export type ErrorSeverity = 'low' | 'medium' | 'high';
export interface ErrorDetails {
    action?: string;
    data?: unknown;
    [key: string]: unknown;
}
export declare class ErrorHandler {
    private static instance;
    private readonly eventBus;
    private errors;
    private readonly MAX_ERRORS;
    private constructor();
    static getInstance(): ErrorHandler;
    handleError(error: Error | unknown, source: string, severity?: ErrorSeverity, details?: ErrorDetails): void;
    private handleCriticalError;
    getErrors(source?: string, severity?: ErrorSeverity, startTime?: number, endTime?: number): Array<{
        error: Error;
        source: string;
        severity: ErrorSeverity;
        details?: ErrorDetails;
        timestamp: number;
    }>;
    clearErrors(): void;
    getErrorCount(severity?: ErrorSeverity): number;
}
