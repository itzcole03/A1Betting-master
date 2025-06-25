import { PredictionResponse, GeneralInsight } from '../services/predictionService';
interface UsePredictionReturn {
    makePrediction: (features: {
        [key: string]: number;
    }, propId?: string, context?: {
        [key: string]: any;
    }) => Promise<PredictionResponse>;
    getInsights: () => Promise<GeneralInsight[]>;
    isLoading: boolean;
    error: Error | null;
    lastPrediction: PredictionResponse | null;
}
export declare function usePrediction(): UsePredictionReturn;
export {};
