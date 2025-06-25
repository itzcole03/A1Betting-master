import { ModelOutput, BetRecommendation } from '../types/prediction';
import { UnifiedLogger } from '../logging/types';
import { UnifiedMetrics } from '../metrics/types';
export interface ModelPerformanceMetrics {
    totalPredictions: number;
    correctPredictions: number;
    totalStake: number;
    totalPayout: number;
    roi: number;
    winRate: number;
    averageConfidence: number;
    averageOdds: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    kellyCriterion: number;
    expectedValue: number;
    calibrationScore: number;
    lastUpdated: Date;
}
interface PerformanceSnapshot {
    timestamp: Date;
    metrics: ModelPerformanceMetrics;
}
export declare class ModelPerformanceTracker {
    private logger;
    private metrics;
    private readonly maxHistoryLength;
    private performanceHistory;
    private currentMetrics;
    private calibrationData;
    constructor(logger: UnifiedLogger, metrics: UnifiedMetrics, maxHistoryLength?: number);
    trackPrediction(modelName: string, prediction: ModelOutput, recommendation: BetRecommendation): void;
    recordOutcome(modelName: string, stake: number, payout: number, odds: number): void;
    getModelPerformance(modelName: string): ModelPerformanceMetrics | undefined;
    getPerformanceHistory(modelName: string, timeframe?: 'day' | 'week' | 'month' | 'all'): PerformanceSnapshot[];
    getTopPerformingModels(metric?: keyof ModelPerformanceMetrics, limit?: number): Array<{
        modelName: string;
        metrics: ModelPerformanceMetrics;
    }>;
    private getOrCreateMetrics;
    private updateAverage;
    private calculateProfitFactor;
    private calculateSharpeRatio;
    private calculateMaxDrawdown;
    private calculateKellyCriterion;
    private calculateExpectedValue;
    private updateCalibrationData;
    private calculateCalibrationScore;
    private updateHistory;
    private getCutoffDate;
    private trackMetrics;
}
export {};
