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
        hyperparameters: Record<string, string | number | boolean | null>;
    };
}
export declare class ModelVersioning {
    private static instance;
    private versions;
    private constructor();
    static getInstance(): ModelVersioning;
    addVersion(modelId: string, version: ModelVersion): void;
    getLatestVersion(modelId: string): ModelVersion | undefined;
    getVersion(modelId: string, versionId: string): ModelVersion | undefined;
    getAllVersions(modelId: string): ModelVersion[];
    rollbackToVersion(modelId: string, versionId: string): boolean;
    compareVersions(modelId: string, version1Id: string, version2Id: string): {
        version1: ModelVersion;
        version2: ModelVersion;
        differences: Record<string, {
            v1: string | number | boolean | string[] | number[] | null | undefined | Record<string, string | number | boolean | null>;
            v2: string | number | boolean | string[] | number[] | null | undefined | Record<string, string | number | boolean | null>;
        }>;
    } | undefined;
}
