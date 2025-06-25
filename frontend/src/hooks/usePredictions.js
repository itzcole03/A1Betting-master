import { useState, useEffect, useCallback } from 'react';
import { UnifiedServiceRegistry } from '../services/unified/UnifiedServiceRegistry';
import { webSocketManager } from '../services/unified/WebSocketManager';
export const usePredictions = () => {
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const predictionService = serviceRegistry.getService('prediction');
    const analyticsService = serviceRegistry.getService('analytics');
    const [state, setState] = useState({
        predictions: [],
        loading: true,
        error: null,
    });
    const getConfidenceColor = useCallback((score) => {
        if (score >= 0.8)
            return 'success';
        if (score >= 0.6)
            return 'warning';
        return 'danger';
    }, []);
    const processModelOutput = useCallback((rawOutput) => {
        return {
            confidenceScore: rawOutput.confidence,
            confidenceColor: getConfidenceColor(rawOutput.confidence),
            topFeatures: rawOutput.features.map((f) => ({
                name: f.name,
                value: f.value,
                impact: f.impact,
            })),
            modelMeta: {
                type: rawOutput.modelType || 'default',
                version: rawOutput.modelVersion || '1.0.0',
                lastUpdated: rawOutput.timestamp || Date.now(),
            },
        };
    }, [getConfidenceColor]);
    const loadPredictions = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const predictions = await predictionService.getPredictions();
            const processedPredictions = predictions.map(pred => ({
                id: pred.id,
                event: pred.event,
                market: pred.market,
                selection: pred.selection,
                modelOutput: processModelOutput(pred),
                timestamp: pred.timestamp,
            }));
            setState({
                predictions: processedPredictions,
                loading: false,
                error: null,
            });
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load predictions',
            }));
        }
    }, [predictionService, processModelOutput]);
    useEffect(() => {
        loadPredictions();
        // Setup WebSocket connection for real-time updates
        let unsub;
        let isMounted = true;
        const reconnectTimeout = null;
        const reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        const reconnectInterval = 3000;
        function handlePredictionUpdate(data) {
            if (!isMounted)
                return;
            setState(prev => ({
                ...prev,
                predictions: [
                    {
                        id: data.id,
                        event: data.eventName,
                        market: data.betType,
                        selection: data.selection || '',
                        modelOutput: processModelOutput(data),
                        timestamp: Date.parse(data.timestamp),
                    },
                    ...prev.predictions,
                ],
            }));
        }
        // Subscribe to predictions event
        webSocketManager.on('predictions', handlePredictionUpdate);
        return () => {
            isMounted = false;
            webSocketManager.off('predictions', handlePredictionUpdate);
        };
    }, [loadPredictions, webSocketService, processModelOutput]);
    const getPredictionById = useCallback((id) => {
        return state.predictions.find(p => p.id === id);
    }, [state.predictions]);
    const getRecentPredictions = useCallback((limit = 5) => {
        return state.predictions.slice(0, limit);
    }, [state.predictions]);
    return {
        ...state,
        loadPredictions,
        getPredictionById,
        getRecentPredictions,
    };
};
