/**
 * Utility functions for custom performance and metric tracking using Sentry.
 * Provides tracing, custom metrics, and tagging for frontend observability.
 */
/**
 * Utility functions for custom performance and metric tracking using Sentry.
 * Provides tracing, custom metrics, and tagging for frontend observability.
 */
import * as Sentry from "@sentry/react";
/**
 * PerformanceTrackingService
 *
 * Provides utility functions to instrument custom performance monitoring
 * using Sentry. This allows for detailed tracing of application-specific
 * operations and collection of custom metrics.
 */
declare class PerformanceTrackingService {
    /**
     * Tracks currently active spans by name.
     * Used to manage and finish spans that are started via startTrace.
     */
    private activeSpans;
    /**
     * Starts a new Sentry transaction/span for a specific operation.
     * In Sentry v7+, transactions are used for top-level traces.
     *
     * The created span is stored in the `activeSpans` map by its `name`.
     * If a span with the same name already exists, it will be overwritten.
     *
     * @param name A descriptive name for the span (e.g., 'user_login_flow', 'load_dashboard_data').
     * @param op An operation name, often a category (e.g., 'ui.load', 'api.request', 'function').
     * @param description Optional longer description for the span.
     */
    startTrace(name: string, op: string, description?: string): Sentry.Span | undefined;
    /**
     * Adds a child span to an active Sentry span.
     * Spans can be nested to measure individual operations.
     * @param parentSpan The parent Sentry Span object.
     * @param op The operation name for the child span.
     * @param description Optional description for the span.
     * @param data Optional data to attach as span attributes (key-value pairs for additional context).
     * @returns The Sentry Span object, or undefined if the parent span is invalid.
     */
    addSpanToTrace(parentSpan: Sentry.Span | undefined, op: string, description?: string, data?: Record<string, unknown>): Sentry.Span | undefined;
    /**
     * Ends a Sentry span and removes it from the activeSpans map if present.
     * @param span The Sentry Span object to finish.
     */
    endTrace(span: Sentry.Span | undefined): void;
    /**
     * Ends a Sentry span (alias for endTrace, for semantic clarity).
     * @param span The Sentry Span object to finish.
     */
    endSpan(span: Sentry.Span | undefined): void;
    /**
     * Records a custom metric using Sentry's custom measurement API.
     * @param params.name The metric name.
     * @param params.value The value of the metric.
     * @param params.unit The unit of the metric (e.g., 'millisecond', 'byte').
     * @param params.tags Optional tags to attach to the metric.
     * @param params.type The type of metric (e.g., 'increment', 'distribution', 'gauge', 'set').
     */
    recordMetric({ name, value, unit, tags, type }: {
        name: string;
        value: number;
        unit?: string;
        tags?: {
            [key: string]: string | number | boolean;
        };
        type?: 'increment' | 'distribution' | 'gauge' | 'set';
    }): void;
    /**
     * Sets a tag on the current Sentry scope.
     * @param key The tag key.
     * @param value The tag value.
     */
    setTag(key: string, value: string | number | boolean): void;
    /**
     * Sets extra context data on the current Sentry scope.
     * @param key The context key.
     * @param data The context data.
     */
    setExtra(key: string, data: unknown): void;
}
/**
 * Singleton instance of PerformanceTrackingService.
 * Use this for all custom performance and metric tracking in the frontend.
 */
export declare const performanceTrackingService: PerformanceTrackingService;
export {};
/**
 * Example Usage (conceptual):
 *     // ... await Promise.all([...]) ...
 *     performanceTrackingService.recordMetric({ name: 'dashboard.data.items_loaded', value: 100 });
 *   } catch (e) {
 *     Sentry.captureException(e); // Capture error if something goes wrong
 *   } finally {
 *     if(fetchDataSpan) performanceTrackingService.endSpan(fetchDataSpan);
 *     if(trace) performanceTrackingService.endTrace(trace);
 *   }
 * }
 */
