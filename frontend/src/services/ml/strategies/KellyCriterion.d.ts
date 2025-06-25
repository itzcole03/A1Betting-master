import * as tf from '@tensorflow/tfjs';
interface KellyMetrics {
    fraction: number;
    expectedValue: number;
    riskAdjustedReturn: number;
    optimalStake: number;
    confidence: number;
    uncertainty: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
}
interface KellyConfig {
    maxFraction: number;
    minConfidence: number;
    riskTolerance: number;
    volatilityThreshold: number;
    drawdownLimit: number;
    profitTarget: number;
    stopLoss: number;
    positionSizing: {
        method: 'fixed' | 'dynamic' | 'adaptive';
        baseSize: number;
        maxSize: number;
        minSize: number;
    };
    bankrollManagement: {
        method: 'fixed' | 'progressive' | 'adaptive';
        initialSize: number;
        maxRiskPerTrade: number;
        maxDrawdown: number;
    };
}
export declare class KellyCriterion {
    private logger;
    private cache;
    private config;
    private state;
    private readonly CACHE_KEY;
    private readonly CACHE_TTL;
    constructor(config?: Partial<KellyConfig>);
    private initializeState;
    private loadState;
    private saveState;
    analyze(predictions: tf.Tensor, labels: tf.Tensor): Promise<KellyMetrics>;
    private calculateWinProbability;
    private calculateOdds;
    private calculateKellyFraction;
    private adjustKellyFraction;
    private calculateAdaptiveMultiplier;
    private calculateExpectedValue;
    private calculateRiskAdjustedReturn;
    private calculateOptimalStake;
    private calculateUncertainty;
    private calculateVolatility;
    private calculateSharpeRatio;
    private calculateMaxDrawdown;
    private calculateWinRate;
    private calculateProfitFactor;
    private calculateConfidence;
    shouldPlaceBet(metrics: KellyMetrics): boolean;
    getBetSize(metrics: KellyMetrics, bankroll: number): number;
    private calculateAdaptiveBetSize;
    updateState(betSize: number, outcome: number, profit: number, metrics: KellyMetrics): void;
}
export {};
