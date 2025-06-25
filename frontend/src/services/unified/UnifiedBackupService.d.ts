import { UnifiedServiceRegistry } from '../unified/UnifiedServiceRegistry';
export interface BackupConfig {
    enabled: boolean;
    schedule: string;
    retentionDays: number;
    backupPath: string;
    includeDatabases: boolean;
    includeFiles: boolean;
    includeLogs: boolean;
    compression: boolean;
    encryption: boolean;
    encryptionKey?: string;
}
export interface BackupResult {
    success: boolean;
    timestamp: number;
    backupPath: string;
    size: number;
    error?: string;
}
export declare class UnifiedBackupService {
    private static instance;
    private logger;
    private settings;
    private errorService;
    private config;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedBackupService;
    private loadConfig;
    performBackup(): Promise<BackupResult>;
    private backupDatabases;
    private backupFiles;
    private backupLogs;
    private copyDir;
    private compressBackup;
    private encryptBackup;
    verifyBackup(backupPath: string): Promise<boolean>;
    cleanupOldBackups(): Promise<void>;
}
