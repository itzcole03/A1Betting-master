import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
import { ModelMetrics, ModelPrediction } from './AdvancedModelArchitectureService';
export interface EnsembleConfig {
    models: {
        type: string;
        weight: number;
        config: Record<string, unknown>;
    }[];
    votingMethod: 'weighted' | 'majority' | 'stacking';
    stackingConfig?: {
        metaModel: string;
        crossValidation: number;
    };
    metadata: Record<string, unknown>;
}
export declare class EnsembleModel {
    private logger;
    private errorHandler;
    private config;
    private models;
    constructor(config: EnsembleConfig);
    initialize(): Promise<void>;
    private initializeModel;
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
    private trainMetaModel;
    private combinePredictions;
    private weightedVoting;
    private majorityVoting;
    private stackingVoting;
    private calculateEnsembleConfidence;
    private calculateEnsembleMetrics;
    private calculateModelMetrics;
    private formatInput;
    private saveConfig;
    private loadConfig;
    private getMetadata;
}
