import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EntryStatus } from '@/types';
import { FaChartLine, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};
const progressVariants = {
    initial: { width: 0 },
    animate: (percentage) => ({
        width: `${percentage}%`,
        transition: { duration: 1, ease: 'easeOut' },
    }),
};
export const EntryCard = ({ entry, onClick }) => {
    const handleClick = () => {
        if (onClick)
            onClick();
    };
    const getStatusColor = (status) => {
        switch (status) {
            case EntryStatus.WON:
                return 'text-green-500';
            case EntryStatus.LOST:
                return 'text-red-500';
            default:
                return 'text-amber-500';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case EntryStatus.WON:
                return _jsx(FaCheckCircle, { className: "w-5 h-5" });
            case EntryStatus.LOST:
                return _jsx(FaTimesCircle, { className: "w-5 h-5" });
            default:
                return _jsx(FaSpinner, { className: "w-5 h-5 animate-spin" });
        }
    };
    return (_jsxs(motion.div, { animate: "animate", className: `
        glass-morphism
        relative overflow-hidden rounded-xl p-6 cursor-pointer
        hover:ring-1 hover:ring-primary-400
        transition-all duration-300 ease-in-out
      `, exit: "exit", initial: "initial", variants: cardVariants, onClick: handleClick, children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1", children: _jsx(motion.div, { animate: "animate", className: `h-full ${getStatusColor(entry.status)}`, custom: 0, initial: "initial", variants: progressVariants }) }), _jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [entry.type, " Entry"] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: new Date(entry.createdAt).toLocaleDateString() })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `${getStatusColor(entry.status)}`, children: getStatusIcon(entry.status) }), _jsx("span", { className: "text-lg font-bold text-primary-600 dark:text-primary-400", children: formatCurrency(entry.stake) })] })] }), _jsxs("div", { className: "mt-6 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaChartLine, { className: "w-4 h-4 text-primary-500" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Potential Winnings" })] }), _jsx("div", { className: "text-right", children: _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: formatCurrency(entry.potentialWinnings) }) })] })] }));
};
