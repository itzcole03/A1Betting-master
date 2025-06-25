export type ModelType = 'traditional' | 'deepLearning' | 'timeSeries' | 'optimization' | 'ensemble' | 'quantum' | 'gameTheory' | 'marketIntelligence' | 'temporalPattern' | 'alternativeData';
export interface ModelConfig {
    name: string;
    type: ModelType;
    features: string[];
    target: string;
    hyperparameters?: {
        learningRate?: number;
        batchSize?: number;
        maxEpochs?: number;
        validationSplit?: number;
        regularization?: number;
        dropout?: number;
        optimizer?: string;
        loss?: string;
        metrics?: string[];
        maxDepth?: number;
        nEstimators?: number;
        minSamplesSplit?: number;
        minSamplesLeaf?: number;
        layers?: Array<{
            type: 'dense' | 'conv' | 'lstm' | 'gru';
            units: number;
            activation?: string;
            dropout?: number;
        }>;
        windowSize?: number;
        forecastHorizon?: number;
        seasonality?: number;
        populationSize?: number;
        generations?: number;
        mutationRate?: number;
        crossoverRate?: number;
        votingStrategy?: 'weighted' | 'majority' | 'confidence';
        minModels?: number;
        consensusThreshold?: number;
    };
    training?: {
        earlyStopping?: {
            patience: number;
            minDelta: number;
        };
        callbacks?: Array<{
            type: string;
            config: Record<string, any>;
        }>;
        validation?: {
            strategy: 'holdout' | 'crossValidation' | 'timeSeriesSplit';
            splits?: number;
        };
    };
    constraints?: {
        min?: number[];
        max?: number[];
        equality?: Array<{
            coefficients: number[];
            value: number;
        }>;
        inequality?: Array<{
            coefficients: number[];
            value: number;
        }>;
    };
}
export interface ModelMetrics {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    auc?: number;
    confusionMatrix?: number[][];
    rmse?: number;
    mae?: number;
    r2?: number;
    mape?: number;
    mase?: number;
    smape?: number;
    custom?: Record<string, number>;
    trainingTime?: number;
    inferenceTime?: number;
    memoryUsage?: number;
    gpuUtilization?: number;
}
export interface ModelPerformance {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    calibration: {
        brierScore: number;
        reliabilityScore: number;
    };
    drift: {
        featureDrift: number;
        predictionDrift: number;
        lastUpdated: number;
    };
}
export interface ModelPrediction {
    prediction: number;
    confidence: number;
    probability: number;
    features: Record<string, number>;
    performance: ModelPerformance;
    modelType: string;
    uncertainty: UncertaintyMetrics;
    explanations: ExplanationMetrics;
    expectedValue: ExpectedValueMetrics;
}
export interface UncertaintyMetrics {
    total: number;
    epistemic: number;
    aleatoric: number;
    confidenceInterval: {
        lower: number;
        upper: number;
        level: number;
    };
    components: {
        modelVariance: number;
        dataQuality: number;
        temporal: number;
        featureCoverage: number;
    };
}
export interface ExplanationMetrics {
    featureImportance: Array<{
        feature: string;
        importance: number;
        direction: 'positive' | 'negative';
        confidence: number;
    }>;
    shapValues: Record<string, number>;
    counterfactuals: Array<{
        feature: string;
        originalValue: number;
        alternativeValue: number;
        impact: number;
    }>;
    decisionPath: Array<{
        node: string;
        threshold: number;
        value: number;
    }>;
}
export interface ExpectedValueMetrics {
    raw: number;
    adjusted: number;
    kellyFraction: number;
    riskAdjustedReturn: number;
    components: {
        baseProbability: number;
        odds: number;
        edge: number;
        riskFactor: number;
    };
}
export interface EnsemblePrediction extends ModelPrediction {
    modelType: 'ensemble';
    modelContributions: {
        [modelName: string]: {
            prediction: any;
            confidence: number;
            weight: number;
        };
    };
    votingStrategy: string;
    consensus: number;
}
export interface ModelEvaluation {
    modelName: string;
    modelType: ModelType;
    metrics: ModelMetrics;
    predictions: ModelPrediction[];
    timestamp: string;
    dataset: {
        name: string;
        size: number;
        split: 'train' | 'validation' | 'test';
    };
    performance: {
        trainingTime: number;
        inferenceTime: number;
        memoryUsage: number;
        gpuUtilization?: number;
    };
}
export interface ModelVersion {
    version: string;
    config: ModelConfig;
    metrics: ModelMetrics;
    createdAt: string;
    updatedAt: string;
    status: 'training' | 'evaluating' | 'ready' | 'failed';
    artifacts: {
        weights?: string;
        config?: string;
        preprocessing?: string;
        postprocessing?: string;
    };
}
export interface ModelMetadata {
    name: string;
    type: ModelType;
    description: string;
    author: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    dependencies: string[];
    requirements: {
        cpu: string;
        memory: string;
        gpu?: string;
    };
    performance: {
        accuracy: number;
        latency: number;
        throughput: number;
    };
    documentation: {
        usage: string;
        examples: string[];
        api: Record<string, any>;
    };
}
