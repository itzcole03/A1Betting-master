interface TechnologicalData {
    dataQuality: number;
    modelAccuracy: number;
    featureImportance: number;
    predictionConfidence: number;
    systemReliability: number;
}
interface TechnologicalAnalysisRequest {
    eventId: string;
    sport: string;
    timestamp: string;
}
export declare class TechnologicalAnalyticsService {
    analyzeTechnologicalFactors(_request: TechnologicalAnalysisRequest): Promise<TechnologicalData>;
    private calculateDataQuality;
    private calculateModelAccuracy;
    private calculateFeatureImportance;
    private calculatePredictionConfidence;
    private calculateSystemReliability;
}
export {};
