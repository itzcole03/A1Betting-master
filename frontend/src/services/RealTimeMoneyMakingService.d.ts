import { EventEmitter } from 'events';
export interface MoneyMakingOpportunity {
    id: string;
    type: 'prizepicks' | 'arbitrage' | 'value_bet' | 'kelly_optimal';
    source: string;
    playerName: string;
    statType: string;
    line: number;
    odds: number;
    confidence: number;
    expectedValue: number;
    kellyFraction: number;
    projectedReturn: number;
    riskLevel: 'low' | 'medium' | 'high';
    timeRemaining: number;
    analysis: {
        historicalTrends: string[];
        marketSignals: string[];
        riskFactors: string[];
        modelBreakdown: Record<string, number>;
        shapValues?: Array<{
            feature: string;
            value: number;
            impact: number;
        }>;
    };
    metadata: {
        createdAt: number;
        expiresAt: number;
        modelVersion: string;
        predictionId: string;
    };
}
export interface PortfolioOptimization {
    opportunities: MoneyMakingOpportunity[];
    totalExpectedValue: number;
    totalKellyFraction: number;
    riskScore: number;
    diversificationScore: number;
    allocation: Record<string, number>;
    constraints: {
        maxSingleBet: number;
        maxTotalExposure: number;
        minConfidence: number;
    };
}
declare class RealTimeMoneyMakingService extends EventEmitter {
    private static instance;
    private logger;
    private backendService;
    private wsService;
    private arbitrageService;
    private prizePicksService;
    private opportunities;
    private isActive;
    private scanInterval;
    private performanceMetrics;
    private constructor();
    static getInstance(): RealTimeMoneyMakingService;
    private setupEventListeners;
    startRealTimeScanning(config: {
        sports: string[];
        minConfidence: number;
        maxExposure: number;
        scanIntervalMs: number;
        strategies: string[];
    }): Promise<void>;
    stopRealTimeScanning(): Promise<void>;
    private performFullScan;
    private scanPrizePicksOpportunities;
    private scanArbitrageOpportunities;
    private scanValueBetOpportunities;
    private optimizePortfolio;
    private calculateKellyFraction;
    private calculateExpectedValue;
    private calculateRiskLevel;
    private calculateTimeRemaining;
    private calculateTimeRemainingFromString;
    private calculatePortfolioRisk;
    private calculateDiversification;
    private updateOpportunities;
    private handleOddsChange;
    private handleArbitrageOpportunity;
    private handlePredictionUpdate;
    private handleNewProp;
    getActiveOpportunities(): MoneyMakingOpportunity[];
    getPerformanceMetrics(): {
        totalOpportunitiesFound: number;
        totalBetsPlaced: number;
        totalProfit: number;
        winRate: number;
        avgKellyFraction: number;
        lastScanTime: number;
    };
    placeBet(opportunityId: string, amount: number): Promise<{
        success: boolean;
        betId?: string;
        error?: string;
    }>;
}
export default RealTimeMoneyMakingService;
