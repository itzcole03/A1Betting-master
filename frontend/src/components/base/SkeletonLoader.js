import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
/**
 * A simple, reusable skeleton loader component to indicate loading states.
 * Supports different shapes, sizes, and counts.
 */
const SkeletonLoader = ({ className = '', count = 1, height = '1rem', width = '100%', variant = 'text', style = {}, }) => {
    const elements = [];
    const baseStyle = 'animate-pulse bg-gradient-to-r from-primary-700/10 via-primary-500/10 to-white/10 glass shadow-inner';
    let variantStyle = '';
    switch (variant) {
        case 'circle':
            variantStyle = `rounded-full`;
            break;
        case 'rect':
            variantStyle = `rounded-md`;
            break;
        case 'text':
        default:
            variantStyle = `rounded`;
            break;
    }
    for (let i = 0; i < count; i++) {
        elements.push(_jsx("div", { className: `${baseStyle} ${variantStyle} ${className}`, style: {
                height,
                width,
                ...(variant === 'text' && i > 0 && { marginTop: '0.5rem' }), // Add margin for multi-line text skeletons
                ...style,
            } }, i));
    }
    if (count === 1) {
        return elements[0];
    }
    return _jsx(_Fragment, { children: elements });
};
export default React.memo(SkeletonLoader);
