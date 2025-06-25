import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
import { ModelMetrics, ModelPrediction } from './AdvancedModelArchitectureService';
export interface XGBoostConfig {
    maxDepth: number;
    learningRate: number;
    nEstimators: number;
    subsample: number;
    colsampleBytree: number;
    minChildWeight: number;
    gamma: number;
    regAlpha: number;
    regLambda: number;
    objective: string;
    evalMetric: string[];
    treeMethod: string;
    gpuId: number;
    metadata: Record<string, unknown>;
}
export interface XGBoostTrainingData {
    input: number[][];
    target: number[];
}
export interface XGBoostModelInterface {
    predict(input: number[][]): Promise<number[]>;
    train(data: XGBoostTrainingData, options: XGBoostTrainingOptions): Promise<void>;
    save?(path: string): Promise<void>;
    load?(path: string): Promise<void>;
}
export interface XGBoostTrainingOptions {
    epochs?: number;
    batchSize?: number;
    validationSplit?: number;
    earlyStopping?: boolean;
    [key: string]: unknown;
}
export declare class XGBoostModel {
    private logger;
    private errorHandler;
    private config;
    private model;
    constructor(config: XGBoostConfig);
    initialize(): Promise<void>;
    private createModel;
    train(features: FeatureSet, options?: XGBoostTrainingOptions): Promise<ModelMetrics>;
    predict(features: Feature[], options?: {
        includeConfidence?: boolean;
        includeMetadata?: boolean;
    }): Promise<ModelPrediction>;
    evaluate(features: FeatureSet): Promise<ModelMetrics>;
    save(path: string): Promise<void>;
    load(path: string): Promise<void>;
    private prepareTrainingData;
    private preparePredictionInput;
    private prepareEvaluationData;
    private formatInput;
    private formatOutput;
    private calculateConfidence;
    private calculateAccuracy;
    private calculatePrecision;
    private calculateRecall;
    private calculateF1Score;
    private calculateAUC;
    private calculateRMSE;
    private calculateMAE;
    private calculateR2;
    private getMetadata;
}
