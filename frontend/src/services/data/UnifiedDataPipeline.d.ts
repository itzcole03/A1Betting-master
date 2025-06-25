import { EventEmitter } from "eventemitter3";
export interface GameData {
    id: string;
    sport: string;
    league: string;
    homeTeam: TeamData;
    awayTeam: TeamData;
    startTime: string;
    status: "scheduled" | "live" | "finished" | "postponed";
    venue?: VenueData;
    weather?: WeatherData;
    officials?: OfficialData[];
}
export interface TeamData {
    id: string;
    name: string;
    abbreviation: string;
    city: string;
    conference?: string;
    division?: string;
    record: {
        wins: number;
        losses: number;
        ties?: number;
    };
    stats: TeamStats;
    injuries: InjuryData[];
    recentForm: number[];
    eloRating: number;
}
export interface PlayerData {
    id: string;
    name: string;
    position: string;
    teamId: string;
    jersey: number;
    stats: PlayerStats;
    recentPerformance: PerformanceData[];
    injuries: InjuryData[];
    salaryInfo?: {
        draftKings?: number;
        fanduel?: number;
        prizePicks?: number;
    };
}
export interface TeamStats {
    offensiveRating: number;
    defensiveRating: number;
    pace: number;
    netRating: number;
    homeAdvantage: number;
    awayPerformance: number;
    recentForm: number;
    strengthOfSchedule: number;
}
export interface PlayerStats {
    gamesPlayed: number;
    averages: Record<string, number>;
    per36: Record<string, number>;
    advanced: Record<string, number>;
    seasonTotals: Record<string, number>;
    last5Games: Record<string, number>;
    last10Games: Record<string, number>;
    vsOpponent: Record<string, number>;
}
export interface PerformanceData {
    gameId: string;
    date: string;
    opponent: string;
    stats: Record<string, number>;
    minutesPlayed: number;
    efficiency: number;
}
export interface InjuryData {
    playerId: string;
    type: string;
    severity: "minor" | "moderate" | "major" | "season-ending";
    status: "questionable" | "doubtful" | "out" | "day-to-day";
    expectedReturn?: string;
    impact: number;
}
export interface OddsData {
    eventId: string;
    bookmaker: string;
    market: string;
    outcomes: Array<{
        name: string;
        odds: number;
        line?: number;
    }>;
    timestamp: number;
    volume?: number;
    sharpMoney?: number;
}
export interface LineMovement {
    eventId: string;
    market: string;
    history: Array<{
        timestamp: number;
        line: number;
        odds: number;
        volume: number;
    }>;
}
export interface VenueData {
    id: string;
    name: string;
    city: string;
    state: string;
    capacity: number;
    surface?: string;
    elevation?: number;
    advantages: Record<string, number>;
}
export interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    visibility: number;
    conditions: string;
}
export interface OfficialData {
    id: string;
    name: string;
    position: string;
    experience: number;
    tendencies: Record<string, number>;
}
export interface MarketData {
    eventId: string;
    market: string;
    currentOdds: OddsData[];
    lineMovement: LineMovement;
    volume: number;
    sharpMoney: number;
    publicBetting: {
        percentage: number;
        tickets: number;
        money: number;
    };
}
export declare class UnifiedDataPipeline extends EventEmitter {
    private static instance;
    private cache;
    private rateLimiter;
    private requestQueue;
    private activeConnections;
    private refreshIntervals;
    private constructor();
    static getInstance(): UnifiedDataPipeline;
    private initializeConnections;
    private startRealTimeStreams;
    private startOddsStream;
    private startLiveGamesStream;
    private startInjuryUpdates;
    getGameData(gameId: string): Promise<GameData>;
    getPlayerData(playerId: string): Promise<PlayerData>;
    getLiveOdds(eventId: string, market?: string): Promise<OddsData[]>;
    getPrizePicksProjections(): Promise<any[]>;
    getInjuries(sport: string): Promise<InjuryData[]>;
    getWeatherData(venueId: string): Promise<WeatherData | null>;
    private fetchGameFromSportradar;
    private fetchPlayerFromSportradar;
    private fetchOddsFromTheOddsApi;
    private fetchPrizePicksProjections;
    private fetchInjuries;
    private fetchWeatherData;
    private transformSportradarGame;
    private transformSportradarPlayer;
    private transformTeamData;
    private transformPlayerStats;
    private transformVenueData;
    private transformOddsData;
    private transformInjuryData;
    private transformWeatherData;
    private getActiveGames;
    private getLiveGames;
    private fetchLiveOdds;
    private fetchLiveGameData;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        hitRate: number;
    };
    getConnectionStatus(): Record<string, boolean>;
    refreshAllData(): Promise<void>;
    private refreshGames;
    private refreshOdds;
    private refreshInjuries;
    shutdown(): void;
}
export declare const dataPipeline: UnifiedDataPipeline;
export type { GameData, TeamData, PlayerData, OddsData, InjuryData, MarketData, WeatherData, LineMovement, };
