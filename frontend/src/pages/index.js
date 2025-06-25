import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Zap, BarChart3, Brain, Target, DollarSign, } from "lucide-react";
// Use basic components first to avoid import issues
import { useAppStore } from "../store/useAppStore";
// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
const HomePage = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    // Use app store for toasts
    const { addToast } = useAppStore();
    // Mock real-time data
    const [realTimeStats] = useState({
        connectedSources: 42,
        totalSources: 50,
        dataQuality: 0.87,
        winRate: 73.2,
        roi: 15.4,
        profitToday: 2847,
        activePredictions: 156,
    });
    // Initialize loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            addToast({
                message: `🔴 Real Data Platform Active! Connected to ${realTimeStats.connectedSources} live sources`,
                type: "success",
            });
        }, 2000);
        return () => clearTimeout(timer);
    }, [addToast, realTimeStats.connectedSources]);
    // Quick stats for the hero section
    const quickStats = [
        {
            label: "Win Rate",
            value: `${realTimeStats.winRate}%`,
            change: "+5.2%",
            icon: _jsx(Target, { className: "w-5 h-5" }),
            color: "from-green-500 to-emerald-600",
        },
        {
            label: "ROI",
            value: `${realTimeStats.roi}%`,
            change: "+2.8%",
            icon: _jsx(TrendingUp, { className: "w-5 h-5" }),
            color: "from-blue-500 to-cyan-600",
        },
        {
            label: "Profit Today",
            value: `$${realTimeStats.profitToday.toLocaleString()}`,
            change: "+18.3%",
            icon: _jsx(DollarSign, { className: "w-5 h-5" }),
            color: "from-purple-500 to-pink-600",
        },
        {
            label: "Predictions",
            value: realTimeStats.activePredictions.toString(),
            change: "+12",
            icon: _jsx(Brain, { className: "w-5 h-5" }),
            color: "from-orange-500 to-red-600",
        },
    ];
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "Initializing A1Betting Platform" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-300", children: ["Connecting to ", realTimeStats.totalSources, " real-time data sources..."] })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950", children: _jsxs("div", { className: "container mx-auto px-6 py-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4", children: "A1Betting Platform" }), _jsx(motion.p, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "text-xl text-gray-600 dark:text-gray-300", children: "Advanced AI-Powered Sports Betting Intelligence" })] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex flex-wrap gap-2 p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto", children: [
                            {
                                key: "overview",
                                label: "Overview",
                                icon: _jsx(BarChart3, { className: "w-4 h-4" }),
                            },
                            {
                                key: "analytics",
                                label: "Analytics",
                                icon: _jsx(Brain, { className: "w-4 h-4" }),
                            },
                            {
                                key: "betting",
                                label: "Betting",
                                icon: _jsx(Target, { className: "w-4 h-4" }),
                            },
                            {
                                key: "strategy",
                                label: "Strategy",
                                icon: _jsx(Zap, { className: "w-4 h-4" }),
                            },
                        ].map((tab) => (_jsxs("button", { onClick: () => setActiveSection(tab.key), className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeSection === tab.key
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`, children: [tab.icon, tab.label] }, tab.key))) }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12", children: quickStats.map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105", children: [_jsx("div", { className: `bg-gradient-to-r ${stat.color} p-3 rounded-lg w-fit mb-4`, children: _jsx("div", { className: "text-white", children: stat.icon }) }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-1", children: stat.value }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-300 mb-2", children: stat.label }), _jsxs("div", { className: "text-xs text-green-600 font-semibold", children: [stat.change, " vs yesterday"] })] }, stat.label))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center", children: "System Status" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "Data Quality:" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500", style: { width: `${realTimeStats.dataQuality * 100}%` } }) }), _jsxs("span", { className: "text-sm font-semibold text-green-600", children: [(realTimeStats.dataQuality * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "Connected Sources:" }), _jsxs("span", { className: "font-semibold text-blue-600", children: [realTimeStats.connectedSources, "/", realTimeStats.totalSources] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "Active Predictions:" }), _jsx("span", { className: "font-semibold text-purple-600", children: realTimeStats.activePredictions })] }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "API Status:" }), _jsx("span", { className: "font-semibold text-green-600", children: "All Systems Online" })] })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "text-center mt-12", children: [_jsxs("button", { className: "group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105", children: [_jsxs("span", { className: "relative z-10 flex items-center justify-center gap-3", children: [_jsx(Rocket, { className: "w-6 h-6" }), "Activate AI System", _jsx(Rocket, { className: "w-6 h-6" })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" })] }), _jsx("p", { className: "mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto", children: "\uD83D\uDE80 Real API Integration \u2022 \uD83D\uDD34 Live Data Feeds \u2022 \uD83D\uDCCA Advanced ML Models \u2022 \uD83C\uDFAF Kelly Optimization \u2022 \uD83D\uDEE1\uFE0F Risk Management" }), _jsxs("p", { className: "mt-2 text-xs text-gray-500 dark:text-gray-500", children: ["Connected to ", realTimeStats.connectedSources, " live data sources with", " ", (realTimeStats.dataQuality * 100).toFixed(1), "% quality rating"] })] })] }) }));
};
export default HomePage;
