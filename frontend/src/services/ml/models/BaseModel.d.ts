/**
 * Base model type definitions for ML models.
 */
declare class EventEmitter {
    private listeners;
    on(event: string, fn: Function): void;
    off(event: string, fn: Function): void;
    emit(event: string, ...args: any[]): void;
}
import { ModelConfig, ModelMetrics, ModelPrediction, ModelType } from '@/types';
import { UnifiedLogger } from '../../../core/UnifiedLogger';
import { UnifiedErrorHandler } from '../../../core/UnifiedErrorHandler';
import { ResourceManager } from '../resources/ResourceManager';
export interface TrainingConfig {
    data: any;
    validationSplit?: number;
    batchSize?: number;
    epochs?: number;
    callbacks?: any[];
}
export interface ModelUpdate {
    timestamp: string;
    type: 'training' | 'prediction' | 'evaluation';
    metrics?: ModelMetrics;
    metadata?: Record<string, any>;
}
export interface ModelError {
    code: string;
    message: string;
    details?: any;
}
export declare abstract class BaseModel extends EventEmitter {
    protected readonly modelId: string;
    protected readonly config: ModelConfig;
    protected isTrained: boolean;
    protected lastUpdate: string;
    protected metadata: Record<string, any>;
    protected readonly logger: UnifiedLogger;
    protected readonly errorHandler: UnifiedErrorHandler;
    protected metrics: ModelMetrics;
    protected model: any;
    protected isTraining: boolean;
    protected resourceManager: ResourceManager;
    constructor(config: ModelConfig);
    abstract predict(input: any): Promise<ModelPrediction>;
    abstract train(data: any): Promise<void>;
    abstract evaluate(data: any): Promise<ModelMetrics>;
    abstract save(path: string): Promise<void>;
    abstract load(path: string): Promise<void>;
    getModelId(): string;
    getConfig(): ModelConfig;
    isModelTrained(): boolean;
    getLastUpdate(): string;
    getMetadata(): Record<string, any>;
    getModelInfo(): Record<string, any>;
    protected updateLastUpdate(): void;
    protected createPrediction(output: any, confidence?: number): {
        output: any;
        confidence?: number;
    };
    protected createError(message: string, error: Error): Error;
    protected preprocessFeatures(data: any): Promise<any>;
    protected validateFeatures(data: any): Promise<boolean>;
    protected calculateMSE(actual: number[], predicted: number[]): number;
    protected calculateMAE(actual: number[], predicted: number[]): number;
    protected calculateMAPE(actual: number[], predicted: number[]): number;
    protected calculateF1Score(predictions: number[], actuals: number[]): number;
    protected ensureGPU(): Promise<void>;
    protected calculateMetrics(predictions: number[], actuals: number[]): ModelMetrics;
    protected isClassification(): boolean;
    protected calculateAccuracy(predictions: number[], actuals: number[]): number;
    protected calculatePrecision(predictions: number[], actuals: number[]): number;
    protected calculateRecall(predictions: number[], actuals: number[]): number;
    protected calculateRMSE(predictions: number[], actuals: number[]): number;
    protected calculateR2(predictions: number[], actuals: number[]): number;
    getMetrics(): ModelMetrics;
    getType(): ModelType;
    getName(): string;
    isModelTraining(): boolean;
}
export type { ModelConfig, ModelPrediction };
