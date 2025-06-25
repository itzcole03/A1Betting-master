import { Observable } from 'rxjs';
export interface BookmakerTag {
    type: 'demon' | 'goblin' | 'normal';
    timestamp: number;
    playerId: string;
    propType: string;
    projectedValue: number;
    actualValue: number;
    success?: boolean;
}
export interface BookmakerPattern {
    tag: BookmakerTag['type'];
    successRate: number;
    averageDeviation: number;
    confidence: number;
    lastUpdated: number;
    sampleSize: number;
}
export interface BookmakerIntent {
    suspiciousLevel: number;
    historicalAccuracy: number;
    marketTrend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    warning?: string;
}
export interface PropAnalysis {
    rawStatisticalProbability: number;
    bookmakerIntent: BookmakerIntent;
    adjustedProbability: number;
    riskScore: number;
    warnings: string[];
}
declare class BookmakerAnalysisService {
    private static readonly SUSPICIOUS_THRESHOLD;
    private static readonly PATTERN_EXPIRY;
    private static readonly MIN_SAMPLE_SIZE;
    private patterns;
    private recentTags;
    private patternUpdateInterval;
    constructor();
    private initializeService;
    private loadHistoricalPatterns;
    private loadRecentTags;
    private startPatternAnalysis;
    private updatePatternAnalysis;
    private calculateConfidence;
    private savePatterns;
    analyzeProp(propData: {
        playerId: string;
        propType: string;
        projectedValue: number;
        tag: BookmakerTag['type'];
        currentOdds: number;
        historicalAverage: number;
    }): Promise<PropAnalysis>;
    private calculateRawProbability;
    private analyzeBookmakerIntent;
    private calculateSuspiciousLevel;
    private analyzeMarketTrend;
    private calculateRiskScore;
    private calculateAdjustedProbability;
    private isSuspiciouslyFavorable;
    getPatternUpdateStream(): Observable<Map<string, BookmakerPattern>>;
}
export declare const bookmakerAnalysisService: BookmakerAnalysisService;
export {};
