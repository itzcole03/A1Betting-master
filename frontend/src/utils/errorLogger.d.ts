export interface ErrorLog {
    timestamp: string;
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
    severity: 'error' | 'warning' | 'info';
}
declare class ErrorLogger {
    private static instance;
    private logs;
    private readonly maxLogs;
    private constructor();
    static getInstance(): ErrorLogger;
    private setupGlobalErrorHandlers;
    logError(error: Error | string, context?: Record<string, unknown>): void;
    logWarning(message: string, context?: Record<string, unknown>): void;
    logInfo(message: string, context?: Record<string, unknown>): void;
    private addLog;
    private notifyUser;
    private sendToBackend;
    getLogs(): ErrorLog[];
    clearLogs(): void;
    getLogsBySeverity(severity: ErrorLog['severity']): ErrorLog[];
    getRecentLogs(count: number): ErrorLog[];
}
export declare const errorLogger: ErrorLogger;
export {};
