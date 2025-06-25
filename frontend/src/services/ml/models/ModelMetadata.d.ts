export interface ModelMetadata {
    name: string;
    description: string;
    author: string;
    tags: string[];
    parameters: Record<string, any>;
    dependencies: string[];
    framework: string;
    architecture: string;
    trainingConfig: {
        epochs: number;
        batchSize: number;
        learningRate: number;
        optimizer: string;
        lossFunction: string;
        validationSplit: number;
        earlyStopping: boolean;
        earlyStoppingPatience: number;
    };
    dataConfig: {
        features: string[];
        target: string;
        preprocessing: string[];
        augmentation: string[];
        validationStrategy: string;
    };
    performanceConfig: {
        metrics: string[];
        thresholds: Record<string, number>;
        evaluationStrategy: string;
    };
    deploymentConfig: {
        environment: string;
        resources: {
            cpu: number;
            memory: number;
            gpu: boolean;
        };
        scaling: {
            minInstances: number;
            maxInstances: number;
            targetUtilization: number;
        };
    };
}
export declare class ModelMetadataManager {
    private metadata;
    constructor(metadata: ModelMetadata);
    getMetadata(): ModelMetadata;
    updateMetadata(updates: Partial<ModelMetadata>): void;
    addTag(tag: string): void;
    removeTag(tag: string): void;
    updateParameter(key: string, value: any): void;
    removeParameter(key: string): void;
    addDependency(dependency: string): void;
    removeDependency(dependency: string): void;
    toJSON(): string;
    static fromJSON(json: string): ModelMetadataManager;
}
