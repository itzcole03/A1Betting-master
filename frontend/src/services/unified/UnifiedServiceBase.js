import UnifiedErrorService from './errorService';
import UnifiedNotificationService from './notificationService';
import UnifiedLoggingService from './loggingService';
import UnifiedSettingsService from './settingsService';
export class UnifiedServiceBase {
    constructor(serviceName, registry) {
        this.serviceRegistry = registry;
        this.errorService = UnifiedErrorService.getInstance(registry);
        this.notificationService = UnifiedNotificationService.getInstance(registry);
        this.loggingService = UnifiedLoggingService.getInstance(registry);
        this.settingsService = UnifiedSettingsService.getInstance(registry);
        this.loggingService.info(`Initializing ${serviceName}`, serviceName);
    }
    async handleServiceOperation(operation, operationName, serviceName, successMessage, errorMessage) {
        try {
            this.loggingService.debug(`Starting ${operationName}`, serviceName);
            const result = await operation();
            if (successMessage) {
                this.notificationService.notify('success', successMessage);
            }
            this.loggingService.info(`Completed ${operationName}`, serviceName);
            return result;
        }
        catch (error) {
            const errorMsg = errorMessage || `Failed to ${operationName}`;
            this.errorService.handleError(error instanceof Error ? error : new Error(errorMsg), serviceName, 'high', { operation: operationName });
            this.notificationService.notify('error', errorMsg);
            throw error;
        }
    }
    handleWebSocketError(error, serviceName, context) {
        this.errorService.handleError(error instanceof Error ? error : new Error('WebSocket error occurred'), serviceName, 'high', { ...context, type: 'websocket' });
    }
    logOperation(level, message, serviceName, data) {
        this.loggingService.log(level, message, serviceName, data);
    }
    // Lifecycle methods
    async initialize() {
        this.loggingService.info(`Initializing service`, this.constructor.name);
    }
    async cleanup() {
        this.loggingService.info(`Cleaning up service`, this.constructor.name);
    }
    // Cache management
    getCacheKey(...parts) {
        return `${this.constructor.name}:${parts.join(':')}`;
    }
    // Service registry helpers
    getService(name) {
        return this.serviceRegistry.getService(name);
    }
    emit(event, data) {
        this.serviceRegistry.emit(event, data);
    }
}
