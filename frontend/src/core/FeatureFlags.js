import { EventBus } from "./EventBus";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { UnifiedConfigManager } from "./UnifiedConfigManager";
import { UnifiedMonitor } from "./UnifiedMonitor";
export class FeatureFlags {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.monitor = UnifiedMonitor.getInstance();
        this.configManager = UnifiedConfigManager.getInstance();
        this.features = new Map();
        this.experiments = new Map();
        this.userAssignments = new Map();
    }
    static getInstance() {
        if (!FeatureFlags.instance) {
            FeatureFlags.instance = new FeatureFlags();
        }
        return FeatureFlags.instance;
    }
    async initialize() {
        const traceId = this.performanceMonitor.startTrace("feature-flags-init");
        try {
            const config = await this.configManager.getConfig();
            // Initialize features
            if (config.features) {
                for (const feature of config.features) {
                    this.features.set(feature.id, feature);
                }
            }
            // Initialize experiments
            if (config.experiments) {
                for (const experiment of config.experiments) {
                    this.experiments.set(experiment.id, experiment);
                }
            }
            this.performanceMonitor.endTrace(traceId);
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    isFeatureEnabled(featureId, context) {
        const feature = this.features.get(featureId);
        if (!feature)
            return false;
        // Check if feature is globally enabled
        if (!feature.enabled)
            return false;
        // Check dependencies
        if (!this.areDependenciesSatisfied(feature, context))
            return false;
        // Check rollout percentage
        if (!this.isUserInRollout(context.userId, feature.rolloutPercentage))
            return false;
        return true;
    }
    getExperimentVariant(experimentId, context) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment || experiment.status !== "active")
            return null;
        // Check if user is in experiment audience
        if (!this.isUserInAudience(context, experiment.audience))
            return null;
        // Get or assign variant
        const userAssignments = this.userAssignments.get(context.userId) || {};
        if (userAssignments[experimentId]) {
            return userAssignments[experimentId];
        }
        // Assign new variant
        const variant = this.assignVariant(experiment, context);
        if (variant) {
            this.userAssignments.set(context.userId, {
                ...userAssignments,
                [experimentId]: variant.id,
            });
            return variant.id;
        }
        return null;
    }
    areDependenciesSatisfied(feature, context) {
        return feature.dependencies.every((depId) => this.isFeatureEnabled(depId, context));
    }
    isUserInRollout(userId, percentage) {
        const hash = this.hashString(userId);
        const normalized = hash / Math.pow(2, 32);
        return normalized <= percentage / 100;
    }
    isUserInAudience(context, audience) {
        // Check percentage rollout
        if (!this.isUserInRollout(context.userId, audience.percentage))
            return false;
        // Check filters if they exist
        if (audience.filters) {
            for (const [key, value] of Object.entries(audience.filters)) {
                if (context.attributes[key] !== value)
                    return false;
            }
        }
        return true;
    }
    assignVariant(experiment, context) {
        const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
        const hash = this.hashString(`${context.userId}:${experiment.id}`);
        const normalized = (hash / Math.pow(2, 32)) * totalWeight;
        let cumulative = 0;
        for (const variant of experiment.variants) {
            cumulative += variant.weight;
            if (normalized <= cumulative) {
                return variant;
            }
        }
        return null;
    }
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    registerFeature(feature) {
        if (this.features.has(feature.id)) {
            throw new Error(`Feature ${feature.id} already exists`);
        }
        this.features.set(feature.id, feature);
    }
    updateFeature(featureId, updates) {
        const feature = this.features.get(featureId);
        if (!feature) {
            throw new Error(`Feature ${featureId} not found`);
        }
        this.features.set(featureId, {
            ...feature,
            ...updates,
        });
        this.eventBus.emit("feature:updated", {
            featureId,
            updates,
            timestamp: Date.now(),
        });
    }
    registerExperiment(experiment) {
        if (this.experiments.has(experiment.id)) {
            throw new Error(`Experiment ${experiment.id} already exists`);
        }
        this.experiments.set(experiment.id, experiment);
    }
    updateExperiment(experimentId, updates) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            throw new Error(`Experiment ${experimentId} not found`);
        }
        this.experiments.set(experimentId, {
            ...experiment,
            ...updates,
        });
        this.eventBus.emit("experiment:updated", {
            experimentId,
            timestamp: Date.now(),
        });
    }
    getAllFeatures() {
        return Array.from(this.features.values());
    }
    getAllExperiments() {
        return Array.from(this.experiments.values());
    }
    getUserAssignments(userId) {
        return this.userAssignments.get(userId) || {};
    }
    clearUserAssignments(userId) {
        this.userAssignments.delete(userId);
    }
}
