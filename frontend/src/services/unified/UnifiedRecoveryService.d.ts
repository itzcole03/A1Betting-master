import { UnifiedServiceRegistry } from '../unified/UnifiedServiceRegistry';
export interface RecoveryConfig {
    enabled: boolean;
    autoRecovery: boolean;
    maxRetries: number;
    retryDelay: number;
    backupVerification: boolean;
    healthCheckInterval: number;
}
export interface RecoveryResult {
    success: boolean;
    timestamp: number;
    component: string;
    action: string;
    error?: string;
    details?: any;
}
export declare class UnifiedRecoveryService {
    private static instance;
    private logger;
    private settings;
    private errorService;
    private backupService;
    private config;
    private recoveryAttempts;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedRecoveryService;
    private loadConfig;
    performRecovery(component: string, action: string): Promise<RecoveryResult>;
    private getLatestBackup;
    private recoverComponent;
    private recoverDatabase;
    private recoverWebSocket;
    private recoverAPI;
    private recoverML;
    getRecoveryAttempts(component: string, action: string): number;
    resetRecoveryAttempts(component: string, action: string): void;
    clearAllRecoveryAttempts(): void;
}
