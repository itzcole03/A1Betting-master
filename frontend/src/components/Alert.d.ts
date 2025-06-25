import React from 'react';
export interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message: string;
    onClose?: () => void;
    className?: string;
    closable?: boolean;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare const Alert: React.FC<AlertProps>;
