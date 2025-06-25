export declare class UltraMLService {
    private static instance;
    private constructor();
    static getInstance(): UltraMLService;
    ultraPredict(features: Record<string, number>): Promise<{
        prediction: number;
        confidence: number;
        quantumAdvantage: number;
        features: Record<string, number>;
        ultraComplexity: string;
        timestamp: number;
    }>;
    quantumAnalysis(data: any): Promise<{
        quantumState: string;
        entanglement: number;
        coherence: number;
        superposition: number;
        decoherence: number;
        timestamp: number;
    }>;
    ultraOptimization(params: any): Promise<{
        optimizedParams: any;
        improvement: number;
        confidence: number;
        quantumBoost: number;
        timestamp: number;
    }>;
}
export declare const ultraMLService: UltraMLService;
export default UltraMLService;
