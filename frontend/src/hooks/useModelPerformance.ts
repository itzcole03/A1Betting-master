import { useCallback, useEffect, useState } from 'react';

interface ModelPerformanceMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    roi: number;
    totalPredictions: number;
    correctPredictions: number;
    averageOdds: number;
    profitLoss: number;
    winRate: number;
    lastUpdated: Date;
    // Add missing properties that ModelPerformanceDashboard expects
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    kellyCriterion: number;
    expectedValue: number;
    calibrationScore: number;
    totalStake: number;
    totalPayout: number;
}

interface ModelInfo {
    name: string;
    version: string;
    status: 'active' | 'inactive' | 'training';
    description?: string;
}

interface UseModelPerformanceReturn {
    performance: ModelPerformanceMetrics | null;
    models: ModelInfo[];
    selectedModel: string | null;
    isLoading: boolean;
    error: string | null;
    selectModel: (modelName: string) => void;
    refreshMetrics: () => Promise<void>;
    history: any[];
    timeframe: string;
    setTimeframe: (timeframe: string) => void;
}

// Simplified function signature

export function useModelPerformance(modelName?: string, timeframe?: string): any {
    const [metrics, setMetrics] = useState<ModelPerformanceMetrics | null>(null);
    const [models, setModels] = useState<ModelInfo[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [currentTimeframe, setCurrentTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('all');
    const fetchModels = useCallback(async () => {
        try {
            // Placeholder for API call
            const mockModels: ModelInfo[] = [
                { name: 'ensemble-v1', version: '1.0.0', status: 'active', description: 'Main ensemble model' },
                { name: 'ml-boost-v2', version: '2.1.0', status: 'active', description: 'XGBoost model' },
                { name: 'neural-net-v1', version: '1.5.0', status: 'inactive', description: 'Neural network model' },
            ];
            setModels(mockModels);
            if (!selectedModel && mockModels.length > 0) {
                setSelectedModel(mockModels[0].name);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch models');
        }
    }, [selectedModel]);

    const fetchMetrics = async (modelName: string) => {
        if (!modelName) return;

        setIsLoading(true);
        setError(null);

        try {
            // Placeholder for API call
            const mockMetrics: ModelPerformanceMetrics = {
                accuracy: 0.72,
                precision: 0.68,
                recall: 0.74,
                f1Score: 0.71,
                roi: 0.125, // Convert to decimal
                totalPredictions: 1420,
                correctPredictions: 1022,
                averageOdds: 1.85,
                profitLoss: 2847.32,
                winRate: 0.719,
                lastUpdated: new Date(),
                // Add missing properties
                profitFactor: 1.35,
                sharpeRatio: 0.82,
                maxDrawdown: 0.15,
                kellyCriterion: 0.08,
                expectedValue: 15.25,
                calibrationScore: 0.78,
                totalStake: 14200,
                totalPayout: 16047.32,
            };
            setMetrics(mockMetrics);

            // Mock history data
            const mockHistory = Array.from({ length: 30 }, (_, i) => ({
                timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
                metrics: {
                    roi: 0.1 + Math.random() * 0.05,
                    winRate: 0.65 + Math.random() * 0.1,
                    profitFactor: 1.2 + Math.random() * 0.3,
                    calibrationScore: 0.7 + Math.random() * 0.2,
                }
            }));
            setHistory(mockHistory);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        } finally {
            setIsLoading(false);
        }
    };

    const selectModel = (modelName: string) => {
        setSelectedModel(modelName);
    };

    const refreshMetrics = async () => {
        if (selectedModel) {
            await fetchMetrics(selectedModel);
        }
    };
    useEffect(() => {
        if (modelName) {
            // If called with a specific modelName, fetch its metrics directly
            fetchMetrics(modelName);
        } else {
            // Otherwise fetch all models
            fetchModels();
        }
    }, [modelName, fetchModels]);

    useEffect(() => {
        if (selectedModel && !modelName) {
            fetchMetrics(selectedModel);
        }
    }, [selectedModel, modelName]);

    // If called with modelName, return the expected interface for ModelPerformanceDashboard
    if (modelName) {
        return {
            performance: metrics,
            history,
            isLoading,
            error,
            timeframe: currentTimeframe,
            setTimeframe: setCurrentTimeframe,
        };
    }

    // Otherwise return the full interface
    return {
        performance: metrics,
        models,
        selectedModel,
        isLoading,
        error,
        selectModel,
        refreshMetrics,
        history,
        timeframe: currentTimeframe,
        setTimeframe: setCurrentTimeframe,
    };
};
