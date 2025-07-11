import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveGridLayout = WidthProvider(Responsive);
export const Grid = ({ children, className = '', layout = {}, onLayoutChange, }) => {
    const defaultLayout = {
        lg: [
            { i: 'a', x: 0, y: 0, w: 1, h: 2 },
            { i: 'b', x: 1, y: 0, w: 1, h: 2 },
            { i: 'c', x: 2, y: 0, w: 1, h: 2 },
        ],
        md: [
            { i: 'a', x: 0, y: 0, w: 1, h: 2 },
            { i: 'b', x: 1, y: 0, w: 1, h: 2 },
            { i: 'c', x: 0, y: 2, w: 1, h: 2 },
        ],
        sm: [
            { i: 'a', x: 0, y: 0, w: 1, h: 2 },
            { i: 'b', x: 0, y: 2, w: 1, h: 2 },
            { i: 'c', x: 0, y: 4, w: 1, h: 2 },
        ],
    };
    const breakpoints = { lg: 1200, md: 996, sm: 768 };
    const cols = { lg: 3, md: 2, sm: 1 };
    return (_jsx(ResponsiveGridLayout, { isDraggable: true, isResizable: true, breakpoints: breakpoints, className: className, cols: cols, layouts: layout || defaultLayout, margin: [16, 16], rowHeight: 100, onLayoutChange: onLayoutChange, children: React.Children.map(children, (child, index) => (_jsx("div", { children: child }, String.fromCharCode(97 + index)))) }));
};
