export class FeatureLogger {
    constructor(config) {
        this.config = {
            logLevel: config?.logLevel || 'info',
            logFormat: config?.logFormat || 'json',
            logOutput: config?.logOutput || 'console',
            logFile: config?.logFile || 'feature-engineering.log',
            maxLogSize: config?.maxLogSize || 10 * 1024 * 1024, // 10MB
            maxLogFiles: config?.maxLogFiles || 5,
        };
    }
    info(message, data) {
        this.log('info', message, data);
    }
    warn(message, data) {
        this.log('warn', message, data);
    }
    error(message, error) {
        this.log('error', message, error);
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
    log(level, message, data) {
        if (!this.shouldLog(level)) {
            return;
        }
        const logEntry = this.createLogEntry(level, message, data);
        const formattedLog = this.formatLog(logEntry);
        this.writeLog(formattedLog);
    }
    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.config.logLevel);
        const targetLevelIndex = levels.indexOf(level);
        return targetLevelIndex <= currentLevelIndex;
    }
    createLogEntry(level, message, data) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
        };
        if (data) {
            if (data instanceof Error) {
                entry.error = {
                    name: data.name,
                    message: data.message,
                    stack: data.stack,
                };
            }
            else {
                entry.data = data;
            }
        }
        return entry;
    }
    formatLog(entry) {
        if (this.config.logFormat === 'json') {
            return JSON.stringify(entry);
        }
        // Simple text format
        const timestamp = entry.timestamp;
        const level = entry.level.toUpperCase();
        const message = entry.message;
        let formatted = `[${timestamp}] ${level}: ${message}`;
        if (entry.error) {
            formatted += `\nError: ${entry.error.name}: ${entry.error.message}`;
            if (entry.error.stack) {
                formatted += `\nStack: ${entry.error.stack}`;
            }
        }
        else if (entry.data) {
            formatted += `\nData: ${JSON.stringify(entry.data, null, 2)}`;
        }
        return formatted;
    }
    writeLog(formattedLog) {
        if (this.config.logOutput === 'console') {
            this.writeToConsole(formattedLog);
        }
        else if (this.config.logOutput === 'file') {
            this.writeToFile(formattedLog);
        }
    }
    writeToConsole(formattedLog) {
        const level = formattedLog.includes('ERROR')
            ? 'error'
            : formattedLog.includes('WARN')
                ? 'warn'
                : formattedLog.includes('DEBUG')
                    ? 'debug'
                    : 'info';
        switch (level) {
            case 'error':
                console.error(formattedLog);
                break;
            case 'warn':
                console.warn(formattedLog);
                break;
            case 'debug':
                console.debug(formattedLog);
                break;
            default:
                console.log(formattedLog);
        }
    }
    writeToFile(formattedLog) {
        // This is a placeholder implementation
        // In a real application, implement file writing with rotation
        console.log(`[FILE] ${formattedLog}`);
    }
    getLogLevel() {
        return this.config.logLevel;
    }
    setLogLevel(level) {
        this.config.logLevel = level;
    }
    getLogFormat() {
        return this.config.logFormat;
    }
    setLogFormat(format) {
        this.config.logFormat = format;
    }
    getLogOutput() {
        return this.config.logOutput;
    }
    setLogOutput(output) {
        this.config.logOutput = output;
    }
}
