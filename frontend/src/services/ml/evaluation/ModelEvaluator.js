import * as tf from '@tensorflow/tfjs';
import * as shap from 'shap';
import { KellyCriterion } from '../strategies/KellyCriterion';
import { BestBetSelector } from '../strategies/BestBetSelector';
import { UnifiedLogger } from '@/core/UnifiedLogger';
import { UnifiedMonitor } from '../../core/UnifiedMonitor';
export class ModelEvaluator {
    constructor() {
        this.logger = UnifiedLogger.getInstance();
        this.monitor = UnifiedMonitor.getInstance();
        this.kellyCriterion = new KellyCriterion();
        this.bestBetSelector = new BestBetSelector();
    }
    static getInstance() {
        if (!ModelEvaluator.instance) {
            ModelEvaluator.instance = new ModelEvaluator();
        }
        return ModelEvaluator.instance;
    }
    async evaluateModel(model, testData, testLabels, metadata) {
        try {
            this.logger.info('Starting model evaluation');
            this.monitor.startTimer('model_evaluation');
            // Basic metrics
            const predictions = model.predict(testData);
            const metrics = await this.calculateBasicMetrics(predictions, testLabels);
            // SHAP analysis
            const shapValues = await this.performShapAnalysis(model, testData);
            metrics.shapValues = shapValues;
            // Feature importance
            metrics.featureImportance = await this.calculateFeatureImportance(model, testData);
            // Prediction confidence analysis
            metrics.predictionConfidence = await this.analyzePredictionConfidence(predictions);
            // Performance metrics
            metrics.performanceMetrics = await this.measurePerformance(model, testData);
            // Drift detection
            metrics.driftMetrics = await this.detectDrift(model, testData);
            // Kelly Criterion analysis
            const kellyMetrics = await this.kellyCriterion.analyze(predictions, testLabels);
            metrics.customMetrics = {
                ...metrics.customMetrics,
                kellyFraction: kellyMetrics.fraction,
                expectedValue: kellyMetrics.expectedValue,
            };
            // Best bet selection
            const bestBets = await this.bestBetSelector.selectBets(predictions, testLabels);
            metrics.customMetrics = {
                ...metrics.customMetrics,
                bestBetAccuracy: bestBets.accuracy,
                bestBetROI: bestBets.roi,
            };
            this.monitor.endTimer('model_evaluation');
            this.logger.info('Model evaluation completed successfully');
            return metrics;
        }
        catch (error) {
            this.logger.error('Model evaluation failed', error);
            throw error;
        }
    }
    async calculateBasicMetrics(predictions, labels) {
        const predArray = await predictions.array();
        const labelArray = await labels.array();
        const confusionMatrix = this.calculateConfusionMatrix(predArray, labelArray);
        const accuracy = this.calculateAccuracy(confusionMatrix);
        const precision = this.calculatePrecision(confusionMatrix);
        const recall = this.calculateRecall(confusionMatrix);
        const f1Score = this.calculateF1Score(precision, recall);
        const auc = await this.calculateAUC(predArray, labelArray);
        return {
            accuracy,
            precision,
            recall,
            f1Score,
            auc,
            confusionMatrix,
        };
    }
    async performShapAnalysis(model, data) {
        const explainer = new shap.DeepExplainer(model);
        const shapValues = await explainer.explain(data);
        return this.processShapValues(shapValues);
    }
    async calculateFeatureImportance(model, data) {
        const importance = {};
        const features = model.inputs[0].shape[1];
        for (let i = 0; i < features; i++) {
            const perturbedData = this.perturbFeature(data, i);
            const originalPred = model.predict(data);
            const perturbedPred = model.predict(perturbedData);
            const importanceScore = tf.mean(tf.abs(tf.sub(originalPred, perturbedPred))).arraySync();
            importance[`feature_${i}`] = importanceScore;
        }
        return importance;
    }
    async analyzePredictionConfidence(predictions) {
        const predArray = await predictions.array();
        const confidences = predArray.map(p => Math.max(...p));
        return {
            mean: this.calculateMean(confidences),
            std: this.calculateStd(confidences),
            distribution: this.calculateDistribution(confidences),
        };
    }
    async measurePerformance(model, data) {
        const startTime = performance.now();
        const batchSize = 32;
        const numBatches = Math.ceil(data.shape[0] / batchSize);
        let totalTime = 0;
        for (let i = 0; i < numBatches; i++) {
            const batchStart = performance.now();
            const batch = data.slice([i * batchSize, 0], [batchSize, data.shape[1]]);
            await model.predict(batch);
            totalTime += performance.now() - batchStart;
        }
        const avgInferenceTime = totalTime / data.shape[0];
        const throughput = 1000 / avgInferenceTime;
        return {
            inferenceTime: avgInferenceTime,
            throughput,
            latency: avgInferenceTime,
            memoryUsage: tf.memory().numTensors,
        };
    }
    async detectDrift(model, data) {
        const predictions = model.predict(data);
        const predArray = await predictions.array();
        return {
            featureDrift: await this.calculateFeatureDrift(data),
            predictionDrift: this.calculatePredictionDrift(predArray),
            dataQuality: await this.assessDataQuality(data),
        };
    }
    // Helper methods
    calculateConfusionMatrix(predictions, labels) {
        let tp = 0, tn = 0, fp = 0, fn = 0;
        for (let i = 0; i < predictions.length; i++) {
            const pred = predictions[i].indexOf(Math.max(...predictions[i]));
            const label = labels[i].indexOf(Math.max(...labels[i]));
            if (pred === 1 && label === 1)
                tp++;
            else if (pred === 0 && label === 0)
                tn++;
            else if (pred === 1 && label === 0)
                fp++;
            else if (pred === 0 && label === 1)
                fn++;
        }
        return { truePositives: tp, trueNegatives: tn, falsePositives: fp, falseNegatives: fn };
    }
    calculateAccuracy(matrix) {
        const total = matrix.truePositives + matrix.trueNegatives + matrix.falsePositives + matrix.falseNegatives;
        return (matrix.truePositives + matrix.trueNegatives) / total;
    }
    calculatePrecision(matrix) {
        return matrix.truePositives / (matrix.truePositives + matrix.falsePositives);
    }
    calculateRecall(matrix) {
        return matrix.truePositives / (matrix.truePositives + matrix.falseNegatives);
    }
    calculateF1Score(precision, recall) {
        return (2 * (precision * recall)) / (precision + recall);
    }
    async calculateAUC(predictions, labels) {
        // Implement AUC calculation using trapezoidal rule
        return 0.85; // Placeholder
    }
    processShapValues(shapValues) {
        // Process and format SHAP values
        return {};
    }
    perturbFeature(data, featureIndex) {
        const perturbed = data.clone();
        const noise = tf.randomNormal([data.shape[0], 1]);
        return tf.tensor2d(perturbed.arraySync().map((row, i) => {
            row[featureIndex] += noise.arraySync()[i][0];
            return row;
        }));
    }
    calculateMean(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    calculateStd(values) {
        const mean = this.calculateMean(values);
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        return Math.sqrt(this.calculateMean(squareDiffs));
    }
    calculateDistribution(values) {
        const bins = 10;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binSize = (max - min) / bins;
        return Array(bins)
            .fill(0)
            .map((_, i) => {
            const binStart = min + i * binSize;
            const binEnd = binStart + binSize;
            return values.filter(v => v >= binStart && v < binEnd).length;
        });
    }
    async calculateFeatureDrift(data) {
        // Implement feature drift detection
        return {};
    }
    calculatePredictionDrift(predictions) {
        // Implement prediction drift detection
        return 0;
    }
    async assessDataQuality(data) {
        // Implement data quality assessment
        return {};
    }
}
