export interface BetRecord {
    id: string;
    userId: string;
    eventId: string;
    betType: string;
    amount: number;
    odds: number;
    result: 'win' | 'loss' | 'pending';
    placedAt: number;
    settledAt?: number;
    notes?: string;
}
export interface BetAnalytics {
    roi: number;
    winRate: number;
    lossRate: number;
    streak: number;
    longestWinStreak: number;
    longestLossStreak: number;
    totalBets: number;
    totalAmount: number;
    profit: number;
}
export declare class BetTrackingService {
    /**
     * Fetch all bets for a user from backend persistent storage
     */
    getUserBets: (userId: string) => Promise<BetRecord[]>;
    /**
     * Fetch analytics (ROI, streak, win/loss, etc.) for a user
     */
    getUserBetAnalytics: (userId: string) => Promise<BetAnalytics>;
}
export declare const betTrackingService: BetTrackingService;
