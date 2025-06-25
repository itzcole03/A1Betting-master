import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Box, Typography, TextField, MenuItem, Grid, Paper, CircularProgress } from '@mui/material';
import { BetRecommendationCard } from './BetRecommendationCard';
import { PredictionExplanationModal } from './PredictionExplanationModal';
export const BetRecommendationList = ({ recommendations, loading = false, error, }) => {
    const [sortBy, setSortBy] = useState('confidence');
    const [filterBy, setFilterBy] = useState('all');
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);
    const filteredAndSortedRecommendations = useMemo(() => {
        let filtered = recommendations;
        // Apply risk level filter
        if (filterBy !== 'all') {
            filtered = filtered.filter(rec => rec.riskLevel === filterBy);
        }
        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'confidence':
                    return b.confidence - a.confidence;
                case 'stake':
                    return b.stake - a.stake;
                case 'expectedValue':
                    return b.expectedValue - a.expectedValue;
                case 'riskLevel':
                    const riskOrder = { low: 0, medium: 1, high: 2 };
                    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
                default:
                    return 0;
            }
        });
    }, [recommendations, sortBy, filterBy]);
    if (loading) {
        return (_jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: 200, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Paper, { sx: { p: 2, bgcolor: 'error.light' }, children: _jsx(Typography, { color: "error", children: error }) }));
    }
    if (recommendations.length === 0) {
        return (_jsx(Paper, { sx: { p: 2 }, children: _jsx(Typography, { color: "text.secondary", children: "No bet recommendations available" }) }));
    }
    return (_jsxs(Box, { children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, sm: 6, xs: 12, children: _jsxs(TextField, { fullWidth: true, select: true, label: "Sort By", value: sortBy, onChange: e => setSortBy(e.target.value), children: [_jsx(MenuItem, { value: "confidence", children: "Confidence" }), _jsx(MenuItem, { value: "stake", children: "Stake Amount" }), _jsx(MenuItem, { value: "expectedValue", children: "Expected Value" }), _jsx(MenuItem, { value: "riskLevel", children: "Risk Level" })] }) }), _jsx(Grid, { item: true, sm: 6, xs: 12, children: _jsxs(TextField, { fullWidth: true, select: true, label: "Filter By Risk", value: filterBy, onChange: e => setFilterBy(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Risk Levels" }), _jsx(MenuItem, { value: "low", children: "Low Risk" }), _jsx(MenuItem, { value: "medium", children: "Medium Risk" }), _jsx(MenuItem, { value: "high", children: "High Risk" })] }) })] }), _jsx(Box, { children: filteredAndSortedRecommendations.map(recommendation => (_jsx(BetRecommendationCard, { recommendation: recommendation, onViewDetails: () => setSelectedRecommendation(recommendation) }, recommendation.id))) }), selectedRecommendation && (_jsx(PredictionExplanationModal, { open: !!selectedRecommendation, prediction: {
                    prediction: selectedRecommendation.prediction.prediction,
                    confidence: selectedRecommendation.confidence,
                    explanations: [
                        {
                            modelName: selectedRecommendation.prediction.type,
                            confidence: selectedRecommendation.confidence,
                            shapExplanation: {
                                featureNames: Object.keys(selectedRecommendation.prediction.features),
                                featureValues: Object.values(selectedRecommendation.prediction.features),
                                importanceScores: [],
                                baseValue: 0,
                                prediction: selectedRecommendation.prediction.prediction,
                            },
                        },
                    ],
                }, onClose: () => setSelectedRecommendation(null) }))] }));
};
