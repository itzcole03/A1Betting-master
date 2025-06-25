export declare enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    source?: string;
    details?: any;
}
export declare class UnifiedLogger {
    private static instance;
    private logLevel;
    private logs;
    private constructor();
    static getInstance(): UnifiedLogger;
    setLogLevel(level: LogLevel): void;
    debug(message: string, source?: string, details?: any): void;
    info(message: string, source?: string, details?: any): void;
    warn(message: string, source?: string, details?: any): void;
    error(message: string, source?: string, details?: any): void;
    private log;
    private shouldLog;
    private outputLog;
    getLogs(level?: LogLevel): LogEntry[];
    clearLogs(): void;
}
