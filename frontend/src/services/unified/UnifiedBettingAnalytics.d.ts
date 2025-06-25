import { EventEmitter } from 'events';
export interface BetRecommendation {
    id: string;
    market: string;
    odds: number;
    prediction: number;
    confidence: number;
    recommendedStake: number;
    expectedValue: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    hedgingOpportunities: Array<{
        market: string;
        odds: number;
        recommendedStake: number;
    }>;
}
export interface BettingStrategy {
    id: string;
    name: string;
    riskLevel: 'low' | 'medium' | 'high';
    stakePercentage: number;
    minOdds: number;
    maxOdds: number;
}
export interface PredictionModel {
    id: string;
    name: string;
    accuracy: number;
    lastUpdated: Date;
    parameters: Record<string, unknown>;
}
export interface BettingAnalysis {
    predictionConfidence: number;
    recommendedStake: number;
    expectedValue: number;
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        factors: string[];
    };
    hedgingOpportunities: Array<{
        market: string;
        odds: number;
        recommendedStake: number;
    }>;
    /**
     * Optional array of risk reasoning strings, propagated from strategy/model layer.
     */
    risk_reasoning?: string[];
}
export declare class UnifiedBettingAnalytics extends EventEmitter {
    private static instance;
    private dataService;
    private activeStrategies;
    private predictionModels;
    private constructor();
    static getInstance(): UnifiedBettingAnalytics;
    private initializeEventListeners;
    private calculateKellyCriterion;
    analyzeBettingOpportunity(market: string, odds: number, stake: number): Promise<BettingAnalysis>;
    /**
     * Generate a prediction for a given market and data by calling the backend ML/analytics API.
     * Emits 'error' event on failure.
     */
    private generatePrediction;
    private assessRiskFactors;
    private calculateRiskLevel;
    private findHedgingOpportunities;
    private calculateHedgeStake;
    private analyzeOddsMovement;
    private updatePredictions;
    addStrategy(strategy: BettingStrategy): void;
    removeStrategy(strategyId: string): void;
    addPredictionModel(model: PredictionModel): void;
    removePredictionModel(modelId: string): void;
    getBettingOpportunities(minConfidence?: number): Promise<BetRecommendation[]>;
    getPerformanceMetrics(): Promise<{
        winRate: number;
        roi: number;
        edgeRetention: number;
        totalBets: number;
        averageOdds: number;
        profitLoss: number;
    }>;
}
