import { MLService } from './MLService';
import { ModelMetadata, ModelVersion, ModelEvaluation, ModelTrainingConfig } from '@/types';
import { ModelManager } from './ModelManager';
import { FeatureLogger } from '../../services/analytics/featureLogging';
export declare abstract class BaseMLService implements MLService {
    protected modelManager: ModelManager;
    protected logger: FeatureLogger;
    constructor(config: {
        modelManagerConfig?: any;
        loggerConfig?: any;
    });
    createModel(metadata: ModelMetadata): Promise<string>;
    getModel(modelId: string): Promise<ModelMetadata>;
    updateModel(modelId: string, metadata: Partial<ModelMetadata>): Promise<void>;
    deleteModel(modelId: string): Promise<void>;
    getVersions(modelId: string): Promise<ModelVersion[]>;
    getVersion(modelId: string, version: string): Promise<ModelVersion>;
    deleteVersion(modelId: string, version: string): Promise<void>;
    abstract train(modelId: string, data: any, config: ModelTrainingConfig): Promise<ModelVersion>;
    abstract retrain(modelId: string, data: any, config: ModelTrainingConfig): Promise<ModelVersion>;
    abstract predict(modelId: string, data: any): Promise<any>;
    abstract predictBatch(modelId: string, data: any[]): Promise<any[]>;
    evaluate(modelId: string, data: any): Promise<ModelEvaluation>;
    evaluateVersion(modelId: string, version: string, data: any): Promise<ModelEvaluation>;
    abstract getPerformanceMetrics(modelId: string): Promise<{
        trainingTime: number;
        inferenceTime: number;
        memoryUsage: number;
    }>;
    abstract getFeatureImportance(modelId: string): Promise<Record<string, number>>;
    abstract updateFeatures(modelId: string, features: string[]): Promise<void>;
    registerModel(modelId: string): Promise<void>;
    unregisterModel(modelId: string): Promise<void>;
    abstract saveModel(modelId: string): Promise<void>;
    abstract loadModel(modelId: string): Promise<void>;
    abstract exportModel(modelId: string, format: string): Promise<any>;
    abstract importModel(data: any, format: string): Promise<string>;
    abstract getModelStatus(modelId: string): Promise<{
        status: 'active' | 'archived' | 'deprecated';
        lastUpdated: Date;
        performance: {
            accuracy: number;
            latency: number;
            throughput: number;
        };
    }>;
    abstract optimize(modelId: string, config: any): Promise<void>;
    abstract tuneHyperparameters(modelId: string, config: any): Promise<ModelVersion>;
    abstract validateModel(modelId: string): Promise<{
        isValid: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    abstract getModelDocumentation(modelId: string): Promise<{
        description: string;
        architecture: string;
        parameters: Record<string, any>;
        examples: any[];
    }>;
    archiveModel(modelId: string): Promise<void>;
    restoreModel(modelId: string): Promise<void>;
    deprecateModel(modelId: string): Promise<void>;
}
