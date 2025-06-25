import { DataSource } from "../unified/DataSource.js";
export interface OddsProvider {
    getOdds(eventId: string): Promise<unknown>;
}
export interface SportsRadarData {
    games: {
        id: string;
        status: string;
        scheduled: string;
        home: {
            name: string;
            alias: string;
            statistics: Record<string, number>;
        };
        away: {
            name: string;
            alias: string;
            statistics: Record<string, number>;
        };
        players: Array<{
            id: string;
            name: string;
            team: string;
            position: string;
            statistics: Record<string, number>;
            injuries: Array<{
                type: string;
                status: string;
                startDate: string;
            }>;
        }>;
    }[];
}
export declare class SportsRadarAdapter implements DataSource<SportsRadarData>, OddsProvider {
    readonly id = "sports-radar";
    readonly type = "sports-data";
    fetchData(): Promise<SportsRadarData>;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly config;
    private cache;
    private apiKey;
    private baseUrl;
    constructor();
    isAvailable(): Promise<boolean>;
    /**
     * Fetches the latest SportsRadar data, using cache if valid.
     */
    fetch(): Promise<SportsRadarData>;
    private fetchSportsRadarData;
    private isCacheValid;
    clearCache(): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getData(): Promise<SportsRadarData>;
    isConnected(): boolean;
    getMetadata(): Record<string, unknown>;
    getOdds(eventId: string): Promise<unknown>;
    getEventDetails(eventId: string): Promise<unknown>;
}
