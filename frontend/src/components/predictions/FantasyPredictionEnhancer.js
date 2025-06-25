import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';
import { useLogger } from '../../hooks/useLogger';
import { useMetrics } from '../../hooks/useMetrics';
export const FantasyPredictionEnhancer = ({ fantasyData, predictions, onEnhancedPredictions, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enhancedPredictions, setEnhancedPredictions] = useState([]);
    const logger = useLogger();
    const metrics = useMetrics();
    useEffect(() => {
        const enhancePredictions = async () => {
            if (!fantasyData.length || !predictions.length)
                return;
            setIsLoading(true);
            setError(null);
            try {
                // Match predictions with fantasy data
                const matchedData = predictions
                    .map(prediction => {
                    const fantasyPlayer = fantasyData.find(player => player.playerId === prediction.playerId);
                    if (!fantasyPlayer) {
                        return null;
                    }
                    // Calculate fantasy value score
                    const fantasyValue = fantasyPlayer.valueScore || 0;
                    // Calculate confidence score based on multiple factors
                    const confidenceScore = calculateConfidenceScore(prediction.predictedWinProbability, prediction.predictedScore, fantasyValue, fantasyPlayer.ownershipPercentage || 0);
                    return {
                        playerId: prediction.playerId,
                        playerName: prediction.playerName,
                        predictedWinProbability: prediction.predictedWinProbability,
                        predictedScore: prediction.predictedScore,
                        fantasyValue,
                        confidenceScore,
                    };
                })
                    .filter(Boolean);
                setEnhancedPredictions(matchedData);
                onEnhancedPredictions(matchedData);
                metrics.track('predictions_enhanced', 1, {
                    predictionCount: predictions.length.toString(),
                    enhancedCount: matchedData.length.toString(),
                });
                logger.info('Successfully enhanced predictions with fantasy data', {
                    predictionCount: predictions.length,
                    enhancedCount: matchedData.length,
                });
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to enhance predictions';
                setError(errorMessage);
                logger.error('Error enhancing predictions', { error: errorMessage });
                metrics.increment('prediction_enhancement_error');
            }
            finally {
                setIsLoading(false);
            }
        };
        enhancePredictions();
    }, [fantasyData, predictions, onEnhancedPredictions, logger, metrics]);
    const calculateConfidenceScore = (winProbability, predictedScore, fantasyValue, ownershipPercentage) => {
        // Normalize each factor to a 0-1 scale
        const normalizedWinProb = winProbability / 100;
        const normalizedScore = Math.min(predictedScore / 30, 1); // Assuming max score of 30
        const normalizedValue = Math.min(fantasyValue / 5, 1); // Assuming max value score of 5
        const normalizedOwnership = ownershipPercentage / 100;
        // Weight each factor
        const weights = {
            winProbability: 0.3,
            predictedScore: 0.3,
            fantasyValue: 0.25,
            ownership: 0.15,
        };
        // Calculate weighted average
        return ((normalizedWinProb * weights.winProbability +
            normalizedScore * weights.predictedScore +
            normalizedValue * weights.fantasyValue +
            normalizedOwnership * weights.ownership) *
            100); // Convert to percentage
    };
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", my: 3, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }));
    }
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Enhanced Predictions" }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Player" }), _jsx(TableCell, { align: "right", children: "Win Probability" }), _jsx(TableCell, { align: "right", children: "Predicted Score" }), _jsx(TableCell, { align: "right", children: "Fantasy Value" }), _jsx(TableCell, { align: "right", children: "Confidence" })] }) }), _jsx(TableBody, { children: enhancedPredictions.map(prediction => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: prediction.playerName }), _jsxs(TableCell, { align: "right", children: [prediction.predictedWinProbability.toFixed(1), "%"] }), _jsx(TableCell, { align: "right", children: prediction.predictedScore.toFixed(1) }), _jsx(TableCell, { align: "right", children: prediction.fantasyValue.toFixed(2) }), _jsxs(TableCell, { align: "right", children: [prediction.confidenceScore.toFixed(1), "%"] })] }, prediction.playerId))) })] }) })] }) }));
};
