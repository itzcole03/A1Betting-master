export interface VenueData {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    altitude?: number;
    surfaceType?: string;
    capacity?: number;
    roofType?: 'open' | 'closed' | 'retractable' | null;
    crowdFactor?: number;
    extra?: Record<string, unknown>;
}
export declare class VenueService {
    /**
     * Fetch venue by ID from external API
     */
    getVenueById(venueId: string): Promise<VenueData | null>;
    /**
     * Search venues by name/city/state
     */
    searchVenues(query: string): Promise<VenueData[]>;
    /**
     * Batch fetch venues by IDs
     */
    getVenuesByIds(ids: string[]): Promise<VenueData[]>;
    /**
     * Advanced modeling endpoint for venue analytics.
     * Integrates with backend ML/analytics API for venue modeling.
     */
    getVenueModeling(venueId: string): Promise<{
        venueId: string;
        model: string;
        score: number;
    }>;
}
export declare const venueService: VenueService;
