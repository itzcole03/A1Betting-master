import { ErrorContext } from './UnifiedError';
export declare class SystemError extends Error {
    readonly context: ErrorContext;
    constructor(message: string, details?: Record<string, any>);
}
