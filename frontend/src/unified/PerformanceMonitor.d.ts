import { PerformanceMetrics, ComponentMetrics } from '../types/core.js';
interface MetricData {
    value: number;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
export declare class PerformanceMonitor {
    /**
     * Start a new performance trace (using browser Performance API)
     */
    startTrace(name: string, metadata?: Record<string, unknown>): string;
    /**
     * Start a new span within a trace
     */
    startSpan(traceId: string, name: string, metadata?: Record<string, unknown>): string;
    /**
     * End a span and log duration
     */
    endSpan(spanId: string, error?: Error): void;
    /**
     * End a trace and log duration
     */
    endTrace(traceId: string, error?: Error): void;
    private static instance;
    private readonly errorHandler;
    private metrics;
    private readonly maxMetricsPerType;
    private componentMetrics;
    private readonly maxHistorySize;
    private history;
    private constructor();
    static getInstance(): PerformanceMonitor;
    trackMetric(name: string, value: number, metadata?: Record<string, unknown>): void;
    getMetrics(name: string): MetricData[];
    getAverageMetric(name: string, timeWindow?: number): number;
    clearMetrics(name?: string): void;
    private initializeMetrics;
    startMonitoring(): void;
    private collectMetrics;
    private gatherMetrics;
    private updateMetrics;
    private addToHistory;
    updateComponentMetrics(componentId: string, metrics: Partial<ComponentMetrics>): void;
    getComponentMetrics(componentId: string): ComponentMetrics | undefined;
    getHistory(): PerformanceMetrics[];
    getAverageMetrics(minutes?: number): PerformanceMetrics;
    private average;
    clearHistory(): void;
}
export {};
