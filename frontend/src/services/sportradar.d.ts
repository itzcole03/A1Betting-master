interface PlayerStats {
    id: string;
    name: string;
    team: string;
    position: string;
    stats: {
        [key: string]: number;
    };
    lastUpdated: string;
}
interface InjuryData {
    id: string;
    name: string;
    team: string;
    position: string;
    status: 'active' | 'questionable' | 'out';
    injury: string;
    expectedReturn?: string;
    lastUpdated: string;
}
interface MatchupData {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    venue: string;
    weather?: {
        temperature: number;
        condition: string;
        windSpeed: number;
    };
    odds?: {
        home: number;
        away: number;
        draw?: number;
    };
    stats?: {
        home: {
            [key: string]: number;
        };
        away: {
            [key: string]: number;
        };
    };
}
declare class SportradarService {
    private config;
    constructor();
    getPlayerStats(playerId: string, options?: {
        season?: string;
        league?: string;
    }): Promise<PlayerStats>;
    getInjuries(options?: {
        team?: string;
        league?: string;
    }): Promise<InjuryData[]>;
    getMatchup(matchupId: string): Promise<MatchupData>;
    getTeamStats(teamId: string, options?: {
        season?: string;
        league?: string;
    }): Promise<{
        [key: string]: number;
    }>;
    getGameSchedule(options?: {
        startDate?: string;
        endDate?: string;
        league?: string;
    }): Promise<MatchupData[]>;
}
export declare const sportradarService: SportradarService;
export {};
