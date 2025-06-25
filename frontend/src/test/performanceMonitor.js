// Performance monitoring utility for Jest/RTL
export async function measurePerformance(fn, label) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    // Log or report
    console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    if (duration > 2000) {
        throw new Error(`[PERF] ${label} exceeded 2s: ${duration.toFixed(2)}ms`);
    }
}
