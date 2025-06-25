interface SentimentData {
    entity: string;
    score: number;
    confidence: number;
    sources: {
        name: string;
        score: number;
        volume: number;
    }[];
    timeline: {
        timestamp: string;
        score: number;
        volume: number;
    }[];
    aspects: {
        [key: string]: {
            score: number;
            volume: number;
        };
    };
}
declare class SentimentService {
    private config;
    constructor();
    getSentiment(entity: string, options?: {
        startTime?: string;
        endTime?: string;
        sources?: string[];
    }): Promise<SentimentData>;
    private scrapeReddit;
    private scrapeESPN;
    private scrapeRotowire;
    private analyzeRedditSentiment;
    private analyzeESPNSentiment;
    private analyzeRotowireSentiment;
    private combineSentimentData;
    private calculateOverallScore;
    private calculateConfidence;
    private generateTimeline;
    private extractAspects;
}
export declare const sentimentService: SentimentService;
export {};
