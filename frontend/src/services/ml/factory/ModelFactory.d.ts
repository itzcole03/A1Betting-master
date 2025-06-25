import { BaseModel } from '../models/BaseModel';
import { ModelConfig, AdvancedEnsembleConfig } from '@/types';
export declare class ModelFactory {
    private static instance;
    private models;
    private configs;
    private metrics;
    private predictionHistory;
    private logger;
    private errorHandler;
    private monitor;
    private constructor();
    static getInstance(): ModelFactory;
    createModel(config: ModelConfig | AdvancedEnsembleConfig): BaseModel;
    trainModel(modelId: string, data: any): Promise<void>;
    predict(modelId: string, input: any): Promise<any>;
    getModel(modelId: string): BaseModel | undefined;
    getModelConfig(modelId: string): ModelConfig | AdvancedEnsembleConfig | undefined;
    getModelMetrics(modelId: string): any;
    getPredictionHistory(modelId?: string): Array<{
        timestamp: string;
        modelId: string;
        input: any;
        output: any;
        confidence?: number;
    }>;
    saveModel(modelId: string, path: string): Promise<void>;
    loadModel(modelId: string, path: string): Promise<void>;
    removeModel(modelId: string): void;
    listModels(): string[];
    getModelInfo(modelId: string): {
        config: ModelConfig | AdvancedEnsembleConfig;
        isTrained: boolean;
        lastUpdate: string;
        metrics: any;
    } | undefined;
    isModelTrained(modelId: string): boolean;
}
