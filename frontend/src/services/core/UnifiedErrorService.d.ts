import { UnifiedServiceRegistry } from '../unified/UnifiedServiceRegistry';
export interface ErrorContext {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
    component?: string;
    action?: string;
    user?: string;
    stack?: string;
}
export declare class UnifiedErrorService {
    private static instance;
    private logger;
    private notificationService;
    private errorCount;
    private readonly MAX_ERRORS_PER_MINUTE;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedErrorService;
    private startErrorCountReset;
    handleError(error: unknown, component: string, action: string): void;
    private getErrorCode;
    private getErrorMessage;
    private getErrorDetails;
    getErrorCount(component: string, action: string): number;
    resetErrorCount(component: string, action: string): void;
    clearAllErrorCounts(): void;
}
