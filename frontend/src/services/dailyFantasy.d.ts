interface Contest {
    id: string;
    name: string;
    entryFee: number;
    totalEntries: number;
    maxEntries: number;
    prizePool: number;
    startTime: string;
    sport: string;
    slate: string;
}
interface Player {
    id: string;
    name: string;
    position: string;
    team: string;
    salary: number;
    projectedPoints: number;
    actualPoints?: number;
    status: "active" | "questionable" | "out";
    stats: {
        [key: string]: number;
    };
}
interface Lineup {
    id: string;
    contestId: string;
    players: Player[];
    totalSalary: number;
    projectedPoints: number;
    actualPoints?: number;
    rank?: number;
    winnings?: number;
}
declare class DailyFantasyService {
    private config;
    constructor();
    getContests(options?: {
        sport?: string;
        slate?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<Contest[]>;
    getPlayers(options?: {
        sport?: string;
        slate?: string;
        position?: string;
        team?: string;
    }): Promise<Player[]>;
    getPlayerStats(playerId: string, options?: {
        startTime?: string;
        endTime?: string;
    }): Promise<Player["stats"]>;
    getLineups(options?: {
        contestId?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<Lineup[]>;
    createLineup(contestId: string, players: Player[]): Promise<Lineup>;
    getContestResults(contestId: string): Promise<{
        lineups: Lineup[];
        prizes: {
            rank: number;
            amount: number;
        }[];
    }>;
    getOptimalLineup(contestId: string, constraints?: {
        minSalary?: number;
        maxSalary?: number;
        minProjectedPoints?: number;
        maxPlayersPerTeam?: number;
        requiredPositions?: {
            [key: string]: number;
        };
    }): Promise<Lineup>;
}
export declare const dailyFantasyService: DailyFantasyService;
export {};
