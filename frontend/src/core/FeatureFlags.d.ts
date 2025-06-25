export interface Feature {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    rolloutPercentage: number;
    dependencies: string[];
    tags: string[];
    metadata: Record<string, any>;
}
export interface Experiment {
    id: string;
    name: string;
    description: string;
    status: "active" | "inactive" | "completed";
    variants: Array<{
        id: string;
        name: string;
        weight: number;
    }>;
    audience: {
        percentage: number;
        filters?: Record<string, any>;
    };
    startDate: number;
    endDate?: number;
    metadata: Record<string, any>;
}
export interface UserContext {
    userId: string;
    userGroups: string[];
    attributes: Record<string, any>;
}
export declare class FeatureFlags {
    private static instance;
    private readonly eventBus;
    private readonly performanceMonitor;
    private readonly monitor;
    private readonly configManager;
    private readonly features;
    private readonly experiments;
    private readonly userAssignments;
    private constructor();
    static getInstance(): FeatureFlags;
    initialize(): Promise<void>;
    isFeatureEnabled(featureId: string, context: UserContext): boolean;
    getExperimentVariant(experimentId: string, context: UserContext): string | null;
    private areDependenciesSatisfied;
    private isUserInRollout;
    private isUserInAudience;
    private assignVariant;
    private hashString;
    registerFeature(feature: Feature): void;
    updateFeature(featureId: string, updates: Partial<Feature>): void;
    registerExperiment(experiment: Experiment): void;
    updateExperiment(experimentId: string, updates: Partial<Experiment>): void;
    getAllFeatures(): Feature[];
    getAllExperiments(): Experiment[];
    getUserAssignments(userId: string): Record<string, string>;
    clearUserAssignments(userId: string): void;
}
