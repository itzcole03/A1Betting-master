import React from 'react';
export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
    showClose?: boolean;
    closeOnOverlayClick?: boolean;
    preventClose?: boolean;
}
export declare const Dialog: React.FC<DialogProps>;
