import { UnifiedLogger } from '@/core/UnifiedLogger';
import { UnifiedNotificationService } from './UnifiedNotificationService';
export class UnifiedErrorService {
    constructor(registry) {
        this.MAX_ERRORS_PER_MINUTE = 10;
        this.logger = UnifiedLogger.getInstance();
        this.notificationService = UnifiedNotificationService.getInstance(registry);
        this.errorCount = new Map();
        this.startErrorCountReset();
    }
    static getInstance(registry) {
        if (!UnifiedErrorService.instance) {
            UnifiedErrorService.instance = new UnifiedErrorService(registry);
        }
        return UnifiedErrorService.instance;
    }
    startErrorCountReset() {
        setInterval(() => {
            this.errorCount.clear();
        }, 60000); // Reset every minute
    }
    handleError(error, component, action) {
        const errorContext = {
            code: this.getErrorCode(error),
            message: this.getErrorMessage(error),
            details: this.getErrorDetails(error),
            timestamp: Date.now(),
            component,
            action,
            stack: error instanceof Error ? error.stack : undefined,
        };
        // Log the error
        this.logger.error(`Error in ${component} during ${action}: ${errorContext.message}`, 'error', errorContext);
        // Check error rate
        const errorKey = `${component}:${action}`;
        const currentCount = (this.errorCount.get(errorKey) || 0) + 1;
        this.errorCount.set(errorKey, currentCount);
        // Send notification if error rate exceeds threshold
        if (currentCount >= this.MAX_ERRORS_PER_MINUTE) {
            this.notificationService.sendNotification({
                type: 'error',
                title: 'High Error Rate Detected',
                message: `Component: ${component}, Action: ${action}, Count: ${currentCount}`,
                severity: 'high',
                timestamp: Date.now(),
            });
        }
    }
    getErrorCode(error) {
        if (error instanceof Error) {
            return error.name;
        }
        return 'UNKNOWN_ERROR';
    }
    getErrorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
    getErrorDetails(error) {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }
        return { error: String(error) };
    }
    getErrorCount(component, action) {
        return this.errorCount.get(`${component}:${action}`) || 0;
    }
    resetErrorCount(component, action) {
        this.errorCount.delete(`${component}:${action}`);
    }
    clearAllErrorCounts() {
        this.errorCount.clear();
    }
}
