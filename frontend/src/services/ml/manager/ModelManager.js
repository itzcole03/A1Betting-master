import { ModelFactory } from '../factory/ModelFactory';
import { validateModelConfig, validateRegularModelConfig, } from '../config/modelConfig';
import { ModelRegistry } from '../registry/ModelRegistry';
export class ModelManager {
    constructor() {
        this.activeModels = new Set();
        this.modelMetrics = new Map();
        this.modelFactory = ModelFactory.getInstance();
        this.modelRegistry = ModelRegistry.getInstance();
    }
    static getInstance() {
        if (!ModelManager.instance) {
            ModelManager.instance = new ModelManager();
        }
        return ModelManager.instance;
    }
    async initializeModel(modelId, type, config) {
        try {
            // Get default configuration from registry
            const defaultConfig = this.modelRegistry.getDefaultConfig(type);
            // Merge with provided config if any
            const finalConfig = config ? { ...defaultConfig, ...config } : defaultConfig;
            // Validate configuration based on model type
            if (type === 'ensemble') {
                validateModelConfig(finalConfig);
            }
            else {
                validateRegularModelConfig(finalConfig);
            }
            // Create model using factory
            await this.modelFactory.createModel(finalConfig, modelId);
            this.activeModels.add(modelId);
            console.log(`Model ${modelId} initialized successfully`);
        }
        catch (error) {
            console.error(`Failed to initialize model ${modelId}:`, error);
            throw error;
        }
    }
    async trainModel(modelId, data) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        try {
            await this.modelFactory.trainModel(modelId, data);
            console.log(`Model ${modelId} trained successfully`);
        }
        catch (error) {
            console.error(`Failed to train model ${modelId}:`, error);
            throw error;
        }
    }
    async predict(modelId, input) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        try {
            return await this.modelFactory.predict(modelId, input);
        }
        catch (error) {
            console.error(`Failed to get prediction from model ${modelId}:`, error);
            throw error;
        }
    }
    async evaluateModel(modelId, data) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        try {
            const metrics = await this.modelFactory.evaluateModel(modelId, data);
            this.modelMetrics.set(modelId, metrics);
            return metrics;
        }
        catch (error) {
            console.error(`Failed to evaluate model ${modelId}:`, error);
            throw error;
        }
    }
    async updateModel(modelId, update) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        try {
            await this.modelFactory.updateModel(modelId, update);
            console.log(`Model ${modelId} updated successfully`);
        }
        catch (error) {
            console.error(`Failed to update model ${modelId}:`, error);
            throw error;
        }
    }
    async saveModel(modelId, path) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        try {
            await this.modelFactory.saveModel(modelId, path);
            console.log(`Model ${modelId} saved successfully to ${path}`);
        }
        catch (error) {
            console.error(`Failed to save model ${modelId}:`, error);
            throw error;
        }
    }
    async loadModel(modelId, path) {
        try {
            await this.modelFactory.loadModel(modelId, path);
            this.activeModels.add(modelId);
            console.log(`Model ${modelId} loaded successfully from ${path}`);
        }
        catch (error) {
            console.error(`Failed to load model ${modelId}:`, error);
            throw error;
        }
    }
    deactivateModel(modelId) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        this.activeModels.delete(modelId);
        this.modelMetrics.delete(modelId);
        console.log(`Model ${modelId} deactivated`);
    }
    getActiveModels() {
        return Array.from(this.activeModels);
    }
    getModelMetrics(modelId) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        return this.modelMetrics.get(modelId);
    }
    isModelActive(modelId) {
        return this.activeModels.has(modelId);
    }
    getModelInfo(modelId) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        return this.modelFactory.getModelInfo(modelId);
    }
    isModelTrained(modelId) {
        if (!this.activeModels.has(modelId)) {
            throw new Error(`Model ${modelId} is not active`);
        }
        return this.modelFactory.isModelTrained(modelId);
    }
    getAvailableModelTypes() {
        return this.modelRegistry.getAvailableModelTypes();
    }
    getModelTypeInfo(type) {
        return this.modelRegistry.getModelTypeInfo(type);
    }
}
