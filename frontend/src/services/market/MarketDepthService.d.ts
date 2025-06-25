export interface MarketDepth {
    eventId: string;
    consensusOdds: number;
    lineVelocity: number;
    bookmakerCount: number;
    oddsSpread: number;
    lastUpdated: number;
}
export interface MarketDepthBatch {
    [eventId: string]: MarketDepth;
}
export declare class MarketDepthService {
    /**
     * Fetch market depth for a single event from backend/bookmaker API
     */
    getMarketDepth: (eventId: string) => Promise<MarketDepth | null>;
    /**
     * Fetch market depth for multiple events (batch)
     */
    getMarketDepthBatch: (eventIds: string[]) => Promise<MarketDepthBatch>;
    /**
     * Fetch market depth trends and analytics for an event
     */
    getMarketDepthTrends: (eventId: string) => Promise<MarketDepthBatch | null>;
}
export declare const marketDepthService: MarketDepthService;
