import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Activity, } from "lucide-react";
// Import existing analytics component
import AdvancedAnalyticsHub from "../analytics/AdvancedAnalyticsHub";
// Cyber UI Components
import GlassCard from "../ui/GlassCard";
import CyberButton from "../ui/CyberButton";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";
// Store integration
import { usePredictions, useBetting, } from "../../store/unified/UnifiedStoreManager";
const CyberAnalyticsHub = () => {
    // State management
    const [state, setState] = useState({
        isAnalyzing: false,
        autoRefresh: true,
        refreshInterval: 10000, // 10 seconds
        metrics: [],
        modelAnalytics: [],
        timeRange: "24h",
        selectedTab: "overview",
        lastUpdate: null,
    });
    // Store integration
    const { latestPredictions } = usePredictions();
    const { bets, opportunities } = useBetting();
    // Generate enhanced metrics
    const generateCyberMetrics = useCallback(() => {
        const currentTime = Date.now();
        const timeRangeMs = {
            "1h": 3600000,
            "24h": 86400000,
            "7d": 604800000,
            "30d": 2592000000,
        }[state.timeRange];
        const recentPredictions = latestPredictions.filter((p) => currentTime - p.timestamp < timeRangeMs);
        const recentBets = bets.filter((b) => currentTime - b.timestamp < timeRangeMs);
        return [
            {
                name: "Quantum Accuracy",
                value: 97.3,
                unit: "%",
                change: 2.1,
                status: "good",
                description: "AI model prediction accuracy with quantum enhancement",
                trend: "up",
                icon: "fa-brain",
            },
            {
                name: "Prediction Volume",
                value: recentPredictions.length,
                unit: "",
                change: 15.3,
                status: "good",
                description: "Total predictions generated in timeframe",
                trend: "up",
                icon: "fa-chart-line",
            },
            {
                name: "Confidence Score",
                value: recentPredictions.length > 0
                    ? (recentPredictions.reduce((sum, p) => sum + p.confidence, 0) /
                        recentPredictions.length) *
                        100
                    : 0,
                unit: "%",
                change: 1.8,
                status: "good",
                description: "Average prediction confidence across all models",
                trend: "up",
                icon: "fa-target",
            },
            {
                name: "ROI Performance",
                value: 247.3,
                unit: "%",
                change: 12.4,
                status: "good",
                description: "Return on investment over selected period",
                trend: "up",
                icon: "fa-dollar-sign",
            },
            {
                name: "Processing Speed",
                value: 0.7,
                unit: "ms",
                change: -0.3,
                status: "good",
                description: "Average prediction processing time",
                trend: "up",
                icon: "fa-bolt",
            },
            {
                name: "Risk Assessment",
                value: 2.1,
                unit: "/10",
                change: -0.5,
                status: "good",
                description: "Overall portfolio risk score",
                trend: "up",
                icon: "fa-shield-alt",
            },
        ];
    }, [latestPredictions, bets, state.timeRange]);
    // Generate model analytics
    const generateModelAnalytics = useCallback(() => {
        return [
            {
                modelName: "XGBoost Ensemble V3",
                accuracy: 94.7,
                confidence: 87.3,
                predictions: 1247,
                profitability: 156.8,
                status: "active",
                lastUpdate: new Date(Date.now() - 300000), // 5 minutes ago
            },
            {
                modelName: "Neural Network Pro",
                accuracy: 92.1,
                confidence: 89.6,
                predictions: 987,
                profitability: 134.2,
                status: "active",
                lastUpdate: new Date(Date.now() - 180000), // 3 minutes ago
            },
            {
                modelName: "Quantum Predictor",
                accuracy: 97.8,
                confidence: 95.2,
                predictions: 456,
                profitability: 198.7,
                status: "training",
                lastUpdate: new Date(Date.now() - 600000), // 10 minutes ago
            },
            {
                modelName: "Ensemble Alpha",
                accuracy: 89.4,
                confidence: 82.1,
                predictions: 2134,
                profitability: 112.5,
                status: "active",
                lastUpdate: new Date(Date.now() - 120000), // 2 minutes ago
            },
            {
                modelName: "Deep Learning V2",
                accuracy: 91.8,
                confidence: 88.9,
                predictions: 1567,
                profitability: 145.3,
                status: "active",
                lastUpdate: new Date(Date.now() - 90000), // 1.5 minutes ago
            },
        ];
    }, []);
    // Perform cyber analysis
    const performCyberAnalysis = useCallback(async () => {
        setState((prev) => ({ ...prev, isAnalyzing: true }));
        try {
            // Simulate analysis process
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const metrics = generateCyberMetrics();
            const modelAnalytics = generateModelAnalytics();
            setState((prev) => ({
                ...prev,
                metrics,
                modelAnalytics,
                lastUpdate: new Date(),
                isAnalyzing: false,
            }));
        }
        catch (error) {
            console.error("Cyber analysis failed:", error);
            setState((prev) => ({ ...prev, isAnalyzing: false }));
        }
    }, [generateCyberMetrics, generateModelAnalytics]);
    // Auto refresh effect
    useEffect(() => {
        let intervalId;
        if (state.autoRefresh) {
            intervalId = setInterval(performCyberAnalysis, state.refreshInterval);
        }
        return () => {
            if (intervalId)
                clearInterval(intervalId);
        };
    }, [state.autoRefresh, state.refreshInterval, performCyberAnalysis]);
    // Initial analysis
    useEffect(() => {
        performCyberAnalysis();
    }, [performCyberAnalysis]);
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "text-green-400";
            case "training":
                return "text-yellow-400";
            case "inactive":
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };
    const getMetricStatusColor = (status) => {
        switch (status) {
            case "good":
                return "border-green-500/30 bg-green-500/10";
            case "warning":
                return "border-yellow-500/30 bg-yellow-500/10";
            case "critical":
                return "border-red-500/30 bg-red-500/10";
            default:
                return "border-gray-500/30 bg-gray-500/10";
        }
    };
    return (_jsxs("div", { className: "space-y-8 animate-slide-in-up", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-6xl mb-6 text-electric-400 float-element", children: _jsx(BarChart3, { className: "w-16 h-16 mx-auto" }) }), _jsx("h1", { className: "holographic text-4xl font-black mb-4", children: "QUANTUM ANALYTICS" }), _jsx("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto", children: "Advanced AI-powered analytics with real-time performance monitoring" })] }), _jsxs(GlassCard, { title: "Analytics Control Center", glowing: state.isAnalyzing, children: [_jsxs("div", { className: "flex flex-wrap gap-4 items-center justify-between mb-6", children: [_jsx("div", { className: "flex space-x-2", children: ["1h", "24h", "7d", "30d"].map((range) => (_jsx(CyberButton, { label: range, onClick: () => setState((prev) => ({ ...prev, timeRange: range })), variant: state.timeRange === range ? "primary" : "ghost", size: "sm" }, range))) }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx(CyberButton, { label: state.isAnalyzing ? "ANALYZING..." : "QUANTUM ANALYSIS", onClick: performCyberAnalysis, variant: "primary", icon: "fa-chart-line", disabled: state.isAnalyzing }), _jsx(CyberButton, { label: state.autoRefresh ? "AUTO ON" : "AUTO OFF", onClick: () => setState((prev) => ({
                                            ...prev,
                                            autoRefresh: !prev.autoRefresh,
                                        })), variant: state.autoRefresh ? "secondary" : "ghost", size: "md", icon: "fa-refresh" }), _jsx(StatusIndicator, { status: state.isAnalyzing ? "warning" : "active", label: state.lastUpdate
                                            ? `Updated: ${state.lastUpdate.toLocaleTimeString()}`
                                            : "Ready" })] })] }), _jsx("div", { className: "flex space-x-4 mb-6", children: [
                            { key: "overview", label: "Overview", icon: "fa-eye" },
                            { key: "models", label: "AI Models", icon: "fa-brain" },
                            {
                                key: "performance",
                                label: "Performance",
                                icon: "fa-chart-line",
                            },
                            { key: "risk", label: "Risk Analysis", icon: "fa-shield-alt" },
                            { key: "insights", label: "AI Insights", icon: "fa-lightbulb" },
                        ].map((tab) => (_jsx(CyberButton, { label: tab.label, onClick: () => setState((prev) => ({ ...prev, selectedTab: tab.key })), variant: state.selectedTab === tab.key ? "primary" : "ghost", size: "sm", icon: tab.icon }, tab.key))) })] }), state.selectedTab === "overview" && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: state.metrics.map((metric, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, children: _jsx(MetricCard, { label: metric.name, value: `${metric.value.toFixed(1)}${metric.unit}`, icon: metric.icon, change: `${metric.change > 0 ? "+" : ""}${metric.change.toFixed(1)}${metric.unit}`, trend: metric.trend }) }, metric.name))) })), state.selectedTab === "models" && (_jsx(GlassCard, { title: "AI Model Performance", glowing: true, children: _jsx("div", { className: "space-y-4", children: state.modelAnalytics.map((model, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "glass-card rounded-xl p-6", style: {
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: model.modelName }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("div", { className: `w-2 h-2 rounded-full animate-pulse ${model.status === "active"
                                                            ? "bg-green-400"
                                                            : model.status === "training"
                                                                ? "bg-yellow-400"
                                                                : "bg-red-400"}` }), _jsx("span", { className: `text-sm font-medium ${getStatusColor(model.status)}`, children: model.status.toUpperCase() })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-electric-400", children: [model.accuracy.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Accuracy" })] })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-lg font-bold text-green-400", children: [model.confidence.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Confidence" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsx("div", { className: "text-lg font-bold text-blue-400", children: model.predictions.toLocaleString() }), _jsx("div", { className: "text-xs text-gray-400", children: "Predictions" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-lg font-bold text-purple-400", children: [model.profitability.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Profitability" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsx("div", { className: "text-lg font-bold text-yellow-400", children: model.lastUpdate.toLocaleTimeString() }), _jsx("div", { className: "text-xs text-gray-400", children: "Last Update" })] })] })] }, model.modelName))) }) })), state.selectedTab === "performance" && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(GlassCard, { title: "Performance Overview", children: _jsx("div", { className: "space-y-4", children: state.metrics.slice(0, 3).map((metric, index) => (_jsx("div", { className: `p-4 rounded-lg border ${getMetricStatusColor(metric.status)}`, children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-white", children: metric.name }), _jsx("div", { className: "text-sm text-gray-400", children: metric.description })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-xl font-bold text-electric-400", children: [metric.value.toFixed(1), metric.unit] }), _jsxs("div", { className: `text-sm ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`, children: [metric.change > 0 ? "+" : "", metric.change.toFixed(1), metric.unit] })] })] }) }, metric.name))) }) }), _jsx(GlassCard, { title: "Real-Time Chart", children: _jsx("div", { className: "h-64 bg-gradient-to-br from-electric-400/20 to-purple-500/20 rounded-lg flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Activity, { className: "w-12 h-12 text-electric-400 mx-auto mb-4" }), _jsx("div", { className: "text-electric-400 font-bold", children: "Real-Time Performance Chart" }), _jsx("div", { className: "text-sm text-gray-400", children: "Interactive visualization placeholder" })] }) }) })] })), _jsx(GlassCard, { title: "Advanced Analytics Integration", children: _jsx("div", { className: "p-4 glass-card rounded-lg", children: _jsx(AdvancedAnalyticsHub, {}) }) })] }));
};
export default CyberAnalyticsHub;
