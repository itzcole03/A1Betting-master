import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Activity, Brain, Target, CheckCircle, XCircle, Clock, Zap, BarChart3, AlertTriangle, } from "lucide-react";
const defaultActivities = [
    {
        id: "1",
        type: "opportunity_found",
        title: "High Value Opportunity Detected",
        description: "Lakers vs Warriors Over 235.5 - 89% confidence prediction",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        metadata: {
            confidence: 89,
            odds: 1.85,
            game: "Lakers vs Warriors",
        },
        status: "info",
    },
    {
        id: "2",
        type: "bet_won",
        title: "Bet Won",
        description: "Celtics -5.5 hit successfully",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        metadata: {
            amount: 100,
            profit: 185,
            odds: 1.85,
            game: "Celtics vs Heat",
        },
        status: "success",
    },
    {
        id: "3",
        type: "prediction_generated",
        title: "AI Prediction Generated",
        description: "NBA model generated 12 new predictions",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        metadata: {
            confidence: 84,
            model: "NBA Advanced Model v2.1",
        },
        status: "info",
    },
    {
        id: "4",
        type: "bet_placed",
        title: "Bet Placed",
        description: "Warriors +7.5 vs Lakers",
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        metadata: {
            amount: 50,
            odds: 1.9,
            game: "Warriors vs Lakers",
        },
        status: "info",
    },
    {
        id: "5",
        type: "model_updated",
        title: "Model Updated",
        description: "NFL model updated with week 15 injury reports",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: {
            model: "NFL Predictive Model v3.2",
        },
        status: "info",
    },
    {
        id: "6",
        type: "alert_triggered",
        title: "Bankroll Alert",
        description: "Daily betting limit reached 75%",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: "warning",
    },
];
const getActivityIcon = (type, status) => {
    const iconClass = "w-4 h-4";
    switch (type) {
        case "bet_won":
            return _jsx(CheckCircle, { className: `${iconClass} text-green-400` });
        case "bet_lost":
            return _jsx(XCircle, { className: `${iconClass} text-red-400` });
        case "bet_placed":
            return _jsx(DollarSign, { className: `${iconClass} text-blue-400` });
        case "prediction_generated":
            return _jsx(Brain, { className: `${iconClass} text-purple-400` });
        case "model_updated":
            return _jsx(BarChart3, { className: `${iconClass} text-cyan-400` });
        case "opportunity_found":
            return _jsx(Target, { className: `${iconClass} text-yellow-400` });
        case "alert_triggered":
            return _jsx(AlertTriangle, { className: `${iconClass} text-orange-400` });
        default:
            return _jsx(Activity, { className: `${iconClass} text-gray-400` });
    }
};
const getStatusColor = (status) => {
    switch (status) {
        case "success":
            return "border-green-400/30 bg-green-500/5";
        case "warning":
            return "border-yellow-400/30 bg-yellow-500/5";
        case "error":
            return "border-red-400/30 bg-red-500/5";
        default:
            return "border-gray-600/30 bg-gray-500/5";
    }
};
const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (minutes < 1)
        return "Just now";
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    return timestamp.toLocaleDateString();
};
export const ModernActivityFeed = ({ className = "", activities = defaultActivities, maxItems = 10, showTimeline = true, }) => {
    const displayActivities = activities.slice(0, maxItems);
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Activity, { size: 18, className: "text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Recent Activity" })] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Last updated: ", new Date().toLocaleTimeString()] })] }), _jsx("div", { className: "space-y-3", children: displayActivities.map((activity, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: `
              relative p-4 rounded-xl border transition-all hover:bg-gray-800/30
              ${getStatusColor(activity.status)}
            `, children: [showTimeline && index < displayActivities.length - 1 && (_jsx("div", { className: "absolute left-6 top-12 w-px h-6 bg-gray-600/30" })), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 p-2 rounded-lg bg-gray-800/50", children: getActivityIcon(activity.type, activity.status) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-white", children: activity.title }), _jsx("p", { className: "mt-1 text-sm text-gray-300", children: activity.description })] }), _jsxs("div", { className: "flex items-center space-x-1 text-xs text-gray-500 ml-4", children: [_jsx(Clock, { size: 12 }), _jsx("span", { children: formatTimestamp(activity.timestamp) })] })] }), activity.metadata && (_jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [activity.metadata.amount && (_jsxs("div", { className: "flex items-center space-x-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs", children: [_jsx(DollarSign, { size: 12 }), _jsxs("span", { children: ["$", activity.metadata.amount] })] })), activity.metadata.profit && (_jsxs("div", { className: "flex items-center space-x-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs", children: [_jsx(TrendingUp, { size: 12 }), _jsxs("span", { children: ["+$", activity.metadata.profit] })] })), activity.metadata.odds && (_jsxs("div", { className: "flex items-center space-x-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs", children: [_jsx(Target, { size: 12 }), _jsx("span", { children: activity.metadata.odds })] })), activity.metadata.confidence && (_jsxs("div", { className: "flex items-center space-x-1 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs", children: [_jsx(Zap, { size: 12 }), _jsxs("span", { children: [activity.metadata.confidence, "%"] })] })), activity.metadata.game && (_jsx("div", { className: "px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-xs", children: activity.metadata.game })), activity.metadata.model && (_jsx("div", { className: "px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs", children: activity.metadata.model }))] }))] })] })] }, activity.id))) }), activities.length > maxItems && (_jsx("div", { className: "text-center", children: _jsxs("button", { className: "text-sm text-blue-400 hover:text-blue-300 transition-colors", children: ["View all ", activities.length, " activities"] }) }))] }));
};
export default ModernActivityFeed;
