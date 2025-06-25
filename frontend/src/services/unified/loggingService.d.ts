interface LogEntry {
    id: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    timestamp: number;
    source: string;
    data?: any;
    tags?: string[];
}
interface LogConfig {
    enabled: boolean;
    minLevel: LogEntry['level'];
    maxEntries: number;
    persistToStorage: boolean;
    consoleOutput: boolean;
    serverOutput: boolean;
    autoClearInterval: number;
    tags: string[];
}
declare class UnifiedLoggingService {
    private static instance;
    private readonly settingsService;
    private readonly errorService;
    private logs;
    private readonly STORAGE_KEY;
    private readonly MAX_LOGS;
    private config;
    protected constructor();
    static getInstance(): UnifiedLoggingService;
    private loadLogs;
    private saveLogs;
    private setupAutoClear;
    private createLogEntry;
    private generateLogId;
    private shouldLog;
    private logToConsole;
    private logToServer;
    log(level: LogEntry['level'], message: string, source: string, data?: any, tags?: string[]): void;
    private dispatchLogEvent;
    debug(message: string, source: string, data?: any, tags?: string[]): void;
    info(message: string, source: string, data?: any, tags?: string[]): void;
    warn(message: string, source: string, data?: any, tags?: string[]): void;
    error(message: string, source: string, data?: any, tags?: string[]): void;
    getLogs(): LogEntry[];
    getLogsByLevel(level: LogEntry['level']): LogEntry[];
    getLogsBySource(source: string): LogEntry[];
    getLogsByTag(tag: string): LogEntry[];
    clearLogs(): void;
    clearOldLogs(maxAge: number): void;
    updateConfig(config: Partial<LogConfig>): void;
    getConfig(): LogConfig;
}
export default UnifiedLoggingService;
