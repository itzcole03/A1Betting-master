import { PrizePicksEntry } from '../frontend/src/types';
export interface UserStatsData {
    totalBets: number;
    settledBets: number;
    winRate: number;
    totalProfitLoss: number;
    roi: number;
}
export interface PerformanceChartData {
    labels: string[];
    profitData: number[];
}
/**
 * Calculates user statistics based on their betting entries.
 */
export declare const calculateUserStats: (entries: PrizePicksEntry[], userId?: string) => UserStatsData;
/**
 * Aggregates entry data for performance charting, focusing on settled bets.
 */
export declare const aggregatePerformanceData: (entries: PrizePicksEntry[]) => PerformanceChartData;
