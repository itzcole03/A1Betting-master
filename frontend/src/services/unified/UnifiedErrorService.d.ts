import { BaseService } from "./BaseService";
import { UnifiedServiceRegistry } from "./UnifiedServiceRegistry";
export interface ErrorContext {
    code: string;
    message: string;
    severity: "error" | "warning" | "info";
    timestamp: number;
    source: string;
    details?: Record<string, any>;
    stack?: string;
}
export interface ErrorDetails {
    code: string;
    source: string;
    details?: Record<string, any>;
    timestamp?: number;
}
export declare class UnifiedErrorService extends BaseService {
    private static instance;
    private readonly config;
    private readonly logger;
    private readonly cache;
    private readonly errorHistory;
    private readonly maxErrorHistory;
    private errors;
    private readonly maxErrors;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedErrorService;
    handleError(error: unknown, details: ErrorDetails): void;
    getErrors(limit?: number): ErrorDetails[];
    clearErrors(): void;
    getErrorCount(): number;
    getErrorsByCode(code: string): ErrorDetails[];
    getErrorsBySource(source: string): ErrorDetails[];
    getRecentErrors(timeRange?: "day" | "week" | "month"): ErrorDetails[];
    getRecentErrorHistory(): ErrorContext[];
    clearErrorHistory(): void;
    subscribe(callback: (error: ErrorContext) => void): () => void;
    private handleErrorBySeverity;
    private handleCriticalError;
    private handleWarning;
    private handleInfo;
    isErrorRecoverable(error: ErrorContext): boolean;
    getErrorMetrics(): {
        totalErrors: number;
        criticalErrors: number;
        warnings: number;
        info: number;
        lastErrorTime: number;
    };
}
