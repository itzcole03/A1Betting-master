import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const Skeleton = ({ className = '', variant = 'text', height, width, animate = true, }) => {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';
    const variantClasses = {
        text: 'rounded',
        rectangular: 'rounded-md',
        circular: 'rounded-full',
    };
    const style = {
        height: height || (variant === 'text' ? '1em' : '100%'),
        width: width || '100%',
    };
    if (!animate) {
        return (_jsx("div", { className: `${baseClasses} ${variantClasses[variant]} ${className}`, style: style }));
    }
    return (_jsx(motion.div, { className: `${baseClasses} ${variantClasses[variant]} ${className} overflow-hidden relative`, style: style, children: _jsx(motion.div, { animate: {
                translateX: ['-100%', '100%'],
            }, className: "absolute inset-0 -translate-x-full", transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            }, children: _jsx("div", { className: "w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" }) }) }));
};
export const SkeletonText = ({ lines = 1, ...props }) => {
    return (_jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => (_jsx(Skeleton, { variant: "text", width: i === lines - 1 ? '75%' : '100%', ...props }, i))) }));
};
export const SkeletonCard = ({ rows = 3 }) => {
    return (_jsxs("div", { className: "p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4", children: [_jsx(Skeleton, { height: 200, variant: "rectangular" }), _jsx(SkeletonText, { lines: rows })] }));
};
