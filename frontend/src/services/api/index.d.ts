export { get, post } from "./client.js";
export { apiService } from "./ApiService.js";
export declare const api: import("./ApiService.js").ApiService;
export type { Player } from "../../types/api.js";
export interface LineupSubmission {
    players: string[];
    totalSalary: number;
    sport: string;
    contestId?: string;
}
export declare function getPlayers(): Promise<Player[]>;
export declare function submitLineup(lineup: LineupSubmission): Promise<{
    success: boolean;
    lineupId?: string;
}>;
