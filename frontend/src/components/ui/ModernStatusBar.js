import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Wifi, Activity, TrendingUp, Clock, Zap, CheckCircle, AlertCircle, XCircle, } from "lucide-react";
const defaultItems = [
    {
        id: "connection",
        label: "Connection",
        value: "Online",
        status: "success",
        icon: _jsx(Wifi, { size: 14 }),
        lastUpdated: new Date(),
    },
    {
        id: "api",
        label: "API Status",
        value: "99.9%",
        status: "success",
        icon: _jsx(Activity, { size: 14 }),
        trend: "up",
    },
    {
        id: "latency",
        label: "Latency",
        value: "12ms",
        status: "success",
        icon: _jsx(Zap, { size: 14 }),
    },
    {
        id: "updates",
        label: "Live Updates",
        value: "Active",
        status: "active",
        icon: _jsx(TrendingUp, { size: 14 }),
    },
];
const getStatusColor = (status) => {
    switch (status) {
        case "success":
            return "text-green-400 bg-green-500/10 border-green-500/20";
        case "active":
            return "text-blue-400 bg-blue-500/10 border-blue-500/20";
        case "warning":
            return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        case "error":
            return "text-red-400 bg-red-500/10 border-red-500/20";
        default:
            return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
};
const getStatusIcon = (status) => {
    switch (status) {
        case "success":
            return _jsx(CheckCircle, { size: 12, className: "text-green-400" });
        case "warning":
            return _jsx(AlertCircle, { size: 12, className: "text-yellow-400" });
        case "error":
            return _jsx(XCircle, { size: 12, className: "text-red-400" });
        default:
            return null;
    }
};
const getTrendIcon = (trend) => {
    switch (trend) {
        case "up":
            return _jsx("span", { className: "text-green-400 text-xs", children: "\u2197" });
        case "down":
            return _jsx("span", { className: "text-red-400 text-xs", children: "\u2198" });
        default:
            return null;
    }
};
export const ModernStatusBar = ({ className = "", items = defaultItems, }) => {
    return (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: `
        fixed top-0 left-0 right-0 z-50
        backdrop-blur-xl bg-black/10 border-b border-white/5
        ${className}
      `, children: _jsx("div", { className: "max-w-full px-6 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center space-x-6", children: items.map((item) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1 }, className: "flex items-center space-x-2", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [item.icon && (_jsx("div", { className: "text-gray-400", children: item.icon })), getStatusIcon(item.status)] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-xs text-gray-400 font-medium", children: [item.label, ":"] }), _jsx("span", { className: `text-xs font-semibold ${getStatusColor(item.status).split(" ")[0]}`, children: item.value }), getTrendIcon(item.trend)] })] }, item.id))) }), _jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-500", children: [_jsx(Clock, { size: 12 }), _jsxs("span", { children: ["Last updated: ", new Date().toLocaleTimeString()] })] })] }) }) }));
};
export default ModernStatusBar;
