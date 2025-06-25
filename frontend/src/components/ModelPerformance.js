import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const ModelPerformance = ({ modelMetricsData }) => {
    const displayMetrics = [
        {
            label: 'Win Rate',
            value: `${(modelMetricsData.winRate * 100).toFixed(1)}%`,
            color: modelMetricsData.winRate >= 0.55 ? 'text-green-600' : 'text-red-600',
        },
        {
            label: 'Profit Factor (ROI)',
            value: `${(modelMetricsData.profitFactor * 100).toFixed(1)}%`,
            color: modelMetricsData.profitFactor > 0 ? 'text-green-600' : 'text-red-600',
        },
        {
            label: 'Total Predictions',
            value: modelMetricsData.totalPredictions.toString(),
            color: 'text-blue-600',
        },
        {
            label: 'Avg. Confidence',
            value: `${(modelMetricsData.averageConfidence * 100).toFixed(1)}%`,
            color: modelMetricsData.averageConfidence >= 0.7 ? 'text-green-600' : 'text-yellow-600',
        },
    ];
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Model Performance" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: displayMetrics.map((metric, index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg p-4 shadow-sm", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: metric.label }), _jsx("div", { className: `text-xl font-bold ${metric.color}`, children: metric.value })] }, metric.label))) })] }));
};
export default React.memo(ModelPerformance);
