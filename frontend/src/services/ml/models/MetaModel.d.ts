import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
import { ModelMetrics, ModelPrediction } from './AdvancedModelArchitectureService';
import { XGBoostConfig } from './XGBoostModel';
export interface MetaModelConfig {
    modelType: string;
    features: string[];
    hyperparameters: XGBoostConfig;
    crossValidation: number;
    metadata: Record<string, unknown>;
}
export declare class MetaModel {
    private logger;
    private errorHandler;
    private config;
    private model;
    constructor(config: MetaModelConfig);
    initialize(): Promise<void>;
    train(features: FeatureSet, options?: {
        validationSplit?: number;
        earlyStopping?: boolean;
        epochs?: number;
        batchSize?: number;
    }): Promise<ModelMetrics>;
    predict(features: Feature[], options?: {
        includeConfidence?: boolean;
        includeMetadata?: boolean;
    }): Promise<ModelPrediction>;
    evaluate(features: FeatureSet): Promise<ModelMetrics>;
    save(path: string): Promise<void>;
    load(path: string): Promise<void>;
    private performCrossValidation;
    private combineMetrics;
    private saveConfig;
    private loadConfig;
    private getMetadata;
}
