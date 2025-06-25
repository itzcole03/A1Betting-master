import { UnifiedLogger } from '@/core/UnifiedLogger';
import { SystemError } from './UnifiedError';
export class UnifiedErrorHandler {
    constructor() {
        this.logger = UnifiedLogger.getInstance();
        this.errorLog = [];
    }
    static getInstance() {
        if (!UnifiedErrorHandler.instance) {
            UnifiedErrorHandler.instance = new UnifiedErrorHandler();
        }
        return UnifiedErrorHandler.instance;
    }
    handleError(error, context, metadata = {}) {
        try {
            const timestamp = new Date().toISOString();
            this.errorLog.push({
                timestamp,
                error,
                context,
                metadata,
            });
            if (error instanceof SystemError) {
                this.logger.error(`[${error.code}] ${error.message}`, {
                    context,
                    metadata,
                    error: error.toJSON(),
                });
            }
            else {
                this.logger.error(error.message, {
                    context,
                    metadata,
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                    },
                });
            }
        }
        catch (handlingError) {
            console.error('Error in error handler:', handlingError);
            console.error('Original error:', error);
        }
    }
    getErrorLog() {
        return [...this.errorLog];
    }
    clearErrorLog() {
        this.errorLog = [];
        this.logger.debug('Error log cleared');
    }
}
