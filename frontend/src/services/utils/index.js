import { unifiedMonitor } from '../../core/UnifiedMonitor';
// import { APIError, AppError } from '../../core/UnifiedError'; // File does not exist, use UnifiedErrorService if needed
// Error handling utilities
export const handleApiError = (error, context) => {
    const trace = unifiedMonitor.startTrace(`error.${context}`, 'error');
    if (trace) {
        trace.setHttpStatus(error.response?.status || 500);
        unifiedMonitor.endTrace(trace);
    }
    if (error instanceof APIError)
        throw error;
    if (error instanceof AppError)
        throw error;
    throw new AppError(`Error in ${context}`, error.response?.status || 500, { context }, error);
};
// Data transformation utilities
export const transformData = (data, transformer, context) => {
    try {
        return transformer(data);
    }
    catch (error) {
        handleApiError(error, `${context}.transform`);
    }
};
// Validation utilities
export const validateResponse = (response, validator, context) => {
    if (!validator(response)) {
        throw new AppError(`Invalid response in ${context}`, 500, { response, context });
    }
    return response;
};
// Cache utilities
const cache = new Map();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const getCachedData = (key, ttl = DEFAULT_CACHE_TTL) => {
    const cached = cache.get(key);
    if (!cached)
        return null;
    const now = Date.now();
    if (now - cached.timestamp > ttl) {
        cache.delete(key);
        return null;
    }
    return cached.data;
};
export const setCachedData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};
export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    }
    else {
        cache.clear();
    }
};
// Retry utilities
export const retry = async (fn, options = {}) => {
    const { maxAttempts = 3, delay = 1000, backoff = 2, context = 'retry' } = options;
    let lastError;
    let currentDelay = delay;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxAttempts)
                break;
            const trace = unifiedMonitor.startTrace(`retry.${context}.attempt${attempt}`, 'retry');
            if (trace) {
                trace.setHttpStatus(error.response?.status || 500);
                unifiedMonitor.endTrace(trace);
            }
            await new Promise(resolve => setTimeout(resolve, currentDelay));
            currentDelay *= backoff;
        }
    }
    throw lastError;
};
// Rate limiting utilities
const rateLimits = new Map();
export const checkRateLimit = (key, limit, window) => {
    const now = Date.now();
    const current = rateLimits.get(key);
    if (!current || now > current.resetTime) {
        rateLimits.set(key, { count: 1, resetTime: now + window });
        return true;
    }
    if (current.count >= limit) {
        return false;
    }
    current.count++;
    return true;
};
// Logging utilities
export const logServiceCall = (service, method, params, result, error) => {
    const trace = unifiedMonitor.startTrace(`${service}.${method}`, 'service');
    if (trace) {
        if (error) {
            trace.setHttpStatus(error.response?.status || 500);
            unifiedMonitor.captureException(error, {
                extra: {
                    service,
                    method,
                    params,
                    result,
                },
            });
        }
        else {
            trace.setHttpStatus(200);
        }
        unifiedMonitor.endTrace(trace);
    }
};
// Performance monitoring utilities
export const measurePerformance = async (fn, context) => {
    const start = performance.now();
    try {
        const result = await fn();
        const duration = performance.now() - start;
        const trace = unifiedMonitor.startTrace(`performance.${context}`, 'performance');
        if (trace) {
            trace.setDuration(duration);
            unifiedMonitor.endTrace(trace);
        }
        return result;
    }
    catch (error) {
        const duration = performance.now() - start;
        const trace = unifiedMonitor.startTrace(`performance.${context}.error`, 'performance');
        if (trace) {
            trace.setDuration(duration);
            trace.setHttpStatus(error.response?.status || 500);
            unifiedMonitor.endTrace(trace);
        }
        throw error;
    }
};
