import EventEmitter from 'eventemitter3';
import { PredictionResult } from './UnifiedPredictionService';
export interface BetResult {
    propId: string;
    prediction: PredictionResult;
    actualValue: number;
    isWin: boolean;
    stakeAmount: number;
    profitLoss: number;
    timestamp: number;
}
export interface PerformanceMetrics {
    winRate: number;
    roi: number;
    totalBets: number;
    profitLoss: number;
    averageStake: number;
    streaks: {
        current: number;
        longest: number;
    };
    byConfidence: {
        [key: string]: {
            winRate: number;
            totalBets: number;
        };
    };
}
export interface SystemMetrics {
    apiLatency: number;
    predictionAccuracy: number;
    errorRate: number;
    processingTime: number;
}
export declare class PerformanceTrackingService extends EventEmitter {
    private betHistory;
    private systemMetrics;
    recordBetResult(result: BetResult): void;
    getPerformanceMetrics(timeRange?: {
        start: number;
        end: number;
    }): PerformanceMetrics;
    updateSystemMetrics(metrics: Partial<SystemMetrics>): void;
    getSystemMetrics(): SystemMetrics;
    private calculateWinRate;
    private calculateROI;
    private calculateTotalProfitLoss;
    private calculateAverageStake;
    private calculateStreaks;
    private calculateMetricsByConfidence;
    private updateMetrics;
}
