import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useUnifiedAnalytics } from '../hooks/useUnifiedAnalytics.js';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry.js';
import { Box, Typography, Paper, LinearProgress, Tooltip, IconButton, Menu, MenuItem, Alert, CircularProgress, Chip, Card, CardContent, CardHeader, } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, } from 'recharts';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import InfoIcon from '@mui/icons-material/Info';
import { NoResultsFallback } from './NoResultsFallback.js';
import { usePredictionService } from '../../hooks/usePredictionService.js';
import { useRiskProfile } from '../../hooks/useRiskProfile.js';
import { EventBus } from '../../unified/EventBus.js';
import { ErrorHandler } from '../../unified/ErrorHandler.js';
import { PerformanceMonitor } from '../../unified/PerformanceMonitor.js';
import { ModelVersioning } from '../../unified/ModelVersioning.js';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFilterStore } from '../stores/filterStore.js';
const PredictionContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
}));
const ConfidenceBar = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
    },
}));
const ShapContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    height: 300,
    position: 'relative',
}));
const ControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const ValueDisplay = styled(Box)(({ theme, changed }) => ({
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: changed ? theme.palette.primary.light : 'transparent',
    transition: `background-color 0.3s`,
}));
const PredictionCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));
export const PredictionDisplay = ({ eventId, marketId, selectionId, className = '', showAdvancedMetrics = false, onPredictionUpdate, }) => {
    const { ml } = useUnifiedAnalytics({ ml: { autoUpdate: false } });
    const predictionService = usePredictionService();
    const { riskProfile } = useRiskProfile();
    const eventBus = EventBus.getInstance();
    const errorHandler = ErrorHandler.getInstance();
    const performanceMonitor = PerformanceMonitor.getInstance();
    const modelVersioning = ModelVersioning.getInstance();
    const filterStore = useFilterStore();
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType, setFilterType] = useState('all');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [changedValues, setChangedValues] = useState(new Set());
    const [showUncertaintyDetails, setShowUncertaintyDetails] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [error, setError] = useState(null);
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [optimalStake, setOptimalStake] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const webSocketService = serviceRegistry.getService('websocket');
    // Memoize prediction for performance
    const prediction = useMemo(() => {
        if (!ml || !ml.mlResult)
            return null;
        if (Array.isArray(ml.mlResult.predictions)) {
            return ml.mlResult.predictions.find((p) => p.eventId === eventId) || null;
        }
        return null;
    }, [ml, eventId]);
    // Calculate optimal stake when prediction or risk profile changes
    useEffect(() => {
        if (prediction && riskProfile) {
            predictionService
                .calculateOptimalStake(prediction, prediction.odds, riskProfile.level)
                .then(setOptimalStake)
                .catch(console.error);
        }
    }, [prediction, riskProfile, predictionService]);
    // WebSocket connection for real-time updates
    useEffect(() => {
        let unsub;
        let isMounted = true;
        let reconnectTimeout = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const reconnectInterval = 3000;
        const handlePredictionUpdate = useCallback((data) => {
            if (!isMounted)
                return;
            if (data.eventId === eventId) {
                setPredictionHistory(prev => [...prev, data].slice(-10)); // Keep last 10 predictions
                onPredictionUpdate?.(data);
                setConnectionStatus('Connected');
            }
        }, [eventId, onPredictionUpdate]);
        const connectAndSubscribe = async () => {
            try {
                await webSocketService.connect();
                unsub = webSocketService.subscribe('predictions', handlePredictionUpdate);
                setConnectionStatus('Connected');
                reconnectAttempts = 0;
            }
            catch (error) {
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectTimeout = setTimeout(connectAndSubscribe, reconnectInterval);
                    reconnectAttempts++;
                }
                else {
                    setError('WebSocket connection failed. Please refresh.');
                    setConnectionStatus('Disconnected');
                }
            }
        };
        connectAndSubscribe();
        return () => {
            isMounted = false;
            if (unsub)
                unsub();
            webSocketService.disconnect();
            if (reconnectTimeout)
                clearTimeout(reconnectTimeout);
        };
    }, [eventId, webSocketService, onPredictionUpdate]);
    // Handle prediction updates
    useEffect(() => {
        if (prediction) {
            const newChangedValues = new Set();
            if (prediction.confidence)
                newChangedValues.add('confidence');
            if (prediction.recommended_stake)
                newChangedValues.add('stake');
            setChangedValues(newChangedValues);
            const timeout = setTimeout(() => setChangedValues(new Set()), 1000);
            return () => clearTimeout(timeout);
        }
    }, [prediction]);
    useEffect(() => {
        const componentId = 'prediction-display';
        const startTime = performance.now();
        const loadPredictions = async () => {
            try {
                const data = await predictionService.getPredictions({
                    riskProfile: filterStore.riskProfile,
                    sport: filterStore.sport,
                    minOdds: filterStore.minOdds,
                    maxOdds: filterStore.maxOdds,
                    minConfidence: filterStore.minConfidence,
                    maxConfidence: filterStore.maxConfidence,
                    projectedReturn: filterStore.projectedReturn,
                    // add any other filters as needed
                });
                setPredictions(data);
                setError(null);
                performanceMonitor.updateComponentMetrics(componentId, {
                    renderCount: 1,
                    renderTime: performance.now() - startTime,
                    memoryUsage: JSON.stringify(data).length,
                    errorCount: 0,
                    lastUpdate: Date.now(),
                });
            }
            catch (err) {
                const error = err;
                setError(error.message);
                errorHandler.handleError(error, {
                    code: 'PREDICTION_LOAD_ERROR',
                    category: 'BUSINESS',
                    severity: 'HIGH',
                    component: componentId,
                    retryable: true,
                    recoveryStrategy: {
                        type: 'retry',
                        maxRetries: 3,
                        timeout: 1000,
                    },
                });
                performanceMonitor.updateComponentMetrics(componentId, {
                    renderCount: 0,
                    renderTime: 0,
                    memoryUsage: 0,
                    errorCount: 1,
                    lastUpdate: Date.now(),
                });
            }
            finally {
                setIsLoading(false);
            }
        };
        const handlePredictionUpdate = (update) => {
            setPredictions(prev => {
                const newPredictions = prev.map(p => (p.id === update.id ? { ...p, ...update } : p));
                performanceMonitor.updateComponentMetrics(componentId, {
                    renderCount: 1,
                    renderTime: performance.now() - startTime,
                    memoryUsage: JSON.stringify(newPredictions).length,
                    errorCount: 0,
                    lastUpdate: Date.now(),
                });
                return newPredictions;
            });
        };
        const handleError = (error) => {
            errorHandler.handleError(error, {
                code: 'PREDICTION_UPDATE_ERROR',
                category: 'BUSINESS',
                severity: 'MEDIUM',
                component: componentId,
                retryable: true,
            });
            performanceMonitor.updateComponentMetrics(componentId, {
                renderCount: 0,
                renderTime: 0,
                memoryUsage: 0,
                errorCount: 1,
                lastUpdate: Date.now(),
            });
        };
        // Subscribe to real-time updates
        const unsubscribe = predictionService.subscribeToUpdates(handlePredictionUpdate, handleError);
        // Load initial predictions
        loadPredictions();
        // Cleanup
        return () => {
            unsubscribe();
            performanceMonitor.updateComponentMetrics(componentId, {
                renderCount: 0,
                renderTime: 0,
                memoryUsage: 0,
                errorCount: 0,
                lastUpdate: Date.now(),
            });
        };
    }, [predictionService, filterStore]);
    const handleMenuOpen = (event, prediction) => {
        setAnchorEl(event.currentTarget);
        setSelectedPrediction(prediction);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPrediction(null);
    };
    if (ml?.isLoading) {
        return (_jsx(PredictionContainer, { className: className, children: _jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: 200, children: _jsx(CircularProgress, {}) }) }));
    }
    if (ml?.error) {
        return (_jsx(PredictionContainer, { className: className, children: _jsxs(Alert, { severity: "error", children: ["Failed to load prediction data: ", ml.error.message] }) }));
    }
    if (!prediction) {
        return _jsx(NoResultsFallback, {});
    }
    const { prediction: value, confidence, uncertainty, kelly_fraction, model_predictions, shap_values, feature_importance, timestamp, } = prediction;
    return (_jsxs(PredictionContainer, { className: className, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Prediction Details" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(Chip, { color: connectionStatus === 'Connected' ? 'success' : 'warning', label: connectionStatus, size: "small" }), _jsxs(ControlsContainer, { children: [_jsx(IconButton, { size: "small", onClick: e => setFilterAnchorEl(e.currentTarget), children: _jsx(FilterListIcon, {}) }), _jsx(IconButton, { size: "small", onClick: e => setSortAnchorEl(e.currentTarget), children: _jsx(SortIcon, {}) })] })] })] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(Box, { mb: 3, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { variant: "subtitle1", children: "Prediction" }), _jsx(ValueDisplay, { changed: changedValues.has('value'), children: _jsx(Typography, { variant: "h5", children: value.toFixed(2) }) })] }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(Typography, { color: "textSecondary", variant: "body2", children: "Confidence:" }), _jsx(Box, { flex: 1, children: _jsx(ConfidenceBar, { sx: {
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: confidence > 0.7
                                                            ? 'success.main'
                                                            : confidence > 0.5
                                                                ? 'warning.main'
                                                                : 'error.main',
                                                    },
                                                }, value: confidence * 100, variant: "determinate" }) }), _jsxs(Typography, { color: "textSecondary", variant: "body2", children: [(confidence * 100).toFixed(1), "%"] })] })] }) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(Box, { mb: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Risk Profile" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(Typography, { variant: "body2", children: "Recommended Stake:" }), _jsx(Typography, { color: "primary", variant: "h6", children: optimalStake ? `${(optimalStake * 100).toFixed(1)}%` : 'Calculating...' })] }), _jsx(Box, { mt: 1, children: _jsxs(Typography, { color: "textSecondary", variant: "body2", children: ["Kelly Fraction: ", kelly_fraction.toFixed(3)] }) })] }) })] }), showAdvancedMetrics && (_jsxs(Box, { mt: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Advanced Metrics" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "body2", children: "Uncertainty Analysis" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsxs(Typography, { variant: "body2", children: ["Total: ", (uncertainty.total * 100).toFixed(1), "%"] }), _jsx(Tooltip, { title: "Epistemic: Model uncertainty, Aleatoric: Data uncertainty", children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) })] })] }) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "body2", children: "Model Contributions" }), _jsx(ResponsiveContainer, { height: 100, width: "100%", children: _jsxs(BarChart, { data: Object.entries(model_predictions).map(([model, value]) => ({
                                                    model,
                                                    value: value * 100,
                                                })), children: [_jsx(XAxis, { dataKey: "model" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) })] }) })] })] })), predictionHistory.length > 0 && (_jsxs(Box, { mt: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Prediction History" }), _jsx(ResponsiveContainer, { height: 200, width: "100%", children: _jsxs(LineChart, { data: predictionHistory, children: [_jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Line, { dataKey: "prediction", stroke: "#8884d8", type: "monotone" }), _jsx(Line, { dataKey: "confidence", stroke: "#82ca9d", type: "monotone" })] }) })] })), _jsxs(Menu, { anchorEl: filterAnchorEl, open: Boolean(filterAnchorEl), onClose: () => setFilterAnchorEl(null), children: [_jsx(MenuItem, { onClick: () => {
                            setFilterType('all');
                            setFilterAnchorEl(null);
                        }, children: "All Predictions" }), _jsx(MenuItem, { onClick: () => {
                            setFilterType('high-confidence');
                            setFilterAnchorEl(null);
                        }, children: "High Confidence" }), _jsx(MenuItem, { onClick: () => {
                            setFilterType('recent');
                            setFilterAnchorEl(null);
                        }, children: "Recent" }), _jsx(MenuItem, { onClick: () => {
                            setFilterType('profitable');
                            setFilterAnchorEl(null);
                        }, children: "Profitable" })] }), _jsxs(Menu, { anchorEl: sortAnchorEl, open: Boolean(sortAnchorEl), onClose: () => setSortAnchorEl(null), children: [_jsx(MenuItem, { onClick: () => {
                            setSortOrder('desc');
                            setSortAnchorEl(null);
                        }, children: "Highest Confidence" }), _jsx(MenuItem, { onClick: () => {
                            setSortOrder('asc');
                            setSortAnchorEl(null);
                        }, children: "Lowest Confidence" })] }), _jsx(Grid, { container: true, spacing: 3, children: predictions.map(prediction => (_jsx(Grid, { item: true, md: 4, sm: 6, xs: 12, children: _jsxs(PredictionCard, { children: [_jsx(CardHeader, { action: _jsx(IconButton, { onClick: e => handleMenuOpen(e, prediction), children: _jsx(MoreVertIcon, {}) }), subheader: new Date(prediction.timestamp).toLocaleString(), title: prediction.event }), _jsxs(CardContent, { children: [_jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Confidence: ", prediction.confidence, "%"] }), _jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Recommended Bet: ", prediction.recommendedBet] }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Expected Value: ", prediction.expectedValue] })] })] }) }, prediction.id))) }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, children: [_jsx(MenuItem, { onClick: handleMenuClose, children: "View Details" }), _jsx(MenuItem, { onClick: handleMenuClose, children: "Track Performance" }), _jsx(MenuItem, { onClick: handleMenuClose, children: "Export Data" })] })] }));
};
