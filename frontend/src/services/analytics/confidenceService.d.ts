import type { PredictionWithConfidence } from '../../types/confidence';
declare class ConfidenceService {
    private static _instance;
    private cache;
    private constructor();
    static getInstance(): ConfidenceService;
    getPredictionWithConfidence(eventId: string, player: string, market: string): PredictionWithConfidence;
    clearCache(): void;
}
export declare const confidenceService: ConfidenceService;
export {};
