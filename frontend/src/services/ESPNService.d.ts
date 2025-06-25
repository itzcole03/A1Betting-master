export interface ESPNConfig {
    baseUrl: string;
    apiKey: string;
    timeout: number;
    cacheTimeout: number;
}
export interface ESPNGame {
    id: string;
    sport: string;
    league: string;
    homeTeam: {
        id: string;
        name: string;
        abbreviation: string;
        score?: number;
    };
    awayTeam: {
        id: string;
        name: string;
        abbreviation: string;
        score?: number;
    };
    startTime: string;
    status: 'scheduled' | 'inProgress' | 'final' | 'postponed';
    venue: {
        name: string;
        city: string;
        state: string;
    };
    weather?: {
        temperature: number;
        condition: string;
        windSpeed: number;
    };
}
export interface ESPNPlayer {
    id: string;
    name: string;
    position: string;
    team: string;
    jersey: string;
    status: 'active' | 'injured' | 'questionable' | 'out';
    stats: {
        [key: string]: number;
    };
    projections?: {
        [key: string]: number;
    };
}
export interface ESPNHeadline {
    id: string;
    title: string;
    description: string;
    link: string;
    published: string;
    updated: string;
    sport: string;
    league?: string;
    team?: string;
    player?: string;
    type: 'news' | 'injury' | 'rumor' | 'analysis';
}
export interface ESPNEvent {
    id: string;
    title: string;
    description: string;
    link: string;
    published: string;
    type: 'news' | 'injury' | 'rumor' | 'analysis';
}
export interface ESPNFeatures {
    gameId?: string;
    sport?: string;
    league?: string;
    homeTeam?: string;
    awayTeam?: string;
    homeScore?: number;
    awayScore?: number;
    status?: 'scheduled' | 'inProgress' | 'final' | 'postponed';
    venue?: string;
    weather_temperature?: number;
    weather_condition?: string;
    weather_windSpeed?: number;
    startTime?: string;
    playerId?: string;
    playerName?: string;
    playerPosition?: string;
    playerTeam?: string;
    playerStatus?: 'active' | 'injured' | 'questionable' | 'out';
    [key: `playerStat_${string}`]: number;
    [key: `playerProjection_${string}`]: number;
    teamRosterSize?: number;
    [key: `teamStat_${string}`]: number;
    news_count?: number;
    news_types?: string[];
}
export declare class ESPNService {
    /**
     * Extracts and returns normalized features for a given context (game, player, team, etc.)
     * to be used in ensemble prediction. This enables ESPNService to contribute structured
     * data to the unified prediction engine for maximum accuracy.
     *
     * @param context - An object containing identifiers and parameters for feature extraction.
     *                  Example: { gameId, playerId, teamId, metric, date, ... }
     * @returns A Promise resolving to a normalized feature object.
     */
    getFeatures(context: {
        gameId?: string;
        playerId?: string;
        teamId?: string;
        metric?: string;
        date?: string;
    }): Promise<ESPNFeatures>;
    private static instance;
    private readonly eventBus;
    private readonly configManager;
    private readonly client;
    private readonly cache;
    private readonly espnConfig;
    private constructor();
    static getInstance(): ESPNService;
    private setupEventListeners;
    private getCacheKey;
    private getCachedData;
    private setCachedData;
    getGames(params: {
        sport?: string;
        league?: string;
        date?: string;
        status?: 'scheduled' | 'inProgress' | 'final';
    }): Promise<ESPNGame[]>;
    getGame(gameId: string): Promise<ESPNGame | null>;
    getPlayers(params: {
        sport?: string;
        league?: string;
        team?: string;
        position?: string;
        status?: string;
    }): Promise<ESPNPlayer[]>;
    getPlayer(playerId: string): Promise<ESPNPlayer | null>;
    getPlayerStats(playerId: string, params: {
        season?: string;
        seasonType?: 'regular' | 'postseason';
        split?: 'game' | 'season';
    }): Promise<Record<string, number>>;
    getPlayerProjections(playerId: string, params: {
        season?: string;
        week?: number;
    }): Promise<Record<string, number>>;
    getHeadlines(params: {
        sport?: string;
        league?: string;
        team?: string;
        player?: string;
        type?: 'news' | 'injury' | 'rumor' | 'analysis';
        limit?: number;
    }): Promise<ESPNHeadline[]>;
    getTeamSchedule(teamId: string, params: {
        season?: string;
        seasonType?: 'regular' | 'postseason';
    }): Promise<ESPNGame[]>;
    getTeamRoster(teamId: string): Promise<ESPNPlayer[]>;
    clearCache(): void;
    clearCacheItem(key: string): void;
}
