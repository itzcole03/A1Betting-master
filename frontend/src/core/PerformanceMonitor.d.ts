interface Trace {
    id: string;
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata: Record<string, unknown>;
    events: TraceEvent[];
    error?: Error;
}
interface TraceEvent {
    name: string;
    timestamp: number;
    metadata: Record<string, unknown>;
}
interface MetricData {
    [key: string]: unknown;
}
interface ErrorReport {
    id: string;
    error: Error;
    context: Record<string, unknown>;
    timestamp: number;
    trace?: Trace;
}
export interface MetricData {
    [key: string]: unknown;
}
export declare class PerformanceMonitor {
    private static instance;
    private readonly eventBus;
    private readonly errorHandler;
    private traces;
    private metrics;
    private errors;
    private readonly RETENTION_PERIOD;
    private readonly MAX_METRICS_PER_TYPE;
    private constructor();
    static getInstance(): PerformanceMonitor;
    private initializeCleanupInterval;
    startTrace(name: string, metadata?: Record<string, unknown>): Trace;
    endTrace(trace: Trace, error?: Error): void;
    addTraceEvent(trace: Trace, name: string, metadata?: Record<string, unknown>): void;
    recordMetric(name: string, value: number, tags?: Record<string, string>): void;
    recordError(error: Error, context?: Record<string, unknown>, trace?: Trace): void;
    getTrace(traceId: string): Trace | undefined;
    getMetrics(type?: string): MetricData[];
    getErrors(startTime?: number, endTime?: number, errorType?: string): ErrorReport[];
    getActiveTraces(): Trace[];
    getCompletedTraces(startTime?: number, endTime?: number, name?: string): Trace[];
    calculateMetricStatistics(name: string): {
        min: number;
        max: number;
        avg: number;
        count: number;
        p95: number;
        p99: number;
    };
    calculateErrorRate(startTime?: number, endTime?: number): {
        total: number;
        rate: number;
        byType: Record<string, number>;
    };
    trackMetric(type: string, data: MetricData): void;
    clearMetrics(type?: string): void;
    getMetricSummary(type: string): MetricData;
    private cleanupOldData;
}
export {};
