import { ErrorCategory, ErrorSeverity } from './UnifiedError';
export class SystemError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'SystemError';
        this.context = {
            code: 'SYSTEM_ERROR',
            message,
            category: ErrorCategory.SYSTEM,
            severity: ErrorSeverity.CRITICAL,
            timestamp: Date.now(),
            details,
        };
    }
}
