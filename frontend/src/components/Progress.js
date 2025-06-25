import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../utils/classNames';
import { motion } from 'framer-motion';
const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};
const variants = {
    default: {
        base: 'bg-gray-200 dark:bg-gray-700',
        bar: 'bg-primary-500',
    },
    success: {
        base: 'bg-green-100 dark:bg-green-800/30',
        bar: 'bg-green-500',
    },
    warning: {
        base: 'bg-yellow-100 dark:bg-yellow-800/30',
        bar: 'bg-yellow-500',
    },
    danger: {
        base: 'bg-red-100 dark:bg-red-800/30',
        bar: 'bg-red-500',
    },
};
export const Progress = ({ value, max = 100, size = 'md', variant = 'default', showValue = false, valuePosition = 'right', label, className, animate = true, }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const renderValue = () => (_jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-200", children: [Math.round(percentage), "%"] }));
    return (_jsxs("div", { className: cn('w-full', className), children: [(label || (showValue && valuePosition === 'top')) && (_jsxs("div", { className: "mb-1 flex justify-between items-center", children: [label && (_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-200", children: label })), showValue && valuePosition === 'top' && renderValue()] })), _jsxs("div", { className: "relative flex items-center", children: [_jsx("div", { className: cn('w-full overflow-hidden rounded-full', variants[variant].base, sizes[size]), children: _jsx(motion.div, { animate: { width: `${percentage}%` }, className: cn('h-full rounded-full', variants[variant].bar), initial: animate ? { width: 0 } : false, transition: { duration: 0.5, ease: 'easeOut' } }) }), showValue && valuePosition === 'right' && (_jsx("div", { className: "ml-3 flex-shrink-0", children: renderValue() }))] }), showValue && valuePosition === 'bottom' && (_jsx("div", { className: "mt-1 flex justify-end", children: renderValue() }))] }));
};
