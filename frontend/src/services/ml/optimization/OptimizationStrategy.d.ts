import { EventEmitter } from 'events';
export interface OptimizationConfig {
    name: string;
    type: 'genetic' | 'particleSwarm' | 'simulatedAnnealing' | 'bayesian';
    parameters: {
        populationSize?: number;
        generations?: number;
        mutationRate?: number;
        crossoverRate?: number;
        inertiaWeight?: number;
        cognitiveWeight?: number;
        socialWeight?: number;
        temperature?: number;
        coolingRate?: number;
        acquisitionFunction?: 'ucb' | 'ei' | 'pi';
        kernel?: 'rbf' | 'matern' | 'linear';
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
    objective: {
        type: 'minimize' | 'maximize';
        function: (params: number[]) => Promise<number>;
    };
}
export interface OptimizationResult {
    bestParameters: number[];
    bestValue: number;
    history: Array<{
        iteration: number;
        bestValue: number;
        parameters: number[];
    }>;
    metadata: {
        iterations: number;
        timeElapsed: number;
        convergence: boolean;
        strategy: string;
    };
}
export declare abstract class OptimizationStrategy extends EventEmitter {
    protected config: OptimizationConfig;
    protected currentIteration: number;
    protected bestParameters: number[];
    protected bestValue: number;
    protected history: OptimizationResult['history'];
    constructor(config: OptimizationConfig);
    protected validateConfig(): void;
    private validateGeneticConfig;
    private validateParticleSwarmConfig;
    private validateSimulatedAnnealingConfig;
    private validateBayesianConfig;
    abstract optimize(): Promise<OptimizationResult>;
    protected evaluateObjective(parameters: number[]): Promise<number>;
    protected updateBest(parameters: number[], value: number): void;
    protected checkConstraints(parameters: number[]): boolean;
    protected getResult(): OptimizationResult;
    protected checkConvergence(): boolean;
}
