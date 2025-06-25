import { EventBus } from './EventBus.js';
import { ErrorHandler } from './ErrorHandler.js';
export class PerformanceMonitor {
    constructor() {
        this.RETENTION_PERIOD = 86400000; // 24 hours in milliseconds
        this.MAX_METRICS_PER_TYPE = 1000;
        this.eventBus = EventBus.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
        this.traces = new Map();
        this.metrics = new Map();
        this.errors = [];
        this.initializeCleanupInterval();
    }
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    initializeCleanupInterval() {
        setInterval(() => {
            this.cleanupOldData();
        }, this.RETENTION_PERIOD / 24); // Run cleanup every hour
    }
    startTrace(name, metadata = {}) {
        const trace = {
            id: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            startTime: Date.now(),
            metadata,
            events: [],
        };
        this.traces.set(trace.id, trace);
        return trace;
    }
    endTrace(trace, error) {
        if (!trace || !this.traces.has(trace.id)) {
            return;
        }
        const endTime = Date.now();
        const duration = endTime - trace.startTime;
        const updatedTrace = {
            ...trace,
            endTime,
            duration,
            error,
        };
        this.traces.set(trace.id, updatedTrace);
        // Emit trace completion event
        this.eventBus.emit('error', new Error(`Trace completed: ${trace.name} (${duration}ms)`));
        // Record trace duration metric
        this.recordMetric('trace_duration', duration, {
            name: trace.name,
            status: error ? 'error' : 'success',
        });
    }
    addTraceEvent(trace, name, metadata = {}) {
        if (!trace || !this.traces.has(trace.id)) {
            return;
        }
        const event = {
            name,
            timestamp: Date.now(),
            metadata,
        };
        const updatedTrace = this.traces.get(trace.id);
        updatedTrace.events.push(event);
        this.traces.set(trace.id, updatedTrace);
    }
    recordMetric(name, value, tags = {}) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            tags,
        };
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        const metrics = this.metrics.get(name);
        metrics.push(metric);
        // Keep only the most recent metrics
        if (metrics.length > this.MAX_METRICS_PER_TYPE) {
            metrics.splice(0, metrics.length - this.MAX_METRICS_PER_TYPE);
        }
        this.eventBus.emit('metric:tracked', { type: name, data: metric });
    }
    recordError(error, context = {}, trace) {
        const errorReport = {
            id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            error,
            context,
            timestamp: Date.now(),
            trace,
        };
        this.errors.push(errorReport);
        this.eventBus.emit('error', error);
        // Record error metric
        this.recordMetric('error_count', 1, {
            type: error.name,
            message: error.message,
        });
    }
    getTrace(traceId) {
        return this.traces.get(traceId);
    }
    getMetrics(type) {
        if (type) {
            return this.metrics.get(type) || [];
        }
        return Array.from(this.metrics.values()).flat();
    }
    getErrors(startTime, endTime, errorType) {
        let filteredErrors = this.errors;
        if (startTime) {
            filteredErrors = filteredErrors.filter(e => e.timestamp >= startTime);
        }
        if (endTime) {
            filteredErrors = filteredErrors.filter(e => e.timestamp <= endTime);
        }
        if (errorType) {
            filteredErrors = filteredErrors.filter(e => e.error.name === errorType);
        }
        return filteredErrors;
    }
    getActiveTraces() {
        return Array.from(this.traces.values()).filter(trace => !trace.endTime);
    }
    getCompletedTraces(startTime, endTime, name) {
        let filteredTraces = Array.from(this.traces.values()).filter(trace => trace.endTime);
        if (startTime) {
            filteredTraces = filteredTraces.filter(t => t.startTime >= startTime);
        }
        if (endTime) {
            filteredTraces = filteredTraces.filter(t => t.endTime <= endTime);
        }
        if (name) {
            filteredTraces = filteredTraces.filter(t => t.name === name);
        }
        return filteredTraces;
    }
    calculateMetricStatistics(name) {
        const metrics = this.getMetrics(name);
        const values = metrics
            .map(m => (typeof m.value === 'number' ? m.value : undefined))
            .filter((v) => typeof v === 'number');
        if (values.length === 0) {
            return {
                min: 0,
                max: 0,
                avg: 0,
                count: 0,
                p95: 0,
                p99: 0,
            };
        }
        values.sort((a, b) => a - b);
        const p95Index = Math.floor(values.length * 0.95);
        const p99Index = Math.floor(values.length * 0.99);
        return {
            min: values[0],
            max: values[values.length - 1],
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            count: values.length,
            p95: values[p95Index],
            p99: values[p99Index],
        };
    }
    calculateErrorRate(startTime, endTime) {
        const errors = this.getErrors(startTime, endTime);
        const totalTime = (endTime || Date.now()) - (startTime || Date.now() - 3600000);
        const errorsByType = {};
        errors.forEach(error => {
            const type = error.error.name;
            errorsByType[type] = (errorsByType[type] || 0) + 1;
        });
        return {
            total: errors.length,
            rate: errors.length / (totalTime / 1000), // errors per second
            byType: errorsByType,
        };
    }
    trackMetric(type, data) {
        try {
            if (!this.metrics.has(type)) {
                this.metrics.set(type, []);
            }
            const metrics = this.metrics.get(type);
            metrics.push({
                ...data,
                timestamp: Date.now(),
            });
            // Keep only the most recent metrics
            if (metrics.length > this.MAX_METRICS_PER_TYPE) {
                metrics.splice(0, metrics.length - this.MAX_METRICS_PER_TYPE);
            }
            this.eventBus.emit('metric:tracked', { type, data });
        }
        catch (error) {
            this.errorHandler.handleError(error, 'PerformanceMonitor', 'medium');
        }
    }
    clearMetrics(type) {
        if (type) {
            this.metrics.delete(type);
        }
        else {
            this.metrics.clear();
        }
    }
    getMetricSummary(type) {
        const metrics = this.metrics.get(type) || [];
        if (metrics.length === 0) {
            return {};
        }
        const numericValues = metrics
            .map(m => (typeof m.value === 'number' ? m.value : undefined))
            .filter((v) => typeof v === 'number');
        return {
            count: metrics.length,
            min: numericValues.length > 0 ? Math.min(...numericValues) : 0,
            max: numericValues.length > 0 ? Math.max(...numericValues) : 0,
            avg: numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : 0,
            lastValue: metrics[metrics.length - 1],
        };
    }
    cleanupOldData() {
        const cutoffTime = Date.now() - this.RETENTION_PERIOD;
        // Clean up old traces
        for (const [id, trace] of this.traces) {
            if (trace.endTime && trace.endTime < cutoffTime) {
                this.traces.delete(id);
            }
        }
        // Clean up old metrics
        this.metrics = new Map(Array.from(this.metrics.entries()).filter(([, metrics]) => {
            return metrics.every(m => typeof m.timestamp === 'number' && m.timestamp >= cutoffTime);
        }));
        // Clean up old errors
        this.errors = this.errors.filter(e => e.timestamp >= cutoffTime);
    }
}
