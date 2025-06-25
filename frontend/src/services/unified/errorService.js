import UnifiedNotificationService from './notificationService';
import UnifiedSettingsService from './settingsService';
class UnifiedErrorService {
    constructor() {
        this.errors = [];
        this.STORAGE_KEY = 'esa_errors';
        this.MAX_ERRORS = 100;
        this.config = {
            logToConsole: true,
            showNotifications: true,
            reportToServer: true,
            maxStoredErrors: 100,
            autoClearInterval: 24 * 60 * 60 * 1000, // 24 hours
        };
        this.notificationService = UnifiedNotificationService.getInstance();
        this.settingsService = UnifiedSettingsService.getInstance();
        this.loadErrors();
        this.setupAutoClear();
    }
    static getInstance() {
        if (!UnifiedErrorService.instance) {
            UnifiedErrorService.instance = new UnifiedErrorService();
        }
        return UnifiedErrorService.instance;
    }
    loadErrors() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.errors = JSON.parse(stored);
            }
        }
        catch (error) {
            console.error('Error loading stored errors:', error);
            this.errors = [];
        }
    }
    saveErrors() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.errors));
        }
        catch (error) {
            console.error('Error saving errors:', error);
        }
    }
    setupAutoClear() {
        setInterval(() => {
            this.clearOldErrors(this.config.autoClearInterval);
        }, this.config.autoClearInterval);
    }
    handleError(error, source, severity = 'medium', context) {
        const errorDetails = {
            code: this.generateErrorCode(error),
            message: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: Date.now(),
            source,
            severity,
            context,
        };
        // Store error
        this.errors.unshift(errorDetails);
        if (this.errors.length > this.config.maxStoredErrors) {
            this.errors = this.errors.slice(0, this.config.maxStoredErrors);
        }
        this.saveErrors();
        // Log to console if enabled
        if (this.config.logToConsole) {
            this.logToConsole(errorDetails);
        }
        // Show notification if enabled
        if (this.config.showNotifications) {
            this.showNotification(errorDetails);
        }
        // Report to server if enabled
        if (this.config.reportToServer) {
            this.reportToServer(errorDetails);
        }
        // Dispatch error event
        this.dispatchErrorEvent(errorDetails);
    }
    generateErrorCode(error) {
        const prefix = 'ESA';
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${prefix}-${timestamp}-${random}`;
    }
    logToConsole(error) {
        const isDebug = this.settingsService.isDebugMode();
        const logMethod = error.severity === 'critical' ? 'error' : 'warn';
        if (isDebug) {
            console[logMethod]('Error Details:', {
                code: error.code,
                message: error.message,
                source: error.source,
                severity: error.severity,
                context: error.context,
                stack: error.stack,
            });
        }
        else {
            console[logMethod](`[${error.code}] ${error.message}`);
        }
    }
    showNotification(error) {
        const message = `[${error.code}] ${error.message}`;
        const title = `Error in ${error.source}`;
        switch (error.severity) {
            case 'critical':
                this.notificationService.notify('error', message, title, error);
                break;
            case 'high':
                this.notificationService.notify('error', message, title, error);
                break;
            case 'medium':
                this.notificationService.notify('warning', message, title, error);
                break;
            case 'low':
                this.notificationService.notify('info', message, title, error);
                break;
        }
    }
    async reportToServer(error) {
        try {
            const settings = this.settingsService.getSettings();
            const response = await fetch(`${settings.apiUrl}/api/errors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(error),
            });
            if (!response.ok) {
                throw new Error('Failed to report error to server');
            }
        }
        catch (error) {
            console.error('Error reporting to server:', error);
        }
    }
    dispatchErrorEvent(error) {
        const event = new CustomEvent('error', {
            detail: error,
        });
        window.dispatchEvent(event);
    }
    getErrors() {
        return [...this.errors];
    }
    getErrorsBySeverity(severity) {
        return this.errors.filter(error => error.severity === severity);
    }
    getErrorsBySource(source) {
        return this.errors.filter(error => error.source === source);
    }
    clearErrors() {
        this.errors = [];
        this.saveErrors();
    }
    clearOldErrors(maxAge) {
        const cutoff = Date.now() - maxAge;
        this.errors = this.errors.filter(error => error.timestamp > cutoff);
        this.saveErrors();
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getConfig() {
        return { ...this.config };
    }
}
UnifiedErrorService.instance = null;
export default UnifiedErrorService;
