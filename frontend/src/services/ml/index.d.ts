import { MLServiceConfig, PredictionResult, ModelMetrics } from '@/types';
export declare class MLService {
    private static instance;
    private config;
    private modelCache;
    private metrics;
    private constructor();
    static getInstance(config?: MLServiceConfig): MLService;
    predict(params: {
        modelSet: string;
        confidenceThreshold: number;
        sports: string[];
        timeWindow: string;
    }): Promise<PredictionResult[]>;
    private executePrediction;
    updateMetrics(metrics: Partial<ModelMetrics>): Promise<void>;
    private persistMetrics;
    getMetrics(): ModelMetrics;
}
export default MLService;
