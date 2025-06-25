import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { usePredictionService } from '../../../hooks/usePredictionService';
import { useRiskProfile } from '../../../hooks/useRiskProfile';
import { EventBus } from '../../../unified/EventBus';
import { ErrorHandler } from '../../../unified/ErrorHandler';
import { PerformanceMonitor } from '../../../unified/PerformanceMonitor';
import { ModelVersioning } from '../../../unified/ModelVersioning';
import { ShapExplanation } from '../../prediction/ShapExplanation';
import { ConfidenceIndicator } from '../../common/ConfidenceIndicator';
import { RiskLevelIndicator } from '../../common/RiskLevelIndicator';
import { ValidationStatus } from '../../common/ValidationStatus';
import { useFilterStore } from '../../../stores/filterStore';
const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8)
        return 'success';
    if (confidence >= 0.6)
        return 'warning';
    return 'error';
};
const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
        case 'low':
            return 'success';
        case 'medium':
            return 'warning';
        case 'high':
            return 'error';
        default:
            return 'default';
    }
};
export const RealtimePredictionDisplay = ({ predictionId, }) => {
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getPredictions } = usePredictionService();
    const { currentProfile } = useRiskProfile();
    const eventBus = EventBus.getInstance();
    const errorHandler = ErrorHandler.getInstance();
    const performanceMonitor = PerformanceMonitor.getInstance();
    const modelVersioning = ModelVersioning.getInstance();
    const filterStore = useFilterStore();
    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                setIsLoading(true);
                const results = await getPredictions({
                    riskProfile: filterStore.riskProfile,
                    sport: filterStore.sport,
                    minOdds: filterStore.minOdds,
                    maxOdds: filterStore.maxOdds,
                    minConfidence: filterStore.minConfidence,
                    maxConfidence: filterStore.maxConfidence,
                    projectedReturn: filterStore.projectedReturn,
                    // add any other filters as needed
                });
                const result = results.find(p => p.id === predictionId);
                setPrediction(result || null);
                setError(null);
                // Track performance
                performanceMonitor.recordOperation('fetchPrediction', performance.now());
                // Emit event for analytics
                if (result) {
                    eventBus.emit('prediction:fetched', {
                        predictionId,
                        confidence: result.confidence,
                        riskLevel: result.riskLevel,
                    });
                }
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to fetch prediction');
                errorHandler.handleError(error, 'RealtimePredictionDisplay', 'fetchPrediction', {
                    category: ErrorCategory.NETWORK,
                    severity: ErrorSeverity.MEDIUM,
                });
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPrediction();
        // Subscribe to real-time updates
        const unsubscribe = eventBus.subscribe(`prediction:${predictionId}`, (data) => {
            setPrediction(prev => ({
                ...prev,
                ...data,
            }));
        });
        return () => {
            unsubscribe();
        };
    }, [predictionId, filterStore]);
    if (isLoading) {
        return (_jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: 200, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }));
    }
    if (!prediction) {
        return (_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "No prediction data available" }));
    }
    const validationStatus = validatePrediction(prediction, currentProfile);
    return (_jsxs(Paper, { elevation: 3, sx: { p: 3 }, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Prediction Details" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(ConfidenceIndicator, { value: prediction.confidence }), _jsx(RiskLevelIndicator, { level: prediction.riskLevel }), _jsx(ValidationStatus, { message: validationStatus.reason || 'Validated', status: validationStatus.isValid ? 'valid' : 'invalid' })] })] }), _jsxs(Box, { mb: 3, children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "subtitle2", children: "Model Information" }), _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Chip, { label: `Version: ${modelVersioning.getCurrentVersion()}`, size: "small" }), _jsx(Chip, { label: `Last Updated: ${new Date(prediction.timestamp).toLocaleString()}`, size: "small" })] })] }), _jsxs(Box, { mb: 3, children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "subtitle2", children: "SHAP Values" }), _jsx(ShapExplanation, { explanation: prediction.explanation })] }), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "subtitle2", children: "Risk Profile Validation" }), _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Chip, { color: prediction.stake <= currentProfile.max_stake_percentage ? 'success' : 'error', label: `Max Stake: ${(currentProfile.max_stake_percentage * 100).toFixed(1)}%`, size: "small" }), _jsx(Chip, { color: prediction.confidence >= currentProfile.min_confidence_threshold ? 'success' : 'error', label: `Min Confidence: ${(currentProfile.min_confidence_threshold * 100).toFixed(1)}%`, size: "small" }), _jsx(Chip, { color: prediction.volatility <= currentProfile.volatility_tolerance ? 'success' : 'error', label: `Volatility: ${(prediction.volatility * 100).toFixed(1)}%`, size: "small" })] })] })] }));
};
const validatePrediction = (prediction, riskProfile) => {
    if (prediction.confidence < riskProfile.min_confidence_threshold) {
        return {
            isValid: false,
            reason: `Confidence below threshold (${(riskProfile.min_confidence_threshold * 100).toFixed(1)}%)`,
        };
    }
    if (prediction.volatility > riskProfile.volatility_tolerance) {
        return {
            isValid: false,
            reason: `Volatility exceeds tolerance (${(riskProfile.volatility_tolerance * 100).toFixed(1)}%)`,
        };
    }
    if (prediction.riskScore > riskProfile.max_risk_score) {
        return {
            isValid: false,
            reason: `Risk score exceeds maximum (${(riskProfile.max_risk_score * 100).toFixed(1)}%)`,
        };
    }
    return { isValid: true };
};
