import { unifiedMonitor } from '../../core/UnifiedMonitor.js';
import { APIError, AppError } from '../../core/UnifiedError.js';
import { getInitializedUnifiedConfig } from '../../core/UnifiedConfig.js';
class ApiClient {
    constructor() {
        const config = getInitializedUnifiedConfig();
        this.baseUrl = (config.get('api.baseUrl') || 'http://localhost:8000') + '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
        this.defaultTimeout = 30000; // 30 seconds
    }
    async request(method, endpoint, data, config = {}) {
        const trace = unifiedMonitor.startTrace(`api.${method.toLowerCase()}.${endpoint}`, 'http.client');
        const url = new URL(endpoint, this.baseUrl);
        // Add query parameters
        if (config.params) {
            Object.entries(config.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }
        const headers = {
            ...this.defaultHeaders,
            ...config.headers,
        };
        try {
            const response = await fetch(url.toString(), {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
                signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined,
            });
            // Utility to safely convert Headers to Record<string, string>
            const headersToObject = (headers) => {
                const result = {};
                headers.forEach((value, key) => {
                    result[key] = value;
                });
                return result;
            };
            if (trace) {
                trace.setHttpStatus(response.status);
                unifiedMonitor.endTrace(trace);
            }
            const responseData = await response.json();
            if (!response.ok) {
                throw new APIError(responseData.message || 'API request failed', response.status, responseData);
            }
            return {
                data: responseData,
                status: response.status,
                headers: headersToObject(response.headers),
            };
        }
        catch (error) {
            if (trace) {
                // error is unknown, so we must check its shape
                let errStatus = 500;
                if (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response?.status) {
                    errStatus = error.response.status;
                }
                trace.setHttpStatus(errStatus);
                unifiedMonitor.endTrace(trace);
            }
            if (error instanceof APIError)
                throw error;
            // If error is an AbortError
            if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
                throw new AppError('Request timeout', { status: 408 }, error);
            }
            // Type guard for error with response.status
            function hasResponseStatus(err) {
                return (typeof err === 'object' &&
                    err !== null &&
                    'response' in err &&
                    typeof err.response === 'object' &&
                    err.response?.status !== undefined &&
                    typeof err.response.status === 'number');
            }
            const status = hasResponseStatus(error) ? error.response.status : 500;
            throw new AppError('API request failed', { status, endpoint, method }, error);
        }
    }
    async get(endpoint, config) {
        return this.request('GET', endpoint, undefined, config);
    }
    async post(endpoint, data, config) {
        return this.request('POST', endpoint, data, config);
    }
    async put(endpoint, data, config) {
        return this.request('PUT', endpoint, data, config);
    }
    async patch(endpoint, data, config) {
        return this.request('PATCH', endpoint, data, config);
    }
    async delete(endpoint, config) {
        return this.request('DELETE', endpoint, undefined, config);
    }
}
// Export a singleton instance
export const apiClient = new ApiClient();
// Export get and post for compatibility with legacy imports
export const get = apiClient.get.bind(apiClient);
export const post = apiClient.post.bind(apiClient);
