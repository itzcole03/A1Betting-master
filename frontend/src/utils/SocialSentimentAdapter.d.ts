import { DataSource } from '../core/DataSource';
export interface SocialSentimentData {
    player: string;
    sentiment: {
        score: number;
        volume: number;
        sources: {
            twitter: number;
            reddit: number;
            news: number;
        };
    };
    trending: boolean;
    keywords: string[];
    timestamp: number;
}
export declare class SocialSentimentAdapter implements DataSource<SocialSentimentData[]> {
    readonly id = "social-sentiment";
    readonly type = "sentiment-analysis";
    private readonly eventBus;
    private readonly performanceMonitor;
    private cache;
    constructor();
    isAvailable(): Promise<boolean>;
    fetch(): Promise<SocialSentimentData[]>;
    private gatherSocialSentiment;
    private isCacheValid;
    clearCache(): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getData(): Promise<SocialSentimentData[]>;
    isConnected(): boolean;
    getMetadata(): Record<string, unknown>;
}
