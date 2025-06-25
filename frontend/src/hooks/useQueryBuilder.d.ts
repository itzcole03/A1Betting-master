interface QueryConfig<T> {
    url: string;
    params?: Record<string, any>;
    transform?: (data: any) => T;
    dependencies?: any[];
    enabled?: boolean;
    refetchInterval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}
interface QueryState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isValidating: boolean;
    timestamp: number | null;
}
interface QueryResult<T> extends QueryState<T> {
    refetch: () => Promise<void>;
    setData: (data: T) => void;
    updateData: (updater: (prev: T | null) => T) => void;
    reset: () => void;
}
interface QueryBuilderOptions {
    cacheTime?: number;
    retries?: number;
    retryDelay?: number;
    suspense?: boolean;
}
export declare function useQueryBuilder<T>(config: QueryConfig<T>, options?: QueryBuilderOptions): QueryResult<T>;
export {};
