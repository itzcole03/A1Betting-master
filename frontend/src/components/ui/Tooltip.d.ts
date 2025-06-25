import React from 'react';
interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    delay?: number;
    position?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}
export declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
