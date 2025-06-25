import React from 'react';
import { useEffect, useState } from 'react';
import { ModelPerformanceMetrics } from '../types';

export interface MetricsData {
    performance: ModelPerformanceMetrics;
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

export const useMetrics = (userId?: string): MetricsData => {
    const [performance, setPerformance] = useState<ModelPerformanceMetrics>({
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        roc_auc: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        kellyCriterion: 0,
        expectedValue: 0,
        calibrationScore: 0,
        totalStake: 0,
        totalPayout: 0,
        totalProfit: 0,
        winRate: 0,
        avgOdds: 0,
        totalBets: 0,
        roi: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - replace with actual API call
            const mockMetrics: ModelPerformanceMetrics = {
                accuracy: 0.82,
                precision: 0.78,
                recall: 0.85,
                f1Score: 0.81,
                roc_auc: 0.87,
                profitFactor: 1.45,
                sharpeRatio: 2.1,
                maxDrawdown: -0.15,
                kellyCriterion: 0.08,
                expectedValue: 0.12,
                calibrationScore: 0.91,
                totalStake: 10000,
                totalPayout: 12500,
                totalProfit: 2500,
                winRate: 0.64,
                avgOdds: 2.2,
                totalBets: 156,
                roi: 0.25
            };

            setPerformance(mockMetrics);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load metrics');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [userId]);

    return {
        performance,
        isLoading,
        error,
        refresh
    };
};

export default useMetrics;
