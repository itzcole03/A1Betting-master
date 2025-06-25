import React from 'react';
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
    showClose?: boolean;
    closeOnOverlayClick?: boolean;
}
export declare const Modal: React.FC<ModalProps>;
