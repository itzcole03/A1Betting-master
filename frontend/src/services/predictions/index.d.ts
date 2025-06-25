interface PredictionModel {
    name: string;
    version: string;
    type: 'ml' | 'statistical' | 'hybrid';
    parameters: Record<string, unknown>;
}
/**
 * PlayerData type for backend player API response.
 */
export interface PlayerData {
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
export interface PredictionResult {
    playerId: string;
    playerName: string;
    predictedWinProbability: number;
    predictedScore: number;
    confidence: number;
    metadata?: Record<string, unknown>;
}
export declare class PredictionService {
    private models;
    constructor();
    /**
     * Generates predictions for all players using the specified model and date.
     * Fetches player data from the backend API and applies the selected prediction algorithm.
     * Rate-limited for backend API calls.
     */
    generatePredictions(modelName: string, date: string): Promise<PredictionResult[]>;
    addModel(model: PredictionModel): Promise<void>;
    removeModel(modelName: string): Promise<void>;
    getAvailableModels(): PredictionModel[];
}
export declare const predictionService: PredictionService;
export {};
