export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogContext {
    level: LogLevel;
    message: string;
    timestamp: number;
    component?: string;
    action?: string;
    details?: Record<string, any>;
    error?: Error;
}
export interface LoggerConfig {
    minLevel: LogLevel;
    enableConsole: boolean;
    enableMonitoring: boolean;
    component?: string;
    format?: (context: LogContext) => string;
}
export declare class UnifiedLogger {
    private static instance;
    private config;
    private serviceName;
    constructor(serviceName: string);
    static getInstance(serviceName: string): UnifiedLogger;
    configure(config: Partial<LoggerConfig>): void;
    private shouldLog;
    private formatMessage;
    private log;
    debug(message: string, context?: Partial<LogContext>): void;
    info(message: string, context?: Partial<LogContext>): void;
    warn(message: string, context?: Partial<LogContext>): void;
    error(message: string, error?: Error, context?: Partial<LogContext>): void;
}
export declare const unifiedLogger: UnifiedLogger;
