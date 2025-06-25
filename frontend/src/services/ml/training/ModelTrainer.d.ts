import { BaseModel, TrainingConfig, ModelMetrics } from '../models/BaseModel';
import { EventEmitter } from 'events';
export interface TrainingProgress {
    epoch: number;
    totalEpochs: number;
    metrics: ModelMetrics;
    validationMetrics?: ModelMetrics;
}
export declare class ModelTrainer extends EventEmitter {
    private static instance;
    private trainingQueue;
    private validationData;
    private constructor();
    static getInstance(): ModelTrainer;
    train(model: BaseModel, config: TrainingConfig): Promise<void>;
    private executeTraining;
    private preprocessData;
    private splitData;
    private calculateMetrics;
    private shouldStopEarly;
    private postTraining;
    isTraining(modelId: string): boolean;
    cancelTraining(modelId: string): Promise<void>;
}
