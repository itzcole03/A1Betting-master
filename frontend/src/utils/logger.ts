/**
 * Production-ready logging service
 * Replaces console.log statements with proper logging levels and filtering
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  source?: string;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs

  constructor() {
    // Set log level based on environment
    this.logLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private addLog(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string,
  ) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      source,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In development, also log to console
    if (import.meta.env.DEV) {
      const prefix = `[${entry.timestamp.toISOString()}] ${source || "App"}:`;
      switch (level) {
        case LogLevel.ERROR:
          console.error(prefix, message, data);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, data);
          break;
        case LogLevel.INFO:
          console.info(prefix, message, data);
          break;
        case LogLevel.DEBUG:
          console.log(prefix, message, data);
          break;
      }
    }
  }

  error(message: string, data?: any, source?: string) {
    this.addLog(LogLevel.ERROR, message, data, source);
  }

  warn(message: string, data?: any, source?: string) {
    this.addLog(LogLevel.WARN, message, data, source);
  }

  info(message: string, data?: any, source?: string) {
    this.addLog(LogLevel.INFO, message, data, source);
  }

  debug(message: string, data?: any, source?: string) {
    this.addLog(LogLevel.DEBUG, message, data, source);
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Set log level dynamically
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience methods for common logging patterns
export const logNavigation = (from: string, to: string) => {
  logger.info(`Navigation: ${from} -> ${to}`, { from, to }, "Navigation");
};

export const logApiCall = (
  endpoint: string,
  method: string,
  success: boolean,
  duration?: number,
) => {
  const message = `API ${method} ${endpoint} ${success ? "success" : "failed"}`;
  const data = { endpoint, method, success, duration };

  if (success) {
    logger.info(message, data, "API");
  } else {
    logger.error(message, data, "API");
  }
};

export const logUserAction = (action: string, data?: any) => {
  logger.info(`User action: ${action}`, data, "User");
};

export const logError = (error: Error, context?: string) => {
  logger.error(
    `Error in ${context || "unknown context"}: ${error.message}`,
    {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    "Error",
  );
};

export const logPerformance = (operation: string, duration: number) => {
  logger.debug(
    `Performance: ${operation} took ${duration}ms`,
    { operation, duration },
    "Performance",
  );
};
