import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from 'chart.js';
import { FaChartLine, FaCalculator, FaExchangeAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { calculateKellyCriterion, americanToDecimal } from '../utils/odds';
import { motion } from 'framer-motion';
import { useApiRequest } from '../hooks/useApiRequest';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
const Analytics = () => {
    // State for Kelly calculator
    const [kellyBankroll, setKellyBankroll] = useState(1000);
    const [kellyProb, setKellyProb] = useState(0.5);
    const [kellyOdds, setKellyOdds] = useState(-110);
    const [kellyFraction, setKellyFraction] = useState(1);
    // Fetch user performance data
    const { data: perf, isLoading: perfLoading, error: perfError, } = useApiRequest('/api/user/performance');
    // Fetch arbitrage opportunities
    const { data: arbs, isLoading: arbsLoading, error: arbsError, } = useApiRequest('/api/arbitrage/opportunities');
    // Chart data for recent history
    const chartData = useMemo(() => {
        if (!perf) {
            return {
                labels: [],
                datasets: [],
            };
        }
        return {
            labels: perf.recentHistory.labels,
            datasets: perf.recentHistory.datasets.map((dataset) => ({
                ...dataset,
                fill: true,
                tension: 0.4,
                borderColor: dataset.borderColor || 'rgb(16, 185, 129)',
                backgroundColor: dataset.backgroundColor || 'rgba(16, 185, 129, 0.1)',
            })),
        };
    }, [perf]);
    // Kelly calculation
    const kellyStake = useMemo(() => {
        const decOdds = americanToDecimal(Number(kellyOdds));
        return calculateKellyCriterion(Number(kellyProb), decOdds, Number(kellyBankroll), Number(kellyFraction));
    }, [kellyBankroll, kellyProb, kellyOdds, kellyFraction]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaChartLine, { className: "w-5 h-5 mr-2 text-primary-500" }), "My Performance"] }), perfLoading ? (_jsx("div", { className: "text-gray-500 animate-pulse-soft", children: "Loading performance..." })) : perfError ? (_jsx("div", { className: "text-red-500", children: perfError.message })) : perf ? (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Total Bets" }), _jsx("div", { className: "text-2xl font-bold", children: perf.totalBets })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Win Rate" }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: [(perf.winRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "Profit" }), _jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["$", perf.profit.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-500", children: "ROI" }), _jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [(perf.roi * 100).toFixed(1), "%"] })] })] })) : null, _jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: { duration: 800 },
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: 'rgba(156,163,175,0.1)' } },
                                    x: { grid: { display: false } },
                                },
                            } }) })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.1 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaCalculator, { className: "w-5 h-5 mr-2 text-primary-500" }), "Kelly Criterion Calculator"] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Bankroll" }), _jsx("input", { className: "premium-input w-full", min: 1, type: "number", value: kellyBankroll, onChange: e => setKellyBankroll(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Win Probability" }), _jsx("input", { className: "premium-input w-full", max: 1, min: 0, step: 0.01, type: "number", value: kellyProb, onChange: e => setKellyProb(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Odds (American)" }), _jsx("input", { className: "premium-input w-full", type: "number", value: kellyOdds, onChange: e => setKellyOdds(Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Fraction" }), _jsx("input", { className: "premium-input w-full", max: 1, min: 0.01, step: 0.01, type: "number", value: kellyFraction, onChange: e => setKellyFraction(Number(e.target.value)) })] })] }), _jsxs("div", { className: "mt-2 text-lg font-bold text-green-600", children: ["Optimal Bet: $", kellyStake.toFixed(2)] })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.2 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaExchangeAlt, { className: "w-5 h-5 mr-2 text-primary-500" }), "Arbitrage Opportunities"] }), arbsLoading ? (_jsx("div", { className: "text-gray-500 animate-pulse-soft", children: "Loading opportunities..." })) : arbsError ? (_jsx("div", { className: "text-red-500", children: arbsError.message })) : arbs && arbs.length > 0 ? (_jsx("div", { className: "space-y-4", children: arbs.map(opp => (_jsx("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-medium", children: opp.player.name }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: opp.player.team.abbreviation }), _jsx("span", { className: "text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded", children: opp.propType })] }), _jsx("div", { className: "mt-2 grid grid-cols-2 gap-4", children: opp.books.map(book => (_jsxs("div", { className: "text-sm", children: [_jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [book.name, ":"] }), _jsxs("span", { className: "ml-1 font-medium", children: [book.line, " @ ", book.odds > 0 ? '+' : '', book.odds] })] }, book.name))) })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Potential Profit" }), _jsxs("span", { className: "text-lg font-bold text-green-500", children: ["$", opp.potentialProfit.toFixed(2)] })] }), _jsxs("div", { className: "mt-2 text-xs text-gray-400", children: ["Expires: ", new Date(opp.expiresAt).toLocaleTimeString()] })] })] }) }, opp.id))) })) : (_jsx("div", { className: "text-gray-500", children: "No arbitrage opportunities found." }))] })] }));
};
// React.memo is used here to prevent unnecessary re-renders of Analytics when its props/state do not change.
// This is beneficial because Analytics fetches data and renders charts, which can be expensive operations.
export default React.memo(Analytics);
