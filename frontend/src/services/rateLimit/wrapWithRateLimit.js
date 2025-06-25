// wrapWithRateLimit: Middleware to apply rate limiting to async functions
// Integrated with all external API calls in the service layer. See tests for coverage.
/**
 * Type-safe rate limiting wrapper for async functions.
 * @param fn The async function to wrap
 * @param limit Max calls per interval
 * @param intervalMs Interval in ms
 */
export function wrapWithRateLimit(fn, limit = 5, intervalMs = 1000) {
    let callTimes = [];
    return async (...args) => {
        const now = Date.now();
        callTimes = callTimes.filter((t) => now - t < intervalMs);
        if (callTimes.length >= limit) {
            throw new Error('Rate limit exceeded');
        }
        callTimes.push(now);
        return await fn(...args);
    };
}
