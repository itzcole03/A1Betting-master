import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Tooltip, IconButton, Chip, Button, Collapse, Alert, CircularProgress, } from '@mui/material';
import { Info as InfoIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Refresh as RefreshIcon, } from '@mui/icons-material';
import { formatPercentage, formatCurrency } from '@/utils/formatters';
import { debounce } from 'lodash';
const PredictionEnhancement = ({ predictions, onStakeOptimize, riskProfile, bankroll, onRefresh, autoRefresh = false, refreshInterval = 30000, }) => {
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    // Memoize confidence level calculation
    const getConfidenceLevel = useCallback((confidence) => {
        if (confidence >= 0.9)
            return { label: 'Safe', color: 'success' };
        if (confidence >= 0.7)
            return { label: 'Medium', color: 'warning' };
        return { label: 'Risky', color: 'error' };
    }, []);
    // Memoize Kelly stake calculation
    const calculateKellyStake = useCallback((prediction) => {
        const { confidence, prediction: odds } = prediction;
        const q = 1 - confidence;
        const b = odds - 1;
        const kelly = (b * confidence - q) / b;
        const riskMultiplier = {
            conservative: 0.25,
            moderate: 0.5,
            aggressive: 0.75,
        }[riskProfile];
        return Math.max(0, Math.min(kelly * riskMultiplier * bankroll, bankroll * 0.1));
    }, [riskProfile, bankroll]);
    // Debounced refresh handler
    const debouncedRefresh = useMemo(() => debounce(async () => {
        if (!onRefresh)
            return;
        try {
            setIsRefreshing(true);
            setError(null);
            await onRefresh();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh predictions');
        }
        finally {
            setIsRefreshing(false);
        }
    }, 1000), [onRefresh]);
    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh || !onRefresh)
            return;
        const interval = setInterval(debouncedRefresh, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, onRefresh, refreshInterval, debouncedRefresh]);
    // Memoize sorted predictions
    const sortedPredictions = useMemo(() => {
        return [...predictions].sort((a, b) => b.confidence - a.confidence);
    }, [predictions]);
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Typography, { variant: "h5", children: ["Enhanced Predictions", _jsx(Tooltip, { title: "AI-powered predictions with multi-model consensus", children: _jsx(IconButton, { children: _jsx(InfoIcon, {}) }) })] }), onRefresh && (_jsx(Button, { disabled: isRefreshing, startIcon: isRefreshing ? _jsx(CircularProgress, { size: 20 }) : _jsx(RefreshIcon, {}), onClick: debouncedRefresh, children: "Refresh" }))] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                }, children: sortedPredictions.map((prediction, index) => {
                    const confidenceLevel = getConfidenceLevel(prediction.confidence);
                    const suggestedStake = calculateKellyStake(prediction);
                    return (_jsx(Card, { sx: {
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            },
                        }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h6", children: prediction.modelName }), _jsx(Chip, { color: confidenceLevel.color, icon: confidenceLevel.color === 'success' ? (_jsx(CheckCircleIcon, {})) : confidenceLevel.color === 'warning' ? (_jsx(WarningIcon, {})) : (_jsx(ErrorIcon, {})), label: confidenceLevel.label })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Confidence Score" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(LinearProgress, { color: confidenceLevel.color, sx: {
                                                        flexGrow: 1,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        transition: 'transform 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scaleY(1.2)',
                                                        },
                                                    }, value: prediction.confidence * 100, variant: "determinate" }), _jsx(Typography, { variant: "body2", children: formatPercentage(prediction.confidence) })] })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Model Performance" }), _jsxs(Box, { sx: {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 1,
                                            }, children: [_jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "caption", children: "Accuracy" }), _jsx(Typography, { variant: "body2", children: formatPercentage(prediction.performance.accuracy) })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "caption", children: "ROI" }), _jsx(Typography, { variant: "body2", children: formatPercentage(prediction.performance.roi) })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "caption", children: "Win Rate" }), _jsx(Typography, { variant: "body2", children: formatPercentage(prediction.performance.winRate) })] })] })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Suggested Stake (Kelly Criterion)" }), _jsx(Typography, { color: "primary", variant: "h6", children: formatCurrency(suggestedStake) })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { fullWidth: true, color: "primary", variant: "contained", onClick: () => onStakeOptimize(prediction), children: "Optimize Stake" }), _jsx(Button, { variant: "outlined", onClick: () => {
                                                setSelectedPrediction(prediction);
                                                setShowDetails(!showDetails);
                                            }, children: "Details" })] }), _jsx(Collapse, { in: showDetails && selectedPrediction === prediction, children: _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Top Contributing Features" }), prediction.features.slice(0, 3).map((feature, idx) => (_jsxs(Box, { sx: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: 'action.hover',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'action.selected',
                                                    },
                                                }, children: [_jsx(Typography, { variant: "body2", children: feature.name }), _jsx(Typography, { color: "text.secondary", variant: "body2", children: formatPercentage(feature.importance) })] }, idx)))] }) })] }) }, prediction.eventId + index));
                }) })] }));
};
export default React.memo(PredictionEnhancement);
