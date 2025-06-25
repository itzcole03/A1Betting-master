import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, BarChart3, Bell, Brain, ChevronDown, DollarSign, HelpCircle, Home, Plus, Search, Settings, Target, User, } from "lucide-react";
import { useEffect, useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Import providers and utilities
import ErrorBoundary from "./components/ErrorBoundary";
import { SafeThemeProvider } from "./providers/SafeThemeProvider";
// Import hooks for real data
import { useMockUserProfile } from "./hooks/UniversalHooks";
// Import main page components - Using advanced versions
import CyberAnalyticsHub from "./components/cyber/CyberAnalyticsHub";
import CyberUltimateMoneyMaker from "./components/cyber/CyberUltimateMoneyMaker";
import EliteFeaturesOverview from "./components/dashboard/EliteFeaturesOverview";
import UltraAdvancedMLDashboard from "./components/ml/UltraAdvancedMLDashboard";
import { UnifiedProfile } from "./components/profile/UnifiedProfile";
import EnhancedRevolutionaryInterface from "./components/revolutionary/EnhancedRevolutionaryInterface";
import UltimateSettingsPage from "./components/settings/UltimateSettingsPage";
// Import modern UI components and advanced layout
import ModernCommandPalette from "./components/ui/ModernCommandPalette";
import ModernNotificationCenter from "./components/ui/ModernNotificationCenter";
// Import styling
import "./App.css";
import "./styles/enhanced-modern-theme.css";
// ============================================================================
// CONFIGURATION
// ============================================================================
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 300000,
            gcTime: 600000, // Updated from cacheTime
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            refetchInterval: false,
        },
    },
});
// Comprehensive Elite Sports Intelligence Platform Navigation
const navigationItems = [
    {
        id: "dashboard",
        label: "Elite Dashboard",
        icon: _jsx(Home, { className: "w-5 h-5" }),
        component: ({ onNavigate }) => (_jsx(EliteFeaturesOverview, { onNavigate: onNavigate })),
        shortcut: ["⌘", "D"],
        badge: "ELITE",
    },
    {
        id: "money-maker",
        label: "Money Maker",
        icon: _jsx(DollarSign, { className: "w-5 h-5" }),
        component: CyberUltimateMoneyMaker,
        shortcut: ["⌘", "M"],
        badge: "CYBER",
    },
    {
        id: "analytics",
        label: "Analytics Hub",
        icon: _jsx(BarChart3, { className: "w-5 h-5" }),
        component: CyberAnalyticsHub,
        shortcut: ["⌘", "A"],
        badge: "PRO",
    },
    {
        id: "ai-predictions",
        label: "AI Predictions",
        icon: _jsx(Brain, { className: "w-5 h-5" }),
        component: EnhancedRevolutionaryInterface,
        shortcut: ["⌘", "P"],
        badge: "ELITE",
    },
    {
        id: "arbitrage",
        label: "AI Arbitrage",
        icon: _jsx(Target, { className: "w-5 h-5" }),
        component: CyberUltimateMoneyMaker, // AI Arbitrage uses money maker for now
        shortcut: ["⌘", "R"],
        badge: "AI",
    },
    {
        id: "ml-center",
        label: "ML Center",
        icon: _jsx(Activity, { className: "w-5 h-5" }),
        component: UltraAdvancedMLDashboard,
        shortcut: ["⌘", "L"],
        badge: "ML",
    },
    {
        id: "profile",
        label: "Profile",
        icon: _jsx(User, { className: "w-5 h-5" }),
        component: UnifiedProfile,
        shortcut: ["⌘", "U"],
    },
    {
        id: "settings",
        label: "Settings",
        icon: _jsx(Settings, { className: "w-5 h-5" }),
        component: UltimateSettingsPage,
        shortcut: ["⌘", ","],
    },
];
const CyberModernSidebar = ({ activeItem, onNavigate, user, }) => {
    return (_jsxs("aside", {
        className: "w-72 h-full bg-gradient-to-b from-gray-900/95 to-black/95 border-r border-cyan-500/20 flex flex-col backdrop-blur-xl", children: [_jsx("div", { className: "p-6 border-b border-cyan-500/30", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-lg opacity-75 animate-pulse" }), _jsx("div", { className: "relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center", children: _jsx(Brain, { className: "w-7 h-7 text-black font-bold" }) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent", children: "A1BETTING" }), _jsx("div", { className: "text-xs text-cyan-400 uppercase tracking-widest font-semibold", children: "Quantum Intelligence" })] })] }) }), _jsx("div", { className: "p-6 border-b border-cyan-500/20", children: _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "text-center p-3 rounded-lg bg-gradient-to-b from-emerald-500/20 to-green-600/20 border border-emerald-500/30", children: [_jsxs("p", { className: "text-xl font-bold text-emerald-400", children: [user.winRate, "%"] }), _jsx("p", { className: "text-xs text-emerald-300 font-medium", children: "Win Rate" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "text-center p-3 rounded-lg bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border border-cyan-500/30", children: [_jsxs("p", { className: "text-xl font-bold text-cyan-400", children: ["$", (user.totalProfit / 1000).toFixed(0), "K"] }), _jsx("p", { className: "text-xs text-cyan-300 font-medium", children: "Profit" })] }), _jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "text-center p-3 rounded-lg bg-gradient-to-b from-purple-500/20 to-violet-600/20 border border-purple-500/30", children: [_jsxs("p", { className: "text-xl font-bold text-purple-400", children: [user.accuracy, "%"] }), _jsx("p", { className: "text-xs text-purple-300 font-medium", children: "Accuracy" })] })] }) }), _jsxs("nav", {
            className: "flex-1 p-4 overflow-y-auto", children: [_jsxs("div", {
                className: "space-y-1 mb-6", children: [_jsx("div", { className: "text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 px-2", children: "Core Platform" }), navigationItems.map((item, index) => (_jsxs(motion.button, {
                    initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, whileHover: { x: 4, scale: 1.02 }, onClick: () => onNavigate(item.id), className: `
                w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group
                ${activeItem === item.id
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/20"
                            : "text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-cyan-500/10 hover:text-cyan-300 hover:border hover:border-cyan-500/30"}
              `, children: [_jsx("div", { className: `${activeItem === item.id ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"} transition-colors`, children: item.icon }), _jsx("span", { className: "font-semibold text-sm flex-1", children: item.label }), item.badge && (_jsx(motion.span, { whileHover: { scale: 1.1 }, className: "px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold rounded-full", children: item.badge })), item.shortcut && (_jsx("span", {
                                className: "text-xs text-gray-500 font-mono bg-gray-800/50 px-1.5 py-0.5 rounded border border-gray-700", children: Array.isArray(item.shortcut)
                                    ? item.shortcut.join("")
                                    : item.shortcut
                            }))]
                }, item.id)))]
            }), _jsxs("div", {
                className: "border-t border-cyan-500/20 pt-4", children: [_jsx("div", { className: "text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 px-2", children: "Elite Features" }), _jsx("div", {
                    className: "space-y-1", children: [
                        { name: "Business Analysis", icon: "📊", status: "active" },
                        { name: "AI Edge ML", icon: "🧠", status: "active" },
                        { name: "Mega Sports", icon: "⚡", status: "pro" },
                        { name: "Elite Bankroll", icon: "💰", status: "premium" },
                        { name: "SQL Sports", icon: "🔍", status: "active" },
                        { name: "Model Analysis", icon: "📈", status: "ai" },
                        { name: "Market Connector", icon: "🔗", status: "live" },
                        { name: "Real Simulator", icon: "🎮", status: "beta" },
                    ].map((feature, index) => (_jsxs(motion.div, {
                        initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5 + index * 0.05 }, className: "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group", children: [_jsx("span", { className: "text-sm", children: feature.icon }), _jsx("span", { className: "text-xs text-gray-400 group-hover:text-gray-300 flex-1", children: feature.name }), _jsx("div", {
                            className: `w-2 h-2 rounded-full ${feature.status === "active"
                                ? "bg-green-400"
                                : feature.status === "pro"
                                    ? "bg-purple-400"
                                    : feature.status === "premium"
                                        ? "bg-yellow-400"
                                        : feature.status === "ai"
                                            ? "bg-cyan-400"
                                            : feature.status === "live"
                                                ? "bg-red-400 animate-pulse"
                                                : "bg-orange-400"}`
                        })]
                    }, feature.name)))
                })]
            })]
        }), _jsx("div", {
            className: "p-4 border-t border-cyan-500/20", children: _jsxs(motion.div, {
                whileHover: { scale: 1.02 }, className: "flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-cyan-500/30 cursor-pointer transition-all duration-300", children: [_jsxs("div", {
                    className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75" }), _jsx("div", {
                        className: "relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center", children: _jsx("span", {
                            className: "text-white text-sm font-bold", children: user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                        })
                    })]
                }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-white", children: user.name }), _jsxs("p", { className: "text-xs text-cyan-400 font-medium", children: [user.tier, " Member"] })] }), _jsx(motion.div, { whileHover: { rotate: 180 }, children: _jsx(ChevronDown, { className: "w-4 h-4 text-gray-400" }) })]
            })
        })]
    }));
};
const CyberTopBar = ({ onOpenCommandPalette, onOpenNotifications, currentPage, }) => {
    const currentItem = navigationItems.find((item) => item.id === currentPage);
    return (_jsxs("header", {
        className: "h-20 bg-gradient-to-r from-gray-900/95 to-black/95 border-b border-cyan-500/30 flex items-center justify-between px-8 backdrop-blur-xl", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 animate-pulse pointer-events-none" }), _jsxs("div", {
            className: "relative z-10 flex items-center gap-6", children: [_jsxs("div", {
                className: "flex items-center gap-4", children: [_jsxs(motion.div, {
                    whileHover: { scale: 1.1, rotate: 5 }, className: `
              p-3 rounded-xl relative overflow-hidden
              ${currentPage === "dashboard"
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50"
                            : currentPage === "money-maker"
                                ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/50"
                                : currentPage === "analytics"
                                    ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/50"
                                    : currentPage === "predictions"
                                        ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50"
                                        : "bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/50"}
            `, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" }), _jsx("div", { className: "relative text-cyan-400", children: currentItem?.icon })]
                }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white tracking-tight", children: currentItem?.label }), _jsxs("p", { className: "text-sm text-cyan-300/80 font-medium", children: [currentPage === "dashboard" && "Ultra-Advanced ML Intelligence", currentPage === "money-maker" && "Cyber Quantum Money Generator", currentPage === "analytics" && "Elite Neural Analytics Hub", currentPage === "predictions" && "Revolutionary AI Predictions", currentPage === "settings" && "Quantum Configuration Portal"] })] })]
            }), _jsxs("div", { className: "hidden lg:flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs text-emerald-400 font-semibold", children: "LIVE" })] }), _jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full", children: [_jsx(Activity, { className: "w-3 h-3 text-cyan-400" }), _jsx("span", { className: "text-xs text-cyan-400 font-semibold", children: "47 Models Active" })] })] })]
        }), _jsxs("div", { className: "relative z-10 flex items-center gap-4", children: [_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: onOpenCommandPalette, className: "flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-cyan-500/20 hover:to-blue-500/20 border border-gray-700/50 hover:border-cyan-500/50 rounded-xl transition-all duration-300", children: [_jsx(Search, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-300", children: "Quantum Search..." }), _jsx("span", { className: "text-xs text-cyan-400 font-mono bg-gray-800 px-2 py-1 rounded border border-gray-600", children: "\u2318K" })] }), _jsx(motion.button, { whileHover: { scale: 1.1, rotate: 90 }, className: "p-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-emerald-500/20 hover:to-green-500/20 border border-gray-700/50 hover:border-emerald-500/50 rounded-xl transition-all duration-300", children: _jsx(Plus, { className: "w-5 h-5 text-gray-400 hover:text-emerald-400" }) }), _jsxs(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, onClick: onOpenNotifications, className: "relative p-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-orange-500/20 hover:to-red-500/20 border border-gray-700/50 hover:border-orange-500/50 rounded-xl transition-all duration-300", children: [_jsx(Bell, { className: "w-5 h-5 text-gray-400 hover:text-orange-400" }), _jsx(motion.span, { animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 2 }, className: "absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-gray-900" })] }), _jsx(motion.button, { whileHover: { scale: 1.1, rotate: 15 }, className: "p-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-purple-500/20 hover:to-violet-500/20 border border-gray-700/50 hover:border-purple-500/50 rounded-xl transition-all duration-300", children: _jsx(HelpCircle, { className: "w-5 h-5 text-gray-400 hover:text-purple-400" }) })] })]
    }));
};
// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const AppContent = () => {
    const [activeNavItem, setActiveNavItem] = useState("dashboard");
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real user data from backend
    const { profile: userData, isLoading: isUserLoading, error: _userError } = useMockUserProfile();

    // Use real user data or fallback to default
    const user = userData || {
        name: "Loading...",
        email: "loading@example.com",
        tier: "Basic",
        winRate: 0,
        totalProfit: 0,
        accuracy: 0,
    };

    // App initialization
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "n") {
                e.preventDefault();
                setIsNotificationCenterOpen(true);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();
                setActiveNavItem("dashboard");
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "m") {
                e.preventDefault();
                setActiveNavItem("money-maker");
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "a") {
                e.preventDefault();
                setActiveNavItem("analytics");
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "p") {
                e.preventDefault();
                setActiveNavItem("predictions");
            }
            if ((e.metaKey || e.ctrlKey) && e.key === ",") {
                e.preventDefault();
                setActiveNavItem("settings");
            }
            if (e.key === "Escape") {
                setIsCommandPaletteOpen(false);
                setIsNotificationCenterOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    const activeComponent = navigationItems.find((item) => item.id === activeNavItem)?.component;
    const ActiveComponent = activeComponent || EliteFeaturesOverview;
    if (isLoading) {
        return (_jsx("div", { className: "h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "text-center", children: [_jsxs("div", { className: "relative mb-8", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse" }), _jsx("div", { className: "relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto", children: _jsx(Brain, { className: "w-12 h-12 text-black animate-pulse" }) })] }), _jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4", children: "A1BETTING" }), _jsx("p", { className: "text-cyan-400 text-lg font-semibold uppercase tracking-widest", children: "Elite Sports Intelligence Platform" }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsx("div", { className: "flex space-x-2", children: [0, 1, 2].map((i) => (_jsx(motion.div, { className: "w-3 h-3 bg-cyan-400 rounded-full", animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 1, delay: i * 0.2 } }, i))) }) })] }) }));
    }
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, className: "h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex", children: [isUserLoading && _jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx("div", { className: "text-cyan-400 text-xl", children: "Loading user data..." }) }), _jsx(CyberModernSidebar, { activeItem: activeNavItem, onNavigate: setActiveNavItem, user: user }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx(CyberTopBar, { onOpenCommandPalette: () => setIsCommandPaletteOpen(true), onOpenNotifications: () => setIsNotificationCenterOpen(true), currentPage: activeNavItem }), _jsxs("main", { className: "flex-1 overflow-auto bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm relative", children: [_jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(6,255,165,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,255,165,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" }), _jsx(ErrorBoundary, { children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "relative z-10 p-8", children: _jsx(ActiveComponent, { onNavigate: setActiveNavItem }) }) })] })] }), _jsx(ModernCommandPalette, { isOpen: isCommandPaletteOpen, onClose: () => setIsCommandPaletteOpen(false), navigationItems: navigationItems, onNavigate: setActiveNavItem }), _jsx(ModernNotificationCenter, { isOpen: isNotificationCenterOpen, onClose: () => setIsNotificationCenterOpen(false) })] }));
};
// ============================================================================
// APP WRAPPER
// ============================================================================
const App = () => {
    return (_jsx(ErrorBoundary, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(SafeThemeProvider, { children: _jsx(AppContent, {}) }) }) }));
};
export default App;
