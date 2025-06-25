import { PrizePicksProps, // Frontend representation
PrizePicksPlayer, PrizePicksLines } from '@/types';
export declare const fetchPrizePicksProps: (league?: string, statType?: string) => Promise<PrizePicksProps[]>;
/**
 * Fetches a specific player's details.
 * NOTE: The current backend does not have a dedicated endpoint for this.
 * This function might need to parse data from a broader fetch (e.g., from fetchPrizePicksProps's included data)
 * or a new backend endpoint would be required.
 * For now, this will be a placeholder or rely on data within already fetched props.
 */
export declare const fetchPrizePicksPlayer: (playerId: string) => Promise<PrizePicksPlayer | undefined>;
/**
 * Fetches lines for a specific prop.
 * NOTE: Similar to player details, the current backend returns lines within the projection data.
 * This function would parse from existing data or need a new backend endpoint `/api/prizepicks/lines/{propId}`.
 */
export declare const fetchPrizePicksLines: (propId: string) => Promise<PrizePicksLines | null>;
export declare const prizePicksService: {
    fetchPrizePicksProps: (league?: string, statType?: string) => Promise<PrizePicksProps[]>;
    fetchPrizePicksPlayer: (playerId: string) => Promise<PrizePicksPlayer | undefined>;
    fetchPrizePicksLines: (propId: string) => Promise<PrizePicksLines | null>;
};
