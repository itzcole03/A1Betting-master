import { BaseModel } from '../models/BaseModel';
declare class EventEmitter {
    private listeners;
    on(event: string, fn: Function): void;
    off(event: string, fn: Function): void;
    emit(event: string, ...args: any[]): void;
}
export declare class ResourceManager extends EventEmitter {
    private static instance;
    private allocations;
    private totalGPUMemory;
    private totalCPUMemory;
    private gpuMemoryLimit;
    private cpuMemoryLimit;
    private constructor();
    static getInstance(): ResourceManager;
    private initializeResources;
    allocateResources(model: BaseModel): Promise<void>;
    releaseResources(modelId: string): Promise<void>;
    private getModelRequirements;
    private checkResourceAvailability;
    private getCurrentGPUUsage;
    private getCurrentCPUUsage;
    getResourceUtilization(): {
        gpu: {
            used: number;
            total: number;
            percentage: number;
        };
        cpu: {
            used: number;
            total: number;
            percentage: number;
        };
    };
    cleanup(): Promise<void>;
}
export {};
