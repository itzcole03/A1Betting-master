import { EventEmitter } from 'events';
export class ModelTrainer extends EventEmitter {
    constructor() {
        super();
        this.trainingQueue = new Map();
        this.validationData = new Map();
    }
    static getInstance() {
        if (!ModelTrainer.instance) {
            ModelTrainer.instance = new ModelTrainer();
        }
        return ModelTrainer.instance;
    }
    async train(model, config) {
        const modelId = model.config.name;
        if (this.trainingQueue.has(modelId)) {
            throw new Error(`Model ${modelId} is already training`);
        }
        try {
            // Preprocess data
            const processedData = await this.preprocessData(config.data);
            // Split validation data if needed
            if (config.validationSplit) {
                const { trainData, validationData } = this.splitData(processedData, config.validationSplit);
                this.validationData.set(modelId, validationData);
                config.data = trainData;
            }
            // Start training
            const trainingPromise = this.executeTraining(model, config);
            this.trainingQueue.set(modelId, trainingPromise);
            await trainingPromise;
            // Post-training steps
            await this.postTraining(model);
        }
        catch (error) {
            this.emit('trainingError', { modelId, error });
            throw error;
        }
        finally {
            this.trainingQueue.delete(modelId);
            this.validationData.delete(modelId);
        }
    }
    async executeTraining(model, config) {
        const modelId = model.config.name;
        const epochs = config.epochs || model.config.trainingConfig.epochs || 100;
        const batchSize = config.batchSize || model.config.trainingConfig.batchSize || 32;
        for (let epoch = 0; epoch < epochs; epoch++) {
            const startTime = Date.now();
            // Train on batch
            await model.train({
                ...config,
                batchSize,
                epochs: 1,
            });
            // Calculate metrics
            const metrics = await this.calculateMetrics(model, config.data);
            // Validate if validation data exists
            let validationMetrics;
            if (this.validationData.has(modelId)) {
                validationMetrics = await this.calculateMetrics(model, this.validationData.get(modelId));
            }
            // Emit progress
            this.emit('trainingProgress', {
                modelId,
                progress: {
                    epoch: epoch + 1,
                    totalEpochs: epochs,
                    metrics,
                    validationMetrics,
                },
            });
            // Check early stopping
            if (this.shouldStopEarly(model, validationMetrics)) {
                this.emit('earlyStopping', { modelId, epoch });
                break;
            }
            // Throttle training if needed
            const trainingTime = Date.now() - startTime;
            if (trainingTime < 100) {
                // Minimum 100ms between epochs
                await new Promise(resolve => setTimeout(resolve, 100 - trainingTime));
            }
        }
    }
    async preprocessData(data) {
        // Implement common preprocessing steps
        return data;
    }
    splitData(data, validationSplit) {
        // Implement data splitting logic
        const splitIndex = Math.floor(data.length * (1 - validationSplit));
        return {
            trainData: data.slice(0, splitIndex),
            validationData: data.slice(splitIndex),
        };
    }
    async calculateMetrics(model, data) {
        return model.evaluate(data);
    }
    shouldStopEarly(model, validationMetrics) {
        if (!model.config.trainingConfig.earlyStopping || !validationMetrics) {
            return false;
        }
        // Implement early stopping logic based on validation metrics
        return false;
    }
    async postTraining(model) {
        // Implement post-training steps like model calibration
        this.emit('trainingComplete', { modelId: model.config.name });
    }
    isTraining(modelId) {
        return this.trainingQueue.has(modelId);
    }
    async cancelTraining(modelId) {
        const trainingPromise = this.trainingQueue.get(modelId);
        if (trainingPromise) {
            // Implement cancellation logic
            this.trainingQueue.delete(modelId);
            this.emit('trainingCancelled', { modelId });
        }
    }
}
