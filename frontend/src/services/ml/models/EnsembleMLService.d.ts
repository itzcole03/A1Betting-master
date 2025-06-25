import { EventEmitter } from 'events';
export interface PredictionConfig {
    investment: number;
    modelSet: string[];
    confidence: number;
    strategy: 'maximum' | 'balanced' | 'conservative';
    portfolio: string;
    sports: string[];
    timeHorizon?: number;
    seasonality?: boolean;
    optimization?: {
        method: string;
        constraints: Record<string, any>;
    };
}
export interface ModelPrediction {
    modelName: string;
    prediction: string;
    confidence: number;
    probability: number;
    features: Record<string, any>;
    performance: {
        accuracy: number;
    };
    modelType: 'traditional' | 'deepLearning' | 'timeSeries' | 'optimization' | 'ensemble';
}
export interface EnsemblePrediction {
    overallConfidence: number;
    projectedPayout: number;
    opportunities: BettingOpportunity[];
    modelBreakdown: Record<string, any>;
    riskAssessment: RiskAssessment;
    confidence: number;
}
export interface BettingOpportunity {
    sport: string;
    event: string;
    prediction: string;
    confidence: number;
    odds: number;
    kellyFraction: number;
    riskLevel: 'low' | 'medium' | 'high';
}
export interface RiskAssessment {
    overallRisk: 'low' | 'medium' | 'high';
    confidenceScore: number;
    modelAgreement: number;
    variance: number;
}
export interface ModelStatus {
    traditional: CollectionStatus;
    deepLearning: CollectionStatus;
    timeSeries: CollectionStatus;
    optimization: CollectionStatus;
    ensemble: CollectionStatus;
}
export interface CollectionStatus {
    active: number;
    accuracy: number;
}
export interface PerformanceMetrics {
    accuracy: number;
    profitFactor: number;
    winRate: number;
    kellyOptimal: number;
}
export interface PropAnalysis {
    confidence: number;
    expectedValue: number;
    kellyFraction: number;
    prediction?: string;
    probability?: number;
}
export declare class EnsembleMLService extends EventEmitter {
    private models;
    constructor();
    generateEnsemblePrediction(config: PredictionConfig): Promise<EnsemblePrediction>;
    private calculateModelWeights;
    private combinePredictions;
    private determineMajorityPrediction;
    private combineFeatures;
    private calculateEnsembleAccuracy;
    private identifyBettingOpportunities;
    private calculateOdds;
    private calculateKellyFraction;
    private determineRiskLevel;
    private assessRisk;
    private calculateModelAgreement;
    private calculatePredictionVariance;
    private determineOverallRisk;
    private calculateProjectedPayout;
    private createModelBreakdown;
    getModelStatus(): Promise<Record<string, any>>;
    getPerformanceMetrics(): Promise<Record<string, any>>;
    analyzeProp(config: {
        player: string;
        statType: string;
        line: number;
        opponent: string;
        venue: string;
    }): Promise<PropAnalysis>;
    private calculateExpectedValue;
}
