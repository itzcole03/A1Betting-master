import React from 'react';
interface ErrorMessageProps {
    error: Error | unknown;
    onRetry?: () => void;
}
export declare const ErrorMessage: React.FC<ErrorMessageProps>;
export {};
