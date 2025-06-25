export declare class HyperAdvancedMLService {
    private static instance;
    private constructor();
    static getInstance(): HyperAdvancedMLService;
    hyperPredict(features: Record<string, number>): Promise<{
        prediction: number;
        confidence: number;
        hyperFeatures: Record<string, number>;
        modelComplexity: string;
        timestamp: number;
    }>;
    analyzeComplexPatterns(data: any): Promise<{
        patterns: {
            type: string;
            strength: number;
        }[];
        complexity: number;
        insights: string[];
        timestamp: number;
    }>;
}
export declare const hyperAdvancedMLService: HyperAdvancedMLService;
export default HyperAdvancedMLService;
