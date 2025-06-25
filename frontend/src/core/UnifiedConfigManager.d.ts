export interface SystemConfig {
    errorHandling: {
        maxRetries: number;
        backoffFactor: number;
        timeoutMs: number;
    };
    emergencyMode: boolean;
}
export interface StrategyConfig {
    riskTolerance: number;
    maxExposure: number;
    adaptiveStaking: boolean;
    hedgingEnabled: boolean;
    stopLoss: number;
}
import type { Feature, Experiment } from '../utils/FeatureFlags-MyPC.js';
export interface Config {
    system: SystemConfig;
    strategy: StrategyConfig;
    data: {
        retryAttempts: number;
        refreshInterval: number;
    };
    prediction: {
        minConfidence: number;
        ensembleSize: number;
    };
    features?: {
        [key: string]: Feature;
    };
    experiments?: {
        [key: string]: Experiment;
    };
}
export declare class UnifiedConfigManager {
    private static instance;
    private config;
    private eventBus;
    private constructor();
    static getInstance(): UnifiedConfigManager;
    getConfig(): Config;
    updateConfig(updates: Partial<Config>): Promise<void>;
}
export declare const configManager: UnifiedConfigManager;
