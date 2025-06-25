import axios, { AxiosError } from 'axios';
const defaultRetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000
};
export async function retryableAxios(config, retryConfig = defaultRetryConfig) {
    let lastError = null;
    let delay = retryConfig.baseDelay;
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
            const response = await axios(config);
            return response.data;
        }
        catch (error) {
            lastError = error;
            if (error instanceof AxiosError) {
                // Don't retry on 4xx errors (except 429 - rate limit)
                if (error.response?.status && error.response.status < 500 && error.response.status !== 429) {
                    throw error;
                }
            }
            if (attempt === retryConfig.maxRetries) {
                break;
            }
            // Exponential backoff with jitter
            delay = Math.min(delay * (1.5 + Math.random() * 0.5), retryConfig.maxDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('Request failed after retries');
}
export function createAxiosWithRetry(baseURL, retryConfig) {
    return {
        get: async (url, config) => {
            return retryableAxios({
                ...config,
                method: 'GET',
                url,
                baseURL
            }, retryConfig);
        },
        post: async (url, data, config) => {
            return retryableAxios({
                ...config,
                method: 'POST',
                url,
                data,
                baseURL
            }, retryConfig);
        }
    };
}
