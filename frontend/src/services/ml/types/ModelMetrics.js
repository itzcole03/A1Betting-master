export class ModelMetricsManager {
    constructor(metrics) {
        this.metrics = metrics;
    }
    getMetrics() {
        return this.metrics;
    }
    updateMetrics(updates) {
        this.metrics = {
            ...this.metrics,
            ...updates,
        };
    }
    addCustomMetric(name, value) {
        if (!this.metrics.customMetrics) {
            this.metrics.customMetrics = {};
        }
        this.metrics.customMetrics[name] = value;
    }
    removeCustomMetric(name) {
        if (this.metrics.customMetrics) {
            delete this.metrics.customMetrics[name];
        }
    }
    calculateDriftMetrics(newData) {
        // Implement drift detection logic here
        this.metrics.driftMetrics = {
            featureDrift: {},
            predictionDrift: 0,
            dataQuality: {},
        };
    }
    toJSON() {
        return JSON.stringify(this.metrics, null, 2);
    }
    static fromJSON(json) {
        const metrics = JSON.parse(json);
        return new ModelMetricsManager(metrics);
    }
}
