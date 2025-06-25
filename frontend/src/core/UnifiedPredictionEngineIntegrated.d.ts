/**
 * Unified Prediction Engine - Integrated Version
 *
 * This is the consolidated prediction engine that integrates all existing models
 * and connects properly to the backend services for Items 1 & 2 of the integration checklist.
 */
import { TimestampedData, BettingOpportunity, PredictionState } from '../types/core';
export interface PredictionRequest {
    features: Record<string, number>;
    playerId?: string;
    metric?: string;
    context?: Record<string, any>;
}
export interface BackendPredictionResponse {
    final_value: number;
    ensemble_confidence: number;
    payout: number;
    model_breakdown: Array<{
        model_name: string;
        value: number;
        confidence: number;
        performance: Record<string, number>;
        shap_values: Record<string, number>;
    }>;
    shap_values: Record<string, number>;
    explanation: string;
}
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
    features?: Record<string, number>;
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
    shap_values?: Record<string, number>;
    explanation?: string;
}
export interface PredictionFactor {
    name: string;
    weight: number;
    source: string;
    confidence: number;
}
export declare class UnifiedPredictionEngineIntegrated {
    private static instance;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly configManager;
    private readonly monitor;
    private readonly models;
    private readonly predictions;
    private isInitialized;
    private backendHealthy;
    private constructor();
    static getInstance(): UnifiedPredictionEngineIntegrated;
    initialize(): Promise<void>;
    private checkBackendHealth;
    private initializePredictionModels;
    private setupEventListeners;
    private handleMarketUpdate;
    generatePrediction(context: PredictionContext): Promise<BettingOpportunity>;
    private getBackendPrediction;
    private convertBackendResponse;
    private getLocalPrediction;
    private getModelPredictions;
    private generateModelPrediction;
    private generateTimeSeriesPrediction;
    private generateMarketAnalysisPrediction;
    private generatePerformanceAnalysisPrediction;
    private generateMLEnsemblePrediction;
    private generateRealityExploitationPrediction;
    private combineModelPredictions;
    private extractFeatures;
    private calculateTrend;
    private extractRiskFactors;
    private calculateMarketEfficiency;
    private convertToBettingOpportunity;
    private calculateExpectedValue;
    private calculateKellyFraction;
    isBackendHealthy(): boolean;
    getModelStatus(): Map<string, PredictionState>;
}
export default UnifiedPredictionEngineIntegrated;
