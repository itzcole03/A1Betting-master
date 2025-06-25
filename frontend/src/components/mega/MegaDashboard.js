import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CYBER_COLORS, CYBER_GRADIENTS, CyberContainer, CyberText, CyberButton, } from "./CyberTheme";
import { Brain, Target, BarChart3, Zap, TrendingUp, DollarSign, Activity, Cpu, Database, Wifi, } from "lucide-react";
// MEGA DASHBOARD - Consolidates all dashboard components with cyber theme
const MegaDashboard = ({ currentSection = "dashboard", connectedSources = 12, dataQuality = 87, userStats = {}, liveMetrics = {}, className = "", }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [metrics, setMetrics] = useState({
        winRate: 89.4,
        totalProfit: 47230,
        accuracy: 97.3,
        activeBets: 23,
        totalPredictions: 1847,
        success: 87.6,
    });
    // Auto-refresh metrics every 10 seconds
    useEffect(() => {
        if (!autoRefresh)
            return;
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                ...prev,
                winRate: 85 + Math.random() * 10,
                totalProfit: prev.totalProfit + (Math.random() - 0.5) * 100,
                accuracy: 95 + Math.random() * 5,
                activeBets: Math.floor(Math.random() * 50) + 10,
            }));
        }, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh]);
    const dashboardCards = [
        {
            title: "Win Rate",
            value: `${metrics.winRate.toFixed(1)}%`,
            icon: TrendingUp,
            trend: "+2.3%",
            color: CYBER_COLORS.primary,
        },
        {
            title: "Total Profit",
            value: `$${metrics.totalProfit.toLocaleString()}`,
            icon: DollarSign,
            trend: "+$1,247",
            color: CYBER_COLORS.secondary,
        },
        {
            title: "Accuracy",
            value: `${metrics.accuracy.toFixed(1)}%`,
            icon: Target,
            trend: "+0.5%",
            color: CYBER_COLORS.accent,
        },
        {
            title: "Active Bets",
            value: metrics.activeBets.toString(),
            icon: Activity,
            trend: "+3",
            color: CYBER_COLORS.purple,
        },
    ];
    const systemStats = [
        { label: "Neural Networks", value: "47", color: CYBER_COLORS.primary },
        {
            label: "Data Sources",
            value: connectedSources.toString(),
            color: CYBER_COLORS.secondary,
        },
        { label: "Predictions Today", value: "1,234", color: CYBER_COLORS.accent },
        { label: "Models Running", value: "12", color: CYBER_COLORS.purple },
    ];
    const tabs = [
        { key: "overview", label: "Overview", icon: BarChart3 },
        { key: "realtime", label: "Real-time", icon: Zap },
        { key: "analytics", label: "Analytics", icon: Brain },
        { key: "system", label: "System", icon: Cpu },
    ];
    const renderOverviewTab = () => (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
        }, children: [dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (_jsx(CyberContainer, { variant: "card", style: { padding: "20px" }, children: _jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "caption", color: "muted", children: card.title }), _jsx(CyberText, { variant: "title", style: {
                                            fontSize: "24px",
                                            color: card.color,
                                            marginBottom: "4px",
                                        }, children: card.value }), _jsxs(CyberText, { variant: "caption", style: { color: CYBER_COLORS.primary }, children: [card.trend, " this week"] })] }), _jsx("div", { style: {
                                    padding: "12px",
                                    borderRadius: "8px",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: `1px solid ${card.color}30`,
                                }, children: _jsx(Icon, { size: 20, color: card.color }) })] }) }, index));
            }), _jsxs(CyberContainer, { variant: "card", style: { gridColumn: "span 2", padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Activity, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "Live Activity Feed"] }), _jsx("div", { style: { space: "12px" }, children: [
                            {
                                time: "2:34 PM",
                                event: "New arbitrage opportunity detected",
                                value: "+$247",
                                color: CYBER_COLORS.primary,
                            },
                            {
                                time: "2:31 PM",
                                event: "ML model accuracy updated",
                                value: "97.3%",
                                color: CYBER_COLORS.secondary,
                            },
                            {
                                time: "2:28 PM",
                                event: "Bet placed: Lakers vs Warriors",
                                value: "$150",
                                color: CYBER_COLORS.accent,
                            },
                            {
                                time: "2:25 PM",
                                event: "Neural network retrained",
                                value: "Complete",
                                color: CYBER_COLORS.purple,
                            },
                        ].map((activity, index) => (_jsxs("div", { style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 0",
                                borderBottom: index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                            }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "body", children: activity.event }), _jsx(CyberText, { variant: "caption", color: "muted", children: activity.time })] }), _jsx(CyberText, { variant: "body", style: { color: activity.color, fontWeight: "600" }, children: activity.value })] }, index))) })] })] }));
    const renderSystemTab = () => (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
        }, children: [_jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Cpu, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "System Health"] }), systemStats.map((stat, index) => (_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 0",
                            borderBottom: index < systemStats.length - 1
                                ? "1px solid rgba(255, 255, 255, 0.05)"
                                : "none",
                        }, children: [_jsx(CyberText, { variant: "body", color: "secondary", children: stat.label }), _jsx(CyberText, { variant: "body", style: { color: stat.color, fontWeight: "600" }, children: stat.value })] }, index)))] }), _jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(Database, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.secondary } }), "Data Quality: ", dataQuality, "%"] }), _jsx("div", { style: {
                            width: "100%",
                            height: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginBottom: "16px",
                        }, children: _jsx("div", { style: {
                                width: `${dataQuality}%`,
                                height: "100%",
                                backgroundImage: CYBER_GRADIENTS.button,
                                transition: "width 0.3s ease",
                            } }) }), _jsxs(CyberText, { variant: "caption", color: "muted", children: [connectedSources, " active data sources connected"] })] })] }));
    return (_jsxs("div", { className: `mega-dashboard ${className}`, style: {
            minHeight: "100vh",
            background: CYBER_GRADIENTS.background,
            padding: "24px",
            color: CYBER_COLORS.text.primary,
        }, children: [_jsxs(CyberContainer, { variant: "panel", style: { marginBottom: "24px", padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "title", style: { fontSize: "28px", marginBottom: "4px" }, children: "A1Betting Dashboard" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Quantum-powered sports betting intelligence platform" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx(Wifi, { size: 16, color: CYBER_COLORS.primary }), _jsx(CyberText, { variant: "caption", color: "accent", children: "Live" })] }), _jsxs(CyberButton, { variant: autoRefresh ? "primary" : "secondary", onClick: () => setAutoRefresh(!autoRefresh), children: ["Auto-refresh: ", autoRefresh ? "ON" : "OFF"] })] })] }), _jsx("div", { style: { display: "flex", gap: "8px" }, children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsx(CyberButton, { variant: activeTab === tab.key ? "primary" : "secondary", active: activeTab === tab.key, onClick: () => setActiveTab(tab.key), icon: _jsx(Icon, { size: 16 }), style: { marginBottom: 0, width: "auto", padding: "8px 16px" }, children: tab.label }, tab.key));
                        }) })] }), _jsxs("div", { style: { minHeight: "500px" }, children: [activeTab === "overview" && renderOverviewTab(), activeTab === "system" && renderSystemTab(), activeTab === "realtime" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Zap, { size: 48, color: CYBER_COLORS.primary, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Real-time Feed Coming Soon" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Live predictions and betting opportunities will be displayed here" })] })), activeTab === "analytics" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Brain, { size: 48, color: CYBER_COLORS.secondary, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Advanced Analytics" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Deep ML insights and performance analytics" })] }))] })] }));
};
export default MegaDashboard;
