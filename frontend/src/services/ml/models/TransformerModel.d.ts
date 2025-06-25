import { Feature, FeatureSet } from '../featureEngineering/AdvancedFeatureEngineeringService';
import { ModelMetrics, ModelPrediction } from './AdvancedModelArchitectureService';
export interface TransformerModelInterface {
    config: TransformerInternalConfig;
    layers: TransformerLayer[];
    embeddings: Record<string, unknown>;
    trained: boolean;
    predict(input: number[][]): Promise<number[]>;
    computeAttentionWeights(sequence: number[]): number[];
    train(data: TransformerTrainingData, options: TransformerTrainingOptions): Promise<void>;
    save?: (path: string) => Promise<void>;
    load?: (path: string) => Promise<void>;
}
export interface TransformerInternalConfig {
    inputSize: number;
    hiddenSize: number;
    numLayers: number;
    numHeads: number;
    dropout: number;
    maxSequenceLength: number;
    learningRate: number;
    warmupSteps: number;
}
export interface TransformerLayer {
    id: number;
    attention: {
        heads: number;
        hiddenSize: number;
    };
    feedForward: {
        hiddenSize: number;
        dropout: number;
    };
}
export interface TransformerTrainingData {
    sequences: number[][];
    targets: number[];
    metadata?: Record<string, unknown>;
}
export interface TransformerTrainingOptions {
    validationSplit?: number;
    earlyStopping?: boolean;
    epochs?: number;
    batchSize?: number;
    [key: string]: unknown;
}
export interface TransformerPredictionInput {
    sequences: number[][];
    metadata?: Record<string, unknown>;
}
export interface TransformerEvaluationData {
    input: TransformerPredictionInput;
    target: number[];
}
export interface TransformerMetrics {
    predictions: number[];
    targets: number[];
    confidence?: number[];
}
export interface TransformerConfig {
    inputSize: number;
    hiddenSize: number;
    numLayers: number;
    numHeads: number;
    dropout: number;
    maxSequenceLength: number;
    learningRate: number;
    optimizer: string;
    lossFunction: string;
    epochs: number;
    batchSize: number;
    warmupSteps: number;
    metadata: Record<string, unknown>;
}
export declare class TransformerModel {
    private logger;
    private errorHandler;
    private config;
    private model;
    constructor(config: TransformerConfig);
    initialize(): Promise<void>;
    private createModel;
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
