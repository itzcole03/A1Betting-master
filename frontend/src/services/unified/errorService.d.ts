interface ErrorDetails {
    code: string;
    message: string;
    stack?: string;
    timestamp: number;
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    context?: any;
}
interface ErrorConfig {
    logToConsole: boolean;
    showNotifications: boolean;
    reportToServer: boolean;
    maxStoredErrors: number;
    autoClearInterval: number;
}
declare class UnifiedErrorService {
    private static instance;
    private readonly notificationService;
    private readonly settingsService;
    private errors;
    private readonly STORAGE_KEY;
    private readonly MAX_ERRORS;
    private config;
    protected constructor();
    static getInstance(): UnifiedErrorService;
    private loadErrors;
    private saveErrors;
    private setupAutoClear;
    handleError(error: Error | string, source: string, severity?: ErrorDetails['severity'], context?: any): void;
    private generateErrorCode;
    private logToConsole;
    private showNotification;
    private reportToServer;
    private dispatchErrorEvent;
    getErrors(): ErrorDetails[];
    getErrorsBySeverity(severity: ErrorDetails['severity']): ErrorDetails[];
    getErrorsBySource(source: string): ErrorDetails[];
    clearErrors(): void;
    clearOldErrors(maxAge: number): void;
    updateConfig(config: Partial<ErrorConfig>): void;
    getConfig(): ErrorConfig;
}
export default UnifiedErrorService;
