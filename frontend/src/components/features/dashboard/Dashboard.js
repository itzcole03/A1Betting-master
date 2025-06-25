import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ESPNHeadlinesTicker from './ESPNHeadlinesTicker';
import EntryTracking from './EntryTracking';
import MLInsights from '../insights/MLInsights';
import MoneyMaker from './MoneyMaker';
import PerformanceChart from '../charts/PerformanceChart';
import PropCards from './PropCards';
import { useEffect } from 'react';
import UserStats from '../analytics/UserStats';
import { useAppStore } from '@/store/useAppStore';
const Dashboard = () => {
    const { fetchProps, fetchEntries, fetchHeadlines,
    // fetchSentiments, // Removed as it was example, can be added if specific dashboard sentiment is needed
     } = useAppStore(state => ({
        fetchProps: state.fetchProps,
        fetchEntries: state.fetchEntries,
        fetchHeadlines: state.fetchHeadlines,
        // fetchSentiments: state.fetchSentiments,
    }));
    useEffect(() => {
        // Initial data fetching for the dashboard
        fetchProps();
        fetchEntries();
        fetchHeadlines();
        // fetchSentiments('general_market'); // Example for dashboard-specific sentiment if needed
    }, [fetchProps, fetchEntries, fetchHeadlines]);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "w-full glass rounded-3xl shadow-2xl p-8 bg-gradient-to-br from-primary-700/80 to-primary-500/80 flex flex-col md:flex-row items-center justify-between mb-6 animate-fade-in", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg", children: "AI Sports Analytics Platform" }), _jsx("div", { className: "text-lg text-primary-100/90 mb-4 font-medium", children: "Real-time data \u2022 Advanced ML predictions \u2022 84%+ win rates" })] }), _jsxs("div", { className: "flex flex-row flex-wrap gap-6 items-center justify-end", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-2xl md:text-3xl font-extrabold text-white", children: "68.9%" }), _jsx("span", { className: "text-xs text-primary-200/80", children: "AI Accuracy" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-2xl md:text-3xl font-extrabold text-green-300", children: "+$1.8K" }), _jsx("span", { className: "text-xs text-primary-200/80", children: "Monthly P&L" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-2xl md:text-3xl font-extrabold text-yellow-300", children: "7" }), _jsx("span", { className: "text-xs text-primary-200/80", children: "Active Arbs" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-2xl md:text-3xl font-extrabold text-blue-200", children: "41.3%" }), _jsx("span", { className: "text-xs text-primary-200/80", children: "Monthly ROI" })] })] })] }), _jsxs("div", { className: "w-full glass rounded-2xl shadow-xl p-6 bg-gradient-to-br from-green-700/80 to-green-500/80 mb-6 animate-fade-in", children: [_jsxs("h2", { className: "text-2xl font-bold text-green-100 mb-2 flex items-center", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCB0" }), " Let's Get Money"] }), _jsx("div", { className: "text-green-200 text-base font-medium mb-2", children: "AI finds the highest-paying 84%+ win probability lineup" }), _jsx(MoneyMaker, {})] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs("div", { className: "p-6 glass rounded-xl shadow-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-text mb-3", children: "Key Performance Indicators" }), _jsx(UserStats, {})] }) }), _jsx(EntryTracking, {})] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(PropCards, {}) }), _jsxs("div", { className: "p-6 glass rounded-xl shadow-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-text mb-3", children: "Performance Analytics" }), _jsx(PerformanceChart, {})] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(ESPNHeadlinesTicker, {}), _jsxs("div", { className: "p-6 glass rounded-xl shadow-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-text mb-3", children: "AI/ML Insights" }), _jsx(MLInsights, {})] })] })] }));
};
export default Dashboard;
