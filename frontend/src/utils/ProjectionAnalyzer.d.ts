import { Analyzer } from '../core/Analyzer';
import { DailyFantasyData } from '../adapters/DailyFantasyAdapter';
export interface ProjectionAnalysis {
    player: string;
    predictions: {
        points: PredictionMetrics;
        rebounds: PredictionMetrics;
        assists: PredictionMetrics;
        steals: PredictionMetrics;
        blocks: PredictionMetrics;
        threes: PredictionMetrics;
        minutes: PredictionMetrics;
    };
    confidence: number;
    metadata: {
        team: string;
        position: string;
        opponent: string;
        isHome: boolean;
    };
}
interface PredictionMetrics {
    predicted: number;
    confidence: number;
    range: {
        min: number;
        max: number;
    };
}
export declare class ProjectionAnalyzer implements Analyzer<DailyFantasyData, ProjectionAnalysis[]> {
    readonly id = "projection-analyzer";
    readonly type = "sports-projections";
    readonly name = "Projection Analyzer";
    readonly description = "Analyzes player projections for fantasy sports.";
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly confidenceThreshold;
    constructor(confidenceThreshold?: number);
    analyze(data: DailyFantasyData): Promise<ProjectionAnalysis[]>;
    confidence(data: DailyFantasyData): Promise<number>;
    private analyzePlayerProjection;
    private calculateBaseConfidence;
    private calculateMetrics;
    private calculateVariance;
    private getStatTypeConfidence;
    private isValidProjection;
    validate(data: DailyFantasyData): boolean;
    getMetrics(): {
        accuracy: number;
        latency: number;
        errorRate: number;
    };
}
export {};
