export interface ModelVersion {
    id: string;
    version: string;
    timestamp: number;
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
    features: string[];
    metadata: {
        trainingDataSize: number;
        trainingDuration: number;
        framework: string;
        hyperparameters: Record<string, any>;
    };
}
export interface ModelVersionConfig {
    autoUpdate: boolean;
    versionCheckInterval: number;
    minAccuracyThreshold: number;
    maxVersionsToKeep: number;
}
export declare class ModelVersioning {
    private static instance;
    private versions;
    private config;
    private eventBus;
    private versionCheckInterval;
    private constructor();
    static getInstance(): ModelVersioning;
    private setupEventListeners;
    registerModelVersion(modelId: string, version: ModelVersion): Promise<void>;
    getLatestVersion(modelId: string): ModelVersion | null;
    getVersionHistory(modelId: string): ModelVersion[];
    validateVersion(modelId: string, version: ModelVersion): Promise<boolean>;
    setConfig(config: Partial<ModelVersionConfig>): void;
    private startVersionChecking;
    private checkForUpdates;
    private handleModelUpdate;
    rollbackToVersion(modelId: string, targetVersion: string): Promise<void>;
    compareVersions(modelId: string, version1: string, version2: string): Promise<{
        differences: {
            metrics: Record<string, {
                v1: number;
                v2: number;
                diff: number;
            }>;
            features: {
                added: string[];
                removed: string[];
                modified: string[];
            };
            metadata: Record<string, {
                v1: any;
                v2: any;
            }>;
        };
        timestamp: number;
    }>;
}
export declare const modelVersioning: ModelVersioning;
