import { ModelMetadata, ModelVersion, ModelEvaluation, ModelTrainingConfig } from '@/types';
export interface MLService {
    createModel(metadata: ModelMetadata): Promise<string>;
    getModel(modelId: string): Promise<ModelMetadata>;
    updateModel(modelId: string, metadata: Partial<ModelMetadata>): Promise<void>;
    deleteModel(modelId: string): Promise<void>;
    getVersions(modelId: string): Promise<ModelVersion[]>;
    getVersion(modelId: string, version: string): Promise<ModelVersion>;
    deleteVersion(modelId: string, version: string): Promise<void>;
    train(modelId: string, data: any, config: ModelTrainingConfig): Promise<ModelVersion>;
    retrain(modelId: string, data: any, config: ModelTrainingConfig): Promise<ModelVersion>;
    predict(modelId: string, data: any): Promise<any>;
    predictBatch(modelId: string, data: any[]): Promise<any[]>;
    evaluate(modelId: string, data: any): Promise<ModelEvaluation>;
    evaluateVersion(modelId: string, version: string, data: any): Promise<ModelEvaluation>;
    getPerformanceMetrics(modelId: string): Promise<{
        trainingTime: number;
        inferenceTime: number;
        memoryUsage: number;
    }>;
    getFeatureImportance(modelId: string): Promise<Record<string, number>>;
    updateFeatures(modelId: string, features: string[]): Promise<void>;
    registerModel(modelId: string): Promise<void>;
    unregisterModel(modelId: string): Promise<void>;
    saveModel(modelId: string): Promise<void>;
    loadModel(modelId: string): Promise<void>;
    exportModel(modelId: string, format: string): Promise<any>;
    importModel(data: any, format: string): Promise<string>;
    getModelStatus(modelId: string): Promise<{
        status: 'active' | 'archived' | 'deprecated';
        lastUpdated: Date;
        performance: {
            accuracy: number;
            latency: number;
            throughput: number;
        };
    }>;
    optimize(modelId: string, config: any): Promise<void>;
    tuneHyperparameters(modelId: string, config: any): Promise<ModelVersion>;
    validateModel(modelId: string): Promise<{
        isValid: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    getModelDocumentation(modelId: string): Promise<{
        description: string;
        architecture: string;
        parameters: Record<string, any>;
        examples: any[];
    }>;
    archiveModel(modelId: string): Promise<void>;
    restoreModel(modelId: string): Promise<void>;
    deprecateModel(modelId: string): Promise<void>;
}
