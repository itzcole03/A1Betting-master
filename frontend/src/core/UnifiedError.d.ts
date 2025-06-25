/**
 * UnifiedError
 *
 * Centralized error handling, logging, and reporting utilities.
 * Can extend base Error class for custom error types specific to the application.
 *
 * Key Responsibilities:
 * 1. Define custom error classes (e.g., APIError, ValidationError, PredictionError) for better categorization.
 * 2. Provide utility functions to log errors consistently (e.g., to console, Sentry, or a backend logging service).
 * 3. Format error messages for user display (e.g., user-friendly toasts or messages in ErrorBoundary).
 * 4. Centralize error reporting to external services like Sentry, including context.
 * 5. Potentially handle specific error types with custom logic (e.g., retry mechanisms for network errors).
 */
export declare enum ErrorSeverity {
    Info = "info",
    Warning = "warning",
    Error = "error",
    Critical = "critical"
}
export interface ErrorContext {
    [key: string]: any;
}
export declare class AppError extends Error {
    readonly context?: ErrorContext;
    readonly originalError?: any;
    constructor(message: string, context?: ErrorContext, originalError?: any);
}
export declare class APIError extends Error {
    readonly status?: number;
    readonly response?: any;
    constructor(message: string, status?: number, response?: any);
}
export declare class ValidationError extends AppError {
    constructor(message: string, context?: ErrorContext, originalError?: any);
}
export declare class SystemError extends AppError {
    constructor(message: string, context?: ErrorContext, originalError?: any);
}
export declare const handleAppError: (error: any, customContext?: ErrorContext) => void;
/**
 * Generates a user-friendly message from an error.
 * @param error The error object (preferably an AppError).
 * @returns A string suitable for display to the user.
 */
export declare const getUserFriendlyMessage: (error: any) => string;
export declare const unifiedError: {
    AppError: typeof AppError;
    APIError: typeof APIError;
    ValidationError: typeof ValidationError;
    SystemError: typeof SystemError;
    handleAppError: (error: any, customContext?: ErrorContext) => void;
    getUserFriendlyMessage: (error: any) => string;
    ErrorSeverity: typeof ErrorSeverity;
};
