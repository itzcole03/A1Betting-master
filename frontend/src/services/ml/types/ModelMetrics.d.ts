export interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
    confusionMatrix: {
        truePositives: number;
        trueNegatives: number;
        falsePositives: number;
        falseNegatives: number;
    };
    featureImportance: Record<string, number>;
    shapValues?: Record<string, number[]>;
    predictionConfidence: {
        mean: number;
        std: number;
        distribution: number[];
    };
    trainingMetrics: {
        loss: number[];
        validationLoss: number[];
        learningRate: number[];
        gradientNorm: number[];
    };
    performanceMetrics: {
        inferenceTime: number;
        throughput: number;
        latency: number;
        memoryUsage: number;
    };
    driftMetrics?: {
        featureDrift: Record<string, number>;
        predictionDrift: number;
        dataQuality: Record<string, number>;
    };
    customMetrics?: Record<string, number>;
}
export declare class ModelMetricsManager {
    private metrics;
    constructor(metrics: ModelMetrics);
    getMetrics(): ModelMetrics;
    updateMetrics(updates: Partial<ModelMetrics>): void;
    addCustomMetric(name: string, value: number): void;
    removeCustomMetric(name: string): void;
    calculateDriftMetrics(newData: any): void;
    toJSON(): string;
    static fromJSON(json: string): ModelMetricsManager;
}
