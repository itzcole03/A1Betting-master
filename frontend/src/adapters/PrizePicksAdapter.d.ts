import { PrizePicksData } from '../types/prizePicks';
interface PrizePicksAdapterConfig {
    apiKey?: string;
    baseUrl?: string;
    cacheTimeout?: number;
    defaultLeagueId?: string;
}
export declare class PrizePicksAdapter {
    readonly id = "prize-picks";
    readonly type = "sports-projections";
    private readonly prizePicksApi;
    private readonly config;
    private cache;
    constructor(config: PrizePicksAdapterConfig);
    isAvailable(): Promise<boolean>;
    fetch(): Promise<PrizePicksData>;
    private transformData;
    private isCacheValid;
    clearCache(): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getData(): Promise<PrizePicksData>;
    isConnected(): boolean;
    getMetadata(): Record<string, unknown>;
}
export {};
