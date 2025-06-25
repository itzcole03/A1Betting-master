/**
 * Advanced ensemble model that combines multiple specialized models for improved predictions.
 */
import { BaseModel } from './BaseModel';
import { UnifiedLogger } from '@/core/UnifiedLogger';
import { UnifiedErrorHandler } from '../../core/UnifiedErrorHandler';
import { MarketIntelligenceModel } from './MarketIntelligenceModel';
export class AdvancedEnsembleModel extends BaseModel {
    constructor(config) {
        super(config);
        this.models = new Map();
        this.weights = new Map();
        this.logger = UnifiedLogger.getInstance();
        this.errorHandler = UnifiedErrorHandler.getInstance();
        this.initializeModels(config);
    }
    initializeModels(config) {
        try {
            config.models.forEach(modelConfig => {
                const model = this.createModel(modelConfig);
                this.models.set(modelConfig.name, model);
                this.weights.set(modelConfig.name, modelConfig.weight);
            });
            this.logger.info(`Initialized ensemble model with ${this.models.size} models`);
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.initializeModels', {
                config,
            });
            throw error;
        }
    }
    createModel(config) {
        // For now, we'll use MarketIntelligenceModel as a concrete implementation
        // In a real implementation, this would create different model types based on config.type
        return new MarketIntelligenceModel(config);
    }
    async predict(data) {
        try {
            const predictions = [];
            for (const [modelName, model] of this.models) {
                const prediction = await model.predict(data);
                predictions.push({
                    model: modelName,
                    prediction: prediction.output,
                    confidence: prediction.confidence || 1.0,
                });
            }
            const weightedPrediction = this.combinePredictions(predictions);
            return this.createPrediction(weightedPrediction, this.calculateConfidence(predictions));
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.predict', { data });
            throw error;
        }
    }
    combinePredictions(predictions) {
        const totalWeight = predictions.reduce((sum, pred) => sum + (this.weights.get(pred.model) || 0), 0);
        return predictions.reduce((sum, pred) => {
            const weight = (this.weights.get(pred.model) || 0) / totalWeight;
            return sum + pred.prediction * weight;
        }, 0);
    }
    calculateConfidence(predictions) {
        const totalWeight = predictions.reduce((sum, pred) => sum + (this.weights.get(pred.model) || 0), 0);
        return predictions.reduce((sum, pred) => {
            const weight = (this.weights.get(pred.model) || 0) / totalWeight;
            return sum + pred.confidence * weight;
        }, 0);
    }
    async train(data) {
        try {
            for (const [modelName, model] of this.models) {
                await model.train(data);
                this.logger.info(`Trained model: ${modelName}`);
            }
            this.isTrained = true;
            this.lastUpdate = new Date().toISOString();
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.train', { data });
            throw error;
        }
    }
    async evaluate(data) {
        try {
            const metrics = {};
            let totalWeight = 0;
            for (const [modelName, model] of this.models) {
                const modelMetrics = await model.evaluate(data);
                const weight = this.weights.get(modelName) || 0;
                totalWeight += weight;
                // Combine metrics with weights
                Object.entries(modelMetrics).forEach(([key, value]) => {
                    if (value !== undefined) {
                        metrics[key] =
                            (metrics[key] || 0) + value * weight;
                    }
                });
            }
            // Normalize metrics by total weight
            Object.keys(metrics).forEach(key => {
                if (metrics[key] !== undefined) {
                    metrics[key] =
                        metrics[key] / totalWeight;
                }
            });
            return metrics;
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.evaluate', { data });
            throw error;
        }
    }
    async save(path) {
        try {
            for (const [modelName, model] of this.models) {
                await model.save(`${path}/${modelName}`);
            }
            this.logger.info(`Saved ensemble model to: ${path}`);
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.save', { path });
            throw error;
        }
    }
    async load(path) {
        try {
            for (const [modelName, model] of this.models) {
                await model.load(`${path}/${modelName}`);
            }
            this.logger.info(`Loaded ensemble model from: ${path}`);
        }
        catch (error) {
            this.errorHandler.handleError(error, 'AdvancedEnsembleModel.load', { path });
            throw error;
        }
    }
}
