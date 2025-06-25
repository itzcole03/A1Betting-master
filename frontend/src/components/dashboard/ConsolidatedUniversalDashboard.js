import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Activity, ArrowDownRight, Brain, ChevronRight, MoreHorizontal, Play, Pause, RefreshCw, Filter, PieChart, LineChart, AlertTriangle, CheckCircle, } from "lucide-react";
// ============================================================================
// MOCK DATA
// ============================================================================
const mockMetrics = [
    {
        id: "1",
        title: "Win Rate",
        value: "72.4%",
        change: "+2.3%",
        trend: "up",
        color: "green",
    },
    {
        id: "2",
        title: "Total Profit",
        value: "$18,247",
        change: "+$3,421",
        trend: "up",
        color: "blue",
    },
    {
        id: "3",
        title: "Active Bets",
        value: "8",
        change: "+3",
        trend: "up",
        color: "purple",
    },
    {
        id: "4",
        title: "Accuracy",
        value: "91.5%",
        change: "+1.2%",
        trend: "up",
        color: "orange",
    },
];
const mockOpportunities = [
    {
        id: "1",
        game: "Lakers vs Warriors",
        prediction: "Over 230.5",
        confidence: 94,
        value: "+12.3%",
        status: "live",
        timeLeft: "2h 15m",
    },
    {
        id: "2",
        game: "Celtics vs Heat",
        prediction: "Celtics -4.5",
        confidence: 87,
        value: "+8.7%",
        status: "upcoming",
        timeLeft: "4h 30m",
    },
    {
        id: "3",
        game: "Warriors vs Nets",
        prediction: "Under 225.5",
        confidence: 82,
        value: "+6.1%",
        status: "upcoming",
        timeLeft: "6h 45m",
    },
];
const mockRecentActivity = [
    {
        id: "1",
        type: "win",
        message: "Lakers Over 230.5 ✓",
        amount: "+$247",
        time: "5m ago",
    },
    {
        id: "2",
        type: "prediction",
        message: "New prediction: Celtics -4.5",
        confidence: "94%",
        time: "12m ago",
    },
    {
        id: "3",
        type: "win",
        message: "Warriors ML ✓",
        amount: "+$180",
        time: "1h ago",
    },
    {
        id: "4",
        type: "alert",
        message: "Value opportunity detected",
        time: "2h ago",
    },
];
// ============================================================================
// COMPONENTS
// ============================================================================
const MetricCard = ({ metric, index }) => {
    const getColorClasses = (color) => {
        switch (color) {
            case "green":
                return "border-green-200 bg-gradient-to-br from-green-50 to-green-100";
            case "blue":
                return "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100";
            case "purple":
                return "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100";
            case "orange":
                return "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100";
            default:
                return "border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100";
        }
    };
    const getTextColor = (color) => {
        switch (color) {
            case "green":
                return "text-green-700";
            case "blue":
                return "text-blue-700";
            case "purple":
                return "text-purple-700";
            case "orange":
                return "text-orange-700";
            default:
                return "text-gray-700";
        }
    };
    const getIconColor = (color) => {
        switch (color) {
            case "green":
                return "text-green-600";
            case "blue":
                return "text-blue-600";
            case "purple":
                return "text-purple-600";
            case "orange":
                return "text-orange-600";
            default:
                return "text-gray-600";
        }
    };
    const getGlowColor = (color) => {
        switch (color) {
            case "green":
                return "rgba(34, 197, 94, 0.1)";
            case "blue":
                return "rgba(59, 130, 246, 0.1)";
            case "purple":
                return "rgba(147, 51, 234, 0.1)";
            case "orange":
                return "rgba(251, 146, 60, 0.1)";
            default:
                return "rgba(156, 163, 175, 0.1)";
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1, duration: 0.5 }, whileHover: {
            y: -4,
            scale: 1.02,
            boxShadow: `0 20px 40px ${getGlowColor(metric.color)}`,
        }, className: `p-6 rounded-xl border-2 ${getColorClasses(metric.color)} hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden`, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: metric.title }), _jsx(motion.div, { whileHover: { rotate: 180, scale: 1.2 }, transition: { duration: 0.3 }, className: `p-2 rounded-lg ${getColorClasses(metric.color)} shadow-sm`, children: metric.trend === "up" ? (_jsx(TrendingUp, { className: `w-4 h-4 ${getIconColor(metric.color)}` })) : (_jsx(ArrowDownRight, { className: `w-4 h-4 ${getIconColor(metric.color)}` })) })] }), _jsx("div", { className: "mb-3", children: _jsx(motion.p, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: { delay: index * 0.1 + 0.2 }, className: `text-3xl font-bold ${getTextColor(metric.color)} tracking-tight`, children: metric.value }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: `text-sm font-medium ${getTextColor(metric.color)} flex items-center gap-1`, children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-400" }), metric.change, " from last period"] }), _jsx(motion.div, { whileHover: { scale: 1.1 }, className: "text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full", children: "24h" })] })] }), _jsx("div", { className: "absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-pulse" })] }));
};
const OpportunityCard = ({ opportunity }) => {
    return (_jsxs("div", { className: "p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${opportunity.status === "live"
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-orange-500"}` }), _jsx("h3", { className: "font-semibold text-gray-900", children: opportunity.game })] }), _jsx("span", { className: "text-green-600 font-bold text-sm", children: opportunity.value })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Prediction" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: opportunity.prediction })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Confidence" }), _jsxs("span", { className: "text-sm font-bold text-blue-600", children: [opportunity.confidence, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Time Left" }), _jsx("span", { className: "text-sm font-medium text-orange-600", children: opportunity.timeLeft })] })] }), _jsx("button", { className: "w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors", children: "View Details" })] }));
};
const ActivityItem = ({ activity, }) => {
    const getIcon = () => {
        switch (activity.type) {
            case "win":
                return _jsx(CheckCircle, { className: "w-4 h-4 text-green-600" });
            case "prediction":
                return _jsx(Brain, { className: "w-4 h-4 text-blue-600" });
            case "alert":
                return _jsx(AlertTriangle, { className: "w-4 h-4 text-orange-600" });
            default:
                return _jsx(Activity, { className: "w-4 h-4 text-gray-600" });
        }
    };
    return (_jsxs("div", { className: "flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors", children: [_jsx("div", { className: "flex-shrink-0", children: getIcon() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: activity.message }), activity.confidence && (_jsxs("p", { className: "text-xs text-blue-600", children: ["Confidence: ", activity.confidence] }))] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [activity.amount && (_jsx("p", { className: "text-sm font-bold text-green-600", children: activity.amount })), _jsx("p", { className: "text-xs text-gray-500", children: activity.time })] })] }));
};
// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
const ConsolidatedUniversalDashboard = () => {
    const [isLive, setIsLive] = useState(true);
    return (_jsx("div", { className: "min-h-full bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Welcome back, Alex" }), _jsx("p", { className: "text-gray-600", children: "Here's what's happening with your betting strategy today" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}` }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: isLive ? "Live Data" : "Offline" })] }), _jsx("button", { onClick: () => setIsLive(!isLive), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: isLive ? (_jsx(Pause, { className: "w-5 h-5 text-gray-600" })) : (_jsx(Play, { className: "w-5 h-5 text-gray-600" })) }), _jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(RefreshCw, { className: "w-5 h-5 text-gray-600" }) }), _jsx("button", { className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors", children: "New Prediction" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: mockMetrics.map((metric, index) => (_jsx(MetricCard, { metric: metric, index: index }, metric.id))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-50 rounded-lg", children: _jsx(Target, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Live Opportunities" }), _jsx("p", { className: "text-sm text-gray-600", children: "AI-detected high-value bets" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(Filter, { className: "w-4 h-4 text-gray-600" }) }), _jsxs("button", { className: "text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1", children: ["View All ", _jsx(ChevronRight, { className: "w-4 h-4" })] })] })] }), _jsx("div", { className: "space-y-4", children: mockOpportunities.map((opportunity) => (_jsx(OpportunityCard, { opportunity: opportunity }, opportunity.id))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Stats" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Today's Bets" }), _jsx("span", { className: "text-sm font-bold text-gray-900", children: "3" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "This Week" }), _jsx("span", { className: "text-sm font-bold text-green-600", children: "+$1,247" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Pending" }), _jsx("span", { className: "text-sm font-bold text-orange-600", children: "5 bets" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "AI Confidence" }), _jsx("span", { className: "text-sm font-bold text-blue-600", children: "94.2%" })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Recent Activity" }), _jsx("button", { className: "text-blue-600 hover:text-blue-700 text-sm font-medium", children: "View All" })] }), _jsx("div", { className: "space-y-2", children: mockRecentActivity.map((activity) => (_jsx(ActivityItem, { activity: activity }, activity.id))) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "System Status" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm text-gray-700", children: "Data Feed" })] }), _jsx("span", { className: "text-xs text-green-600 font-medium", children: "Operational" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm text-gray-700", children: "ML Models" })] }), _jsx("span", { className: "text-xs text-green-600 font-medium", children: "Operational" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-sm text-gray-700", children: "Predictions" })] }), _jsx("span", { className: "text-xs text-green-600 font-medium", children: "Operational" })] })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Performance Trend" }), _jsx("p", { className: "text-sm text-gray-600", children: "Profit over time" })] }), _jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(MoreHorizontal, { className: "w-5 h-5 text-gray-600" }) })] }), _jsx("div", { className: "h-64 flex items-center justify-center bg-gray-50 rounded-lg", children: _jsxs("div", { className: "text-center", children: [_jsx(LineChart, { className: "w-12 h-12 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Chart visualization would go here" })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Bet Distribution" }), _jsx("p", { className: "text-sm text-gray-600", children: "By sport and type" })] }), _jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(MoreHorizontal, { className: "w-5 h-5 text-gray-600" }) })] }), _jsx("div", { className: "h-64 flex items-center justify-center bg-gray-50 rounded-lg", children: _jsxs("div", { className: "text-center", children: [_jsx(PieChart, { className: "w-12 h-12 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Distribution chart would go here" })] }) })] })] })] }) }));
};
export default ConsolidatedUniversalDashboard;
