import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, Suspense, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, DollarSign, Target, Activity, BarChart3, Brain, Settings, User, } from "lucide-react";
// Import unified components
import { MegaCard, MegaButton } from "../mega/MegaUI";
import { CyberText, CyberContainer } from "../mega/CyberTheme";
import useStore from "../../store/useStore";
// Lazy load heavy components
const PerformanceAnalyticsDashboard = React.lazy(() => import("../analytics/PerformanceAnalyticsDashboard"));
const UnifiedMoneyMaker = React.lazy(() => import("../money-maker/UnifiedMoneyMaker"));
const UnifiedStrategyEngineDisplay = React.lazy(() => import("../strategy/UnifiedStrategyEngineDisplay"));
// ============================================================================
// COMPONENTS
// ============================================================================
const MetricCard = ({ label, value, icon, change, trend, loading, }) => {
    const trendColor = trend === "up" ? "#06ffa5" : trend === "down" ? "#ff4757" : "#00d4ff";
    if (loading) {
        return (_jsx(MegaCard, { variant: "glass", padding: "md", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-600 rounded mb-2" }), _jsx("div", { className: "h-8 bg-gray-600 rounded mb-2" }), _jsx("div", { className: "h-3 bg-gray-600 rounded w-1/2" })] }) }));
    }
    return (_jsxs(MegaCard, { variant: "glowing", padding: "md", onClick: () => { }, className: "transition-all duration-300 hover:scale-105 cursor-pointer", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { style: { color: "#06ffa5" }, children: icon }), change && (_jsx("span", { style: { color: trendColor, fontSize: "12px", fontWeight: "600" }, children: change }))] }), _jsx(CyberText, { variant: "caption", color: "secondary", className: "mb-1", children: label }), _jsx(CyberText, { variant: "title", style: { fontSize: "24px", fontWeight: "700" }, children: value })] }));
};
const DashboardSkeleton = () => (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(4)].map((_, i) => (_jsx(MetricCard, { label: "", value: "", icon: _jsx("div", {}), loading: true }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(MegaCard, { variant: "glass", padding: "lg", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-6 bg-gray-600 rounded w-1/3" }), _jsx("div", { className: "h-32 bg-gray-600 rounded" })] }) }), _jsx(MegaCard, { variant: "glass", padding: "lg", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-6 bg-gray-600 rounded w-1/2" }), _jsx("div", { className: "space-y-2", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "h-4 bg-gray-600 rounded" }, i))) })] }) })] })] }));
// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export const UniversalDashboard = ({ variant = "standard", user = {
    name: "User",
    tier: "Pro",
    balance: 0,
    totalProfit: 0,
    accuracy: 0,
    winRate: 0,
}, defaultTab = "overview", }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { darkMode } = useStore();
    // Mock data to prevent fetch errors
    const mockPredictions = Array.from({ length: 5 }, (_, i) => ({
        id: `pred-${i + 1}`,
        game: `Game ${i + 1}`,
        prediction: Math.random() * 100,
        confidence: 75 + Math.random() * 20,
        timestamp: new Date().toISOString(),
        status: ["pending", "won", "lost"][Math.floor(Math.random() * 3)],
    }));
    const mockMetrics = {
        accuracy: 89.3,
        totalPredictions: 156,
        winRate: 85.6,
        avgConfidence: 88.5,
    };
    // Data fetching with React Query (using mock data)
    const { data: predictions, isLoading: predictionsLoading } = useQuery({
        queryKey: ["dashboard-predictions"],
        queryFn: async () => mockPredictions,
        staleTime: 300000, // 5 minutes
        refetchInterval: false, // Disable auto-refetch
    });
    const { data: metrics, isLoading: metricsLoading } = useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: async () => mockMetrics,
        staleTime: 300000, // 5 minutes
        refetchInterval: false, // Disable auto-refetch
    });
    // Dashboard tabs configuration
    const dashboardTabs = useMemo(() => [
        {
            key: "overview",
            label: "Overview",
            icon: _jsx(BarChart3, { size: 20 }),
            component: () => (_jsx(OverviewTab, { user: user, predictions: predictions, metrics: metrics })),
        },
        {
            key: "analytics",
            label: "Analytics",
            icon: _jsx(Brain, { size: 20 }),
            component: PerformanceAnalyticsDashboard,
            isPremium: true,
        },
        {
            key: "moneymaker",
            label: "Money Maker",
            icon: _jsx(TrendingUp, { size: 20 }),
            component: UnifiedMoneyMaker,
            isPremium: true,
        },
        {
            key: "strategy",
            label: "Strategy Engine",
            icon: _jsx(Target, { size: 20 }),
            component: UnifiedStrategyEngineDisplay,
        },
        {
            key: "profile",
            label: "Profile",
            icon: _jsx(User, { size: 20 }),
            component: () => _jsx("div", { children: "Profile Component" }),
        },
    ], [user, predictions, metrics]);
    const currentTab = dashboardTabs.find((tab) => tab.key === activeTab);
    // Loading state
    if (predictionsLoading && metricsLoading) {
        return (_jsx("div", { className: "min-h-screen p-6", children: _jsx(DashboardSkeleton, {}) }));
    }
    return (_jsxs("div", { className: "min-h-screen relative", children: [_jsx(AnimatePresence, { children: (sidebarOpen || window.innerWidth >= 1024) && (_jsx(motion.div, { initial: { x: -280 }, animate: { x: 0 }, exit: { x: -280 }, className: "fixed left-0 top-0 h-full w-72 z-40 lg:relative lg:w-64", children: _jsx(CyberContainer, { variant: "panel", className: "h-full", style: { borderRadius: "0 16px 16px 0" }, children: _jsxs("div", { className: "p-6", children: [_jsx(CyberText, { variant: "title", className: "mb-6", children: "A1Betting Dashboard" }), _jsx("nav", { className: "space-y-2", children: dashboardTabs.map((tab) => (_jsxs(MegaButton, { variant: activeTab === tab.key ? "primary" : "secondary", onClick: () => {
                                            setActiveTab(tab.key);
                                            setSidebarOpen(false);
                                        }, icon: tab.icon, fullWidth: true, className: "justify-start", children: [_jsx("span", { className: "ml-3", children: tab.label }), tab.isPremium && (_jsx("span", { className: "ml-auto text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded", children: "PRO" }))] }, tab.key))) })] }) }) })) }), _jsx("div", { className: `transition-all duration-300 ${sidebarOpen || window.innerWidth >= 1024 ? "lg:ml-64" : ""}`, children: _jsxs("div", { className: "p-6 lg:p-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "mb-12", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "mb-6 lg:mb-0", children: [_jsxs("div", { className: "flex items-center gap-4 mb-3", children: [_jsx("div", { className: "p-3 rounded-xl", style: {
                                                            background: "linear-gradient(135deg, rgba(6, 255, 165, 0.2), rgba(0, 255, 136, 0.1))",
                                                            boxShadow: "0 8px 32px rgba(6, 255, 165, 0.2)",
                                                        }, children: _jsx(Brain, { size: 28, style: { color: "#06ffa5" } }) }), _jsx("div", { children: _jsx(CyberText, { variant: "title", style: {
                                                                fontSize: "36px",
                                                                fontWeight: "800",
                                                                lineHeight: "1.1",
                                                                marginBottom: "4px",
                                                                background: "linear-gradient(135deg, #ffffff, #94a3b8)",
                                                                WebkitBackgroundClip: "text",
                                                                WebkitTextFillColor: "transparent",
                                                                letterSpacing: "-0.02em",
                                                            }, children: currentTab?.label || "Dashboard" }) })] }), _jsxs(CyberText, { variant: "body", style: {
                                                    fontSize: "18px",
                                                    color: "#94a3b8",
                                                    fontWeight: "500",
                                                    lineHeight: "1.5",
                                                }, children: ["Welcome back, ", user.name, ". Your AI-powered betting intelligence is ready. \uD83D\uDE80"] })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "px-4 py-2 rounded-xl", style: {
                                                background: "rgba(6, 255, 165, 0.1)",
                                                border: "1px solid rgba(6, 255, 165, 0.3)",
                                                backdropFilter: "blur(20px)",
                                            }, children: _jsx(CyberText, { variant: "caption", style: { color: "#06ffa5", fontWeight: "600" }, children: "\u26A1 System Online" }) }) })] }) }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: _jsx(Suspense, { fallback: _jsx(DashboardSkeleton, {}), children: currentTab?.component && _jsx(currentTab.component, {}) }) }, activeTab) })] }) }), sidebarOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden", onClick: () => setSidebarOpen(false) }))] }));
};
const OverviewTab = ({ user, predictions, metrics, }) => {
    const metricCards = [
        {
            label: "Total Profit",
            value: `$${user.totalProfit.toLocaleString()}`,
            icon: _jsx(DollarSign, { size: 24 }),
            change: "+$3.2K",
            trend: "up",
        },
        {
            label: "Accuracy",
            value: `${user.accuracy}%`,
            icon: _jsx(Target, { size: 24 }),
            change: "+2.3%",
            trend: "up",
        },
        {
            label: "Win Rate",
            value: `${user.winRate}%`,
            icon: _jsx(TrendingUp, { size: 24 }),
            change: "+1.2%",
            trend: "up",
        },
        {
            label: "Active Bets",
            value: predictions?.length || 0,
            icon: _jsx(Activity, { size: 24 }),
            change: "+5",
            trend: "up",
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: metricCards.map((metric, index) => (_jsx(MetricCard, { ...metric }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(MegaCard, { title: "Recent Predictions", variant: "glass", padding: "lg", children: _jsx("div", { className: "space-y-4", children: predictions?.slice(0, 5).map((prediction, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-gray-800 bg-opacity-50", children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "body", className: "font-medium", children: prediction.game || `Game ${index + 1}` }), _jsxs(CyberText, { variant: "caption", color: "muted", children: ["Confidence: ", prediction.confidence, "%"] })] }), _jsx("div", { className: "text-right", children: _jsxs(CyberText, { variant: "body", style: { color: "#06ffa5" }, children: ["$", prediction.potentialWin || "0"] }) })] }, index))) || (_jsx(CyberText, { variant: "body", color: "muted", children: "No recent predictions available" })) }) }), _jsx(MegaCard, { title: "Quick Actions", variant: "glass", padding: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsx(MegaButton, { variant: "primary", fullWidth: true, icon: _jsx(Brain, { size: 16 }), children: "Run Analysis" }), _jsx(MegaButton, { variant: "secondary", fullWidth: true, icon: _jsx(TrendingUp, { size: 16 }), children: "View Opportunities" }), _jsx(MegaButton, { variant: "secondary", fullWidth: true, icon: _jsx(Settings, { size: 16 }), children: "Configure Strategy" })] }) })] }), metrics && (_jsx(MegaCard, { title: "Performance Summary", variant: "glass", padding: "lg", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx(CyberText, { variant: "title", style: { fontSize: "32px", color: "#06ffa5" }, children: metrics.totalPredictions || 0 }), _jsx(CyberText, { variant: "body", color: "secondary", children: "Total Predictions" })] }), _jsxs("div", { className: "text-center", children: [_jsxs(CyberText, { variant: "title", style: { fontSize: "32px", color: "#00d4ff" }, children: [metrics.accuracy || user.accuracy, "%"] }), _jsx(CyberText, { variant: "body", color: "secondary", children: "Average Accuracy" })] }), _jsxs("div", { className: "text-center", children: [_jsxs(CyberText, { variant: "title", style: { fontSize: "32px", color: "#06ffa5" }, children: ["$", (metrics.totalProfit || user.totalProfit).toLocaleString()] }), _jsx(CyberText, { variant: "body", color: "secondary", children: "Total Profit" })] })] }) }))] }));
};
export default UniversalDashboard;
