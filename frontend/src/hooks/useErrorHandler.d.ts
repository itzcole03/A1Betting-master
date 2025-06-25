interface ErrorHandlerOptions {
    onError?: (error: Error, info?: Record<string, string | number | boolean | object>) => void;
    shouldRethrow?: boolean;
}
export declare function useErrorHandler(options?: ErrorHandlerOptions): {
    error: Error | null;
    errorInfo: Record<string, string | number | boolean | object> | undefined;
    handleError: (error: unknown, info?: Record<string, string | number | boolean | object>) => void;
    clearError: () => void;
    hasError: boolean;
};
export {};
