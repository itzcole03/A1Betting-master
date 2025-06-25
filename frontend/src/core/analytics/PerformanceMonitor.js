export class PerformanceMonitor {
    constructor(logger, metrics, customThresholds = []) {
        this.logger = logger;
        this.metrics = metrics;
        this.customThresholds = customThresholds;
        this.alerts = [];
        this.maxAlerts = 1000;
        this.defaultThresholds = [
            { metric: 'roi', threshold: -0.1, condition: 'below', severity: 'warning' },
            { metric: 'roi', threshold: -0.2, condition: 'below', severity: 'critical' },
            { metric: 'winRate', threshold: 0.4, condition: 'below', severity: 'warning' },
            { metric: 'winRate', threshold: 0.3, condition: 'below', severity: 'critical' },
            { metric: 'maxDrawdown', threshold: 0.2, condition: 'above', severity: 'warning' },
            { metric: 'maxDrawdown', threshold: 0.3, condition: 'above', severity: 'critical' },
            { metric: 'calibrationScore', threshold: 0.6, condition: 'below', severity: 'warning' },
            { metric: 'calibrationScore', threshold: 0.5, condition: 'below', severity: 'critical' },
        ];
    }
    static getInstance(logger, metrics, customThresholds = []) {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor(logger, metrics, customThresholds);
        }
        return PerformanceMonitor.instance;
    }
    monitorPerformance(modelName, metrics) {
        const thresholds = [...this.defaultThresholds, ...this.customThresholds];
        thresholds.forEach(threshold => {
            const value = metrics[threshold.metric];
            const shouldAlert = this.checkThreshold(value, threshold);
            if (shouldAlert) {
                this.createAlert(modelName, threshold, value);
            }
        });
        // Track metrics
        this.trackMetrics(modelName, metrics);
    }
    getAlerts(modelName, severity, startTime) {
        let filtered = this.alerts;
        if (modelName) {
            filtered = filtered.filter(alert => alert.modelName === modelName);
        }
        if (severity) {
            filtered = filtered.filter(alert => alert.severity === severity);
        }
        if (startTime) {
            filtered = filtered.filter(alert => alert.timestamp >= startTime);
        }
        return filtered;
    }
    clearAlerts(modelName) {
        if (modelName) {
            this.alerts = this.alerts.filter(alert => alert.modelName !== modelName);
        }
        else {
            this.alerts = [];
        }
    }
    checkThreshold(value, threshold) {
        if (threshold.condition === 'above') {
            return value > threshold.threshold;
        }
        return value < threshold.threshold;
    }
    createAlert(modelName, threshold, value) {
        const alert = {
            modelName,
            metric: threshold.metric,
            value,
            threshold: threshold.threshold,
            severity: threshold.severity,
            timestamp: new Date(),
        };
        this.alerts.unshift(alert);
        if (this.alerts.length > this.maxAlerts) {
            this.alerts.pop();
        }
        // Log alert
        this.logger.warn('Performance alert triggered', {
            modelName,
            metric: threshold.metric,
            value,
            threshold: threshold.threshold,
            severity: threshold.severity,
        });
        // Track alert metric
        this.metrics.increment(`model.${modelName}.alerts.${threshold.severity}`);
    }
    trackMetrics(modelName, metrics) {
        // Track performance metrics
        Object.entries(metrics).forEach(([key, value]) => {
            if (typeof value === 'number') {
                this.metrics.gauge(`model.${modelName}.${key}`, value);
            }
        });
    }
}
