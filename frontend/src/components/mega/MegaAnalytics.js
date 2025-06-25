import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CYBER_COLORS, CYBER_GRADIENTS, CyberContainer, CyberText, CyberButton, } from "./CyberTheme";
import { Brain, BarChart3, TrendingUp, Target, Activity, Cpu, Eye, AlertCircle, CheckCircle, } from "lucide-react";
// MEGA ANALYTICS COMPONENT - Consolidates all analytics and ML insights
const MegaAnalytics = ({ timeRange = "24h", autoRefresh = true, showAdvanced = true, className = "", }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalPredictions: 1847,
            accuracy: 97.3,
            profitability: 89.4,
            sharpeRatio: 2.14,
            maxDrawdown: 3.2,
            avgROI: 12.1,
            winStreak: 23,
            totalProfit: 47230,
        },
        models: {
            neuralNetworks: 47,
            ensembleModels: 12,
            quantumModels: 3,
            activeModels: 28,
            trainingModels: 4,
            avgAccuracy: 94.7,
            bestModel: { name: "Quantum-Enhanced Ensemble v4.2", accuracy: 98.1 },
            worstModel: { name: "Basic Linear Regression", accuracy: 78.4 },
        },
        performance: {
            last24h: { predictions: 234, accuracy: 96.8, profit: 1247 },
            last7d: { predictions: 1658, accuracy: 95.2, profit: 8934 },
            last30d: { predictions: 7234, accuracy: 94.1, profit: 47230 },
            trends: {
                accuracy: "+2.3%",
                volume: "+15.7%",
                profit: "+8.9%",
            },
        },
        realtime: {
            activePredictions: 23,
            modelsRunning: 28,
            dataStreams: 156,
            predictionLatency: 0.023,
            systemLoad: 67.8,
            memoryUsage: 84.3,
        },
    });
    // Auto-refresh data every 10 seconds
    useEffect(() => {
        if (!autoRefresh)
            return;
        const interval = setInterval(() => {
            setRefreshing(true);
            setTimeout(() => {
                setAnalyticsData((prev) => ({
                    ...prev,
                    overview: {
                        ...prev.overview,
                        accuracy: 95 + Math.random() * 5,
                        totalPredictions: prev.overview.totalPredictions + Math.floor(Math.random() * 5),
                        totalProfit: prev.overview.totalProfit + (Math.random() - 0.3) * 100,
                    },
                    realtime: {
                        ...prev.realtime,
                        activePredictions: Math.floor(Math.random() * 20) + 15,
                        systemLoad: Math.random() * 40 + 50,
                        memoryUsage: Math.random() * 30 + 70,
                    },
                }));
                setRefreshing(false);
            }, 1000);
        }, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh]);
    const tabs = [
        { key: "overview", label: "Overview", icon: BarChart3 },
        { key: "models", label: "ML Models", icon: Brain },
        { key: "performance", label: "Performance", icon: TrendingUp },
        { key: "realtime", label: "Real-time", icon: Activity },
        { key: "insights", label: "AI Insights", icon: Eye },
    ];
    const timeRanges = [
        { key: "1h", label: "1 Hour" },
        { key: "24h", label: "24 Hours" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
    ];
    const getStatusColor = (value, thresholds) => {
        if (value >= thresholds.good)
            return CYBER_COLORS.primary;
        if (value >= thresholds.warning)
            return CYBER_COLORS.accent;
        return "#ff4757";
    };
    const renderOverviewTab = () => (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
        }, children: [[
                {
                    title: "Model Accuracy",
                    value: `${analyticsData.overview.accuracy.toFixed(1)}%`,
                    trend: "+2.3%",
                    icon: Target,
                    color: CYBER_COLORS.primary,
                },
                {
                    title: "Total Predictions",
                    value: analyticsData.overview.totalPredictions.toLocaleString(),
                    trend: "+47",
                    icon: Brain,
                    color: CYBER_COLORS.secondary,
                },
                {
                    title: "Profit Factor",
                    value: `${analyticsData.overview.profitability.toFixed(1)}%`,
                    trend: "+5.7%",
                    icon: TrendingUp,
                    color: CYBER_COLORS.accent,
                },
                {
                    title: "Sharpe Ratio",
                    value: analyticsData.overview.sharpeRatio.toFixed(2),
                    trend: "+0.12",
                    icon: BarChart3,
                    color: CYBER_COLORS.purple,
                },
            ].map((metric, index) => {
                const Icon = metric.icon;
                return (_jsx(CyberContainer, { variant: "card", style: { padding: "20px" }, children: _jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "caption", color: "muted", children: metric.title }), _jsx(CyberText, { variant: "title", style: {
                                            fontSize: "24px",
                                            color: metric.color,
                                            marginBottom: "4px",
                                        }, children: metric.value }), _jsxs(CyberText, { variant: "caption", style: { color: CYBER_COLORS.primary }, children: [metric.trend, " today"] })] }), _jsx("div", { style: {
                                    padding: "12px",
                                    borderRadius: "8px",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: `1px solid ${metric.color}30`,
                                }, children: _jsx(Icon, { size: 20, color: metric.color }) })] }) }, index));
            }), _jsxs(CyberContainer, { variant: "card", style: { gridColumn: "span 2", padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(TrendingUp, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "Performance Over Time"] }), _jsx("div", { style: {
                            height: "200px",
                            background: "rgba(6, 255, 165, 0.05)",
                            border: `1px solid ${CYBER_COLORS.primary}20`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }, children: _jsx(CyberText, { variant: "body", color: "muted", children: "Advanced charting visualization will be implemented here" }) })] }), _jsxs(CyberContainer, { variant: "card", style: { gridColumn: "span 2", padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Brain, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.secondary } }), "AI Insights & Recommendations"] }), [
                        {
                            type: "success",
                            message: "Quantum ensemble model achieved 98.1% accuracy on NBA predictions",
                            time: "2 min ago",
                        },
                        {
                            type: "warning",
                            message: "MLB model accuracy dropped to 89.2%, retraining recommended",
                            time: "15 min ago",
                        },
                        {
                            type: "info",
                            message: "New arbitrage opportunity detected in NFL futures market",
                            time: "23 min ago",
                        },
                        {
                            type: "success",
                            message: "Portfolio optimization increased expected ROI by 12.4%",
                            time: "1 hour ago",
                        },
                    ].map((insight, index) => (_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "flex-start",
                            padding: "12px 0",
                            borderBottom: index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                        }, children: [_jsxs("div", { style: { marginRight: "12px", marginTop: "2px" }, children: [insight.type === "success" && (_jsx(CheckCircle, { size: 16, color: CYBER_COLORS.primary })), insight.type === "warning" && (_jsx(AlertCircle, { size: 16, color: CYBER_COLORS.accent })), insight.type === "info" && (_jsx(Eye, { size: 16, color: CYBER_COLORS.secondary }))] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx(CyberText, { variant: "body", children: insight.message }), _jsx(CyberText, { variant: "caption", color: "muted", children: insight.time })] })] }, index)))] })] }));
    const renderModelsTab = () => (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
        }, children: [_jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Brain, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "Model Fleet Status"] }), [
                        {
                            label: "Neural Networks",
                            value: analyticsData.models.neuralNetworks,
                            max: 50,
                            color: CYBER_COLORS.primary,
                        },
                        {
                            label: "Ensemble Models",
                            value: analyticsData.models.ensembleModels,
                            max: 15,
                            color: CYBER_COLORS.secondary,
                        },
                        {
                            label: "Quantum Models",
                            value: analyticsData.models.quantumModels,
                            max: 5,
                            color: CYBER_COLORS.accent,
                        },
                        {
                            label: "Active Models",
                            value: analyticsData.models.activeModels,
                            max: 50,
                            color: CYBER_COLORS.purple,
                        },
                    ].map((model, index) => (_jsxs("div", { style: { marginBottom: "16px" }, children: [_jsxs("div", { style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }, children: [_jsx(CyberText, { variant: "body", color: "secondary", children: model.label }), _jsxs(CyberText, { variant: "body", style: { color: model.color, fontWeight: "600" }, children: [model.value, "/", model.max] })] }), _jsx("div", { style: {
                                    width: "100%",
                                    height: "6px",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                }, children: _jsx("div", { style: {
                                        width: `${(model.value / model.max) * 100}%`,
                                        height: "100%",
                                        backgroundColor: model.color,
                                        transition: "width 0.3s ease",
                                    } }) })] }, index)))] }), _jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Target, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.secondary } }), "Top Performers"] }), _jsxs("div", { style: { marginBottom: "16px" }, children: [_jsxs(CyberText, { variant: "body", style: {
                                    color: CYBER_COLORS.primary,
                                    fontWeight: "600",
                                    marginBottom: "4px",
                                }, children: ["Best: ", analyticsData.models.bestModel.name] }), _jsxs(CyberText, { variant: "caption", color: "muted", children: ["Accuracy: ", analyticsData.models.bestModel.accuracy, "%"] })] }), _jsxs("div", { children: [_jsxs(CyberText, { variant: "body", style: { color: "#ff4757", fontWeight: "600", marginBottom: "4px" }, children: ["Needs Attention: ", analyticsData.models.worstModel.name] }), _jsxs(CyberText, { variant: "caption", color: "muted", children: ["Accuracy: ", analyticsData.models.worstModel.accuracy, "%"] })] })] }), _jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Cpu, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.accent } }), "System Health"] }), [
                        {
                            label: "CPU Usage",
                            value: analyticsData.realtime.systemLoad,
                            unit: "%",
                            threshold: { good: 80, warning: 60 },
                        },
                        {
                            label: "Memory Usage",
                            value: analyticsData.realtime.memoryUsage,
                            unit: "%",
                            threshold: { good: 90, warning: 70 },
                        },
                        {
                            label: "Active Streams",
                            value: analyticsData.realtime.dataStreams,
                            unit: "",
                            threshold: { good: 100, warning: 50 },
                        },
                        {
                            label: "Prediction Latency",
                            value: analyticsData.realtime.predictionLatency * 1000,
                            unit: "ms",
                            threshold: { good: 50, warning: 100 },
                        },
                    ].map((metric, index) => {
                        const color = getStatusColor(metric.value, metric.threshold);
                        return (_jsxs("div", { style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                borderBottom: index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                            }, children: [_jsx(CyberText, { variant: "body", color: "secondary", children: metric.label }), _jsxs(CyberText, { variant: "body", style: { color: color, fontWeight: "600" }, children: [metric.value.toFixed(metric.unit === "ms" ? 0 : 1), metric.unit] })] }, index));
                    })] })] }));
    return (_jsxs("div", { className: `mega-analytics ${className}`, style: {
            minHeight: "100vh",
            background: CYBER_GRADIENTS.background,
            padding: "24px",
            color: CYBER_COLORS.text.primary,
        }, children: [_jsxs(CyberContainer, { variant: "panel", style: { marginBottom: "24px", padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "title", style: { fontSize: "28px", marginBottom: "4px" }, children: "Advanced Analytics Hub" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Real-time ML insights and predictive performance analytics" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [refreshing && (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx(Activity, { size: 16, color: CYBER_COLORS.primary, style: { animation: "cyber-pulse 1s infinite" } }), _jsx(CyberText, { variant: "caption", color: "accent", children: "Refreshing..." })] })), _jsx("div", { style: { display: "flex", gap: "4px" }, children: timeRanges.map((range) => (_jsx(CyberButton, { variant: selectedTimeRange === range.key ? "primary" : "secondary", active: selectedTimeRange === range.key, onClick: () => setSelectedTimeRange(range.key), style: {
                                                marginBottom: 0,
                                                width: "auto",
                                                padding: "6px 12px",
                                                fontSize: "12px",
                                            }, children: range.label }, range.key))) })] })] }), _jsx("div", { style: { display: "flex", gap: "8px" }, children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsx(CyberButton, { variant: activeTab === tab.key ? "primary" : "secondary", active: activeTab === tab.key, onClick: () => setActiveTab(tab.key), icon: _jsx(Icon, { size: 16 }), style: { marginBottom: 0, width: "auto", padding: "8px 16px" }, children: tab.label }, tab.key));
                        }) })] }), _jsxs("div", { style: { minHeight: "500px" }, children: [activeTab === "overview" && renderOverviewTab(), activeTab === "models" && renderModelsTab(), activeTab === "performance" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(TrendingUp, { size: 48, color: CYBER_COLORS.accent, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Performance Analytics" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Deep performance metrics and trend analysis" })] })), activeTab === "realtime" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Activity, { size: 48, color: CYBER_COLORS.primary, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Real-time Monitoring" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Live system metrics and prediction streams" })] })), activeTab === "insights" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Eye, { size: 48, color: CYBER_COLORS.secondary, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "AI Insights Engine" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Intelligent pattern recognition and market insights" })] }))] })] }));
};
export default MegaAnalytics;
