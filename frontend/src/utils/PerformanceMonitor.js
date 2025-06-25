// Performance monitoring utility for Jest/RTL
export class PerformanceMonitor {
    constructor() { }
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    startTrace(label) {
        // In a real app, you would generate a trace ID and start timing
        return `${label}-${Date.now()}`;
    }
    endTrace(traceId, error) {
        // In a real app, you would end timing and log/report
        if (error) {
            // Optionally log error
        }
    }
}
export async function measurePerformance(fn, label) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    // Log or report
    if (duration > 2000) {
        throw new Error(`[PERF] ${label} exceeded 2s: ${duration.toFixed(2)}ms`);
    }
}
