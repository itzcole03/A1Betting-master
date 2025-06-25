import { Decision, IntegratedData, Strategy } from "../core/PredictionEngine";
import { PerformanceMetrics } from "../types/core";
interface StrategyConfig {
    minConfidence: number;
    minEdge: number;
    maxRisk: number;
    useHistoricalData: boolean;
    useAdvancedStats: boolean;
}
export declare class ProjectionBettingStrategy implements Strategy {
    readonly id = "projection-betting";
    readonly name = "Projection-Based Betting Strategy";
    readonly description = "Analyzes player projections to identify betting opportunities";
    confidence: number;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly featureManager;
    private readonly config;
    private metrics;
    constructor(config: StrategyConfig);
    analyze(data: IntegratedData): Promise<Decision>;
    validate(data: IntegratedData): boolean;
    getMetrics(): PerformanceMetrics;
    private processProjections;
    private calculateDataQuality;
    private calculateDataCompleteness;
    private calculateDataRecency;
    private calculatePredictionStability;
    private calculateMarketEfficiency;
    private calculateVolatility;
    private calculateConfidenceFactors;
    private calculateProjectionConfidence;
    private calculateSentimentConfidence;
    private calculateMarketConfidence;
    private calculateRiskFactors;
    private calculateMarketVolatility;
    private calculateInjuryRisk;
    private evaluateProjection;
    private calculateEdge;
    private generateReasoning;
}
export {};
