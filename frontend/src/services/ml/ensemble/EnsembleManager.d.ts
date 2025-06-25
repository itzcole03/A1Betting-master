import { EventEmitter } from 'events';
interface EnsembleConfig {
    name: string;
    models: string[];
    weights?: {
        [modelName: string]: number;
    };
    votingStrategy: 'weighted' | 'majority' | 'confidence';
    minConfidence: number;
    minModels: number;
}
interface EnsemblePrediction {
    prediction: any;
    confidence: number;
    modelContributions: {
        [modelName: string]: {
            prediction: any;
            confidence: number;
            weight: number;
        };
    };
    metadata: {
        timestamp: number;
        modelCount: number;
        votingStrategy: string;
    };
}
export declare class EnsembleManager extends EventEmitter {
    private static instance;
    private ensembles;
    private modelRegistry;
    private constructor();
    static getInstance(): EnsembleManager;
    createEnsemble(config: EnsembleConfig): Promise<void>;
    getEnsemblePrediction(ensembleName: string, input: any): Promise<EnsemblePrediction>;
    private combinePredictions;
    private weightedVoting;
    private majorityVoting;
    private confidenceVoting;
    updateEnsembleWeights(ensembleName: string, weights: {
        [modelName: string]: number;
    }): Promise<void>;
    getEnsembleConfig(ensembleName: string): EnsembleConfig | undefined;
    getAllEnsembles(): Map<string, EnsembleConfig>;
    removeEnsemble(ensembleName: string): Promise<void>;
}
export {};
