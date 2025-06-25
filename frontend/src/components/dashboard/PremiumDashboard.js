import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, TrendingUp, Brain, Target, BarChart3, Settings, Zap, Trophy, DollarSign, Activity, Eye, Smartphone, Bell, ArrowUpRight, ArrowDownRight, Plus, Play, Pause, ChevronRight, Filter, Search, Download, Share, } from "lucide-react";
// Lazy load components for better performance
const AdvancedAnalyticsHub = lazy(() => import("../analytics/AdvancedAnalyticsHub"));
const MLModelCenter = lazy(() => import("../ml/MLModelCenter"));
const UnifiedBettingInterface = lazy(() => import("../betting/UnifiedBettingInterface"));
const ArbitrageOpportunities = lazy(() => import("../ArbitrageOpportunities"));
const PerformanceAnalyticsDashboard = lazy(() => import("../analytics/PerformanceAnalyticsDashboard"));
const RealTimeDataStream = lazy(() => import("../realtime/RealTimeDataStream"));
const MobileOptimizedInterface = lazy(() => import("../mobile/MobileOptimizedInterface"));
// Dashboard tab configuration with proper typing
const dashboardTabs = [
    {
        id: "overview",
        name: "Overview",
        icon: Home,
        color: "brand",
        description: "Complete performance overview",
    },
    {
        id: "trading",
        name: "Trading",
        icon: TrendingUp,
        color: "success",
        description: "Advanced betting interface",
    },
    {
        id: "ml-center",
        name: "ML Center",
        icon: Brain,
        color: "purple",
        description: "AI model management",
    },
    {
        id: "arbitrage",
        name: "Arbitrage",
        icon: Target,
        color: "warning",
        description: "Risk-free opportunities",
    },
    {
        id: "analytics",
        name: "Analytics",
        icon: BarChart3,
        color: "info",
        description: "Deep insights & charts",
    },
    {
        id: "performance",
        name: "Performance",
        icon: Activity,
        color: "success",
        description: "Track your results",
    },
    {
        id: "live",
        name: "Live Data",
        icon: Eye,
        color: "error",
        description: "Real-time monitoring",
    },
    {
        id: "mobile",
        name: "Mobile",
        icon: Smartphone,
        color: "purple",
        description: "Mobile experience",
    },
];
// Mock dashboard metrics with proper typing
const mockMetrics = {
    totalProfit: 12450.8,
    profitChange: 8.2,
    winRate: 73.5,
    winRateChange: 2.1,
    totalBets: 127,
    betsChange: 5,
    avgOdds: 1.92,
    oddsChange: -0.03,
    activeModels: 8,
    modelsChange: 2,
    confidenceScore: 87.3,
    confidenceChange: 3.2,
};
const PremiumDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isLive, setIsLive] = useState(true);
    const [notifications, setNotifications] = useState(3);
    const [currentTime, setCurrentTime] = useState(new Date());
    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);
    // Memoized color mapping for better performance
    const colorClasses = useMemo(() => ({
        brand: {
            gradient: "from-brand-500 to-brand-600",
            text: "text-brand-600",
            background: "bg-brand-50",
            border: "border-brand-200",
            full: "from-brand-500 to-brand-600 text-brand-600 bg-brand-50 border-brand-200",
        },
        success: {
            gradient: "from-success-500 to-success-600",
            text: "text-success-600",
            background: "bg-success-50",
            border: "border-success-200",
            full: "from-success-500 to-success-600 text-success-600 bg-success-50 border-success-200",
        },
        warning: {
            gradient: "from-warning-500 to-warning-600",
            text: "text-warning-600",
            background: "bg-warning-50",
            border: "border-warning-200",
            full: "from-warning-500 to-warning-600 text-warning-600 bg-warning-50 border-warning-200",
        },
        error: {
            gradient: "from-error-500 to-error-600",
            text: "text-error-600",
            background: "bg-error-50",
            border: "border-error-200",
            full: "from-error-500 to-error-600 text-error-600 bg-error-50 border-error-200",
        },
        info: {
            gradient: "from-blue-500 to-blue-600",
            text: "text-blue-600",
            background: "bg-blue-50",
            border: "border-blue-200",
            full: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200",
        },
        purple: {
            gradient: "from-purple-500 to-purple-600",
            text: "text-purple-600",
            background: "bg-purple-50",
            border: "border-purple-200",
            full: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200",
        },
    }), []);
    const getColorClasses = useCallback((color) => {
        return colorClasses[color] || colorClasses.brand;
    }, [colorClasses]);
    const MetricCard = React.memo(({ title, value, change, prefix = "", suffix = "", icon: Icon, color = "brand", }) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "premium-card p-6 hover:scale-105 transition-transform duration-300", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: title }), _jsxs("p", { className: "text-3xl font-bold text-gray-900 mb-2", children: [prefix, typeof value === "number" ? value.toLocaleString() : value, suffix] }), change !== undefined && (_jsxs("div", { className: `flex items-center text-sm ${change >= 0 ? "text-success-600" : "text-error-600"}`, children: [change >= 0 ? (_jsx(ArrowUpRight, { className: "w-4 h-4 mr-1" })) : (_jsx(ArrowDownRight, { className: "w-4 h-4 mr-1" })), Math.abs(change), "% from last period"] }))] }), Icon && (_jsx("div", { className: `p-3 rounded-xl ${getColorClasses(color).background} ${getColorClasses(color).border}`, children: _jsx(Icon, { className: `w-6 h-6 ${getColorClasses(color).text}` }) }))] }) })));
    const QuickAction = React.memo(({ title, description, icon: Icon, color, onClick }) => (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: onClick, className: "premium-card p-4 text-left w-full hover:shadow-lg transition-all duration-300", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `p-2 rounded-lg ${getColorClasses(color).background} ${getColorClasses(color).border}`, children: _jsx(Icon, { className: `w-5 h-5 ${getColorClasses(color).text}` }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: title }), _jsx("p", { className: "text-sm text-gray-600", children: description })] }), _jsx(ChevronRight, { className: "w-5 h-5 text-gray-400" })] }) })));
    const renderTabContent = useCallback(() => {
        const LoadingFallback = useCallback(() => {
            const tabName = dashboardTabs.find((t) => t.id === activeTab)?.name || "content";
            return (_jsx("div", { className: "flex items-center justify-center h-96", role: "status", "aria-live": "polite", "aria-label": `Loading ${tabName}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent mx-auto mb-4" }), _jsxs("p", { className: "text-gray-600 font-medium", children: ["Loading ", tabName, "..."] })] }) }));
        }, [activeTab]);
        switch (activeTab) {
            case "overview":
                return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [_jsx(MetricCard, { title: "Total Profit", value: mockMetrics.totalProfit, change: mockMetrics.profitChange, prefix: "$", icon: DollarSign, color: "success" }), _jsx(MetricCard, { title: "Win Rate", value: mockMetrics.winRate, change: mockMetrics.winRateChange, suffix: "%", icon: Trophy, color: "brand" }), _jsx(MetricCard, { title: "Total Bets", value: mockMetrics.totalBets, change: mockMetrics.betsChange, icon: Target, color: "info" }), _jsx(MetricCard, { title: "Avg Odds", value: mockMetrics.avgOdds, change: mockMetrics.oddsChange, icon: TrendingUp, color: "warning" })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-6", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsx(QuickAction, { title: "Place New Bet", description: "Start a new betting session", icon: Plus, color: "success", onClick: () => setActiveTab("trading") }), _jsx(QuickAction, { title: "View Analytics", description: "Explore performance insights", icon: BarChart3, color: "brand", onClick: () => setActiveTab("analytics") }), _jsx(QuickAction, { title: "ML Models", description: "Manage AI predictions", icon: Brain, color: "purple", onClick: () => setActiveTab("ml-center") }), _jsx(QuickAction, { title: "Find Arbitrage", description: "Risk-free opportunities", icon: Target, color: "warning", onClick: () => setActiveTab("arbitrage") }), _jsx(QuickAction, { title: "Live Data", description: "Real-time monitoring", icon: Eye, color: "error", onClick: () => setActiveTab("live") }), _jsx(QuickAction, { title: "Performance", description: "Track your results", icon: Activity, color: "success", onClick: () => setActiveTab("performance") })] })] }), _jsxs("div", { className: "premium-card p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Recent Activity" }), _jsx("button", { className: "btn-outline px-3 py-2 text-sm", children: "View All" })] }), _jsx("div", { className: "space-y-4", children: useMemo(() => {
                                        const activities = [
                                            {
                                                type: "bet",
                                                desc: "NBA: Lakers vs Warriors OVER 220.5",
                                                amount: "+$250",
                                                time: "2 hours ago",
                                                status: "won",
                                            },
                                            {
                                                type: "model",
                                                desc: "ML Model updated: NBA Points Predictor",
                                                amount: "v2.1.3",
                                                time: "4 hours ago",
                                                status: "info",
                                            },
                                            {
                                                type: "arb",
                                                desc: "Arbitrage opportunity detected",
                                                amount: "2.3% ROI",
                                                time: "6 hours ago",
                                                status: "pending",
                                            },
                                            {
                                                type: "bet",
                                                desc: "NFL: Chiefs vs Bills UNDER 48.5",
                                                amount: "-$100",
                                                time: "1 day ago",
                                                status: "lost",
                                            },
                                        ];
                                        return activities;
                                    }, []).map((activity, idx) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `p-2 rounded-lg ${activity.status === "won"
                                                            ? "bg-success-100 text-success-600"
                                                            : activity.status === "lost"
                                                                ? "bg-error-100 text-error-600"
                                                                : activity.status === "info"
                                                                    ? "bg-blue-100 text-blue-600"
                                                                    : "bg-warning-100 text-warning-600"}`, children: activity.type === "bet" ? (_jsx(Target, { className: "w-4 h-4" })) : activity.type === "model" ? (_jsx(Brain, { className: "w-4 h-4" })) : (_jsx(TrendingUp, { className: "w-4 h-4" })) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: activity.desc }), _jsx("p", { className: "text-sm text-gray-600", children: activity.time })] })] }), _jsx("span", { className: `font-semibold ${activity.status === "won"
                                                    ? "text-success-600"
                                                    : activity.status === "lost"
                                                        ? "text-error-600"
                                                        : "text-gray-900"}`, children: activity.amount })] }, idx))) })] })] }));
            case "trading":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(UnifiedBettingInterface, {}) }));
            case "ml-center":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(MLModelCenter, {}) }));
            case "arbitrage":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(ArbitrageOpportunities, {}) }));
            case "analytics":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AdvancedAnalyticsHub, {}) }));
            case "performance":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(PerformanceAnalyticsDashboard, {}) }));
            case "live":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(RealTimeDataStream, {}) }));
            case "mobile":
                return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(MobileOptimizedInterface, {}) }));
            default:
                return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "Select a tab to view content" }) }));
        }
    }, [activeTab]);
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100", children: [_jsx("div", { className: "nav-premium sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl", children: _jsx(Zap, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gradient", children: "A1 Betting Pro" }), _jsxs("p", { className: "text-sm text-gray-600", children: [currentTime.toLocaleDateString(), " \u2022", " ", currentTime.toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })] })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("button", { onClick: () => setIsLive(!isLive), className: `flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isLive
                                                ? "bg-success-100 text-success-700 hover:bg-success-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: [isLive ? (_jsx(Play, { className: "w-3 h-3" })) : (_jsx(Pause, { className: "w-3 h-3" })), _jsx("span", { className: "text-sm font-medium", children: isLive ? "LIVE" : "PAUSED" }), isLive && (_jsx("div", { className: "w-2 h-2 bg-success-500 rounded-full animate-pulse" }))] }) })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { className: "btn-glass px-3 py-2 relative", children: [_jsx(Bell, { className: "w-5 h-5" }), notifications > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center", children: notifications }))] }), _jsx("button", { className: "btn-glass px-3 py-2", children: _jsx(Search, { className: "w-5 h-5" }) }), _jsx("button", { className: "btn-glass px-3 py-2", children: _jsx(Filter, { className: "w-5 h-5" }) }), _jsx("button", { className: "btn-glass px-3 py-2", children: _jsx(Download, { className: "w-5 h-5" }) }), _jsx("button", { className: "btn-glass px-3 py-2", children: _jsx(Share, { className: "w-5 h-5" }) }), _jsx("button", { className: "btn-glass px-3 py-2", children: _jsx(Settings, { className: "w-5 h-5" }) })] })] }) }) }), _jsx("div", { className: "border-b border-gray-200 bg-white/80 backdrop-blur-lg", role: "tablist", "aria-label": "Dashboard navigation tabs", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-1 overflow-x-auto py-2 scrollbar-hide", children: dashboardTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            const colors = getColorClasses(tab.color);
                            return (_jsxs(motion.button, { onClick: () => setActiveTab(tab.id), className: `flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap relative ${isActive
                                    ? `${colors.background} ${colors.text} ${colors.border} shadow-sm`
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, role: "tab", "aria-selected": isActive, "aria-controls": `tabpanel-${tab.id}`, "aria-label": `${tab.name} - ${tab.description}`, tabIndex: isActive ? 0 : -1, children: [_jsx(Icon, { className: `w-4 h-4 ${isActive ? colors.text : "text-gray-500"}`, "aria-hidden": "true" }), _jsx("span", { className: "hidden sm:inline", children: tab.name }), isActive && (_jsx(motion.div, { layoutId: "activeTab", className: `absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient}`, "aria-hidden": "true" }))] }, tab.id));
                        }) }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, role: "tabpanel", id: `tabpanel-${activeTab}`, "aria-labelledby": `tab-${activeTab}`, children: renderTabContent() }, activeTab) }) })] }));
};
export default PremiumDashboard;
