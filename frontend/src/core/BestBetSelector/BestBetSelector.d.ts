import { RiskProfile } from '../types/prediction';
import { UnifiedLogger } from '../logging/types';
import { UnifiedMetrics } from '../metrics/types';
import { BettingOpportunity } from '../../types/betting';
import { PredictionEngine } from '../FinalPredictionEngine/FinalPredictionEngine';
import { EventBus } from '../../unified/EventBus';
import { ErrorHandler } from '../../unified/ErrorHandler';
import { PerformanceMonitor } from '../../unified/PerformanceMonitor';
interface ModelPerformance {
    wins: number;
    losses: number;
    roi: number;
    lastUpdated: Date;
}
interface BestBetSelectorConfig {
    minConfidence: number;
    maxStake: number;
    minOdds: number;
    maxOdds: number;
    maxConcurrentBets: number;
    maxDailyLoss: number;
}
export declare class BestBetSelector {
    private logger;
    private metrics;
    private modelPerformance;
    private config;
    private predictionEngine;
    private eventBus;
    private errorHandler;
    private performanceMonitor;
    constructor(logger: UnifiedLogger, metrics: UnifiedMetrics, config: BestBetSelectorConfig, predictionEngine: PredictionEngine, eventBus: EventBus, errorHandler: ErrorHandler, performanceMonitor: PerformanceMonitor);
    selectBestBets(opportunities: BettingOpportunity[], riskProfile: RiskProfile): Promise<BettingOpportunity[]>;
    private validateRiskProfile;
    private calculateKellyStake;
    private calculateExpectedValue;
    updateModelPerformance(modelName: string, result: {
        won: boolean;
        stake: number;
        payout: number;
    }): void;
    getModelPerformance(): Map<string, ModelPerformance>;
    updateConfig(newConfig: Partial<BestBetSelectorConfig>): void;
}
export {};
