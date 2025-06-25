import { z } from 'zod';
import { DataSource } from '../UnifiedDataService';
export declare const HistoricalGameDataSchema: z.ZodObject<{
    gameId: z.ZodString;
    date: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    venue: z.ZodString;
    result: z.ZodObject<{
        homeScore: z.ZodNumber;
        awayScore: z.ZodNumber;
        winner: z.ZodString;
        margin: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        margin: number;
        homeScore: number;
        awayScore: number;
        winner: string;
    }, {
        margin: number;
        homeScore: number;
        awayScore: number;
        winner: string;
    }>;
    weather: z.ZodObject<{
        temperature: z.ZodNumber;
        humidity: z.ZodNumber;
        windSpeed: z.ZodNumber;
        precipitation: z.ZodNumber;
        conditions: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        temperature: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
        conditions: string;
    }, {
        temperature: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
        conditions: string;
    }>;
    attendance: z.ZodNumber;
    duration: z.ZodNumber;
    officials: z.ZodArray<z.ZodString, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    result: {
        margin: number;
        homeScore: number;
        awayScore: number;
        winner: string;
    };
    date: string;
    duration: number;
    homeTeam: string;
    awayTeam: string;
    weather: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
        conditions: string;
    };
    gameId: string;
    venue: string;
    attendance: number;
    officials: string[];
    metadata?: Record<string, unknown> | undefined;
}, {
    result: {
        margin: number;
        homeScore: number;
        awayScore: number;
        winner: string;
    };
    date: string;
    duration: number;
    homeTeam: string;
    awayTeam: string;
    weather: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
        conditions: string;
    };
    gameId: string;
    venue: string;
    attendance: number;
    officials: string[];
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const PlayerStatsSchema: z.ZodObject<{
    playerId: z.ZodString;
    name: z.ZodString;
    team: z.ZodString;
    position: z.ZodString;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    advancedMetrics: z.ZodRecord<z.ZodString, z.ZodNumber>;
    gameLog: z.ZodArray<z.ZodObject<{
        gameId: z.ZodString;
        date: z.ZodString;
        stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
        advancedMetrics: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        stats: Record<string, number>;
        gameId: string;
        advancedMetrics: Record<string, number>;
    }, {
        date: string;
        stats: Record<string, number>;
        gameId: string;
        advancedMetrics: Record<string, number>;
    }>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    position: string;
    name: string;
    team: string;
    playerId: string;
    stats: Record<string, number>;
    advancedMetrics: Record<string, number>;
    gameLog: {
        date: string;
        stats: Record<string, number>;
        gameId: string;
        advancedMetrics: Record<string, number>;
    }[];
    metadata?: Record<string, unknown> | undefined;
}, {
    position: string;
    name: string;
    team: string;
    playerId: string;
    stats: Record<string, number>;
    advancedMetrics: Record<string, number>;
    gameLog: {
        date: string;
        stats: Record<string, number>;
        gameId: string;
        advancedMetrics: Record<string, number>;
    }[];
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const TeamStatsSchema: z.ZodObject<{
    teamId: z.ZodString;
    name: z.ZodString;
    season: z.ZodString;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    advancedMetrics: z.ZodRecord<z.ZodString, z.ZodNumber>;
    homeStats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    awayStats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    lineupStats: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    stats: Record<string, number>;
    advancedMetrics: Record<string, number>;
    teamId: string;
    season: string;
    homeStats: Record<string, number>;
    awayStats: Record<string, number>;
    lineupStats: Record<string, Record<string, number>>;
    metadata?: Record<string, unknown> | undefined;
}, {
    name: string;
    stats: Record<string, number>;
    advancedMetrics: Record<string, number>;
    teamId: string;
    season: string;
    homeStats: Record<string, number>;
    awayStats: Record<string, number>;
    lineupStats: Record<string, Record<string, number>>;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const VenueStatsSchema: z.ZodObject<{
    venueId: z.ZodString;
    name: z.ZodString;
    location: z.ZodObject<{
        city: z.ZodString;
        state: z.ZodString;
        country: z.ZodString;
        coordinates: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            altitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
            altitude: number;
        }, {
            latitude: number;
            longitude: number;
            altitude: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        state: string;
        country: string;
        city: string;
        coordinates: {
            latitude: number;
            longitude: number;
            altitude: number;
        };
    }, {
        state: string;
        country: string;
        city: string;
        coordinates: {
            latitude: number;
            longitude: number;
            altitude: number;
        };
    }>;
    capacity: z.ZodNumber;
    surface: z.ZodString;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    weatherImpact: z.ZodRecord<z.ZodString, z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    location: {
        state: string;
        country: string;
        city: string;
        coordinates: {
            latitude: number;
            longitude: number;
            altitude: number;
        };
    };
    stats: Record<string, number>;
    venueId: string;
    capacity: number;
    surface: string;
    weatherImpact: Record<string, number>;
    metadata?: Record<string, unknown> | undefined;
}, {
    name: string;
    location: {
        state: string;
        country: string;
        city: string;
        coordinates: {
            latitude: number;
            longitude: number;
            altitude: number;
        };
    };
    stats: Record<string, number>;
    venueId: string;
    capacity: number;
    surface: string;
    weatherImpact: Record<string, number>;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const OfficialStatsSchema: z.ZodObject<{
    officialId: z.ZodString;
    name: z.ZodString;
    games: z.ZodNumber;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    tendencies: z.ZodRecord<z.ZodString, z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    stats: Record<string, number>;
    games: number;
    officialId: string;
    tendencies: Record<string, number>;
    metadata?: Record<string, unknown> | undefined;
}, {
    name: string;
    stats: Record<string, number>;
    games: number;
    officialId: string;
    tendencies: Record<string, number>;
    metadata?: Record<string, unknown> | undefined;
}>;
export type HistoricalGameData = z.infer<typeof HistoricalGameDataSchema>;
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
export type TeamStats = z.infer<typeof TeamStatsSchema>;
export type VenueStats = z.infer<typeof VenueStatsSchema>;
export type OfficialStats = z.infer<typeof OfficialStatsSchema>;
export interface HistoricalDataConfig {
    dataSources: DataSource[];
    cacheConfig: {
        enabled: boolean;
        ttl: number;
        maxSize: number;
    };
    validationConfig: {
        strict: boolean;
        allowPartial: boolean;
    };
}
export declare class HistoricalDataService {
    private logger;
    private errorHandler;
    private config;
    private cache;
    constructor(config: HistoricalDataConfig);
    initialize(): Promise<void>;
    private initializeDataSource;
    loadHistoricalData(startDate: string, endDate: string, options?: {
        includePlayerStats?: boolean;
        includeTeamStats?: boolean;
        includeVenueStats?: boolean;
        includeOfficialStats?: boolean;
    }): Promise<{
        games: HistoricalGameData[];
        playerStats?: PlayerStats[];
        teamStats?: TeamStats[];
        venueStats?: VenueStats[];
        officialStats?: OfficialStats[];
    }>;
    private generateCacheKey;
    private getCachedData;
    private cacheData;
    private fetchHistoricalData;
    getGameHistory(teamId: string, options?: {
        limit?: number;
        includeStats?: boolean;
        includeWeather?: boolean;
        includeOfficials?: boolean;
    }): Promise<HistoricalGameData[]>;
    getTeamStats(teamId: string, season: string, options?: {
        includeAdvanced?: boolean;
        includeHomeAway?: boolean;
        includeLineup?: boolean;
    }): Promise<TeamStats | null>;
    getPlayerStats(playerId: string, options?: {
        includeAdvanced?: boolean;
        includeGameLog?: boolean;
        includeTrends?: boolean;
    }): Promise<PlayerStats | null>;
    getVenueStats(venueId: string, options?: {
        includeWeather?: boolean;
        includeSurface?: boolean;
        includeAltitude?: boolean;
    }): Promise<VenueStats | null>;
    getOfficialStats(officialId: string, options?: {
        includeTendencies?: boolean;
        includeBias?: boolean;
        includeConsistency?: boolean;
    }): Promise<OfficialStats | null>;
    updateHistoricalData(data: Partial<HistoricalGameData>): Promise<void>;
    private validateData;
}
