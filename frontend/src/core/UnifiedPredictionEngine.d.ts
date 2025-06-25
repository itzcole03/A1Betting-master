import { TimestampedData, BettingOpportunity } from '../types/core';
export interface PredictionContext {
    playerId: string;
    metric: string;
    timestamp: number;
    marketState?: {
        line: number;
        volume: number;
        movement: 'up' | 'down' | 'stable';
    };
    historicalData?: TimestampedData[];
}
export interface PredictionFactor {
    name: string;
    weight: number;
    source: string;
    confidence: number;
}
export interface ModelPrediction {
    value: number;
    confidence: number;
    factors: PredictionFactor[];
    analysis: {
        risk_factors: string[];
        meta_analysis: {
            market_efficiency: number;
            playerId: string;
            metric: string;
        };
    };
}
export declare class UnifiedPredictionEngine {
    private static instance;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly configManager;
    private readonly advancedAnalysisEngine;
    private readonly analyticsService;
    private readonly models;
    private isInitialized;
    private constructor();
    static getInstance(): UnifiedPredictionEngine;
    initialize(): Promise<void>;
    generatePrediction(context: PredictionContext): Promise<BettingOpportunity>;
    private initializePredictionModels;
    getModelPredictions(context: PredictionContext): Promise<Array<{
        id: string;
        prediction: ModelPrediction | null;
        weight: number;
    }>>;
    private generateModelPrediction;
    private combineModelPredictions;
    private generateAnalysis;
    private analyzeHistoricalTrends;
    private analyzeMarketSignals;
    private calculateMovingAverage;
    private setupEventListeners;
    private generateTimeSeriesPrediction;
    private generateMarketAnalysisPrediction;
    private generatePerformanceAnalysisPrediction;
}
