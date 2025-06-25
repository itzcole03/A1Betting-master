import UnifiedSettingsService from './settingsService';
import UnifiedErrorService from './errorService';
class UnifiedLoggingService {
    constructor() {
        this.logs = [];
        this.STORAGE_KEY = 'esa_logs';
        this.MAX_LOGS = 1000;
        this.config = {
            enabled: true,
            minLevel: 'info',
            maxEntries: 1000,
            persistToStorage: true,
            consoleOutput: true,
            serverOutput: true,
            autoClearInterval: 24 * 60 * 60 * 1000, // 24 hours
            tags: ['app', 'user', 'betting', 'prediction', 'analytics'],
        };
        this.settingsService = UnifiedSettingsService.getInstance();
        this.errorService = UnifiedErrorService.getInstance();
        this.loadLogs();
        this.setupAutoClear();
    }
    static getInstance() {
        if (!UnifiedLoggingService.instance) {
            UnifiedLoggingService.instance = new UnifiedLoggingService();
        }
        return UnifiedLoggingService.instance;
    }
    loadLogs() {
        if (!this.config.persistToStorage)
            return;
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        }
        catch (error) {
            this.errorService.handleError(error instanceof Error ? error : new Error('Failed to load logs'), 'LoggingService', 'low', { action: 'loadLogs' });
            this.logs = [];
        }
    }
    saveLogs() {
        if (!this.config.persistToStorage)
            return;
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
        }
        catch (error) {
            this.errorService.handleError(error instanceof Error ? error : new Error('Failed to save logs'), 'LoggingService', 'low', { action: 'saveLogs' });
        }
    }
    setupAutoClear() {
        setInterval(() => {
            this.clearOldLogs(this.config.autoClearInterval);
        }, this.config.autoClearInterval);
    }
    createLogEntry(level, message, source, data, tags) {
        return {
            id: this.generateLogId(),
            level,
            message,
            timestamp: Date.now(),
            source,
            data,
            tags: tags || [],
        };
    }
    generateLogId() {
        return `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    shouldLog(level) {
        if (!this.config.enabled)
            return false;
        const levels = ['debug', 'info', 'warn', 'error'];
        const minLevelIndex = levels.indexOf(this.config.minLevel);
        const currentLevelIndex = levels.indexOf(level);
        return currentLevelIndex >= minLevelIndex;
    }
    logToConsole(entry) {
        if (!this.config.consoleOutput)
            return;
        const isDebug = this.settingsService.isDebugMode();
        const logMethod = entry.level === 'error' ? 'error' : entry.level;
        if (isDebug) {
            console[logMethod]('Log Entry:', {
                id: entry.id,
                level: entry.level,
                message: entry.message,
                source: entry.source,
                timestamp: new Date(entry.timestamp).toISOString(),
                data: entry.data,
                tags: entry.tags,
            });
        }
        else {
            console[logMethod](`[${entry.source}] ${entry.message}`);
        }
    }
    async logToServer(entry) {
        if (!this.config.serverOutput)
            return;
        try {
            const settings = this.settingsService.getSettings();
            const response = await fetch(`${settings.apiUrl}/api/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entry),
            });
            if (!response.ok) {
                throw new Error('Failed to send log to server');
            }
        }
        catch (error) {
            this.errorService.handleError(error instanceof Error ? error : new Error('Failed to send log to server'), 'LoggingService', 'low', { action: 'logToServer', logEntry: entry });
        }
    }
    log(level, message, source, data, tags) {
        if (!this.shouldLog(level))
            return;
        const entry = this.createLogEntry(level, message, source, data, tags);
        // Store log
        this.logs.unshift(entry);
        if (this.logs.length > this.config.maxEntries) {
            this.logs = this.logs.slice(0, this.config.maxEntries);
        }
        this.saveLogs();
        // Output log
        this.logToConsole(entry);
        this.logToServer(entry);
        // Dispatch log event
        this.dispatchLogEvent(entry);
    }
    dispatchLogEvent(entry) {
        const event = new CustomEvent('log', {
            detail: entry,
        });
        window.dispatchEvent(event);
    }
    debug(message, source, data, tags) {
        this.log('debug', message, source, data, tags);
    }
    info(message, source, data, tags) {
        this.log('info', message, source, data, tags);
    }
    warn(message, source, data, tags) {
        this.log('warn', message, source, data, tags);
    }
    error(message, source, data, tags) {
        this.log('error', message, source, data, tags);
    }
    getLogs() {
        return [...this.logs];
    }
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    getLogsBySource(source) {
        return this.logs.filter(log => log.source === source);
    }
    getLogsByTag(tag) {
        return this.logs.filter(log => log.tags?.includes(tag));
    }
    clearLogs() {
        this.logs = [];
        this.saveLogs();
    }
    clearOldLogs(maxAge) {
        const cutoff = Date.now() - maxAge;
        this.logs = this.logs.filter(log => log.timestamp > cutoff);
        this.saveLogs();
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getConfig() {
        return { ...this.config };
    }
}
UnifiedLoggingService.instance = null;
export default UnifiedLoggingService;
