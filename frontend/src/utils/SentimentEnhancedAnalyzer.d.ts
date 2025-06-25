import { Analyzer } from '../core/Analyzer.js';
import { ProjectionAnalysis } from './ProjectionAnalyzer.js';
import { SocialSentimentData } from '../adapters/SocialSentimentAdapter.js';
import { SportsRadarData } from '../adapters/SportsRadarAdapter.js';
import { TheOddsData } from '../adapters/TheOddsAdapter.js';
export interface EnhancedAnalysis extends ProjectionAnalysis {
    sentiment: {
        score: number;
        volume: number;
        trending: boolean;
        keywords: string[];
    };
    marketData: {
        odds: {
            moneyline?: number;
            spread?: number;
            total?: number;
        };
        consensus: {
            overPercentage: number;
            underPercentage: number;
        };
    };
    injuries: {
        player: string;
        status: string;
        impact: number;
    }[];
}
interface AnalysisInput {
    projectionAnalysis: ProjectionAnalysis[];
    sentimentData: SocialSentimentData[];
    sportsRadarData: SportsRadarData;
    oddsData: TheOddsData;
}
export declare class SentimentEnhancedAnalyzer implements Analyzer<AnalysisInput, EnhancedAnalysis[]> {
    readonly id = "sentiment-enhanced-analyzer";
    readonly type = "enhanced-analysis";
    readonly name = "Sentiment Enhanced Analyzer";
    readonly description = "Enhances projections with sentiment, odds, and injury data.";
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly sentimentWeight;
    private readonly injuryWeight;
    constructor(sentimentWeight?: number, injuryWeight?: number);
    validate(data: AnalysisInput): boolean;
    getMetrics(): {
        accuracy: number;
        latency: number;
        errorRate: number;
    };
    analyze(input: AnalysisInput): Promise<EnhancedAnalysis[]>;
    confidence(input: AnalysisInput): Promise<number>;
    private findPlayerSentiment;
    private findPlayerInjuries;
    /**
     * Attempts to find odds for a given player from the provided odds data.
     * Returns an OddsData object or null if not found.
     */
    private findPlayerOdds;
    private calculateEnhancedConfidence;
    private calculateInjuryImpact;
}
export {};
