import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
import { ModelMetrics, ModelPrediction } from './AdvancedModelArchitectureService';
export interface LSTMConfig {
    inputSize: number;
    hiddenSize: number;
    numLayers: number;
    dropout: number;
    bidirectional: boolean;
    batchFirst: boolean;
    learningRate: number;
    optimizer: string;
    lossFunction: string;
    epochs: number;
    batchSize: number;
    sequenceLength: number;
    metadata: Record<string, unknown>;
}
export interface TrainingData {
    input: number[][];
    target: number[];
}
export interface ModelState {
    config: Record<string, unknown>;
    weights: number[] | null;
    compiled: boolean;
}
export interface LSTMModelInterface {
    predict(input: number[][]): Promise<number[]>;
    train(data: TrainingData, options: TrainingOptions): Promise<void>;
    save?(path: string): Promise<void>;
    load?(path: string): Promise<void>;
}
export interface TrainingOptions {
    epochs?: number;
    batchSize?: number;
    validationSplit?: number;
    earlyStopping?: boolean;
}
export declare class LSTMModel {
    private logger;
    private errorHandler;
    private config;
    private model;
    constructor(config: LSTMConfig);
    initialize(): Promise<void>;
    private createModel;
    train(features: FeatureSet, options?: TrainingOptions): Promise<ModelMetrics>;
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
