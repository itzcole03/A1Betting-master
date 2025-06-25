import React from 'react';
interface WithErrorBoundaryOptions {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
export declare function withErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<P>, options?: WithErrorBoundaryOptions): {
    (props: P): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export {};
