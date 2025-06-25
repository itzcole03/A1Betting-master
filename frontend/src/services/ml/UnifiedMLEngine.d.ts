import { EventEmitter } from "eventemitter3";
export interface MLModelConfig {
    name: string;
    type: "xgboost" | "lightgbm" | "randomforest" | "neural_network" | "ensemble";
    version: string;
    weight: number;
    features: string[];
    hyperparameters: Record<string, any>;
    performance: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        roc_auc: number;
        logLoss: number;
    };
    lastTrained: number;
    isActive: boolean;
}
export interface FeatureVector {
    [featureName: string]: number;
}
export interface PredictionInput {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    features: FeatureVector;
    market: string;
    timestamp: number;
}
export interface ModelPrediction {
    modelName: string;
    prediction: number;
    confidence: number;
    features: FeatureVector;
    shapValues: Record<string, number>;
    processingTime: number;
    modelVersion: string;
}
export interface EnsemblePrediction {
    finalPrediction: number;
    confidence: number;
    models: ModelPrediction[];
    consensusScore: number;
    valueEdge: number;
    kellyFraction: number;
    recommendedStake: number;
    riskLevel: "low" | "medium" | "high";
    factors: Array<{
        name: string;
        impact: number;
        weight: number;
        direction: "positive" | "negative";
    }>;
    metadata: {
        processingTime: number;
        dataFreshness: number;
        signalQuality: number;
        modelAgreement: number;
    };
}
export interface FeatureImportance {
    name: string;
    importance: number;
    category: "player" | "team" | "game" | "market" | "environmental";
    description: string;
}
export interface ModelPerformanceMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    logLoss: number;
    calibrationError: number;
    profitability: number;
    sharpeRatio: number;
    winRate: number;
    averageOdds: number;
    totalPredictions: number;
    lastUpdated: number;
}
export declare class UnifiedMLEngine extends EventEmitter {
    private static instance;
    private models;
    private cache;
    private performanceMetrics;
    private featureImportances;
    private isTraining;
    private constructor();
    static getInstance(): UnifiedMLEngine;
    private initializeModels;
    generatePrediction(input: PredictionInput): Promise<EnsemblePrediction>;
    private generateModelPrediction;
    private simulateModelPrediction;
    private calculateModelConfidence;
    private combineModelPredictions;
    private calculateConsensusScore;
    private calculateValueEdge;
    private calculateKellyFraction;
    private determineRiskLevel;
    private calculateRecommendedStake;
    private extractKeyFactors;
    private calculateDataFreshness;
    private calculateSignalQuality;
    private calculateModelAgreement;
    private aggregateShapValues;
    private validateInput;
    getActiveModels(): MLModelConfig[];
    getModelPerformance(modelName: string): ModelPerformanceMetrics | undefined;
    updateModelPerformance(modelName: string, metrics: Partial<ModelPerformanceMetrics>): void;
    retrain(modelName?: string): Promise<void>;
    getCachedPrediction(eventId: string, market: string): EnsemblePrediction | undefined;
    clearCache(): void;
}
export declare const mlEngine: UnifiedMLEngine;
export type { MLModelConfig, FeatureVector, PredictionInput, ModelPrediction, EnsemblePrediction, FeatureImportance, ModelPerformanceMetrics, };
