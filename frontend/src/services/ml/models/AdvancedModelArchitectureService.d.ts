import { z } from 'zod';
import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
export declare const ModelConfigSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["xgboost", "lstm", "transformer", "ensemble"]>;
    hyperparameters: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    features: z.ZodArray<z.ZodString, "many">;
    target: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    target: string;
    type: "xgboost" | "ensemble" | "lstm" | "transformer";
    features: string[];
    hyperparameters: Record<string, unknown>;
    metadata?: Record<string, unknown> | undefined;
}, {
    name: string;
    target: string;
    type: "xgboost" | "ensemble" | "lstm" | "transformer";
    features: string[];
    hyperparameters: Record<string, unknown>;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const ModelMetricsSchema: z.ZodObject<{
    accuracy: z.ZodNumber;
    precision: z.ZodNumber;
    recall: z.ZodNumber;
    f1Score: z.ZodNumber;
    auc: z.ZodNumber;
    rmse: z.ZodNumber;
    mae: z.ZodNumber;
    r2: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    precision: number;
    accuracy: number;
    recall: number;
    f1Score: number;
    auc: number;
    rmse: number;
    mae: number;
    r2: number;
    metadata?: Record<string, unknown> | undefined;
}, {
    precision: number;
    accuracy: number;
    recall: number;
    f1Score: number;
    auc: number;
    rmse: number;
    mae: number;
    r2: number;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const ModelPredictionSchema: z.ZodObject<{
    timestamp: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    output: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    confidence: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    timestamp: string;
    metadata?: Record<string, unknown> | undefined;
}, {
    confidence: number;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    timestamp: string;
    metadata?: Record<string, unknown> | undefined;
}>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type ModelMetrics = z.infer<typeof ModelMetricsSchema>;
export type ModelPrediction = z.infer<typeof ModelPredictionSchema>;
export interface ModelArchitectureConfig {
    modelTypes: string[];
    defaultHyperparameters: Record<string, unknown>;
    validationConfig: {
        strict: boolean;
        allowPartial: boolean;
    };
    trainingConfig: {
        epochs: number;
        batchSize: number;
        validationSplit: number;
        earlyStopping: boolean;
    };
}
export declare class AdvancedModelArchitectureService {
    private logger;
    private errorHandler;
    private config;
    private models;
    constructor(config: ModelArchitectureConfig);
    initialize(): Promise<void>;
    private initializeModel;
    private initializeXGBoostModel;
    private initializeLSTMModel;
    private initializeTransformerModel;
    private initializeEnsembleModel;
    trainModel(modelConfig: ModelConfig, features: FeatureSet, options?: {
        validationSplit?: number;
        earlyStopping?: boolean;
        epochs?: number;
        batchSize?: number;
    }): Promise<ModelMetrics>;
    predict(modelConfig: ModelConfig, features: Feature[], options?: {
        includeConfidence?: boolean;
        includeMetadata?: boolean;
    }): Promise<ModelPrediction>;
    evaluateModel(modelConfig: ModelConfig, features: FeatureSet, options?: {
        includeConfidence?: boolean;
        includeMetadata?: boolean;
    }): Promise<ModelMetrics>;
    saveModel(modelConfig: ModelConfig, path: string): Promise<void>;
    loadModel(modelConfig: ModelConfig, path: string): Promise<void>;
    private getModel;
    private validateData;
}
