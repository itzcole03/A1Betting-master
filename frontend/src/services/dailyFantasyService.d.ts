interface DailyFantasyPlayer {
    id: string;
    name: string;
    position: string;
    team: string;
    salary: number;
    projectedPoints: number;
    actualPoints?: number;
    status: 'active' | 'inactive' | 'questionable';
}
interface DailyFantasyContest {
    id: string;
    name: string;
    sport: string;
    startTime: string;
    entryFee: number;
    totalEntries: number;
    maxEntries: number;
    prizePool: number;
    status: 'upcoming' | 'live' | 'completed';
}
interface DailyFantasyLineup {
    id: string;
    contestId: string;
    players: DailyFantasyPlayer[];
    totalSalary: number;
    projectedPoints: number;
    actualPoints?: number;
    rank?: number;
}
declare class DailyFantasyService {
    private api;
    getContests(sport: string): Promise<DailyFantasyContest[]>;
    getPlayers(contestId: string): Promise<DailyFantasyPlayer[]>;
    getPlayerProjections(playerId: string): Promise<number>;
    getOptimalLineup(contestId: string, strategy: string): Promise<DailyFantasyLineup>;
    getContestResults(contestId: string): Promise<DailyFantasyLineup[]>;
    getPlayerStats(playerId: string, timeframe: string): Promise<any>;
    getContestTrends(contestId: string): Promise<any>;
    getPlayerOwnership(contestId: string): Promise<Record<string, number>>;
    getSalaryChanges(contestId: string): Promise<Record<string, number>>;
}
export declare const dailyFantasyService: DailyFantasyService;
export {};
