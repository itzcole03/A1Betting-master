/**
 * UnifiedMonitor
 *
 * Provides a unified interface for application monitoring, encompassing error reporting,
 * performance tracing, and custom metric collection. It acts as an abstraction layer
 * over Sentry and the performanceTrackingService.
 *
 * Key Responsibilities:
 * 1. Centralize error reporting to Sentry, adding relevant context.
 * 2. Simplify starting and stopping performance traces.
 * 3. Offer a straightforward way to add spans to ongoing traces.
 * 4. Facilitate the recording of custom application metrics.
 * 5. Manage user context for error and performance reports.
 */
export interface Metric {
    name: string;
    value: number;
    tags?: Record<string, string | number | boolean>;
    timestamp?: Date;
}
export declare class UnifiedMonitor {
    private static instance;
    static getInstance(): UnifiedMonitor;
    startTrace(name: string, type: string): {
        name: string;
        type: string;
        startTime: number;
        setHttpStatus: (status: number) => void;
    };
    endTrace(trace: any): void;
    reportError(error: any, context: any): void;
}
export declare const unifiedMonitor: UnifiedMonitor;
