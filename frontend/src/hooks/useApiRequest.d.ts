interface UseApiRequestOptions {
    cacheTime?: number;
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
    enabled?: boolean;
}
export declare function useApiRequest<T>(url: string, { cacheTime, // 5 minutes
retries, retryDelay, onError, enabled }?: UseApiRequestOptions): {
    mutate: () => Promise<void>;
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isValidating: boolean;
};
export {};
