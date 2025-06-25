import { logger } from './logger';
class PerformanceService {
    constructor() {
        this.metrics = new Map();
        this.MAX_METRICS = 1000;
        this.REPORT_INTERVAL = 60000; // 1 minute
        this.initializePerformanceObserver();
        this.startReporting();
    }
    initializePerformanceObserver() {
        if (typeof PerformanceObserver !== 'undefined') {
            // Observe long tasks
            const longTaskObserver = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    this.recordMetric('longTask', entry.duration);
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            // Observe layout shifts
            const layoutShiftObserver = new PerformanceObserver(list => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        this.recordMetric('layoutShift', entry.value);
                    }
                });
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            // Observe first input delay
            const firstInputObserver = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    this.recordMetric('firstInput', entry.duration);
                });
            });
            firstInputObserver.observe({ entryTypes: ['first-input'] });
        }
    }
    recordMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
        };
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        const metrics = this.metrics.get(name);
        metrics.push(metric);
        // Keep only the last MAX_METRICS entries
        if (metrics.length > this.MAX_METRICS) {
            metrics.shift();
        }
    }
    getMetrics(name) {
        return this.metrics.get(name) || [];
    }
    getAverageMetric(name) {
        const metrics = this.getMetrics(name);
        if (metrics.length === 0)
            return 0;
        const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
        return sum / metrics.length;
    }
    startReporting() {
        setInterval(() => {
            const report = this.generateReport();
            this.sendReport(report);
        }, this.REPORT_INTERVAL);
    }
    generateReport() {
        const metrics = [];
        this.metrics.forEach((metricList, name) => {
            const average = this.getAverageMetric(name);
            metrics.push({
                name,
                value: average,
                timestamp: Date.now(),
            });
        });
        return {
            metrics,
            timestamp: Date.now(),
        };
    }
    sendReport(report) {
        // In production, this would send to your analytics service
        logger.info('Performance Report:', report);
    }
    measureAsync(name, fn) {
        const start = performance.now();
        return fn().finally(() => {
            const duration = performance.now() - start;
            this.recordMetric(name, duration);
        });
    }
    measureSync(name, fn) {
        const start = performance.now();
        try {
            return fn();
        }
        finally {
            const duration = performance.now() - start;
            this.recordMetric(name, duration);
        }
    }
}
export const performanceService = new PerformanceService();
