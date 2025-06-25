import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EntryStatus } from '@/types';
import { calculateProgressPercentage } from '../utils/odds';
import { motion } from 'framer-motion';
const progressVariants = {
    initial: { width: 0 },
    animate: (percentage) => ({
        width: `${percentage}%`,
        transition: { duration: 1, ease: 'easeOut' },
    }),
};
const glowVariants = {
    initial: { opacity: 0 },
    animate: { opacity: [0.4, 1, 0.4], transition: { duration: 2, repeat: Infinity } },
};
export const ProgressBar = ({ current, target, status, showPercentage = false, className = '', showGlow = true, animated = true, }) => {
    const percentage = calculateProgressPercentage(current, target);
    const getStatusColor = () => {
        switch (status) {
            case EntryStatus.WON:
                return {
                    bar: 'bg-green-500',
                    text: 'text-green-500',
                    glow: 'shadow-green-500/50',
                };
            case EntryStatus.LOST:
                return {
                    bar: 'bg-red-500',
                    text: 'text-red-500',
                    glow: 'shadow-red-500/50',
                };
            default:
                return {
                    bar: 'bg-primary-500',
                    text: 'text-primary-500',
                    glow: 'shadow-primary-500/50',
                };
        }
    };
    const { bar, text, glow } = getStatusColor();
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: `
          relative h-2 rounded-full overflow-hidden
          glass-morphism
          ${className}
        `, children: [_jsx("div", { className: "absolute inset-0 bg-gray-200 dark:bg-gray-700" }), _jsx(motion.div, { animate: "animate", className: `absolute inset-y-0 left-0 ${bar}`, custom: percentage, initial: "initial", variants: progressVariants }), showGlow && (_jsx(motion.div, { animate: "animate", className: `
              absolute inset-y-0 left-0
              w-full h-full
              bg-gradient-to-r from-transparent
              ${glow}
              blur-sm
            `, initial: "initial", style: { width: `${percentage}%` }, variants: glowVariants })), animated && percentage < 100 && status === EntryStatus.PENDING && (_jsx("div", { className: `
              absolute inset-y-0 left-0 
              bg-gradient-to-r from-transparent via-white/10 to-transparent
              animate-[progress-stripe_1s_linear_infinite]
            `, style: {
                            width: `${percentage}%`,
                            backgroundSize: '20px 100%',
                            animation: 'progress-stripe 1s linear infinite',
                        } }))] }), showPercentage && (_jsx("div", { className: "absolute -top-6 right-0", children: _jsxs(motion.span, { animate: { opacity: 1, y: 0 }, className: `text-xs font-medium ${text}`, initial: { opacity: 0, y: 10 }, children: [percentage, "%"] }) }))] }));
};
