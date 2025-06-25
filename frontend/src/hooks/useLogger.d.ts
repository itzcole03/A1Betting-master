import React, { ReactNode } from 'react';
interface LoggerContextType {
    log: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
    info: (message: string) => void;
}
export declare const useLogger: () => LoggerContextType;
interface LoggerProviderProps {
    children: ReactNode;
}
export declare const LoggerProvider: React.FC<LoggerProviderProps>;
export {};
