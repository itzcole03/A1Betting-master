import { BetRecord } from '../types/core.js';
/**
 * Analytics service for tracking performance metrics.
 */
export interface AnalyticsConfig {
    retentionPeriod: number;
    aggregationIntervals: string[];
    metrics: string[];
    dimensions: string[];
    filters: Record<string, unknown>;
}
export interface PerformanceMetrics {
    totalBets: number;
    winningBets: number;
    losingBets: number;
    pushBets: number;
    pendingBets: number;
    totalStake: number;
    totalReturn: number;
    profitLoss: number;
    roi: number;
    winRate: number;
    averageOdds: number;
    averageStake: number;
    maxDrawdown: number;
    sharpeRatio: number;
    kellyMultiplier: number;
    clvAverage: number;
    edgeRetention: number;
    timeInMarket: number;
}
export interface MetricBreakdown {
    metric: string;
    bets: number;
    stake: number;
    profitLoss: number;
    roi: number;
    winRate: number;
    averageOdds: number;
    clv: number;
}
export interface PlayerBreakdown {
    playerId: string;
    bets: number;
    stake: number;
    profitLoss: number;
    roi: number;
    winRate: number;
    averageOdds: number;
    metrics: string[];
}
export interface TimeSeriesData {
    timestamp: number;
    metrics: {
        bets: number;
        stake: number;
        profitLoss: number;
        roi: number;
        winRate: number;
        clv: number;
    };
}
/**
 * Analytics service for tracking performance metrics.
 */
/**
 * Simulated fallback metrics for disabled/feature-flag scenarios.
 */
export declare class AnalyticsService {
    private static instance;
    private readonly eventBus;
    private readonly config;
    private readonly bets;
    private readonly opportunities;
    private readonly riskAssessments;
    private readonly timeSeriesData;
    private metrics;
    /**
     * Returns the current analytics status: 'enabled', 'disabled', or 'error'.
     */
    /**
     * Returns the current analytics status: 'enabled', 'disabled', or 'error'.
     */
    /**
     * Returns true if analytics is enabled via feature flag.
     */
    static isEnabled(): boolean;
    private constructor();
    /**
     * Returns the singleton instance of AnalyticsService.
     */
    static getInstance(): AnalyticsService;
    private initializeConfig;
    private initializeMetrics;
    private setupEventListeners;
    private startPeriodicUpdates;
    private updateTimeSeriesData;
    private cleanupOldData;
    private handleBetSettlement;
    private updateMetrics;
    private calculateMaxDrawdown;
    private calculateSharpeRatio;
    private calculateKellyMultiplier;
    private calculateTimeInMarket;
    /**
     * Returns a breakdown of metrics by metric type. If analytics is disabled, returns an empty array.
     */
    getMetricBreakdown(): MetricBreakdown[];
    /**
     * Returns a breakdown of metrics by player. If analytics is disabled, returns an empty array.
     */
    getPlayerBreakdown(): PlayerBreakdown[];
    getTimeSeriesData(interval: '1d' | '7d' | '30d'): TimeSeriesData[];
    getMetrics(): PerformanceMetrics;
    getBets(): BetRecord[];
    getConfig(): AnalyticsConfig;
}
