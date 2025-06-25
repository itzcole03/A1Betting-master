export type Sport = 'nfl' | 'nba' | 'mlb' | 'nhl' | 'soccer';
export interface PlayerStats {
    playerId: string;
    name: string;
    team: string;
    position: string;
    lastGames: {
        date: string;
        stats: Record<string, number>;
    }[];
    seasonAverages: Record<string, number>;
    matchupStats: {
        opponent: string;
        stats: Record<string, number>;
    }[];
    injuryStatus?: string;
    restDays: number;
}
export interface TeamStats {
    teamId: string;
    name: string;
    league: Sport;
    lastGames: {
        date: string;
        opponent: string;
        score: string;
        stats: Record<string, number>;
    }[];
    seasonStats: Record<string, number>;
    homeAwaySplit: {
        home: Record<string, number>;
        away: Record<string, number>;
    };
    pace: number;
    defensiveRating: number;
    offensiveRating: number;
}
export interface PropPrediction {
    propId: string;
    playerId: string;
    propType: string;
    value: number;
    confidence: number;
    factors: {
        name: string;
        impact: number;
        description: string;
    }[];
    historicalAccuracy: number;
    recommendedBet: {
        amount: number;
        type: 'over' | 'under';
        modifier?: 'goblin' | 'devil';
        expectedValue: number;
    };
}
export interface Recommendation {
    id: string;
    sport: Sport;
    event: string;
    betType: string;
    odds: number;
    confidence: number;
    edge: number;
    analysis: string;
    risk: 'low' | 'medium' | 'high';
    timestamp: number;
    favorite: boolean;
}
type EventMap = {
    playerStats: PlayerStats;
    teamStats: TeamStats;
    propPrediction: PropPrediction;
    recommendations: Recommendation[];
};
export declare class SportsAnalyticsService {
    private static instance;
    private cache;
    private readonly CACHE_DURATION;
    private subscribers;
    private constructor();
    static getInstance(): SportsAnalyticsService;
    /**
     * Fetch player stats from backend API (production-ready)
     */
    getPlayerStats: (sport: Sport, playerId: string) => Promise<PlayerStats>;
    /**
     * Fetch team stats from backend API (production-ready)
     */
    getTeamStats: (sport: Sport, teamId: string) => Promise<TeamStats>;
    /**
     * Analyze a prop using backend ML/analytics API (production-ready)
     */
    analyzeProp: (sport: Sport, propId: string) => Promise<PropPrediction>;
    /**
     * Get betting recommendations from backend API (production-ready)
     */
    getRecommendations: (sport: Sport) => Promise<Recommendation[]>;
    /**
     * Subscribe to analytics events (playerStats, teamStats, propPrediction, recommendations)
     * @param event Event name
     * @param callback Callback with event data
     */
    subscribe<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): () => void;
    /**
     * Get a value from the cache if valid, otherwise null.
     */
    private getFromCache;
    /**
     * Set a value in the cache.
     */
    private setCache;
    analyzeNBAProp(propId: string): Promise<PropPrediction>;
    analyzeWNBAProp(propId: string): Promise<PropPrediction>;
    analyzeMLBProp(propId: string): Promise<PropPrediction>;
    analyzeSoccerProp(propId: string): Promise<PropPrediction>;
}
export declare const sportsAnalytics: SportsAnalyticsService;
export {};
