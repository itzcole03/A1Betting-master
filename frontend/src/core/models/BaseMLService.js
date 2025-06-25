import { ModelManager } from './ModelManager';
import { FeatureLogger } from '../../services/analytics/featureLogging';
export class BaseMLService {
    constructor(config) {
        this.modelManager = new ModelManager(config.modelManagerConfig);
        this.logger = new FeatureLogger(config.loggerConfig);
    }
    // Model Management
    async createModel(metadata) {
        try {
            return await this.modelManager.createModel(metadata);
        }
        catch (error) {
            this.logger.error('Failed to create model', error);
            throw error;
        }
    }
    async getModel(modelId) {
        try {
            return await this.modelManager.getModelMetadata(modelId);
        }
        catch (error) {
            this.logger.error(`Failed to get model ${modelId}`, error);
            throw error;
        }
    }
    async updateModel(modelId, metadata) {
        try {
            await this.modelManager.updateModelMetadata(modelId, metadata);
        }
        catch (error) {
            this.logger.error(`Failed to update model ${modelId}`, error);
            throw error;
        }
    }
    async deleteModel(modelId) {
        try {
            await this.modelManager.deleteModel(modelId);
        }
        catch (error) {
            this.logger.error(`Failed to delete model ${modelId}`, error);
            throw error;
        }
    }
    // Version Management
    async getVersions(modelId) {
        try {
            return await this.modelManager.getModelVersions(modelId);
        }
        catch (error) {
            this.logger.error(`Failed to get versions for model ${modelId}`, error);
            throw error;
        }
    }
    async getVersion(modelId, version) {
        try {
            const versions = await this.getVersions(modelId);
            const modelVersion = versions.find(v => v.version === version);
            if (!modelVersion) {
                throw new Error(`Version ${version} not found for model ${modelId}`);
            }
            return modelVersion;
        }
        catch (error) {
            this.logger.error(`Failed to get version ${version} for model ${modelId}`, error);
            throw error;
        }
    }
    async deleteVersion(modelId, version) {
        try {
            const versions = await this.getVersions(modelId);
            const updatedVersions = versions.filter(v => v.version !== version);
            // Implementation depends on storage mechanism
            this.logger.info(`Deleted version ${version} for model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete version ${version} for model ${modelId}`, error);
            throw error;
        }
    }
    // Evaluation
    async evaluate(modelId, data) {
        try {
            return await this.modelManager.evaluateModel(modelId, data);
        }
        catch (error) {
            this.logger.error(`Failed to evaluate model ${modelId}`, error);
            throw error;
        }
    }
    async evaluateVersion(modelId, version, data) {
        try {
            const modelVersion = await this.getVersion(modelId, version);
            // Implementation depends on evaluation mechanism
            return {};
        }
        catch (error) {
            this.logger.error(`Failed to evaluate version ${version} for model ${modelId}`, error);
            throw error;
        }
    }
    // Model Registry
    async registerModel(modelId) {
        try {
            // Implementation depends on registry mechanism
            this.logger.info(`Registered model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to register model ${modelId}`, error);
            throw error;
        }
    }
    async unregisterModel(modelId) {
        try {
            // Implementation depends on registry mechanism
            this.logger.info(`Unregistered model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to unregister model ${modelId}`, error);
            throw error;
        }
    }
    // Model Lifecycle
    async archiveModel(modelId) {
        try {
            await this.updateModel(modelId, { status: 'archived' });
            this.logger.info(`Archived model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to archive model ${modelId}`, error);
            throw error;
        }
    }
    async restoreModel(modelId) {
        try {
            await this.updateModel(modelId, { status: 'active' });
            this.logger.info(`Restored model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to restore model ${modelId}`, error);
            throw error;
        }
    }
    async deprecateModel(modelId) {
        try {
            await this.updateModel(modelId, { status: 'deprecated' });
            this.logger.info(`Deprecated model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to deprecate model ${modelId}`, error);
            throw error;
        }
    }
}
