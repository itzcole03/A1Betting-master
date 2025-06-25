import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { formatPercentage, formatTimeAgo } from '../../utils/formatters';
export const LivePredictions = ({ predictions }) => {
    // Sort predictions by timestamp, most recent first
    const sortedPredictions = [...predictions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const getStatusColor = (status) => {
        switch (status) {
            case 'won':
                return 'text-green-500';
            case 'lost':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };
    return (_jsx("div", { className: "space-y-4", children: sortedPredictions.map(prediction => (_jsx(motion.div, { animate: { opacity: 1, x: 0 }, className: "p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow", initial: { opacity: 0, x: -20 }, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: prediction.id }), _jsxs("div", { className: "mt-2 space-y-1", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Prediction: " }), _jsx("span", { className: "font-medium", children: formatPercentage(prediction.prediction) })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Confidence: " }), _jsx("span", { className: "font-medium", children: formatPercentage(prediction.confidence) })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Time: " }), _jsx("span", { className: "font-medium", children: formatTimeAgo(new Date(prediction.timestamp)) })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-lg font-bold text-yellow-500", children: "LIVE" }), _jsx("div", { className: "mt-2", children: _jsx("button", { className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors", children: "View Details" }) })] })] }) }, prediction.id))) }));
};
