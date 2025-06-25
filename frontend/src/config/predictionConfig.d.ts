export interface FeatureFlags {
    enableExperimentalOddsCalculation: boolean;
    showAdvancedAnalyticsDashboard: boolean;
    useNewSentimentModel: boolean;
}
export interface ExperimentConfig {
    id: string;
    name: string;
    variants: {
        id: string;
        name: string;
        weight: number;
    }[];
    isActive: boolean;
}
export declare const getFeatureFlag: (flagName: keyof FeatureFlags) => boolean;
export declare const getActiveExperiments: () => ExperimentConfig[];
export declare const getAllFeatureFlags: () => FeatureFlags;
