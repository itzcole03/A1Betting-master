import { EventEmitter } from 'events';
import { apiService } from './api/ApiService';
/**
 * Modern OddsService with proper TypeScript and error handling
 */
export class OddsService extends EventEmitter {
    constructor() {
        super();
        this.cache = new Map();
        this.CACHE_TTL = 30000; // 30 seconds
        this.initializeHealthChecking();
    }
    initializeHealthChecking() {
        // Report status for monitoring
        setInterval(() => {
            this.reportStatus('odds-service', true, 0.9);
        }, 30000);
    }
    /**
     * Fetch live odds for sports events
     */
    async getLiveOdds(sport = 'americanfootball_nfl') {
        const cacheKey = `live-odds-${sport}`;
        // Check cache first
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await apiService.getOdds({ sport });
            if (response.success && response.data) {
                this.setCachedData(cacheKey, response.data);
                this.emit('odds:updated', { sport, data: response.data });
                this.reportStatus('live-odds', true, 0.9);
                return response.data;
            }
            throw new Error('Failed to fetch live odds');
        }
        catch (error) {
            console.error('Error fetching live odds:', error);
            this.reportStatus('live-odds', false, 0.1);
            return this.getFallbackOdds(sport);
        }
    }
    /**
     * Get market analysis for a specific market
     */
    async getMarketAnalysis(market, options) {
        try {
            const response = await apiService.get(`/odds/markets/${market}/analysis`, {
                params: {
                    sport: options?.sport,
                    start_time: options?.startTime,
                    end_time: options?.endTime,
                },
            });
            return response;
        }
        catch (error) {
            console.error('Error fetching market analysis:', error);
            throw error;
        }
    }
    /**
     * Get available bookmakers
     */
    async getBookmakers() {
        try {
            const response = await apiService.get('/odds/bookmakers', {
                headers: {
                    'Accept': 'application/json',
                },
            });
            return response;
        }
        catch (error) {
            console.error('Error fetching bookmakers:', error);
            return ['draftkings', 'fanduel', 'betmgm', 'caesars'];
        }
    }
    /**
     * Get historical odds data
     */
    async getHistoricalOdds(market, options) {
        try {
            const response = await apiService.get(`/odds/markets/${market}/history`, {
                params: {
                    start_time: options?.startTime,
                    end_time: options?.endTime,
                    bookmaker: options?.bookmaker,
                },
            });
            if (typeof response === 'object' && response !== null && 'data' in response) {
                return response.data;
            }
            return [];
        }
        catch (error) {
            console.error('Error fetching historical odds:', error);
            return [];
        }
    }
    /**
     * Get arbitrage opportunities
     */
    async getArbitrageOpportunities(options) {
        try {
            const response = await apiService.get('/odds/arbitrage', {
                params: {
                    sport: options?.sport,
                    min_edge: options?.minEdge,
                    max_edge: options?.maxEdge,
                },
            });
            if (typeof response === 'object' && response !== null && 'data' in response) {
                return response.data;
            }
            return [];
        }
        catch (error) {
            console.error('Error fetching arbitrage opportunities:', error);
            return [];
        }
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
     * Report service status for monitoring
     */
    reportStatus(source, connected, quality) {
        if (typeof window !== 'undefined') {
            window.appStatus = window.appStatus || {};
            window.appStatus[source] = { connected, quality, timestamp: Date.now() };
        }
        console.info(`[OddsService] ${source} status:`, { connected, quality });
    }
    /**
     * Fallback odds data when API fails
     */
    getFallbackOdds(sport) {
        return [
            {
                id: `fallback-${sport}-1`,
                sport,
                commence_time: new Date(Date.now() + 3600000).toISOString(),
                home_team: 'Team A',
                away_team: 'Team B',
                bookmakers: [
                    {
                        key: 'draftkings',
                        title: 'DraftKings',
                        last_update: new Date().toISOString(),
                        markets: [
                            {
                                key: 'h2h',
                                outcomes: [
                                    { name: 'Team A', price: 1.9 },
                                    { name: 'Team B', price: 1.9 },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
    }
}
// Export singleton instance
export const oddsService = new OddsService();
