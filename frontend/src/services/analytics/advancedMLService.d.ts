export declare class AdvancedMLService {
    private static instance;
    private constructor();
    static getInstance(): AdvancedMLService;
    predict(features: Record<string, number>): Promise<{
        prediction: number;
        confidence: number;
        features: Record<string, number>;
        modelVersion: string;
        timestamp: number;
    }>;
    analyzeMarket(marketData: any): Promise<{
        analysis: string;
        confidence: number;
        recommendations: string[];
        timestamp: number;
    }>;
    generateFeatures(rawData: any): Promise<{
        basic_feature_1: number;
        basic_feature_2: number;
        legacy_processed: boolean;
        timestamp: number;
    }>;
}
export declare const advancedMLService: AdvancedMLService;
export default AdvancedMLService;
