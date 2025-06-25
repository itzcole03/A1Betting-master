import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const ModelPerformance = ({ analytics }) => {
    const metrics = [
        {
            label: 'Win Rate',
            value: `${(analytics.winRate * 100).toFixed(1)}%`,
            color: analytics.winRate >= 0.55 ? 'text-green-600' : 'text-red-600',
        },
        {
            label: 'ROI',
            value: `${(analytics.roi * 100).toFixed(1)}%`,
            color: analytics.roi > 0 ? 'text-green-600' : 'text-red-600',
        },
        {
            label: 'Total Bets',
            value: analytics.totalBets.toString(),
            color: 'text-blue-600',
        },
        {
            label: 'Confidence',
            value: `${(analytics.confidence * 100).toFixed(1)}%`,
            color: analytics.confidence >= 0.7 ? 'text-green-600' : 'text-yellow-600',
        },
    ];
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Model Performance" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: metrics.map((metric, index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg p-4 shadow-sm", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: metric.label }), _jsx("div", { className: `text-xl font-bold ${metric.color}`, children: metric.value })] }, metric.label))) })] }));
};
export default React.memo(ModelPerformance);
