import { AxiosRequestConfig } from 'axios';
interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
}
export declare function retryableAxios<T>(config: AxiosRequestConfig, retryConfig?: RetryConfig): Promise<T>;
export declare function createAxiosWithRetry(baseURL: string, retryConfig?: RetryConfig): {
    get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
};
export {};
