import { ModelManager } from '../manager/ModelManager';
export class ModelService {
    constructor() {
        this.modelManager = ModelManager.getInstance();
    }
    static getInstance() {
        if (!ModelService.instance) {
            ModelService.instance = new ModelService();
        }
        return ModelService.instance;
    }
    async createModel(modelId, type, config) {
        await this.modelManager.initializeModel(modelId, type, config);
    }
    async trainModel(modelId, data) {
        await this.modelManager.trainModel(modelId, data);
    }
    async predict(modelId, input) {
        return await this.modelManager.predict(modelId, input);
    }
    async evaluateModel(modelId, data) {
        return await this.modelManager.evaluateModel(modelId, data);
    }
    async updateModel(modelId, update) {
        await this.modelManager.updateModel(modelId, update);
    }
    async saveModel(modelId, path) {
        await this.modelManager.saveModel(modelId, path);
    }
    async loadModel(modelId, path) {
        await this.modelManager.loadModel(modelId, path);
    }
    deactivateModel(modelId) {
        this.modelManager.deactivateModel(modelId);
    }
    getActiveModels() {
        return this.modelManager.getActiveModels();
    }
    getModelMetrics(modelId) {
        return this.modelManager.getModelMetrics(modelId);
    }
    isModelActive(modelId) {
        return this.modelManager.isModelActive(modelId);
    }
    getModelInfo(modelId) {
        return this.modelManager.getModelInfo(modelId);
    }
    isModelTrained(modelId) {
        return this.modelManager.isModelTrained(modelId);
    }
    getAvailableModelTypes() {
        return this.modelManager.getAvailableModelTypes();
    }
    getModelTypeInfo(type) {
        return this.modelManager.getModelTypeInfo(type);
    }
}
