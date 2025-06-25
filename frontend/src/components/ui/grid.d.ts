import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
interface GridProps {
    children: React.ReactNode;
    className?: string;
    layout?: any;
    onLayoutChange?: (layout: any) => void;
}
export declare const Grid: React.FC<GridProps>;
export {};
