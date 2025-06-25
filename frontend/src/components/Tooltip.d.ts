import React from 'react';
export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'right' | 'bottom' | 'left';
    delay?: number;
    className?: string;
    maxWidth?: string;
    arrow?: boolean;
}
export declare const Tooltip: React.FC<TooltipProps>;
