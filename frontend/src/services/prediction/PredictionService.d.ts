import type { PredictionWithConfidence } from '../../types/confidence';
import type { ContextualInput } from '../../types/filters';
export declare class PredictionService {
    private static instance;
    private constructor();
    static getInstance(): PredictionService;
    getPredictionWithConfidence(eventId: string, model: string, market: string, context?: ContextualInput): Promise<PredictionWithConfidence>;
}
