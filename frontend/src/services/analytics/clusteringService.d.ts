export interface ClusteringModelConfig {
    type: string;
    params: Record<string, unknown>;
}
export interface OptimizerConfig {
    type: string;
    params: Record<string, unknown>;
}
export interface ClusteringResult {
    clusters: number[];
    embedding?: number[][];
}
export interface OptimizationResult {
    bestParams: Record<string, unknown>;
    bestValue: number;
    history: OptimizationHistoryEntry[];
}
export interface OptimizationHistoryEntry {
    params: Record<string, unknown>;
    value: number;
}
interface ClusteringConfig {
    modelType: 'kmeans' | 'dbscan' | 'hierarchical' | 'gmm' | 'pca' | 'ica' | 'tsne' | 'umap';
    params: {
        nClusters?: number;
        eps?: number;
        minSamples?: number;
        nComponents?: number;
        perplexity?: number;
        nNeighbors?: number;
        minDist?: number;
    };
}
interface OptimizationConfig {
    algorithm: 'genetic' | 'particleSwarm' | 'simulatedAnnealing' | 'bayesian' | 'gridSearch' | 'randomSearch' | 'differential' | 'antColony';
    params: {
        populationSize?: number;
        generations?: number;
        mutationRate?: number;
        crossoverRate?: number;
        nParticles?: number;
        inertia?: number;
        temperature?: number;
        coolingRate?: number;
        nIterations?: number;
        explorationRate?: number;
    };
    objective: (params: Record<string, unknown>) => number;
    constraints?: {
        min: Record<string, number>;
        max: Record<string, number>;
    };
}
declare class ClusteringService {
    private clusteringModels;
    private optimizers;
    constructor();
    private initializeClusteringModels;
    private initializeOptimizers;
    cluster(data: number[][], config: ClusteringConfig): Promise<ClusteringResult>;
    private performClustering;
    private performKMeans;
    private performDBSCAN;
    private performHierarchical;
    private performGMM;
    private performPCA;
    private performICA;
    private performTSNE;
    private performUMAP;
    optimize(config: OptimizationConfig): Promise<OptimizationResult>;
    private runOptimization;
    private runGeneticAlgorithm;
    private runParticleSwarm;
    private runSimulatedAnnealing;
    private runBayesianOptimization;
    private runGridSearch;
    private runRandomSearch;
    private runDifferentialEvolution;
    private runAntColony;
}
export declare const clusteringService: ClusteringService;
export {};
