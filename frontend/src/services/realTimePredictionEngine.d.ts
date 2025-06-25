export interface EnhancedPrediction {
    id: string;
    sport: string;
    type: string;
    game: string;
    pick: string;
    valueGrade: string;
    confidence: number;
    expectedValue: number;
    riskScore: number;
    modelConsensus: number;
    kellyOptimal: number;
    dataQuality: number;
    odds: number;
    backtestResults: {
        winRate: number;
        avgReturn: number;
        maxDrawdown: number;
        profitFactor: number;
    };
    realTimeFactors: {
        lineMovement: number;
        publicBetting: number;
        sharpMoney: boolean;
        weatherImpact: number;
    };
    reasoning: string[];
    sources: string[];
    timestamp: Date;
    value: string;
    risk: number;
    details: string;
}
