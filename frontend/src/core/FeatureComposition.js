import { EventBus } from '@/core/EventBus';
import { PerformanceMonitor } from './PerformanceMonitor';
export class ComposableFeature {
    constructor(metadata, processor, validator, rollbackHandler) {
        this.metadata = metadata;
        this.processor = processor;
        this.validator = validator;
        this.rollbackHandler = rollbackHandler;
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
    }
    async process(input, context) {
        const traceId = this.performanceMonitor.startTrace(`feature-${this.metadata.id}`, {
            featureId: this.metadata.id,
            category: this.metadata.category,
            version: this.metadata.version,
        });
        try {
            // Validate input if validator exists
            if (this.validator && !(await this.validate(input))) {
                throw new Error(`Input validation failed for feature ${this.metadata.id}`);
            }
            // Process the input
            const startTime = Date.now();
            const result = await this.processor(input, context);
            const duration = Date.now() - startTime;
            // Emit success event
            this.eventBus.publish({
                type: 'feature:executed',
                payload: {
                    featureId: this.metadata.id,
                    duration,
                    success: true,
                    timestamp: Date.now(),
                    context,
                },
            });
            this.performanceMonitor.endTrace(traceId);
            return result;
        }
        catch (error) {
            // Handle error and attempt rollback
            this.performanceMonitor.endTrace(traceId, error);
            if (this.rollbackHandler) {
                await this.rollbackHandler(input, error);
            }
            // Emit error event
            this.eventBus.publish({
                type: 'feature:error',
                payload: {
                    featureId: this.metadata.id,
                    error: error,
                    timestamp: Date.now(),
                    context,
                },
            });
            throw error;
        }
    }
    combine(next) {
        return new ComposableFeature({
            id: `${this.metadata.id}->${next.metadata.id}`,
            name: `${this.metadata.name} -> ${next.metadata.name}`,
            description: `Composed feature: ${this.metadata.description} -> ${next.metadata.description}`,
            version: `${this.metadata.version}+${next.metadata.version}`,
            dependencies: [...this.metadata.dependencies, ...next.metadata.dependencies],
            category: this.metadata.category,
            tags: [...new Set([...this.metadata.tags, ...next.metadata.tags])],
        }, async (input, context) => {
            const intermediate = await this.process(input, context);
            return next.process(intermediate, context);
        });
    }
    async validate(input) {
        if (this.validator) {
            return this.validator(input);
        }
        return true;
    }
    async rollback(input, error) {
        if (this.rollbackHandler) {
            await this.rollbackHandler(input, error);
        }
    }
}
export class FeatureRegistry {
    constructor() {
        this.features = new Map();
        this.eventBus = EventBus.getInstance();
    }
    static getInstance() {
        if (!FeatureRegistry.instance) {
            FeatureRegistry.instance = new FeatureRegistry();
        }
        return FeatureRegistry.instance;
    }
    registerFeature(feature) {
        if (this.features.has(feature.metadata.id)) {
            throw new Error(`Feature with ID ${feature.metadata.id} is already registered`);
        }
        this.features.set(feature.metadata.id, feature);
        this.eventBus.publish({
            type: 'feature:registered',
            payload: {
                featureId: feature.metadata.id,
                metadata: feature.metadata,
                timestamp: Date.now(),
            },
        });
    }
    getFeature(featureId) {
        return this.features.get(featureId);
    }
    listFeatures() {
        return Array.from(this.features.values()).map(f => f.metadata);
    }
    composeFeatures(firstFeatureId, secondFeatureId) {
        const first = this.getFeature(firstFeatureId);
        const second = this.getFeature(secondFeatureId);
        if (!first || !second) {
            return undefined;
        }
        return first.combine(second);
    }
    async executeFeature(featureId, input, context) {
        const feature = this.getFeature(featureId);
        if (!feature) {
            throw new Error(`Feature ${featureId} not found`);
        }
        return feature.process(input, context);
    }
}
