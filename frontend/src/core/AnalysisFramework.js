import { EventBus } from '@/core/EventBus';
import { PerformanceMonitor } from './PerformanceMonitor';
import { UnifiedMonitor } from './UnifiedMonitor';
export class AnalysisRegistry {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.monitor = UnifiedMonitor.getInstance();
        this.plugins = new Map();
        this.pluginDependencies = new Map();
        this.pluginConfidence = new Map();
    }
    static getInstance() {
        if (!AnalysisRegistry.instance) {
            AnalysisRegistry.instance = new AnalysisRegistry();
        }
        return AnalysisRegistry.instance;
    }
    registerPlugin(plugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin with ID ${plugin.id} already registered`);
        }
        // Validate plugin dependencies
        this.validateDependencies(plugin);
        // Register plugin
        this.plugins.set(plugin.id, plugin);
        this.pluginDependencies.set(plugin.id, new Set(plugin.metadata.dependencies));
        this.pluginConfidence.set(plugin.id, plugin.confidence);
        // Emit plugin registered event
        this.eventBus.emit('metric:recorded', {
            name: 'plugin_registered',
            value: 1,
            timestamp: Date.now(),
            labels: {
                plugin_id: plugin.id,
                plugin_name: plugin.name,
                plugin_version: plugin.version,
            },
        });
    }
    unregisterPlugin(pluginId) {
        if (!this.plugins.has(pluginId)) {
            return;
        }
        // Check if any other plugins depend on this one
        for (const [id, dependencies] of this.pluginDependencies.entries()) {
            if (dependencies.has(pluginId)) {
                throw new Error(`Cannot unregister plugin ${pluginId} as it is required by plugin ${id}`);
            }
        }
        this.plugins.delete(pluginId);
        this.pluginDependencies.delete(pluginId);
        this.pluginConfidence.delete(pluginId);
        // Emit plugin unregistered event
        this.eventBus.emit('metric:recorded', {
            name: 'plugin_unregistered',
            value: 1,
            timestamp: Date.now(),
            labels: {
                plugin_id: pluginId,
            },
        });
    }
    getPlugin(pluginId) {
        return this.plugins.get(pluginId);
    }
    async analyze(pluginId, input, context) {
        const plugin = this.getPlugin(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} not found`);
        }
        const traceId = this.performanceMonitor.startTrace('plugin-analysis', {
            pluginId,
            pluginName: plugin.name,
            pluginVersion: plugin.version,
        });
        try {
            // Run analysis
            const result = await plugin.analyze(input, context);
            // Update plugin confidence based on result
            this.updatePluginConfidence(pluginId, context);
            this.performanceMonitor.endTrace(traceId);
            return result;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    async analyzeWithFallback(primaryPluginId, fallbackPluginId, input, context) {
        try {
            return await this.analyze(primaryPluginId, input, context);
        }
        catch (error) {
            this.monitor.logError('analysis', error, {
                primaryPluginId,
                fallbackPluginId,
            });
            return await this.analyze(fallbackPluginId, input, context);
        }
    }
    getPluginsByTag(tag) {
        return Array.from(this.plugins.values()).filter(plugin => plugin.metadata.tags.includes(tag));
    }
    getPluginConfidence(pluginId) {
        return this.pluginConfidence.get(pluginId) || 0;
    }
    validateDependencies(plugin) {
        for (const dependency of plugin.metadata.dependencies) {
            if (!this.plugins.has(dependency)) {
                throw new Error(`Plugin ${plugin.id} requires missing dependency ${dependency}`);
            }
        }
    }
    updatePluginConfidence(pluginId, context) {
        const currentConfidence = this.pluginConfidence.get(pluginId) || 0;
        const plugin = this.plugins.get(pluginId);
        if (!plugin)
            return;
        // Update confidence based on context and stability
        const newConfidence = this.calculatePluginConfidence(currentConfidence, plugin, context);
        this.pluginConfidence.set(pluginId, newConfidence);
        // Emit confidence update event
        this.eventBus.emit('metric:recorded', {
            name: 'plugin_confidence',
            value: newConfidence,
            timestamp: Date.now(),
            labels: {
                plugin_id: pluginId,
                plugin_name: plugin.name,
            },
        });
    }
    calculatePluginConfidence(currentConfidence, plugin, context) {
        const weights = {
            streamConfidence: 0.3,
            modelDiversity: 0.2,
            predictionStability: 0.3,
            historicalConfidence: 0.2,
        };
        const newConfidence = context.streamConfidence * weights.streamConfidence +
            context.modelDiversity * weights.modelDiversity +
            context.predictionStability * weights.predictionStability +
            currentConfidence * weights.historicalConfidence;
        return Math.max(0, Math.min(1, newConfidence));
    }
}
