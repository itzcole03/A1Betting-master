interface MatchPrediction {
    homeWinProbability: number;
    awayWinProbability: number;
    drawProbability: number;
    recommendedBet: {
        type: 'home' | 'away' | 'draw' | 'none';
        stake: number;
        odds: number;
        expectedValue: number;
        confidence: number;
    };
    insights: {
        keyFactors: string[];
        riskLevel: 'low' | 'medium' | 'high';
        valueAssessment: string;
        modelConsensus: number;
    };
}
declare class SportsBettingService {
    private readonly API_ENDPOINTS;
    private readonly API_KEYS;
    constructor();
    private validateApiConfig;
    getMatchPrediction(homeTeam: string, awayTeam: string, league: string, date: string): Promise<MatchPrediction>;
    private fetchOdds;
    private fetchTeamStats;
    private fetchHistoricalMatches;
    private calculateProbabilities;
    private determineOptimalBet;
    private calculateKellyStake;
    private determineRiskLevel;
    private assessValue;
}
export declare const sportsBettingService: SportsBettingService;
export {};
