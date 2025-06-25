interface PredictionInput {
    playerId: string;
    playerName: string;
    historicalData: {
        wins: number;
        losses: number;
        averageScore: number;
        recentPerformance: number[];
    };
    opponentData?: {
        wins: number;
        losses: number;
        averageScore: number;
    };
    fantasyData?: {
        projectedPoints: number;
        salary: number;
        value: number;
    };
}
interface PredictionOutput {
    predictedWinProbability: number;
    predictedScore: number;
    confidence: number;
    metadata: {
        algorithm: string;
        factors: string[];
        weights: Record<string, number>;
    };
}
export declare class PredictionAlgorithms {
    static statisticalModel(input: PredictionInput): PredictionOutput;
    static mlModel(input: PredictionInput): PredictionOutput;
    static hybridModel(input: PredictionInput): PredictionOutput;
}
export {};
