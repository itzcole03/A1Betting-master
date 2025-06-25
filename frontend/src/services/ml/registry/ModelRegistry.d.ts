import { BaseModel } from '../models/BaseModel';
import { ModelMetrics, ModelType } from '@/types';
import { EventEmitter } from 'events';
export declare class ModelRegistry extends EventEmitter {
    private static instance;
    private models;
    private modelMetrics;
    private modelWeights;
    private constructor();
    static getInstance(): ModelRegistry;
    registerModel(model: BaseModel): void;
    unregisterModel(modelName: string): void;
    getModel(modelName: string): BaseModel | undefined;
    getModelsByType(type: ModelType): BaseModel[];
    getAllModels(): BaseModel[];
    updateModelMetrics(modelName: string, metrics: ModelMetrics): void;
    getModelMetrics(modelName: string): ModelMetrics | undefined;
    updateModelWeights(): void;
    getModelWeight(modelName: string): number;
    trainAllModels(data: any): Promise<void>;
    evaluateAllModels(data: any): Promise<void>;
    saveAllModels(basePath: string): Promise<void>;
    loadAllModels(basePath: string): Promise<void>;
}
