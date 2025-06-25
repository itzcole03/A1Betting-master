// Centralized logger: swap out console.* for Sentry, Datadog, etc. here for production
class Logger {
    constructor(context) {
        this.context = context;
    }
    info(message, ...args) {
        // Replace with production logger if needed
        console.log(`[${this.context}] INFO: ${message}`, ...args);
    }
    error(message, ...args) {
        // Replace with production logger if needed
        console.error(`[${this.context}] ERROR: ${message}`, ...args);
    }
    warn(message, ...args) {
        // Replace with production logger if needed
        console.warn(`[${this.context}] WARN: ${message}`, ...args);
    }
    debug(message, ...args) {
        // Replace with production logger if needed
        console.debug(`[${this.context}] DEBUG: ${message}`, ...args);
    }
    trace(message, ...args) {
        // Replace with production logger if needed
        console.trace(`[${this.context}] TRACE: ${message}`, ...args);
    }
}
export function getLogger(context) {
    return new Logger(context);
}
