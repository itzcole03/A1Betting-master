import { toast } from 'react-toastify';
class ErrorLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        // Initialize error handlers
        this.setupGlobalErrorHandlers();
    }
    static getInstance() {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }
    setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', event => {
            this.logError(event.reason, {
                type: 'unhandledRejection',
                context: event,
            });
        });
        // Handle uncaught errors
        window.addEventListener('error', event => {
            this.logError(event.error || new Error(event.message), {
                type: 'uncaughtError',
                context: event,
            });
        });
    }
    logError(error, context) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            message: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            context,
            severity: 'error',
        };
        this.addLog(errorLog);
        this.notifyUser(errorLog);
    }
    logWarning(message, context) {
        const warningLog = {
            timestamp: new Date().toISOString(),
            message,
            context,
            severity: 'warning',
        };
        this.addLog(warningLog);
        this.notifyUser(warningLog);
    }
    logInfo(message, context) {
        const infoLog = {
            timestamp: new Date().toISOString(),
            message,
            context,
            severity: 'info',
        };
        this.addLog(infoLog);
    }
    addLog(log) {
        this.logs.unshift(log);
        // Maintain log size limit
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        // Send to backend if needed
        this.sendToBackend(log);
    }
    notifyUser(log) {
        switch (log.severity) {
            case 'error':
                toast.error(log.message);
                break;
            case 'warning':
                toast.warning(log.message);
                break;
            case 'info':
                toast.info(log.message);
                break;
        }
    }
    async sendToBackend(log) {
        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(log),
            });
        }
        catch (error) {
            console.error('Failed to send log to backend:', error);
        }
    }
    getLogs() {
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
    getLogsBySeverity(severity) {
        return this.logs.filter(log => log.severity === severity);
    }
    getRecentLogs(count) {
        return this.logs.slice(0, count);
    }
}
ErrorLogger.instance = null;
export const errorLogger = ErrorLogger.getInstance();
