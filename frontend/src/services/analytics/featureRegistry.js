import { FeatureLogger } from './featureLogging';
import { FeatureStore } from './featureStore';
export class FeatureRegistry {
    constructor(config) {
        this.config = config;
        this.logger = new FeatureLogger();
        this.store = new FeatureStore({
            path: this.config.path,
            type: 'local',
            backupEnabled: this.config.backupEnabled,
            backupInterval: this.config.backupInterval,
        });
        this.registry = new Map();
        this.initializeRegistry();
    }
    async initializeRegistry() {
        try {
            const versions = await this.store.listVersions();
            for (const version of versions) {
                const features = await this.store.loadFeatures(version);
                this.registry.set(version, features);
            }
            this.logger.info(`Initialized feature registry with ${versions.length} versions`);
        }
        catch (error) {
            this.logger.error('Failed to initialize feature registry', error);
            throw error;
        }
    }
    async registerFeatures(features, version) {
        try {
            // Validate features
            if (!this.validateFeatures(features)) {
                throw new Error('Invalid features');
            }
            // Save features to store
            await this.store.saveFeatures(features, version);
            // Update registry
            this.registry.set(version, features);
            // Update metadata
            features.metadata.lastUpdated = new Date().toISOString();
            this.logger.info(`Registered features version ${version}`);
        }
        catch (error) {
            this.logger.error('Failed to register features', error);
            throw error;
        }
    }
    async getFeatures(version) {
        try {
            // Check registry first
            const features = this.registry.get(version);
            if (features) {
                return features;
            }
            // Load from store if not in registry
            const loadedFeatures = await this.store.loadFeatures(version);
            this.registry.set(version, loadedFeatures);
            return loadedFeatures;
        }
        catch (error) {
            this.logger.error('Failed to get features', error);
            throw error;
        }
    }
    async listVersions() {
        try {
            return Array.from(this.registry.keys());
        }
        catch (error) {
            this.logger.error('Failed to list versions', error);
            throw error;
        }
    }
    async getVersionInfo(version) {
        try {
            return await this.store.getVersionInfo(version);
        }
        catch (error) {
            this.logger.error('Failed to get version info', error);
            throw error;
        }
    }
    async deleteVersion(version) {
        try {
            // Delete from store
            await this.store.deleteVersion(version);
            // Remove from registry
            this.registry.delete(version);
            this.logger.info(`Deleted features version ${version}`);
        }
        catch (error) {
            this.logger.error('Failed to delete version', error);
            throw error;
        }
    }
    async cleanupOldVersions(maxVersions) {
        try {
            await this.store.cleanupOldVersions(maxVersions);
            await this.initializeRegistry(); // Reload registry after cleanup
        }
        catch (error) {
            this.logger.error('Failed to cleanup old versions', error);
            throw error;
        }
    }
    validateFeatures(features) {
        try {
            // Check required fields
            if (!features.numerical ||
                !features.categorical ||
                !features.temporal ||
                !features.derived ||
                !features.metadata) {
                return false;
            }
            // Check metadata
            const metadata = features.metadata;
            if (!metadata.featureNames ||
                !metadata.featureTypes ||
                !metadata.scalingParams ||
                !metadata.encodingMaps) {
                return false;
            }
            // Check feature types
            for (const [feature, type] of Object.entries(metadata.featureTypes)) {
                if (!['numerical', 'categorical', 'temporal', 'derived'].includes(type)) {
                    return false;
                }
            }
            // Check scaling parameters
            for (const [feature, params] of Object.entries(metadata.scalingParams)) {
                if (typeof params.mean !== 'number' || typeof params.std !== 'number' || params.std <= 0) {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            this.logger.error('Failed to validate features', error);
            return false;
        }
    }
    async getFeatureStats(version) {
        try {
            const features = await this.getFeatures(version);
            const stats = {
                numerical: this.calculateNumericalStats(features.numerical),
                categorical: this.calculateCategoricalStats(features.categorical),
                temporal: this.calculateTemporalStats(features.temporal),
                derived: this.calculateDerivedStats(features.derived),
            };
            return stats;
        }
        catch (error) {
            this.logger.error('Failed to get feature stats', error);
            throw error;
        }
    }
    calculateNumericalStats(features) {
        const stats = {};
        for (const [feature, values] of Object.entries(features)) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            const min = Math.min(...values);
            const max = Math.max(...values);
            stats[feature] = {
                mean,
                std,
                min,
                max,
                count: values.length,
                missing: values.filter(v => v === null || v === undefined || isNaN(v)).length,
            };
        }
        return stats;
    }
    calculateCategoricalStats(features) {
        const stats = {};
        for (const [feature, values] of Object.entries(features)) {
            const uniqueValues = new Set(values);
            const valueCounts = values.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            stats[feature] = {
                uniqueCount: uniqueValues.size,
                valueCounts,
                count: values.length,
                missing: values.filter(v => v === null || v === undefined || v === '').length,
            };
        }
        return stats;
    }
    calculateTemporalStats(features) {
        const stats = {};
        for (const [feature, values] of Object.entries(features)) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            // Calculate trend
            const x = Array.from({ length: values.length }, (_, i) => i);
            const slope = this.calculateLinearRegressionSlope(x, values);
            // Calculate seasonality
            const seasonality = this.calculateSeasonality(values);
            stats[feature] = {
                mean,
                std,
                trend: {
                    slope,
                    direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
                },
                seasonality,
                count: values.length,
                missing: values.filter(v => v === null || v === undefined || isNaN(v)).length,
            };
        }
        return stats;
    }
    calculateDerivedStats(features) {
        const stats = {};
        for (const [feature, values] of Object.entries(features)) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            stats[feature] = {
                mean,
                std,
                count: values.length,
                missing: values.filter(v => v === null || v === undefined || isNaN(v)).length,
            };
        }
        return stats;
    }
    calculateLinearRegressionSlope(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
    calculateSeasonality(values) {
        const maxLag = Math.min(50, Math.floor(values.length / 2));
        let bestPeriod = 1;
        let maxAutocorr = -1;
        for (let lag = 1; lag <= maxLag; lag++) {
            const autocorr = this.calculateAutocorrelation(values, lag);
            if (autocorr > maxAutocorr) {
                maxAutocorr = autocorr;
                bestPeriod = lag;
            }
        }
        return {
            hasSeasonality: maxAutocorr > 0.5,
            period: bestPeriod,
            strength: maxAutocorr,
        };
    }
    calculateAutocorrelation(values, lag) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < values.length - lag; i++) {
            numerator += (values[i] - mean) * (values[i + lag] - mean);
            denominator += Math.pow(values[i] - mean, 2);
        }
        return numerator / denominator;
    }
}
