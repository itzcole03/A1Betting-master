interface BettingStats {
    totalBets: number;
    totalStake: number;
    totalWinnings: number;
    winRate: number;
    averageOdds: number;
    profitLoss: number;
    roi: number;
    bestBet: {
        selection: string;
        odds: number;
        stake: number;
        winnings: number;
    } | null;
    worstBet: {
        selection: string;
        odds: number;
        stake: number;
        loss: number;
    } | null;
    performanceBySport: {
        [sport: string]: {
            totalBets: number;
            winRate: number;
            profitLoss: number;
        };
    };
    performanceByMarket: {
        [market: string]: {
            totalBets: number;
            winRate: number;
            profitLoss: number;
        };
    };
    recentPerformance: {
        date: string;
        profitLoss: number;
        bets: number;
    }[];
    riskMetrics: {
        averageStake: number;
        maxStake: number;
        stakeToBalanceRatio: number;
        volatility: number;
    };
}
export declare const useBettingAnalytics: () => BettingStats;
export {};
