import { UnifiedConfig } from "../unified/UnifiedConfig";
import { UnifiedLogger } from "../unified/UnifiedLogger";
import { UnifiedCache } from "../unified/UnifiedCache";
import { BaseService } from "./BaseService";
export class UnifiedErrorService extends BaseService {
    constructor(registry) {
        super("error", registry);
        this.errorHistory = [];
        this.maxErrorHistory = 100;
        this.errors = [];
        this.maxErrors = 1000;
        this.config = UnifiedConfig.getInstance();
        this.logger = UnifiedLogger.getInstance();
        this.cache = UnifiedCache.getInstance();
    }
    static getInstance(registry) {
        if (!UnifiedErrorService.instance) {
            UnifiedErrorService.instance = new UnifiedErrorService(registry);
        }
        return UnifiedErrorService.instance;
    }
    handleError(error, details) {
        const errorDetails = {
            ...details,
            timestamp: Date.now(),
        };
        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error:", error);
            console.error("Details:", errorDetails);
        }
        // Store error
        this.errors.unshift(errorDetails);
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }
        // Emit error event
        this.emit("error", { error, details: errorDetails });
    }
    getErrors(limit = 100) {
        return this.errors.slice(0, limit);
    }
    clearErrors() {
        this.errors = [];
    }
    getErrorCount() {
        return this.errors.length;
    }
    getErrorsByCode(code) {
        return this.errors.filter((error) => error.code === code);
    }
    getErrorsBySource(source) {
        return this.errors.filter((error) => error.source === source);
    }
    getRecentErrors(timeRange = "day") {
        const now = Date.now();
        const rangeInMs = this.getTimeRangeInMs(timeRange);
        const cutoff = now - rangeInMs;
        return this.errors.filter((error) => (error.timestamp || 0) >= cutoff);
    }
    // Renamed to avoid duplicate member error
    getRecentErrorHistory() {
        return this.errorHistory.slice(0, 10);
    }
    clearErrorHistory() {
        this.errorHistory.length = 0;
        this.cache.delete("recent_errors");
        this.emit("error:history:cleared");
    }
    subscribe(callback) {
        this.on("error:occurred", callback);
        return () => this.off("error:occurred", callback);
    }
    handleErrorBySeverity(error) {
        switch (error.severity) {
            case "error":
                this.handleCriticalError(error);
                break;
            case "warning":
                this.handleWarning(error);
                break;
            case "info":
                this.handleInfo(error);
                break;
        }
    }
    handleCriticalError(error) {
        // Implement critical error handling logic
        // For example, notify administrators, trigger fallback mechanisms, etc.
        this.emit("error:critical", error);
    }
    handleWarning(error) {
        // Implement warning handling logic
        // For example, log to monitoring system, notify developers, etc.
        this.emit("error:warning", error);
    }
    handleInfo(error) {
        // Implement info handling logic
        // For example, log to analytics, track patterns, etc.
        this.emit("error:info", error);
    }
    isErrorRecoverable(error) {
        // Implement logic to determine if an error is recoverable
        const recoverableCodes = this.config.get("recoverableErrorCodes") || [];
        return recoverableCodes.includes(error.code);
    }
    getErrorMetrics() {
        return {
            totalErrors: this.errorHistory.length,
            criticalErrors: this.errorHistory.filter((e) => e.severity === "error")
                .length,
            warnings: this.errorHistory.filter((e) => e.severity === "warning")
                .length,
            info: this.errorHistory.filter((e) => e.severity === "info").length,
            lastErrorTime: this.errorHistory[0]?.timestamp || 0,
        };
    }
}
