import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Target, Brain, Zap, Activity, Eye, Shield, Clock, } from "lucide-react";
// Import our modern components
import ModernActivityFeed from "../ui/ModernActivityFeed";
const MetricCard = ({ title, value, change, changeType = "neutral", icon, trend, loading = false, }) => {
    if (loading) {
        return (_jsx("div", { className: "p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-4 bg-gray-700/50 rounded w-3/4" }), _jsx("div", { className: "h-8 bg-gray-700/50 rounded w-1/2" }), _jsx("div", { className: "h-3 bg-gray-700/50 rounded w-2/3" })] }) }));
    }
    const getChangeColor = () => {
        switch (changeType) {
            case "positive":
                return "text-green-400";
            case "negative":
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };
    const getChangeIcon = () => {
        switch (changeType) {
            case "positive":
                return _jsx(TrendingUp, { size: 12 });
            case "negative":
                return _jsx(TrendingDown, { size: 12 });
            default:
                return null;
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.02 }, className: "p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl hover:border-gray-700/50 transition-all group cursor-pointer", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all", children: _jsx("div", { className: "text-blue-400 group-hover:text-blue-300 transition-colors", children: icon }) }), change !== undefined && (_jsxs("div", { className: `flex items-center space-x-1 text-sm ${getChangeColor()}`, children: [getChangeIcon(), _jsxs("span", { children: [change > 0 ? "+" : "", change, "%"] })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400", children: title }), _jsx("p", { className: "text-2xl font-bold text-white", children: value }), trend && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "flex-1 h-1 bg-gray-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000", style: { width: `${Math.max(...trend)}%` } }) }), _jsx("span", { className: "text-xs text-gray-500", children: "Trend" })] }))] })] }));
};
const OpportunityCard = ({ game, prediction, confidence, odds, value, timeLeft, status, }) => {
    const getStatusColor = () => {
        switch (status) {
            case "hot":
                return "from-red-500/20 to-orange-500/20 border-red-500/30";
            case "warm":
                return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
            case "cool":
                return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
        }
    };
    const getStatusIcon = () => {
        switch (status) {
            case "hot":
                return "🔥";
            case "warm":
                return "⚡";
            case "cool":
                return "❄️";
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.02 }, className: `p-6 rounded-2xl border bg-gradient-to-br backdrop-blur-xl hover:shadow-lg transition-all cursor-pointer ${getStatusColor()}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("span", { className: "text-lg", children: getStatusIcon() }), _jsx("h3", { className: "font-semibold text-white", children: game })] }), _jsx("p", { className: "text-sm text-gray-300", children: prediction })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Value" }), _jsxs("div", { className: "text-lg font-bold text-green-400", children: ["+", value, "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-400", children: "Confidence" }), _jsxs("div", { className: "text-sm font-medium text-white", children: [confidence, "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-400", children: "Odds" }), _jsx("div", { className: "text-sm font-medium text-white", children: odds })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-gray-400", children: "Time Left" }), _jsx("div", { className: "text-sm font-medium text-white", children: timeLeft })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-700/50", children: _jsx("button", { className: "w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all", children: "View Details" }) })] }));
};
export const ModernDashboardEnhancement = () => {
    const [metrics, setMetrics] = useState([
        {
            title: "Total Profit",
            value: "$12,847",
            change: 15.3,
            changeType: "positive",
            icon: _jsx(DollarSign, { size: 20 }),
            trend: [65, 78, 85, 92, 89],
        },
        {
            title: "Win Rate",
            value: "89.2%",
            change: 2.1,
            changeType: "positive",
            icon: _jsx(Target, { size: 20 }),
            trend: [82, 85, 87, 89, 89],
        },
        {
            title: "AI Confidence",
            value: "94.7%",
            change: 1.8,
            changeType: "positive",
            icon: _jsx(Brain, { size: 20 }),
            trend: [88, 91, 93, 95, 95],
        },
        {
            title: "Active Models",
            value: "47",
            change: 0,
            changeType: "neutral",
            icon: _jsx(Activity, { size: 20 }),
            trend: [45, 46, 47, 47, 47],
        },
    ]);
    const [opportunities] = useState([
        {
            game: "Lakers vs Warriors",
            prediction: "Over 235.5 Points",
            confidence: 94,
            odds: 1.85,
            value: 12.3,
            timeLeft: "2h 15m",
            status: "hot",
        },
        {
            game: "Celtics vs Heat",
            prediction: "Celtics -5.5",
            confidence: 87,
            odds: 1.92,
            value: 8.7,
            timeLeft: "4h 32m",
            status: "warm",
        },
        {
            game: "Nuggets vs Suns",
            prediction: "Under 228.5 Points",
            confidence: 81,
            odds: 1.78,
            value: 6.2,
            timeLeft: "6h 45m",
            status: "cool",
        },
    ]);
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: metrics.map((metric, index) => (_jsx(MetricCard, { ...metric }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-xl font-bold text-white flex items-center space-x-2", children: [_jsx(Zap, { size: 20, className: "text-yellow-400" }), _jsx("span", { children: "Live Opportunities" })] }), _jsx("button", { className: "text-sm text-blue-400 hover:text-blue-300 transition-colors", children: "View All" })] }), _jsx("div", { className: "space-y-4", children: opportunities.map((opportunity, index) => (_jsx(OpportunityCard, { ...opportunity }, index))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-green-500/20", children: _jsx(TrendingUp, { size: 16, className: "text-green-400" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Today's Performance" }), _jsx("div", { className: "text-lg font-bold text-green-400", children: "+$2,347" })] })] }) }), _jsx("div", { className: "p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-blue-500/20", children: _jsx(Eye, { size: 16, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Watching" }), _jsx("div", { className: "text-lg font-bold text-blue-400", children: "12 Games" })] })] }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(ModernActivityFeed, { maxItems: 6, showTimeline: true }), _jsxs("div", { className: "p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center space-x-2", children: [_jsx(Shield, { size: 18, className: "text-green-400" }), _jsx("span", { children: "System Status" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "API Status" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm text-green-400", children: "Online" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Model Performance" }), _jsx("span", { className: "text-sm text-white", children: "94.7%" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Data Latency" }), _jsx("span", { className: "text-sm text-white", children: "12ms" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Last Update" }), _jsxs("div", { className: "flex items-center space-x-1 text-sm text-gray-400", children: [_jsx(Clock, { size: 12 }), _jsx("span", { children: "Just now" })] })] })] })] })] })] })] }));
};
export default ModernDashboardEnhancement;
