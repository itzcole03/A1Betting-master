export declare const handleApiError: (error: any, context: string) => never;
export declare const transformData: <T, R>(data: T, transformer: (data: T) => R, context: string) => R;
export declare const validateResponse: <T>(response: any, validator: (data: any) => data is T, context: string) => T;
export declare const getCachedData: <T>(key: string, ttl?: number) => T | null;
export declare const setCachedData: <T>(key: string, data: T) => void;
export declare const clearCache: (key?: string) => void;
export declare const retry: <T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    context?: string;
}) => Promise<T>;
export declare const checkRateLimit: (key: string, limit: number, window: number) => boolean;
export declare const logServiceCall: (service: string, method: string, params?: any, result?: any, error?: any) => void;
export declare const measurePerformance: <T>(fn: () => Promise<T>, context: string) => Promise<T>;
