interface PlayerProp {
    player: string;
    statType: string;
    line: number;
    odds: {
        over: number;
        under: number;
    };
    book: string;
    timestamp: number;
}
interface PropAnalysis {
    prop: PlayerProp;
    prediction: {
        expectedValue: number;
        probability: number;
        confidence: number;
        recommendation: 'over' | 'under' | 'pass';
    };
    insights: {
        keyFactors: string[];
        trendStrength: number;
        valueRating: number;
        riskScore: number;
    };
    models: {
        modelId: string;
        prediction: number;
        confidence: number;
    }[];
}
interface LineupOptimization {
    legs: PropAnalysis[];
    expectedValue: number;
    winProbability: number;
    riskScore: number;
    correlationMatrix: number[][];
}
export declare class PlayerPropService {
    private readonly MIN_CONFIDENCE_THRESHOLD;
    private readonly MIN_VALUE_THRESHOLD;
    private readonly MAX_RISK_SCORE;
    constructor();
    private initializeDataStreams;
    private processDataUpdate;
    private updatePropAnalysis;
    analyzeProp(prop: PlayerProp): Promise<PropAnalysis>;
    optimizeLineup(availableProps: PlayerProp[], targetLegs: number): Promise<LineupOptimization>;
    private extractFeatures;
    private calculateRecommendation;
    private calculateEdge;
    private calculateProbability;
    private normalCDF;
    private generateInsights;
    private calculateTrendStrength;
    private calculateValueRating;
    private calculateRiskScore;
    private calculateCorrelations;
    private calculatePropCorrelation;
    private optimizeLegsSelection;
    private calculatePortfolioEV;
    private calculateWinProbability;
    private calculatePortfolioRisk;
    private calculateAverageCorrelation;
}
export declare const playerPropService: PlayerPropService;
export {};
