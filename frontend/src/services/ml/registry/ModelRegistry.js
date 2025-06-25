import { EventEmitter } from 'events';
export class ModelRegistry extends EventEmitter {
    constructor() {
        super();
        this.models = new Map();
        this.modelMetrics = new Map();
        this.modelWeights = new Map();
    }
    static getInstance() {
        if (!ModelRegistry.instance) {
            ModelRegistry.instance = new ModelRegistry();
        }
        return ModelRegistry.instance;
    }
    registerModel(model) {
        const config = model.getConfig();
        this.models.set(config.name, model);
        this.modelMetrics.set(config.name, {});
        this.modelWeights.set(config.name, 1.0);
        this.emit('modelRegistered', config.name);
    }
    unregisterModel(modelName) {
        this.models.delete(modelName);
        this.modelMetrics.delete(modelName);
        this.modelWeights.delete(modelName);
        this.emit('modelUnregistered', modelName);
    }
    getModel(modelName) {
        return this.models.get(modelName);
    }
    getModelsByType(type) {
        return Array.from(this.models.values()).filter(model => model.getType() === type);
    }
    getAllModels() {
        return Array.from(this.models.values());
    }
    updateModelMetrics(modelName, metrics) {
        this.modelMetrics.set(modelName, metrics);
        this.emit('metricsUpdated', modelName, metrics);
    }
    getModelMetrics(modelName) {
        return this.modelMetrics.get(modelName);
    }
    updateModelWeights() {
        let totalAccuracy = 0;
        let modelCount = 0;
        // Calculate total accuracy
        for (const [name, metrics] of this.modelMetrics.entries()) {
            if (metrics.accuracy !== undefined) {
                totalAccuracy += metrics.accuracy;
                modelCount++;
            }
        }
        if (modelCount === 0)
            return;
        const averageAccuracy = totalAccuracy / modelCount;
        // Update weights based on relative accuracy
        for (const [name, metrics] of this.modelMetrics.entries()) {
            if (metrics.accuracy !== undefined) {
                const weight = metrics.accuracy / averageAccuracy;
                this.modelWeights.set(name, weight);
            }
        }
        this.emit('weightsUpdated', Object.fromEntries(this.modelWeights));
    }
    getModelWeight(modelName) {
        return this.modelWeights.get(modelName) || 1.0;
    }
    async trainAllModels(data) {
        const trainingPromises = Array.from(this.models.values()).map(model => model.train(data));
        await Promise.all(trainingPromises);
        this.emit('allModelsTrained');
    }
    async evaluateAllModels(data) {
        const evaluationPromises = Array.from(this.models.values()).map(async (model) => {
            const metrics = await model.evaluate(data);
            this.updateModelMetrics(model.getName(), metrics);
        });
        await Promise.all(evaluationPromises);
        this.updateModelWeights();
        this.emit('allModelsEvaluated');
    }
    async saveAllModels(basePath) {
        const savePromises = Array.from(this.models.values()).map(model => model.save(`${basePath}/${model.getName()}`));
        await Promise.all(savePromises);
        this.emit('allModelsSaved');
    }
    async loadAllModels(basePath) {
        const loadPromises = Array.from(this.models.values()).map(model => model.load(`${basePath}/${model.getName()}`));
        await Promise.all(loadPromises);
        this.emit('allModelsLoaded');
    }
}
