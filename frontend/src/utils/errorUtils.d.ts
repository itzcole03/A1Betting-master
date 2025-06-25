import { APIError } from '../services/api';
export interface ErrorDetails {
    code: string;
    message: string;
    details?: string | number | object;
    timestamp: number;
    path?: string;
}
export declare class ApplicationError extends Error {
    readonly code: string;
    readonly details?: string | number | object | undefined;
    constructor(code: string, message: string, details?: string | number | object | undefined);
    toJSON(): ErrorDetails;
}
export declare function isAPIError(error: unknown): error is APIError;
export declare function isApplicationError(error: unknown): error is ApplicationError;
export declare function normalizeError(error: unknown): ApplicationError;
export declare function createErrorHandler(context: string): (error: unknown) => ApplicationError;
export declare function handleNetworkError(error: unknown): ApplicationError;
export declare function handleTimeoutError(error: unknown): ApplicationError;
export declare function handleAuthenticationError(error: unknown): ApplicationError;
export declare function getErrorMessage(error: unknown): string;
