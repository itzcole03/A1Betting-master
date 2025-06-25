class LoggerService {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    info(message, meta) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, meta || '');
        }
        // In production, you would send this to your logging service
    }
    error(message, meta) {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, meta || '');
        }
        // In production, you would send this to your logging service
    }
    warn(message, meta) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, meta || '');
        }
        // In production, you would send this to your logging service
    }
    debug(message, meta) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, meta || '');
        }
        // In production, you would send this to your logging service
    }
}
export const logger = LoggerService.getInstance();
export default logger;
