import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const MetricCard = ({ label, value, icon, change, trend = "up", }) => {
    const trendColor = trend === "up"
        ? "text-green-400"
        : trend === "down"
            ? "text-red-400"
            : "text-gray-400";
    const trendIcon = trend === "up"
        ? "fa-arrow-up"
        : trend === "down"
            ? "fa-arrow-down"
            : "fa-minus";
    const handleMouseEnter = (e) => {
        e.currentTarget.style.boxShadow =
            "0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.4)";
        e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)";
    };
    const handleMouseLeave = (e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
    };
    return (_jsxs("div", { className: "glass-card rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer", style: {
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [_jsx("div", { className: "text-3xl mb-3 text-electric-400", children: _jsx("i", { className: icon }) }), _jsx("div", { className: "text-2xl font-bold mb-2 text-white", children: value }), _jsx("div", { className: "text-gray-400 text-sm mb-2", children: label }), change && (_jsxs("div", { className: `flex items-center justify-center text-xs ${trendColor}`, children: [_jsx("i", { className: `${trendIcon} mr-1` }), change] }))] }));
};
export default MetricCard;
