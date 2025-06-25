import UnifiedErrorService from './errorService';
import UnifiedNotificationService from './notificationService';
import UnifiedLoggingService from './loggingService';
import UnifiedSettingsService from './settingsService';
import { UnifiedServiceRegistry } from './UnifiedServiceRegistry';
export declare abstract class UnifiedServiceBase {
    protected readonly errorService: UnifiedErrorService;
    protected readonly notificationService: UnifiedNotificationService;
    protected readonly loggingService: UnifiedLoggingService;
    protected readonly settingsService: UnifiedSettingsService;
    protected readonly serviceRegistry: UnifiedServiceRegistry;
    protected constructor(serviceName: string, registry: UnifiedServiceRegistry);
    protected handleServiceOperation<T>(operation: () => Promise<T>, operationName: string, serviceName: string, successMessage?: string, errorMessage?: string): Promise<T>;
    protected handleWebSocketError(error: any, serviceName: string, context?: any): void;
    protected logOperation(level: 'debug' | 'info' | 'warn' | 'error', message: string, serviceName: string, data?: any): void;
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    protected getCacheKey(...parts: (string | number)[]): string;
    protected getService<T>(name: string): T | undefined;
    protected emit(event: string, data: any): void;
}
