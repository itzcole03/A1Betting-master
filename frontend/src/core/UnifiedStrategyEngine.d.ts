import { PredictionFactor } from './UnifiedPredictionEngine';
import { StrategyRecommendation, AnalysisResult, BettingOpportunity, BetRecord } from '../types/core';
export interface StrategyConfig {
    riskTolerance: number;
    maxExposure: number;
    minConfidence: number;
    hedgingEnabled: boolean;
    adaptiveStaking: boolean;
    profitTarget: number;
    stopLoss: number;
    confidenceThreshold: number;
    maxRiskPerBet: number;
    kellyMultiplier: number;
}
export interface StrategyMetrics {
    totalRecommendations: number;
    successfulRecommendations: number;
    averageConfidence: number;
    lastUpdate: number;
}
export interface RiskAssessment {
    riskScore: number;
    factors: string[];
    timestamp: number;
}
export interface StrategyContext {
    playerId: string;
    metric: string;
    timestamp: number;
    marketState: {
        line: number;
        volume: number;
        movement: 'up' | 'down' | 'stable';
    };
    predictionState: {
        value: number;
        confidence: number;
        factors: string[];
    };
}
export interface StrategyInput {
    id: string;
    prediction: {
        value: number;
        confidence: number;
        factors: PredictionFactor[];
        analysis: AnalysisResult;
    };
    weight: number;
}
export interface StrategyRecommendation {
    strategyId: string;
    type: 'OVER' | 'UNDER';
    confidence: number;
    expectedValue: number;
    riskAssessment: RiskAssessment;
    timestamp: number;
    success: boolean;
}
export declare class UnifiedStrategyEngine {
    private static instance;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly dataEngine;
    private readonly predictionEngine;
    private readonly configManager;
    private readonly monitor;
    private readonly predictionService;
    private strategyConfig;
    private readonly performance;
    private readonly riskProfiles;
    private readonly activeStrategies;
    private readonly hedgingOpportunities;
    private readonly strategies;
    private readonly metrics;
    private isInitialized;
    private constructor();
    static getInstance(): UnifiedStrategyEngine;
    initialize(): Promise<void>;
    private setupEventListeners;
    private handleMarketUpdate;
    private handlePredictionUpdate;
    private generateRecommendation;
    private getPredictionState;
    private getMarketState;
    private updateMetrics;
    private combineRecommendations;
    private getMostCommonType;
    private combineRiskAssessments;
    private initializeStrategies;
    private calculateMomentum;
    registerStrategy(id: string, strategy: (context: StrategyContext) => Promise<StrategyRecommendation>): void;
    getMetrics(): Map<string, StrategyMetrics>;
    evaluateOpportunity(opportunity: BettingOpportunity): Promise<RiskAssessment>;
    updatePerformance(bet: BetRecord): Promise<void>;
    analyzeOpportunities(data: DataPoint[]): Promise<BettingOpportunity[]>;
    private groupPropsByGame;
    private analyzeSingleProp;
    private analyzeParlayOpportunities;
    private analyzeParlay;
    private calculateRiskLevel;
    private calculateOptimalStake;
    private calculateMaxStake;
    private calculateExpectedValue;
    private generateCombinations;
    assessRisk(currentBets: BettingOpportunity[]): RiskAssessment;
    private calculatePortfolioRisk;
    private identifyRiskFactors;
    private findCorrelatedBets;
    private areCorrelated;
}
