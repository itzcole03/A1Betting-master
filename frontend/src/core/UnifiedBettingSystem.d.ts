import { PerformanceMetrics, AnalysisResult, RiskTolerance, BettingContext, BettingDecision, BetRecord, ClvAnalysis, BetType, BetResult, BettingStrategy } from '../types/core';
import { BettingOpportunity } from '../types/core';
export interface BankrollConfig {
    initialAmount: number;
    maxRiskPerBet: number;
    maxDailyLoss: number;
    maxExposure: number;
    kellyFraction: number;
}
export interface BankrollState {
    currentAmount: number;
    totalWagered: number;
    totalWon: number;
    totalLost: number;
    openPositions: number;
    maxDrawdown: number;
    lastUpdate: number;
}
export interface BetTransaction {
    id: string;
    timestamp: number;
    type: 'bet' | 'win' | 'loss' | 'deposit' | 'withdrawal';
    amount: number;
    balance: number;
    metadata?: Record<string, unknown>;
}
export interface ActiveBet {
    id: string;
    opportunity: BettingOpportunity;
    stake: number;
    placedAt: number;
    status: 'pending' | 'won' | 'lost';
    result?: {
        actualValue: number;
        profit: number;
        settledAt: number;
    };
}
export interface BettingPosition {
    id: string;
    propId: string;
    type: 'over' | 'under';
    stake: number;
    entryPrice: number;
    timestamp: number;
    status: 'open' | 'closed' | 'pending';
    pnl?: number;
    closeTimestamp?: number;
    closePrice?: number;
}
export interface BettingMetrics {
    totalBets: number;
    winningBets: number;
    losingBets: number;
    totalStake: number;
    totalPnl: number;
    roi: number;
    winRate: number;
    averageStake: number;
    averagePnl: number;
    lastUpdate: number;
}
export interface RiskProfile {
    maxExposure: number;
    maxPositions: number;
    stopLoss: number;
    profitTarget: number;
    riskPerTrade: number;
    maxDrawdown: number;
}
export declare class UnifiedBettingSystem {
    private static instance;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly dataEngine;
    private readonly predictionEngine;
    private readonly strategyEngine;
    private readonly analysisRegistry;
    private readonly strategies;
    private readonly MIN_CONFIDENCE;
    private readonly MAX_ACTIVE_BETS;
    private readonly RISK_THRESHOLD;
    private bankrollConfig;
    private bankrollState;
    private activeBets;
    private transactions;
    private readonly positions;
    private readonly metrics;
    private readonly riskProfile;
    private constructor();
    static getInstance(): UnifiedBettingSystem;
    initialize(): Promise<void>;
    analyzeBettingOpportunity(context: BettingContext): Promise<BettingDecision>;
    calculatePerformanceMetrics(bets: BetRecord[]): PerformanceMetrics;
    analyzeClv(bet: BetRecord): ClvAnalysis;
    private analyzeHistoricalTrends;
    private analyzeMarketSignals;
    private analyzeRiskFactors;
    private calculateMetrics;
    private calculateOptimalStake;
    private calculateVariance;
    private calculateSharpeRatio;
    private calculateAverageOdds;
    private calculateMaxDrawdown;
    private calculateClvValue;
    private calculateEdgeRetention;
    private calculateMarketEfficiency;
    private calculateTimingImpact;
    private calculatePriceMovement;
    private calculateKellyMultiplier;
    private calculateProfitByStrategy;
    private calculateSharpnessScore;
    private calculateAverageClv;
    private setupEventListeners;
    private handleMarketUpdate;
    private handlePredictionFeedback;
    private handleStrategyResult;
    private handleCriticalAlert;
    private shouldActivateCircuitBreaker;
    private stopActiveBettingOperations;
    private cancelBet;
    private mitigateOddsRisk;
    private mitigateInjuryRisk;
    private mitigateWeatherRisk;
    private mitigateLineMovementRisk;
    private mitigateSystemRisk;
    registerStrategy(strategy: BettingStrategy): void;
    evaluateBet(prediction: AnalysisResult, odds: number, context?: Partial<BettingContext>): Promise<BettingDecision>;
    settleBet(betId: string, result: BetResult): Promise<void>;
    private createBettingContext;
    private validateSystemConstraints;
    private getApplicableStrategies;
    private aggregateDecisions;
    private createNoBetDecision;
    private calculateRiskScore;
    private calculateExposureRisk;
    private determineBetType;
    private calculatePayout;
    private updatePerformanceMetrics;
    private initializeMetrics;
    private initializeRiskProfile;
    private handleOpportunity;
    private shouldTakeOpportunity;
    private createPosition;
    private updateMetrics;
    private calculateCurrentExposure;
    private getOpenPositions;
    closePosition(positionId: string, closePrice: number): Promise<void>;
    private calculatePnl;
    getMetrics(): BettingMetrics;
    getRiskProfile(): RiskProfile;
    getPosition(positionId: string): BettingPosition | undefined;
    getAllPositions(): BettingPosition[];
    evaluatePosition(positionId: string, closePrice: number): Promise<{
        currentPnl: number;
        riskLevel: 'low' | 'medium' | 'high';
        recommendation: 'hold' | 'close';
    }>;
    evaluateBettingOpportunity(prediction: AnalysisResult, context: BettingContext): Promise<BettingStrategy>;
    updateBankrollState(betType: BetType, stake: number, odds: number, result: BetResult): Promise<void>;
    private calculateProfitLoss;
}
export declare function toRiskTolerance(level: string): RiskTolerance;
