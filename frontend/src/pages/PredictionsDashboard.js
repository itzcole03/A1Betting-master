import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress, Alert, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { predictionService } from '../services/predictionService';
import { LivePredictions } from '../components/predictions/LivePredictions';
import { ModelPerformance } from '../components/predictions/ModelPerformance';
import { BettingOpportunities } from '../components/predictions/BettingOpportunities';
import { useWebSocket } from '../hooks/useWebSocket';
import { BettingSettingsContainer } from '../components/betting/BettingSettingsContainer';
const PredictionsDashboard = () => {
    const [error, setError] = useState(null);
    // Fetch initial predictions
    const { data: predictions, isLoading: predictionsLoading } = useQuery({
        queryKey: ['predictions'],
        queryFn: () => predictionService.getRecentPredictions(),
        staleTime: 30000,
    });
    // Fetch model performance
    const { data: performance, isLoading: performanceLoading } = useQuery({
        queryKey: ['model-performance'],
        queryFn: () => predictionService.getModelPerformance('xgboost'),
        staleTime: 60000,
    });
    // WebSocket connection for real-time updates
    const { lastMessage, isConnected } = useWebSocket(`${process.env.VITE_WS_URL}/ws/predictions`);
    useEffect(() => {
        if (lastMessage) {
            // TODO: Handle real-time prediction updates if needed
            // const data = JSON.parse(lastMessage.data);
            // if (data.type === 'prediction_update') { ... }
        }
    }, [lastMessage]);
    if (error) {
        return (_jsx(Container, { maxWidth: "lg", sx: { mt: 4, mb: 4 }, children: _jsx(Alert, { severity: "error", children: error }) }));
    }
    return (_jsx(motion.div, { animate: { opacity: 1 }, exit: { opacity: 0 }, initial: { opacity: 0 }, children: _jsxs(Container, { maxWidth: "lg", sx: { mt: 4, mb: 4 }, children: [_jsx(Typography, { gutterBottom: true, component: "h1", variant: "h4", children: "Predictions Dashboard" }), _jsx(BettingSettingsContainer, {}), _jsx(Divider, { sx: { my: 4 } }), !isConnected && (_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: "Connecting to prediction server..." })), _jsxs(Box, { sx: {
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }, children: [_jsxs(Box, { sx: { p: 2, bgcolor: 'background.paper', borderRadius: 1 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Live Predictions" }), predictionsLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(LivePredictions, { predictions: predictions || [] }))] }), _jsxs(Box, { sx: { p: 2, bgcolor: 'background.paper', borderRadius: 1 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Model Performance" }), performanceLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(ModelPerformance, { metrics: performance || {} }))] }), _jsxs(Box, { sx: { p: 2, bgcolor: 'background.paper', borderRadius: 1 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Betting Opportunities" }), predictionsLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(BettingOpportunities, { predictions: predictions || [] }))] })] })] }) }));
};
export default PredictionsDashboard;
