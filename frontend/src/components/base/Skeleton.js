import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/classNames';
export const Skeleton = ({ className, variant = 'text', height, width, animate = true, }) => {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';
    const animationClasses = animate ? 'animate-pulse' : '';
    const variantClasses = {
        text: 'rounded',
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
    };
    const style = {
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
    };
    return (_jsx("div", { className: cn(baseClasses, animationClasses, variantClasses[variant], className), style: style }));
};
export const SkeletonText = ({ lines = 1, ...props }) => {
    return (_jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => (_jsx(Skeleton, { variant: "text", width: i === lines - 1 ? '75%' : '100%', ...props }, i))) }));
};
export const SkeletonCard = ({ rows = 3 }) => {
    return (_jsxs("div", { className: "space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4", children: [_jsx(Skeleton, { height: 200, variant: "rectangular" }), _jsx(SkeletonText, { lines: rows })] }));
};
