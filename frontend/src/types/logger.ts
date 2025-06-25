// Logger types for compatibility
export interface UnifiedLogger {
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: Error | unknown): void;
    trace(message: string, data?: unknown): void;
}

export interface LoggerContextType {
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: Error | unknown): void;
}

// Create adapter to make LoggerContextType compatible with UnifiedLogger
export const createUnifiedLoggerAdapter = (logger: LoggerContextType): UnifiedLogger => ({
    debug: logger.info, // Map debug to info
    info: logger.info,
    warn: logger.warn,
    error: logger.error,
    trace: logger.info, // Map trace to info
});

export default UnifiedLogger;
