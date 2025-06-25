import { EventBus } from './EventBus.js';
export class ErrorHandler {
    constructor() {
        this.MAX_ERRORS = 1000;
        this.eventBus = EventBus.getInstance();
        this.errors = [];
    }
    static getInstance() {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }
    handleError(error, source, severity = 'medium', details) {
        try {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            const errorEntry = {
                error: errorObj,
                source,
                severity,
                details,
                timestamp: Date.now(),
            };
            this.errors.push(errorEntry);
            if (this.errors.length > this.MAX_ERRORS) {
                this.errors.shift();
            }
            this.eventBus.emit('error:occurred', errorEntry);
            // Log error based on severity
            switch (severity) {
                case 'high':
                    console.error(`[${source}] Critical error:`, errorObj, details);
                    break;
                case 'medium':
                    console.warn(`[${source}] Warning:`, errorObj, details);
                    break;
                case 'low':
                    console.info(`[${source}] Info:`, errorObj, details);
                    break;
            }
            // Handle high severity errors
            if (severity === 'high') {
                this.handleCriticalError(errorEntry);
            }
        }
        catch (e) {
            console.error('Error in error handler:', e);
        }
    }
    handleCriticalError(errorEntry) {
        // Implement critical error handling (e.g., notify user, retry operation, etc.)
        this.eventBus.emit('error:critical', errorEntry);
    }
    getErrors(source, severity, startTime, endTime) {
        return this.errors.filter(entry => {
            if (source && entry.source !== source)
                return false;
            if (severity && entry.severity !== severity)
                return false;
            if (startTime && entry.timestamp < startTime)
                return false;
            if (endTime && entry.timestamp > endTime)
                return false;
            return true;
        });
    }
    clearErrors() {
        this.errors = [];
        this.eventBus.emit('error:cleared', null);
    }
    getErrorCount(severity) {
        return this.errors.filter(entry => !severity || entry.severity === severity).length;
    }
}
