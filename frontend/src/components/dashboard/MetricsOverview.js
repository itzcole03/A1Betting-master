import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Target, Activity, } from "lucide-react";
export const MetricsOverview = ({ className = "", layout = "grid", showTrends = true, }) => {
    const [metrics, setMetrics] = useState([
        {
            id: "win-rate",
            label: "Win Rate",
            value: 72.4,
            change: 2.3,
            changeType: "positive",
            icon: _jsx(Target, { size: 24 }),
            trend: [68, 70, 71, 72, 72.4],
            suffix: "%",
            description: "+2.3% this period",
            isPercentage: true,
            gradient: "from-green-500/20 to-emerald-500/20",
            borderColor: "border-green-500/30",
        },
        {
            id: "roi",
            label: "ROI",
            value: 15.8,
            change: 3.2,
            changeType: "positive",
            icon: _jsx(TrendingUp, { size: 24 }),
            trend: [12, 13.5, 14.2, 15.1, 15.8],
            suffix: "%",
            description: "+$3.2% this period",
            isPercentage: true,
            gradient: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-500/30",
        },
        {
            id: "profit-loss",
            label: "Profit/Loss",
            value: 4247.83,
            change: 24.8,
            changeType: "positive",
            icon: _jsx(DollarSign, { size: 24 }),
            trend: [3200, 3600, 3850, 4100, 4247.83],
            prefix: "$",
            description: "+24.8% this period",
            gradient: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-500/30",
        },
        {
            id: "active-bets",
            label: "Active Bets",
            value: 8,
            change: 0,
            changeType: "neutral",
            icon: _jsx(Activity, { size: 24 }),
            trend: [6, 7, 8, 8, 8],
            description: "Currently tracking",
            gradient: "from-yellow-500/20 to-orange-500/20",
            borderColor: "border-yellow-500/30",
        },
    ]);
    const [aiMetrics, setAiMetrics] = useState([
        {
            id: "total-profit",
            label: "Total Profit",
            value: "$12,847",
            change: "+23.1%",
            trend: "up",
            gradient: "from-purple-600 to-blue-600",
        },
        {
            id: "win-rate-ai",
            label: "Win Rate",
            value: "89.2%",
            change: "+5.7%",
            trend: "up",
            gradient: "from-green-600 to-emerald-600",
        },
        {
            id: "ai-confidence",
            label: "AI Confidence",
            value: "94.7%",
            change: "+1.2%",
            trend: "up",
            gradient: "from-cyan-600 to-blue-600",
        },
        {
            id: "active-models",
            label: "Active Models",
            value: "47",
            change: "+0.0%",
            trend: "neutral",
            gradient: "from-gray-600 to-gray-700",
        },
    ]);
    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => prev.map((metric) => {
                const variation = (Math.random() - 0.5) * 0.1;
                const newValue = typeof metric.value === "number"
                    ? Math.max(0, metric.value + variation)
                    : metric.value;
                return {
                    ...metric,
                    value: newValue,
                    trend: [
                        ...metric.trend.slice(1),
                        typeof newValue === "number" ? newValue : 0,
                    ],
                };
            }));
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    const formatValue = (metric) => {
        const { value, prefix = "", suffix = "", isPercentage } = metric;
        const numValue = typeof value === "number" ? value : parseFloat(value.toString());
        if (isPercentage || suffix === "%") {
            return `${prefix}${numValue.toFixed(1)}${suffix}`;
        }
        if (prefix === "$") {
            return `${prefix}${numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `${prefix}${numValue}${suffix}`;
    };
    const getChangeColor = (changeType) => {
        switch (changeType) {
            case "positive":
                return "text-green-400";
            case "negative":
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };
    const getChangeIcon = (changeType) => {
        switch (changeType) {
            case "positive":
                return _jsx(TrendingUp, { size: 12 });
            case "negative":
                return _jsx(TrendingDown, { size: 12 });
            default:
                return _jsx(Activity, { size: 12 });
        }
    };
    const renderTrendLine = (trend) => {
        const max = Math.max(...trend);
        const min = Math.min(...trend);
        const range = max - min || 1;
        const points = trend
            .map((value, index) => {
            const x = (index / (trend.length - 1)) * 60;
            const y = 20 - ((value - min) / range) * 15;
            return `${x},${y}`;
        })
            .join(" ");
        return (_jsx("svg", { width: "60", height: "20", className: "opacity-60", children: _jsx("polyline", { points: points, fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "text-current" }) }));
    };
    return (_jsxs("div", { className: className, children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: metrics.map((metric, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: `
              relative p-6 rounded-2xl backdrop-blur-xl border transition-all
              bg-gradient-to-br ${metric.gradient} ${metric.borderColor}
              hover:shadow-xl hover:scale-105 cursor-pointer group
            `, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all", children: _jsx("div", { className: "text-white group-hover:scale-110 transition-transform", children: metric.icon }) }), _jsxs("div", { className: `flex items-center space-x-1 text-sm ${getChangeColor(metric.changeType)}`, children: [getChangeIcon(metric.changeType), _jsxs("span", { children: [metric.change > 0 ? "+" : "", metric.change, "%"] })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-3xl font-bold text-white mb-1", children: formatValue(metric) }), _jsx("div", { className: "text-sm text-gray-400", children: metric.label })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-xs text-gray-400", children: metric.description }), showTrends && (_jsx("div", { className: "text-gray-400", children: renderTrendLine(metric.trend) }))] })] }, metric.id))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: aiMetrics.map((metric, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: (index + 4) * 0.1 }, className: `
              relative p-6 rounded-2xl backdrop-blur-xl
              bg-gradient-to-br ${metric.gradient}
              hover:shadow-xl hover:scale-105 cursor-pointer group
              transition-all duration-300
            `, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-xs font-semibold text-white/70 uppercase tracking-wider", children: metric.label }), _jsx("div", { className: `
                text-xs font-bold px-2 py-1 rounded-full
                ${metric.trend === "up"
                                        ? "bg-green-500/20 text-green-400"
                                        : metric.trend === "down"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-gray-500/20 text-gray-400"}
              `, children: metric.change })] }), _jsx("div", { className: "text-2xl font-bold text-white mb-1", children: metric.value }), _jsx("div", { className: "text-xs text-white/60", children: "Trend" })] }, metric.id))) }), _jsx("div", { className: "mt-8 p-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Performance Summary" }), _jsx("p", { className: "text-gray-400", children: "Your betting performance over the last 30 days" })] }), _jsxs("div", { className: "flex items-center space-x-6 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-green-400", children: "+247%" }), _jsx("div", { className: "text-xs text-gray-400", children: "Monthly ROI" })] }), _jsx("div", { className: "w-px h-12 bg-gray-700" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-blue-400", children: "94.7%" }), _jsx("div", { className: "text-xs text-gray-400", children: "AI Accuracy" })] }), _jsx("div", { className: "w-px h-12 bg-gray-700" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-purple-400", children: "47" }), _jsx("div", { className: "text-xs text-gray-400", children: "Models Active" })] })] })] }) })] }));
};
export default MetricsOverview;
