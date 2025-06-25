import { DailyFantasyAdapter } from '../adapters/DailyFantasyAdapter';
import { ESPNAdapter } from '../adapters/ESPNAdapter';
import { EventBus } from '@/core/EventBus';
import { PerformanceMonitor } from './PerformanceMonitor';
import { PrizePicksAdapter } from '../adapters/PrizePicksAdapter';
import { SocialSentimentAdapter } from '../adapters/SocialSentimentAdapter';
import { SportsRadarAdapter } from '../adapters/SportsRadarAdapter';
import { TheOddsAdapter } from '../adapters/TheOddsAdapter';
export class DataIntegrationHub {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.dataSources = new Map();
        this.metrics = new Map();
        this.correlationCache = new Map();
        this.dataCache = new Map();
        this.integratedData = this.initializeIntegratedData();
        this.syncInterval = 30000; // 30 seconds default
        this.isRealTimeEnabled = false;
        // Register all adapters
        const espnAdapter = new ESPNAdapter();
        this.registerDataSource(espnAdapter);
        const socialSentimentAdapter = new SocialSentimentAdapter();
        this.registerDataSource(socialSentimentAdapter);
        // Configure and register TheOddsAdapter
        const theOddsApiKey = import.meta.env.VITE_THEODDS_API_KEY;
        if (theOddsApiKey) {
            const theOddsAdapter = new TheOddsAdapter({
                apiKey: theOddsApiKey,
                baseUrl: 'https://api.the-odds-api.com/v4',
                cacheTimeout: 300000,
            });
            this.registerDataSource(theOddsAdapter);
        }
        else {
            console.warn('TheOddsAdapter not initialized: VITE_THEODDS_API_KEY is missing.');
        }
        // Configure and register SportsRadarAdapter
        const sportsRadarApiKey = import.meta.env.VITE_SPORTRADAR_API_KEY;
        if (sportsRadarApiKey) {
            const sportsRadarAdapter = new SportsRadarAdapter({
                apiKey: sportsRadarApiKey,
                baseUrl: 'https://api.sportradar.us',
                cacheTimeout: 300000,
            });
            this.registerDataSource(sportsRadarAdapter);
        }
        else {
            console.warn('SportsRadarAdapter not initialized: VITE_SPORTRADAR_API_KEY is missing.');
        }
        // Configure and register DailyFantasyAdapter
        const dailyFantasyApiKey = import.meta.env.VITE_DAILYFANTASY_API_KEY;
        if (dailyFantasyApiKey) {
            const dailyFantasyAdapter = new DailyFantasyAdapter({
                apiKey: dailyFantasyApiKey,
                baseUrl: 'https://api.example.com/dailyfantasy',
                cacheTimeout: 300000,
            });
            this.registerDataSource(dailyFantasyAdapter);
        }
        else {
            console.warn('DailyFantasyAdapter not initialized: VITE_DAILYFANTASY_API_KEY is missing.');
        }
        // Configure and register PrizePicksAdapter
        const prizePicksApiKey = import.meta.env.VITE_PRIZEPICKS_API_KEY;
        if (prizePicksApiKey) {
            const prizePicksAdapter = new PrizePicksAdapter({
                apiKey: prizePicksApiKey,
                baseUrl: import.meta.env.VITE_PRIZEPICKS_API_URL || 'https://api.prizepicks.com',
                cacheTimeout: 300000, // 5 minutes cache
            });
            this.registerDataSource(prizePicksAdapter);
        }
        else {
            console.warn('PrizePicksAdapter not initialized: VITE_PRIZEPICKS_API_KEY is missing.');
        }
        this.setupEventListeners();
    }
    static getInstance() {
        if (!DataIntegrationHub.instance) {
            DataIntegrationHub.instance = new DataIntegrationHub();
        }
        return DataIntegrationHub.instance;
    }
    initializeIntegratedData() {
        return {
            timestamp: Date.now(),
            projections: {},
            sentiment: {},
            odds: {},
            injuries: {},
            trends: {},
        };
    }
    registerDataSource(source) {
        this.dataSources.set(source.id, source);
        this.metrics.set(source.id, {
            latency: [],
            errorRate: 0,
            lastUpdate: 0,
            dataQuality: 0,
        });
    }
    async startRealTimeSync() {
        this.isRealTimeEnabled = true;
        await this.synchronizeAll();
    }
    stopRealTimeSync() {
        this.isRealTimeEnabled = false;
    }
    setSyncInterval(milliseconds) {
        this.syncInterval = milliseconds;
    }
    async synchronizeAll() {
        const traceId = this.performanceMonitor.startTrace('data-sync');
        try {
            const syncPromises = Array.from(this.dataSources.entries()).map(async ([id, source]) => {
                const startTime = Date.now();
                try {
                    const data = await source.fetch();
                    this.updateSourceMetrics(id, {
                        latency: [Date.now() - startTime],
                        errorRate: 0,
                        lastUpdate: Date.now(),
                        dataQuality: 0.8,
                    });
                    return { id, data, error: null };
                }
                catch (error) {
                    this.updateSourceMetrics(id, {
                        latency: [Date.now() - startTime],
                        errorRate: 1,
                        lastUpdate: Date.now(),
                        dataQuality: 0.0,
                    });
                    return {
                        id,
                        data: null,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                }
            });
            const results = await Promise.all(syncPromises);
            await this.integrateData(results);
            if (this.isRealTimeEnabled) {
                setTimeout(() => this.synchronizeAll(), this.syncInterval);
            }
            this.performanceMonitor.endTrace(traceId);
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    updateSourceMetrics(sourceId, metrics) {
        if (!this.metrics.has(sourceId)) {
            this.metrics.set(sourceId, metrics);
        }
        else {
            const existingMetrics = this.metrics.get(sourceId);
            this.metrics.set(sourceId, {
                ...existingMetrics,
                latency: [...existingMetrics.latency, ...metrics.latency].slice(-10),
                errorRate: metrics.errorRate,
                lastUpdate: metrics.lastUpdate,
                dataQuality: metrics.dataQuality,
            });
        }
        this.emitMetricsUpdate(sourceId);
    }
    async integrateData(results) {
        const newData = this.initializeIntegratedData();
        const correlations = [];
        for (const result of results) {
            if (result.error)
                continue;
            // Cache the raw data with metadata
            const confidence = this.calculateDataConfidence(result.data);
            this.dataCache.set(result.id, {
                data: result.data,
                timestamp: Date.now(),
                correlations: [], // Placeholder, to be updated later if correlation analysis is run on this source
                confidence,
            });
            this.updateIntegratedDataSource(newData, result);
        }
        // After all individual sources are processed and cached, perform cross-source analysis
        // For example, calculate correlations if multiple projection sources exist
        // this.analyzeAndCacheCorrelations(results.filter(r => !r.error).map(r => ({id: r.id, data: r.data })));
        this.integratedData = newData;
        this.eventBus.emit('data:integrated', {
            integratedData: this.integratedData,
            timestamp: Date.now(),
        });
    }
    calculateDataConfidence(data) {
        // Basic confidence: presence of data and key fields
        if (!data)
            return 0;
        if (data.projections && Array.isArray(data.projections) && data.projections.length > 0)
            return 0.75;
        if (data.sentiment && Object.keys(data.sentiment).length > 0)
            return 0.7;
        // Add more sophisticated checks based on data quality, recency, etc.
        return 0.5; // Default baseline confidence
    }
    // Placeholder for a more sophisticated correlation analysis if needed
    // private analyzeAndCacheCorrelations(activeDataSources: Array<{id: string, data: any }>): void {
    //   // ... implementation ...
    // }
    updateIntegratedDataSource(newData, result) {
        if (result.error || !result.data)
            return;
        switch (result.id) {
            case 'daily-fantasy': // Assuming DailyFantasyAdapter.id is 'daily-fantasy'
                this.integrateProjections(newData, result.data);
                break;
            case 'prize-picks': // Assuming PrizePicksAdapter.id is 'prize-picks'
                this.integratePrizePicksProjections(newData, result.data);
                break;
            case 'social-sentiment': // Assuming SocialSentimentAdapter.id is 'social-sentiment'
                this.integrateSentiment(newData, result.data); // Assuming it's an array
                break;
            case 'sports-radar': // Assuming SportsRadarAdapter.id is 'sports-radar'
                this.integrateSportsData(newData, result.data);
                break;
            case 'the-odds': // Assuming TheOddsAdapter.id is 'the-odds'
                this.integrateOdds(newData, result.data);
                break;
            // Add cases for other adapters like ESPN if they have specific integration logic
            default:
                console.warn(`DataIntegrationHub: No specific integration logic for source ID: ${result.id}`);
                // Attempt a generic integration or log/ignore
                break;
        }
    }
    integrateProjections(newData, dailyFantasyData) {
        dailyFantasyData.projections.forEach(projection => {
            const playerId = projection.name.toLowerCase().replace(/\s+/g, '-');
            if (!newData.projections[playerId]) {
                newData.projections[playerId] = {
                    stats: {},
                    confidence: 0.8,
                    lastUpdated: Date.now(),
                };
            }
            // Map DailyFantasy stats to our internal format
            newData.projections[playerId].stats = {
                points: projection.pts,
                rebounds: projection.reb,
                assists: projection.ast,
                steals: projection.stl,
                blocks: projection.blk,
                threePointers: projection.three_pt,
                minutes: projection.min,
            };
            newData.projections[playerId].lastUpdated = Date.now();
        });
    }
    integratePrizePicksProjections(newData, prizePicksData) {
        prizePicksData.projections.forEach((proj) => {
            if (!newData.projections[proj.playerId]) {
                newData.projections[proj.playerId] = {
                    stats: {},
                    confidence: 0.8,
                    lastUpdated: Date.now(),
                };
            }
            // Map PrizePicks stat types to our internal format
            const statType = proj.statType.toLowerCase();
            newData.projections[proj.playerId].stats[statType] = proj.line;
            newData.projections[proj.playerId].lastUpdated = Date.now();
        });
    }
    integrateSentiment(newData, sentimentDataArray) {
        sentimentDataArray.forEach(data => {
            newData.sentiment[data.player] = data;
        });
    }
    integrateSportsData(newData, sportsData) {
        sportsData.games.forEach(game => {
            game.players.forEach(player => {
                if (player.injuries.length > 0) {
                    newData.injuries[player.id] = {
                        status: player.injuries[0].status,
                        details: player.injuries[0].type,
                        impact: this.calculateInjuryImpact(player.injuries[0]),
                        timeline: player.injuries[0].startDate,
                    };
                }
            });
        });
    }
    integrateOdds(newData, oddsData) {
        oddsData.events.forEach(event => {
            const markets = {};
            event.bookmakers.forEach(bookmaker => {
                bookmaker.markets.forEach(market => {
                    market.outcomes.forEach(outcome => {
                        markets[`${market.key}_${outcome.name}`] = outcome.price;
                    });
                });
            });
            newData.odds[event.id] = {
                markets,
                movement: this.calculateOddsMovement(event.id, markets),
            };
        });
    }
    calculateInjuryImpact(injury) {
        const statusImpact = {
            out: 1,
            doubtful: 0.75,
            questionable: 0.5,
            probable: 0.25,
        }[injury.status.toLowerCase()] ?? 0;
        return statusImpact;
    }
    calculateOddsMovement(eventId, currentMarkets) {
        const previousData = this.integratedData.odds[eventId];
        if (!previousData) {
            return { direction: 'stable', magnitude: 0 };
        }
        const avgCurrentPrice = Object.values(currentMarkets).reduce((a, b) => a + b, 0) /
            Object.values(currentMarkets).length;
        const avgPreviousPrice = Object.values(previousData.markets).reduce((a, b) => a + b, 0) /
            Object.values(previousData.markets).length;
        const difference = avgCurrentPrice - avgPreviousPrice;
        const magnitude = Math.abs(difference);
        if (magnitude < 0.05)
            return { direction: 'stable', magnitude };
        return {
            direction: difference > 0 ? 'up' : 'down',
            magnitude,
        };
    }
    analyzeTrendsWithCorrelations(newData, correlations) {
        // Analyze projection trends
        this.analyzeProjectionTrends(newData);
        // Analyze sentiment trends
        this.analyzeSentimentTrends(newData);
        // Analyze market trends
        this.analyzeMarketTrends(newData);
        // Analyze correlation trends
        this.analyzeCorrelationTrends(newData, correlations);
    }
    analyzeProjectionTrends(newData) {
        Object.entries(newData.projections).forEach(([playerId, projection]) => {
            Object.entries(projection.stats).forEach(([metric, value]) => {
                const trendKey = `${playerId}_${metric}`;
                const previousValue = this.integratedData.projections[playerId]?.stats[metric];
                if (previousValue !== undefined) {
                    const change = value - previousValue;
                    const significance = this.calculateTrendSignificance(change, previousValue);
                    newData.trends[trendKey] = {
                        value,
                        change,
                        significance,
                    };
                }
            });
        });
    }
    analyzeSentimentTrends(newData) {
        Object.entries(newData.sentiment).forEach(([playerId, sentiment]) => {
            const trendKey = `${playerId}_sentiment`;
            const previousSentiment = this.integratedData.sentiment[playerId];
            if (previousSentiment) {
                const change = sentiment.sentiment.score - previousSentiment.sentiment.score;
                const volumeChange = sentiment.sentiment.volume - previousSentiment.sentiment.volume;
                const significance = this.calculateTrendSignificance(change, previousSentiment.sentiment.score);
                newData.trends[trendKey] = {
                    value: sentiment.sentiment.score,
                    change,
                    significance: significance * (1 + Math.min(1, volumeChange / 1000)),
                };
            }
        });
    }
    analyzeMarketTrends(newData) {
        Object.entries(newData.odds).forEach(([eventId, odds]) => {
            Object.entries(odds.markets).forEach(([market, price]) => {
                const trendKey = `${eventId}_${market}`;
                const previousPrice = this.integratedData.odds[eventId]?.markets[market];
                if (previousPrice !== undefined) {
                    const change = price - previousPrice;
                    const significance = this.calculateTrendSignificance(change, previousPrice);
                    newData.trends[trendKey] = {
                        value: price,
                        change,
                        significance,
                    };
                }
            });
        });
    }
    analyzeCorrelationTrends(newData, correlations) {
        // Analyze correlations between different data points
        Object.entries(newData.projections).forEach(([playerId, projection]) => {
            const sentiment = newData.sentiment[playerId];
            const injuries = newData.injuries[playerId];
            if (sentiment && projection) {
                const correlationKey = `${playerId}_sentiment_correlation`;
                const sentimentImpact = sentiment.sentiment.score * (sentiment.sentiment.volume / 1000);
                const performanceCorrelation = this.calculateCorrelation(Object.values(projection.stats), [
                    sentimentImpact,
                ]);
                newData.trends[correlationKey] = {
                    value: performanceCorrelation,
                    change: 0, // We don't track change for correlations
                    significance: Math.abs(performanceCorrelation),
                };
            }
            if (injuries) {
                const injuryKey = `${playerId}_injury_impact`;
                newData.trends[injuryKey] = {
                    value: injuries.impact,
                    change: 0,
                    significance: injuries.impact,
                };
            }
        });
        // Analyze correlations with other data sources
        for (const correlation of correlations) {
            const sourceA = correlation.sourceA;
            const sourceB = correlation.sourceB;
            const correlationValue = correlation.correlation;
            const significance = correlation.significance;
            const trendKey = `${sourceA}_${sourceB}_correlation`;
            newData.trends[trendKey] = {
                value: correlationValue,
                change: 0,
                significance: significance,
            };
        }
    }
    calculateTrendSignificance(change, baseValue) {
        if (baseValue === 0)
            return change === 0 ? 0 : 1;
        const percentageChange = Math.abs(change / baseValue);
        return Math.min(1, percentageChange);
    }
    calculateCorrelation(series1, series2) {
        if (series1.length !== series2.length || series1.length === 0)
            return 0;
        const mean1 = series1.reduce((a, b) => a + b, 0) / series1.length;
        const mean2 = series2.reduce((a, b) => a + b, 0) / series2.length;
        const variance1 = series1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
        const variance2 = series2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);
        if (variance1 === 0 || variance2 === 0)
            return 0;
        const covariance = series1.reduce((a, b, i) => {
            return a + (b - mean1) * (series2[i] - mean2);
        }, 0);
        return covariance / Math.sqrt(variance1 * variance2);
    }
    setupEventListeners() {
        this.eventBus.on('dataSource:error', async (event) => {
            const sourceId = event.sourceId;
            const metrics = this.metrics.get(sourceId) || {
                latency: [],
                errorRate: 0,
                lastUpdate: 0,
                dataQuality: 0,
            };
            this.updateSourceMetrics(sourceId, {
                ...metrics,
                errorRate: metrics.errorRate + 0.1,
                dataQuality: metrics.dataQuality * 0.9,
            });
        });
        this.eventBus.on('cache:clear', event => {
            if (event.source === 'all' || event.source === 'dataHub') {
                this.dataCache.clear();
                this.correlationCache.clear();
                this.integratedData = this.initializeIntegratedData();
                this.eventBus.emit('cache:cleared', { source: 'dataHub' });
            }
        });
        this.eventBus.on('config:updated', event => {
            if (event.section === 'dataSources' || event.section === 'all') {
                // Handle config updates
            }
        });
    }
    getIntegratedData() {
        return this.integratedData;
    }
    getSourceMetrics() {
        return new Map(this.metrics);
    }
    calculateMetrics(sourceId, data) {
        const startTime = Date.now();
        return {
            latency: [Date.now() - startTime],
            errorRate: 0,
            lastUpdate: Date.now(),
            dataQuality: 0.8,
        };
    }
    emitMetricsUpdate(sourceId) {
        const metrics = this.metrics.get(sourceId) || {
            latency: [],
            errorRate: 0,
            lastUpdate: 0,
            dataQuality: 0,
        };
        this.eventBus.emit('data-source-metric-updated', {
            sourceId,
            latency: metrics.latency[0] || 0,
            errorRate: metrics.errorRate,
            lastUpdate: metrics.lastUpdate,
            dataQuality: metrics.dataQuality,
        });
    }
}
