import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const EnhancedMetricCard = ({ label, value, icon, change, trend = "neutral", className = "", glowing = false, }) => {
    const trendColors = {
        up: "text-green-400",
        down: "text-red-400",
        neutral: "text-gray-400",
    };
    const trendIcons = {
        up: "fa-arrow-up",
        down: "fa-arrow-down",
        neutral: "fa-minus",
    };
    return (_jsxs("div", { className: cn("metric-card rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105", glowing && "shadow-neon", className), style: {
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: glowing
                ? "0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.4)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
        }, children: [_jsx("div", { className: "text-3xl mb-3 text-electric-400 animate-float", children: _jsx("i", { className: icon }) }), _jsx("div", { className: "text-2xl font-bold mb-2 text-white", style: { fontFamily: "Inter, system-ui, sans-serif" }, children: value }), _jsx("div", { className: "text-gray-400 text-sm mb-2", children: label }), change && (_jsxs("div", { className: cn("flex items-center justify-center text-xs", trendColors[trend]), children: [_jsx("i", { className: cn("mr-1", trendIcons[trend]) }), change] }))] }));
};
export default EnhancedMetricCard;
