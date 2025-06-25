import { EventEmitter } from 'events';
interface SentimentAnalysis {
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    platform: string;
    timestamp: number;
    topics: string[];
    entities: {
        name: string;
        type: string;
        sentiment: number;
    }[];
}
interface SentimentTrend {
    entityId: string;
    entityType: string;
    timeframe: string;
    platform?: string;
    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
    };
    volume: number;
    trends: {
        timestamp: number;
        sentiment: number;
        volume: number;
    }[];
}
interface EntityMention {
    entityId: string;
    entityType: string;
    mentions: {
        text: string;
        platform: string;
        sentiment: number;
        timestamp: number;
        engagement: number;
    }[];
    summary: {
        totalMentions: number;
        avgSentiment: number;
        platforms: string[];
    };
}
/**
 * Modern SocialSentimentService with proper async/await and error handling
 */
export declare class SocialSentimentService extends EventEmitter {
    private config;
    private cache;
    private analysisQueue;
    private readonly CACHE_TTL;
    constructor();
    /**
     * Queue text for sentiment analysis
     */
    queueAnalysis(text: string, platform: string): void;
    /**
     * Analyze sentiment for a single text
     */
    analyzeSentiment(text: string, platform: string): Promise<SentimentAnalysis | null>;
    /**
     * Get sentiment trend for an entity
     */
    getSentimentTrend(params: {
        entityId: string;
        entityType: string;
        timeframe: string;
        platform?: string;
    }): Promise<SentimentTrend | null>;
    /**
     * Get entity mentions
     */
    getEntityMentions(entityId: string, entityType: string): Promise<EntityMention | null>;
    /**
     * Start processing the analysis queue
     */
    private startProcessingQueue;
    /**
     * Process a batch of sentiment analysis requests
     */
    private analyzeBatch;
    /**
     * Add text to analysis queue
     */
    private queueForAnalysis;
    /**
     * Simulate sentiment analysis for fallback
     */
    private simulateSentiment;
    /**
     * Report service status
     */
    private reportStatus;
    /**
     * Generate cache key
     */
    private getCacheKey;
    /**
     * Get cached data if still valid
     */
    private getCachedData;
    /**
     * Set data in cache
     */
    private setCachedData;
    /**
     * Clear all cached data
     */
    clearCache(): void;
    /**
     * Clear specific cache item
     */
    clearCacheItem(key: string): void;
    /**
     * Get current queue size
     */
    getQueueSize(): number;
    /**
     * Check if queue is processing
     */
    isQueueProcessing(): boolean;
}
export declare const socialSentimentService: SocialSentimentService;
export {};
