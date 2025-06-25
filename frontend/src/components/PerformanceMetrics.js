import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
export const PerformanceMetrics = ({ bankroll, profit, riskProfile, recommendations, }) => {
    const totalBets = recommendations.length;
    const winningBets = recommendations.filter(rec => rec.result === 'win').length;
    const winRate = totalBets > 0 ? winningBets / totalBets : 0;
    const roi = bankroll > 0 ? (profit / bankroll) * 100 : 0;
    const metrics = [
        {
            label: 'Total Bankroll',
            value: formatCurrency(bankroll),
            trend: profit >= 0 ? 'up' : 'down',
        },
        {
            label: 'Profit/Loss',
            value: formatCurrency(profit),
            trend: profit >= 0 ? 'up' : 'down',
        },
        {
            label: 'Win Rate',
            value: formatPercentage(winRate),
            trend: winRate >= 0.5 ? 'up' : 'down',
        },
        {
            label: 'ROI',
            value: formatPercentage(roi / 100),
            trend: roi >= 0 ? 'up' : 'down',
        },
        {
            label: 'Risk Profile',
            value: riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1),
            trend: 'neutral',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: metrics.map((metric, index) => (_jsxs("div", { className: `bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in`, style: { animationDelay: `${index * 100}ms` }, children: [_jsx("h4", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-1", children: metric.label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: metric.value }), metric.trend !== 'neutral' && (_jsx("span", { className: `text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`, children: metric.trend === 'up' ? '↑' : '↓' }))] })] }, metric.label))) }));
};
export default React.memo(PerformanceMetrics);
