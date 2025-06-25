import { BettingOpportunity, BetRecord } from '../types/core';
export interface RiskConfig {
    maxExposure: number;
    maxExposurePerBet: number;
    maxExposurePerPlayer: number;
    maxExposurePerMetric: number;
    maxActiveBets: number;
    minBankroll: number;
    maxBankrollPercentage: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
    confidenceThresholds: {
        low: number;
        medium: number;
        high: number;
    };
    volatilityThresholds: {
        low: number;
        medium: number;
        high: number;
    };
}
export interface RiskAssessment {
    id: string;
    timestamp: number;
    opportunity: BettingOpportunity;
    riskLevel: 'low' | 'medium' | 'high';
    maxStake: number;
    factors: {
        exposure: number;
        confidence: number;
        volatility: number;
        correlation: number;
        timeToEvent: number;
    };
    limits: {
        maxExposure: number;
        maxStake: number;
        minOdds: number;
        maxOdds: number;
    };
    warnings: string[];
    recommendations: string[];
}
export interface RiskMetrics {
    totalExposure: number;
    exposureByPlayer: Record<string, number>;
    exposureByMetric: Record<string, number>;
    activeBets: number;
    bankroll: number;
    profitLoss: number;
    roi: number;
    winRate: number;
    averageStake: number;
    maxDrawdown: number;
    sharpeRatio: number;
    kellyMultiplier: number;
}
export declare class RiskManagerService {
    private static instance;
    private readonly eventBus;
    private readonly configManager;
    private readonly config;
    private readonly activeBets;
    private readonly riskAssessments;
    private metrics;
    private constructor();
    static getInstance(): RiskManagerService;
    private initializeConfig;
    private initializeMetrics;
    private setupEventListeners;
    private assessRisk;
    private calculateExposureFactor;
    private calculateConfidenceFactor;
    private calculateVolatilityFactor;
    private calculateCorrelationFactor;
    private calculateTimeToEventFactor;
    private calculateBetCorrelation;
    private calculateOverallRisk;
    private calculateMaxStake;
    private generateWarnings;
    private generateRecommendations;
    private updateExposure;
    private handleBetSettlement;
    private updateMetrics;
    getRiskAssessment(id: string): RiskAssessment | undefined;
    getMetrics(): RiskMetrics;
    getActiveBets(): BetRecord[];
    getConfig(): RiskConfig;
}
