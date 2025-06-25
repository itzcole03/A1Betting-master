import { EventEmitter } from 'events';
interface OddsData {
    id: string;
    sport: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
}
interface Bookmaker {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
}
interface Market {
    key: string;
    outcomes: Outcome[];
}
interface Outcome {
    name: string;
    price: number;
    point?: number;
}
interface MarketAnalysis {
    market: string;
    volume: number;
    spread: number;
    trends: {
        direction: 'up' | 'down' | 'stable';
        strength: number;
    };
    bookmakerComparison: {
        bookmaker: string;
        odds: number;
        volume: number;
    }[];
}
/**
 * Modern OddsService with proper TypeScript and error handling
 */
export declare class OddsService extends EventEmitter {
    private cache;
    private readonly CACHE_TTL;
    constructor();
    private initializeHealthChecking;
    /**
     * Fetch live odds for sports events
     */
    getLiveOdds(sport?: string): Promise<OddsData[]>;
    /**
     * Get market analysis for a specific market
     */
    getMarketAnalysis(market: string, options?: {
        sport?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<MarketAnalysis>;
    /**
     * Get available bookmakers
     */
    getBookmakers(): Promise<string[]>;
    /**
     * Get historical odds data
     */
    getHistoricalOdds(market: string, options?: {
        startTime?: string;
        endTime?: string;
        bookmaker?: string;
    }): Promise<{
        timestamp: string;
        odds: number;
        probability: number;
    }[]>;
    /**
     * Get arbitrage opportunities
     */
    getArbitrageOpportunities(options?: {
        sport?: string;
        minEdge?: number;
        maxEdge?: number;
    }): Promise<{
        market: string;
        bets: {
            name: string;
            odds: number;
            bookmaker: string;
        }[];
        edge: number;
        confidence: number;
    }[]>;
    /**
     * Get cached data if still valid
     */
    private getCachedData;
    /**
     * Set data in cache
     */
    private setCachedData;
    /**
     * Report service status for monitoring
     */
    private reportStatus;
    /**
     * Fallback odds data when API fails
     */
    private getFallbackOdds;
}
export declare const oddsService: OddsService;
export {};
