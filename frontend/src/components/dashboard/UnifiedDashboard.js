import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useCallback, Suspense } from "react";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { usePrizePicksLiveData } from "../../hooks/usePrizePicksLiveData";
import { useStrategyEngineData } from "../../hooks/useStrategyEngineData";
import { PerformanceAnalyticsDashboard } from "../analytics/PerformanceAnalyticsDashboard";
import { MarketAnalysisDashboard } from "../MarketAnalysisDashboard";
import { ArbitrageOpportunities } from "../ArbitrageOpportunities";
import { PrizePicksEdgeDisplay } from "../betting/PrizePicksEdgeDisplay";
import { SmartLineupBuilder } from "../lineup/SmartLineupBuilder";
import MLFactorViz from "../MLFactorViz";
import { UnifiedMoneyMaker } from "../money-maker/UnifiedMoneyMaker";
import { QuantumPredictionsInterface } from "../prediction/QuantumPredictionsInterface";
import { UnifiedProfile } from "../profile/UnifiedProfile";
import { UnifiedSettingsInterface } from "../settings/UnifiedSettingsInterface";
import UnifiedStrategyEngineDisplay from "../strategy/UnifiedStrategyEngineDisplay";
import { Badge } from "../ui/badge";
import { BetSimulationTool } from "../ui/BetSimulationTool";
import { Card } from "../ui/card";
import { FeatureFlagIndicators } from "../ui/FeatureFlagIndicators";
import { ServiceStatusIndicators } from "../ui/ServiceStatusIndicators";
import { Skeleton } from "../ui/Skeleton";
import { Toast } from "../ui/UnifiedUI";
import { HeroSection } from "./HeroSection";
import { LiveGamesDisplay } from "./LiveGamesDisplay";
import { RealTimePredictions } from "./RealTimePredictions";
import { DataSourcesPanel } from "./DataSourcesPanel";
// ============================================================================
// TAB COMPONENTS & CONFIGURATION
// ============================================================================
// Overview tab content
const OverviewTab = ({ metrics, recentActivity, winRate, roi, profitLoss, dataQuality }) => (_jsxs(_Fragment, { children: [_jsx(HeroSection, { connectedSources: 50, totalSources: 60, gamesCount: 20, playersCount: 100, dataQuality: 0.85, dataReliability: 0.9 }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8", children: [_jsx(Card, { className: "glass-card bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2", children: "Win Rate" }), _jsxs("div", { className: "text-3xl font-extrabold text-blue-600 dark:text-blue-300", children: [winRate.value.toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-blue-500/70 mt-1", children: "+2.3% this week" })] }) }), _jsx(Card, { className: "glass-card bg-gradient-to-br from-green-500/20 to-teal-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-lg font-semibold text-green-800 dark:text-green-200 mb-2", children: "ROI" }), _jsxs("div", { className: "text-3xl font-extrabold text-green-600 dark:text-green-300", children: [roi.value.toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-green-500/70 mt-1", children: "+5.1% this month" })] }) }), _jsx(Card, { className: "glass-card bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2", children: "Profit/Loss" }), _jsxs("div", { className: `text-3xl font-extrabold ${profitLoss.value >= 0 ? "text-green-500" : "text-red-500"}`, children: ["$", profitLoss.value.toFixed(2)] }), _jsx("div", { className: "text-sm text-yellow-600/70 mt-1", children: "Last 30 days" })] }) }), _jsx(Card, { className: "glass-card bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2", children: "Active Bets" }), _jsx("div", { className: "text-3xl font-extrabold text-purple-600 dark:text-purple-300", children: metrics.activePredictions }), _jsx("div", { className: "text-sm text-purple-500/70 mt-1", children: "Currently tracking" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8", children: [_jsx(DataSourcesPanel, { connectedSources: metrics.activePredictions, totalSources: 15 }), _jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg", children: [_jsx("h3", { className: "text-lg font-bold mb-4 dark:text-white", children: "Real-Time System Status" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Connection Status:" }), _jsx("span", { className: "font-medium dark:text-white", children: "Connected" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Data Quality:" }), _jsxs("span", { className: "font-medium text-green-600", children: [(dataQuality * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Active Predictions:" }), _jsx("span", { className: "font-medium text-purple-600", children: metrics.activePredictions })] })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8", children: [_jsx(LiveGamesDisplay, { games: [] }), _jsx(RealTimePredictions, { predictions: [], loading: false })] })] }));
// PrizePicks tab with loading states
const PrizePicksTab = ({ livePrizePicksData, showDebug }) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\uD83C\uDFAF PrizePicks Intelligence Hub" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Real-time prop analysis with advanced ML predictions" })] }), livePrizePicksData.length === 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => (_jsx(Skeleton, { height: 200, className: "w-full rounded-xl" }, i))) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: livePrizePicksData.map((pick, idx) => (_jsx(PrizePicksEdgeDisplay, { ...pick, showDebug: showDebug }, pick.id || idx))) }))] }));
// Create icon component helper
const createIcon = (emoji, label) => (_jsx("span", { role: "img", "aria-label": label, className: "text-xl", children: emoji }));
// Main tab configuration
const TAB_CONFIGS = [
    {
        key: "overview",
        label: "Overview",
        icon: createIcon("📊", "overview"),
        component: OverviewTab,
    },
    {
        key: "analytics",
        label: "Analytics",
        icon: createIcon("📈", "analytics"),
        component: ({}) => (_jsxs("div", { className: "space-y-8", children: [_jsx(PerformanceAnalyticsDashboard, {}), _jsx(MarketAnalysisDashboard, {})] })),
    },
    {
        key: "prizepicks",
        label: "PrizePicks",
        icon: createIcon("🎯", "prizepicks"),
        component: PrizePicksTab,
    },
    {
        key: "strategyEngine",
        label: "Strategy Engine",
        icon: createIcon("🧠", "strategy"),
        component: ({ recommendations, showDebug }) => (_jsx(UnifiedStrategyEngineDisplay, { recommendations: recommendations, showDebug: showDebug })),
    },
    {
        key: "moneyMaker",
        label: "Money Maker",
        icon: createIcon("💰", "money"),
        component: UnifiedMoneyMaker,
        isPremium: true,
    },
    {
        key: "arbitrage",
        label: "Arbitrage",
        icon: createIcon("🔀", "arbitrage"),
        component: ArbitrageOpportunities,
    },
    {
        key: "ml",
        label: "ML Models",
        icon: createIcon("🤖", "ml"),
        component: ({}) => _jsx(MLFactorViz, { playerId: null, metric: null }),
    },
    {
        key: "quantum",
        label: "Quantum",
        icon: createIcon("🧬", "quantum"),
        component: QuantumPredictionsInterface,
        isPremium: true,
    },
    {
        key: "simulator",
        label: "Simulator",
        icon: createIcon("🧪", "simulator"),
        component: BetSimulationTool,
    },
    {
        key: "lineup",
        label: "Smart Lineup",
        icon: createIcon("📋", "lineup"),
        component: SmartLineupBuilder,
    },
    {
        key: "profile",
        label: "Profile",
        icon: createIcon("👤", "profile"),
        component: UnifiedProfile,
    },
    {
        key: "settings",
        label: "Settings",
        icon: createIcon("⚙️", "settings"),
        component: UnifiedSettingsInterface,
    },
];
// ============================================================================
// MAIN COMPONENT
// ============================================================================
const UnifiedDashboard = () => {
    // ========== STATE ==========
    const [activeTab, setActiveTab] = useState("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);
    // Demo data - replace with real data sources
    const [recentActivity] = useState([
        {
            id: "1",
            type: "bet",
            description: "Lakers vs Warriors Over 220.5",
            amount: 100,
            odds: 2.1,
            timestamp: Date.now() - 3600000,
            status: "success",
        },
        {
            id: "2",
            type: "prediction",
            description: "Patriots ML Prediction",
            amount: 50,
            odds: 1.8,
            timestamp: Date.now() - 7200000,
            status: "pending",
        },
    ]);
    const [metrics] = useState({
        winRate: 72.4,
        roi: 18.2,
        profitLoss: 1240.55,
        totalBets: 156,
        activePredictions: 8,
    });
    // ========== HOOKS ==========
    const winRate = useAnimatedValue(metrics.winRate, { duration: 1200 });
    const roi = useAnimatedValue(metrics.roi, { duration: 1400 });
    const profitLoss = useAnimatedValue(metrics.profitLoss, { duration: 1600 });
    const showDebug = import.meta.env.MODE === "development";
    const livePrizePicksData = usePrizePicksLiveData();
    const strategyRecommendations = useStrategyEngineData();
    // ========== HANDLERS ==========
    const handleTabChange = useCallback((tabKey) => {
        setActiveTab(tabKey);
        setIsMobileMenuOpen(false);
    }, []);
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);
    const showToast = useCallback((message, type = "info") => {
        setToast({ message, type });
    }, []);
    // ========== COMPUTED VALUES ==========
    const currentTabConfig = TAB_CONFIGS.find((tab) => tab.key === activeTab);
    const CurrentTabComponent = currentTabConfig?.component;
    // Get props for current tab
    const getTabProps = () => {
        switch (activeTab) {
            case "overview":
                return {
                    metrics,
                    recentActivity,
                    winRate,
                    roi,
                    profitLoss,
                    dataQuality: 0.87,
                };
            case "prizepicks":
                return { livePrizePicksData, showDebug };
            case "strategyEngine":
                return { recommendations: strategyRecommendations, showDebug };
            default:
                return {};
        }
    };
    // ========== ANIMATION VARIANTS ==========
    const sidebarVariants = {
        open: { x: 0, opacity: 1 },
        closed: { x: "-100%", opacity: 0 },
    };
    const contentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };
    const overlayVariants = {
        open: { opacity: 1 },
        closed: { opacity: 0 },
    };
    // ========== RENDER COMPONENTS ==========
    // Mobile Header
    const MobileHeader = () => (_jsxs("div", { className: "lg:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl animate-pulse", children: "\u26A1" }), _jsx("span", { className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "A1Betting" })] }), _jsx("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors", "aria-label": "Toggle menu", children: isMobileMenuOpen ? _jsx(X, { size: 20 }) : _jsx(Menu, { size: 20 }) })] }));
    // Sidebar component
    const Sidebar = () => (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: isMobileMenuOpen && (_jsx(motion.div, { initial: "closed", animate: "open", exit: "closed", variants: overlayVariants, className: "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40", onClick: closeMobileMenu })) }), _jsxs(motion.aside, { initial: false, animate: isMobileMenuOpen ? "open" : "closed", variants: sidebarVariants, transition: { type: "spring", damping: 25, stiffness: 200 }, className: `
          fixed lg:static top-0 left-0 h-full w-72 z-50
          lg:translate-x-0 lg:opacity-100
          bg-gradient-to-b from-blue-600/95 to-purple-700/95
          backdrop-blur-xl shadow-2xl rounded-none lg:rounded-2xl
          flex flex-col gap-4 text-white overflow-y-auto
        `, children: [_jsx("div", { className: "p-6 border-b border-white/10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-3xl animate-pulse", children: "\u26A1" }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-extrabold tracking-tight", children: "A1Betting" }), _jsx("div", { className: "text-xs text-blue-200 opacity-75", children: "AI Sports Intelligence" })] })] }), _jsx("button", { onClick: closeMobileMenu, className: "lg:hidden p-1 rounded text-white/70 hover:text-white", "aria-label": "Close menu", children: _jsx(X, { size: 20 }) })] }) }), _jsx("nav", { className: "flex-1 px-4 pb-6 space-y-2", children: TAB_CONFIGS.map((tab) => (_jsxs("button", { className: `
                w-full flex items-center gap-4 px-4 py-3 rounded-xl
                transition-all duration-200 font-semibold text-left
                ${activeTab === tab.key
                                ? "bg-white/20 shadow-lg ring-2 ring-yellow-400/50 text-white"
                                : "hover:bg-white/10 text-white/90 hover:text-white"}
                ${tab.isPremium ? "border border-yellow-400/30" : ""}
              `, onClick: () => handleTabChange(tab.key), children: [_jsx("span", { className: "text-xl", children: tab.icon }), _jsx("span", { className: "flex-1", children: tab.label }), tab.isPremium && (_jsx(Badge, { variant: "warning", className: "text-xs bg-yellow-500/20 text-yellow-300 border-yellow-400/30", children: "PRO" }))] }, tab.key))) }), _jsx("div", { className: "p-4 border-t border-white/10", children: _jsx("div", { className: "text-xs text-white/60 text-center", children: "Version 2.1.0 \u2022 Real-time AI" }) })] })] }));
    // Main content
    const MainContent = () => (_jsxs("main", { className: "flex-1 min-h-screen p-4 lg:p-8 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-yellow-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: "initial", animate: "animate", exit: "exit", variants: contentVariants, transition: { duration: 0.3, ease: "easeInOut" }, className: "space-y-8 min-h-[60vh]", children: [_jsx(Suspense, { fallback: _jsxs("div", { className: "space-y-6", children: [_jsx(Skeleton, { height: 120, className: "w-full" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(3)].map((_, i) => (_jsx(Skeleton, { height: 200, className: "w-full" }, i))) })] }), children: CurrentTabComponent ? (_jsx(CurrentTabComponent, { ...getTabProps() })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDEA7" }), _jsx("h3", { className: "text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "Tab Under Development" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "This feature is coming soon!" })] })) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12", children: [_jsx(Card, { className: "glass-card bg-white/70 dark:bg-gray-900/70 shadow-lg", children: _jsxs("div", { className: "p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDCCA" }), "Recent Activity"] }), _jsx("div", { className: "space-y-3", children: recentActivity.length === 0 ? (_jsx("div", { className: "text-gray-400 text-center py-4", children: "No recent activity." })) : (recentActivity.map((activity) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm", children: activity.description }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: new Date(activity.timestamp).toLocaleString() })] }), _jsxs("div", { className: "flex items-center gap-3", children: [activity.amount && (_jsxs("span", { className: "text-sm font-medium", children: ["$", activity.amount] })), _jsx(Badge, { variant: activity.status === "success"
                                                                        ? "success"
                                                                        : activity.status === "pending"
                                                                            ? "warning"
                                                                            : "danger", children: activity.status })] })] }, activity.id)))) })] }) }), _jsx(Card, { className: "glass-card bg-white/70 dark:bg-gray-900/70 shadow-lg", children: _jsxs("div", { className: "p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDD27" }), "System Status"] }), _jsx(ServiceStatusIndicators, {}), _jsx("div", { className: "mt-4", children: _jsx(FeatureFlagIndicators, {}) })] }) })] })] }, activeTab) }), _jsx(AnimatePresence, { children: toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })) })] }));
    // ========== MAIN RENDER ==========
    return (_jsxs("div", { className: "flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800", children: [_jsx(MobileHeader, {}), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsx(Sidebar, {}), _jsx(MainContent, {})] })] }));
};
export default UnifiedDashboard;
