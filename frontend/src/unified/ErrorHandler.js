import { EventBus } from '@/core/EventBus';
export class ErrorHandler {
    constructor() {
        this.errorMetrics = new Map();
        this.eventBus = EventBus.getInstance();
    }
    static getInstance() {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }
    handleError(error, context) {
        const metrics = {
            count: (this.errorMetrics.get(context)?.count || 0) + 1,
            lastError: error,
            timestamp: Date.now(),
        };
        this.errorMetrics.set(context, metrics);
        this.eventBus.emit('error:occurred', error);
    }
    getErrorMetrics(context) {
        return this.errorMetrics.get(context);
    }
    getAllErrorMetrics() {
        return new Map(this.errorMetrics);
    }
    clearErrorMetrics(context) {
        if (context) {
            this.errorMetrics.delete(context);
        }
        else {
            this.errorMetrics.clear();
        }
    }
    getErrorCount(context) {
        return this.errorMetrics.get(context)?.count || 0;
    }
    getLastError(context) {
        return this.errorMetrics.get(context)?.lastError;
    }
    getLastErrorTimestamp(context) {
        return this.errorMetrics.get(context)?.timestamp;
    }
}
