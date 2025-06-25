import { FeatureLogger } from '../../services/analytics/featureLogging';
import * as fs from 'fs/promises';
import * as path from 'path';
export class ModelRegistry {
    constructor(config) {
        this.config = config;
        this.logger = new FeatureLogger({});
        this.models = new Map();
        this.versions = new Map();
        this.initialize();
    }
    async initialize() {
        try {
            await fs.mkdir(this.config.storagePath, { recursive: true });
            await this.loadModels();
        }
        catch (error) {
            this.logger.error('Failed to initialize model registry', error);
            throw error;
        }
    }
    async loadModels() {
        try {
            const files = await fs.readdir(this.config.storagePath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readFile(path.join(this.config.storagePath, file), 'utf-8');
                    const model = JSON.parse(content);
                    this.models.set(model.id, model);
                    await this.loadVersions(model.id);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to load models', error);
            throw error;
        }
    }
    async loadVersions(modelId) {
        try {
            const versionPath = path.join(this.config.storagePath, modelId, 'versions');
            const files = await fs.readdir(versionPath);
            const versions = [];
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readFile(path.join(versionPath, file), 'utf-8');
                    versions.push(JSON.parse(content));
                }
            }
            this.versions.set(modelId, versions);
        }
        catch (error) {
            this.logger.error(`Failed to load versions for model ${modelId}`, error);
            throw error;
        }
    }
    async registerModel(metadata) {
        try {
            const modelPath = path.join(this.config.storagePath, metadata.id);
            await fs.mkdir(modelPath, { recursive: true });
            await fs.mkdir(path.join(modelPath, 'versions'), { recursive: true });
            await fs.writeFile(path.join(modelPath, 'metadata.json'), JSON.stringify(metadata, null, 2));
            this.models.set(metadata.id, metadata);
            this.versions.set(metadata.id, []);
            this.logger.info(`Registered new model: ${metadata.id}`);
            return metadata.id;
        }
        catch (error) {
            this.logger.error('Failed to register model', error);
            throw error;
        }
    }
    async getModel(modelId) {
        const model = this.models.get(modelId);
        if (!model) {
            throw new Error(`Model not found: ${modelId}`);
        }
        return model;
    }
    async updateModel(modelId, version) {
        try {
            const versions = this.versions.get(modelId) || [];
            versions.push(version);
            // Maintain version limit
            if (versions.length > this.config.maxVersions) {
                versions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                versions.splice(this.config.maxVersions);
            }
            await fs.writeFile(path.join(this.config.storagePath, modelId, 'versions', `${version.version}.json`), JSON.stringify(version, null, 2));
            this.versions.set(modelId, versions);
            this.logger.info(`Updated model ${modelId} with version ${version.version}`);
        }
        catch (error) {
            this.logger.error(`Failed to update model ${modelId}`, error);
            throw error;
        }
    }
    async getModelVersions(modelId) {
        return this.versions.get(modelId) || [];
    }
    async getModelMetadata(modelId) {
        const model = this.models.get(modelId);
        if (!model) {
            throw new Error(`Model not found: ${modelId}`);
        }
        return model;
    }
    async updateModelMetadata(modelId, metadata) {
        try {
            const model = await this.getModel(modelId);
            const updatedModel = { ...model, ...metadata, updatedAt: new Date() };
            await fs.writeFile(path.join(this.config.storagePath, modelId, 'metadata.json'), JSON.stringify(updatedModel, null, 2));
            this.models.set(modelId, updatedModel);
            this.logger.info(`Updated metadata for model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to update metadata for model ${modelId}`, error);
            throw error;
        }
    }
    async updateMetrics(modelId, evaluation) {
        try {
            const versions = this.versions.get(modelId);
            if (!versions || versions.length === 0) {
                throw new Error(`No versions found for model ${modelId}`);
            }
            const latestVersion = versions[versions.length - 1];
            latestVersion.metrics = evaluation;
            await fs.writeFile(path.join(this.config.storagePath, modelId, 'versions', `${latestVersion.version}.json`), JSON.stringify(latestVersion, null, 2));
            this.logger.info(`Updated metrics for model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to update metrics for model ${modelId}`, error);
            throw error;
        }
    }
    async deleteModel(modelId) {
        try {
            const modelPath = path.join(this.config.storagePath, modelId);
            await fs.rm(modelPath, { recursive: true });
            this.models.delete(modelId);
            this.versions.delete(modelId);
            this.logger.info(`Deleted model ${modelId}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete model ${modelId}`, error);
            throw error;
        }
    }
    async backup() {
        if (!this.config.backupEnabled)
            return;
        try {
            const backupPath = path.join(this.config.storagePath, 'backups', new Date().toISOString());
            await fs.mkdir(backupPath, { recursive: true });
            for (const [modelId, model] of this.models.entries()) {
                const modelPath = path.join(this.config.storagePath, modelId);
                const backupModelPath = path.join(backupPath, modelId);
                await fs.mkdir(backupModelPath, { recursive: true });
                await fs.cp(modelPath, backupModelPath, { recursive: true });
            }
            this.logger.info('Created model registry backup');
        }
        catch (error) {
            this.logger.error('Failed to create backup', error);
            throw error;
        }
    }
}
