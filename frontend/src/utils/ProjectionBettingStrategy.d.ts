type ExtendedIntegratedData = Omit<IntegratedData, 'sentiment'> & {
    projections?: Record<string, unknown>;
    odds?: Record<string, unknown>;
    sentiment?: unknown[];
    injuries?: Record<string, unknown>;
    trends?: Record<string, unknown>;
    timestamp?: number;
};
import { ProjectionAnalysis } from "../analyzers/ProjectionAnalyzer";
import { Decision, IntegratedData, Recommendation, Strategy } from "../core/PredictionEngine";
export interface ProjectionPlugin {
    statType: string;
    evaluate: (projection: ProjectionAnalysis, config: StrategyConfig) => Recommendation[];
}
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
    private edgeCache;
    private stabilityCache;
    private confidenceCache;
    private plugins;
    constructor(config: StrategyConfig, plugins?: ProjectionPlugin[]);
    validate(data: IntegratedData): boolean;
    getMetrics(): void;
    private registerDefaultPlugins;
    analyze(data: ExtendedIntegratedData): Promise<Decision>;
    private generateRiskReasoning;
}
export {};
