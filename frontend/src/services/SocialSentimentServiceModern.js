import { EventEmitter } from 'events';
/**
 * Modern SocialSentimentService with proper async/await and error handling
 */
export class SocialSentimentService extends EventEmitter {
    constructor() {
        super();
        this.cache = new Map();
        this.analysisQueue = [];
        this.CACHE_TTL = 300000; // 5 minutes
        this.config = {
            apiUrl: import.meta.env.VITE_SENTIMENT_API_URL || 'https://api.sentiment.com',
            apiKey: import.meta.env.VITE_SENTIMENT_API_KEY || '',
            batchSize: 50,
            refreshInterval: 30000,
            enableRealTime: import.meta.env.VITE_ENABLE_SENTIMENT === 'true',
        };
        if (this.config.enableRealTime) {
            this.startProcessingQueue();
        }
    }
    /**
     * Queue text for sentiment analysis
     */
    queueAnalysis(text, platform) {
        if (import.meta.env.VITE_DISABLE_SOCIAL_SENTIMENT === 'true') {
            return;
        }
        this.queueForAnalysis(text, platform, Date.now());
    }
    /**
     * Analyze sentiment for a single text
     */
    async analyzeSentiment(text, platform) {
        if (import.meta.env.VITE_DISABLE_SOCIAL_SENTIMENT === 'true') {
            return this.simulateSentiment(text, platform);
        }
        try {
            const response = await fetch(`${this.config.apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    text,
                    platform,
                    options: {
                        includeEntities: true,
                        includeTopics: true,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error(`Sentiment API error: ${response.status}`);
            }
            const result = await response.json();
            this.reportStatus('sentiment-api', true, 0.9);
            return result;
        }
        catch (error) {
            console.error('Error analyzing sentiment:', error);
            this.reportStatus('sentiment-api', false, 0.1);
            return this.simulateSentiment(text, platform);
        }
    }
    /**
     * Get sentiment trend for an entity
     */
    async getSentimentTrend(params) {
        const cacheKey = this.getCacheKey('trend', params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await fetch(`${this.config.apiUrl}/trends`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Trends API error: ${response.status}`);
            }
            const trend = await response.json();
            this.setCachedData(cacheKey, trend);
            return trend;
        }
        catch (error) {
            console.error('Error fetching sentiment trend:', error);
            return null;
        }
    }
    /**
     * Get entity mentions
     */
    async getEntityMentions(entityId, entityType) {
        const cacheKey = this.getCacheKey(`entity:${entityId}`);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await fetch(`${this.config.apiUrl}/entities/${entityId}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Entity mentions API error: ${response.status}`);
            }
            const mentions = await response.json();
            this.setCachedData(cacheKey, mentions);
            return mentions;
        }
        catch (error) {
            console.error('Error fetching entity mentions:', error);
            return null;
        }
    }
    /**
     * Start processing the analysis queue
     */
    async startProcessingQueue() {
        setInterval(async () => {
            if (this.analysisQueue.length === 0)
                return;
            const batch = this.analysisQueue.splice(0, this.config.batchSize);
            try {
                await this.analyzeBatch(batch);
            }
            catch (error) {
                console.error('Error processing sentiment batch:', error);
            }
        }, this.config.refreshInterval);
    }
    /**
     * Process a batch of sentiment analysis requests
     */
    async analyzeBatch(batch) {
        const startTime = Date.now();
        try {
            const response = await fetch(`${this.config.apiUrl}/analyze/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({ batch }),
            });
            if (!response.ok) {
                throw new Error(`Batch sentiment API error: ${response.status}`);
            }
            const result = await response.json();
            const analyses = result.analyses;
            // Emit metrics
            this.emit('metric:recorded', {
                type: 'sentiment_batch_processed',
                value: analyses.length,
                duration: Date.now() - startTime,
                timestamp: Date.now(),
            });
            return analyses;
        }
        catch (error) {
            console.error('Error in batch sentiment analysis:', error);
            // Return simulated results for fallback
            return batch.map(item => this.simulateSentiment(item.text, item.platform));
        }
    }
    /**
     * Add text to analysis queue
     */
    queueForAnalysis(text, platform, timestamp) {
        this.analysisQueue.push({ text, platform, timestamp });
        // Emit queue metrics
        this.emit('metric:recorded', {
            type: 'sentiment_queue_size',
            value: this.analysisQueue.length,
            timestamp: Date.now(),
        });
    }
    /**
     * Simulate sentiment analysis for fallback
     */
    simulateSentiment(text, platform) {
        const words = text.toLowerCase().split(' ');
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'win', 'victory'];
        const negativeWords = ['bad', 'terrible', 'awful', 'loss', 'fail', 'injury'];
        let sentiment = 'neutral';
        let confidence = 0.5;
        if (words.some(word => positiveWords.includes(word))) {
            sentiment = 'positive';
            confidence = 0.7;
        }
        else if (words.some(word => negativeWords.includes(word))) {
            sentiment = 'negative';
            confidence = 0.7;
        }
        return {
            text,
            sentiment,
            confidence,
            platform,
            timestamp: Date.now(),
            topics: ['sports', 'betting'],
            entities: [],
        };
    }
    /**
     * Report service status
     */
    reportStatus(source, connected, quality) {
        if (typeof window !== 'undefined') {
            window.appStatus = window.appStatus || {};
            window.appStatus[source] = { connected, quality, timestamp: Date.now() };
        }
        console.info(`[SocialSentimentService] ${source} status:`, { connected, quality });
    }
    /**
     * Generate cache key
     */
    getCacheKey(endpoint, params) {
        const paramStr = params ? JSON.stringify(params) : '';
        return `${endpoint}:${paramStr}`;
    }
    /**
     * Get cached data if still valid
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }
        return null;
    }
    /**
     * Set data in cache
     */
    setCachedData(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Clear specific cache item
     */
    clearCacheItem(key) {
        this.cache.delete(key);
    }
    /**
     * Get current queue size
     */
    getQueueSize() {
        return this.analysisQueue.length;
    }
    /**
     * Check if queue is processing
     */
    isQueueProcessing() {
        return this.config.enableRealTime;
    }
}
// Export singleton instance
export const socialSentimentService = new SocialSentimentService();
