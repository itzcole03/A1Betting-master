import { Sport, PropType } from "../types/common";
interface Projection {
    id: string;
    playerId: string;
    playerName: string;
    team: string;
    opponent: string;
    sport: Sport;
    league: string;
    propType: PropType;
    line: number;
    overOdds: number;
    underOdds: number;
    timestamp: number;
    gameTime: string;
    status: "active" | "suspended" | "settled";
    result?: number;
}
interface Player {
    id: string;
    name: string;
    team: string;
    position: string;
    sport: Sport;
    stats: Record<string, number>;
}
interface Game {
    id: string;
    homeTeam: string;
    awayTeam: string;
    sport: Sport;
    league: string;
    startTime: string;
    status: "scheduled" | "live" | "final";
    score?: {
        home: number;
        away: number;
    };
}
export declare class PrizePicksAPI {
    private static instance;
    private readonly api;
    private readonly config;
    private lastErrorLog;
    private constructor();
    static getInstance(): PrizePicksAPI;
    getProjections(params: {
        sport?: Sport;
        propType?: PropType;
        playerId?: string;
        limit?: number;
        offset?: number;
    }): Promise<Projection[]>;
    private getMockProjections;
    getPlayer(playerId: string): Promise<Player>;
    getGame(gameId: string): Promise<Game>;
    private getMockPlayer;
    private getMockGame;
    getPlayerProjections(playerId: string): Promise<Projection[]>;
    getPlayerHistory(playerId: string, params: {
        startDate?: string;
        endDate?: string;
        propType?: PropType;
        limit?: number;
    }): Promise<Projection[]>;
    getTeamProjections(team: string, sport: Sport): Promise<Projection[]>;
    private rateLimiter;
    private handleApiError;
}
export {};
