import type { PrizePicksProps } from '../types/prizePicks';
import type { OddsData } from '@/types/betting';
/**
 * UnifiedDataEngine (Client-Side Orchestrator)
 *
 * This client-side engine is responsible for orchestrating data retrieval from various
 * specialized services and potentially transforming or combining this data into formats
 * suitable for UI components or other core engines.
 *
 * The actual heavy lifting of fetching from diverse external raw sources (Sportradar, Twitter, etc.)
 * and complex aggregation/normalization is assumed to happen on the BACKEND.
 * This engine interacts with backend APIs (via services) that provide already processed or proxied data.
 *
 * Key Client-Side Responsibilities:
 * 1. Provide methods to fetch comprehensive datasets by orchestrating calls to multiple services.
 *    (e.g., getFullPlayerData(playerId) might fetch stats, news, sentiment, projections).
 * 2. Define interfaces for complex data objects that combine information from different sources.
 * 3. Handle client-side caching or leverage caching from services/Zustand if appropriate.
 * 4. Transform data into view models or formats required by specific UI components or engines.
 * 5. Manage data freshness and trigger updates (possibly via WebSocket events or polling strategies coordinated with services).
 */
export interface ComprehensivePlayerProfile {
    playerId: string;
    name: string;
    team?: string;
    position?: string;
    imageUrl?: string;
    recentProps?: PrizePicksProps[];
    marketOdds?: OddsData[];
}
export declare class UnifiedDataEngineSingleton {
    constructor();
    /**
     * Fetches a comprehensive profile for a player by aggregating data from various services.
     * Note: This is a conceptual example. Actual implementation depends heavily on available service methods.
     */
    getComprehensivePlayerProfile(playerNameOrId: string, leagueFilter?: string): Promise<ComprehensivePlayerProfile | null>;
    /**
     * Fetches and normalizes data for a specific market or prop ID.
     * This would involve fetching odds, lines, relevant stats, predictions etc.
     */
    getMarketDetails(propId: string): Promise<any | null>;
    /**
     * Fetches props from the Poe-like data source using the PoeToApiAdapter.
     */
    fetchPropsFromPoeSource(): Promise<PrizePicksProps[]>;
}
export declare const unifiedDataEngine: UnifiedDataEngineSingleton;
