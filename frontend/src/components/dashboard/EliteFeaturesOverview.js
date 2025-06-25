import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, DollarSign, BarChart3, Target, Activity, Zap, TrendingUp, Shield, Database, Globe, Cpu, Eye, Settings, Award, Play, RefreshCw, } from "lucide-react";
// Elite Features Data from the error screen
const eliteFeatures = [
    {
        category: "Core Analytics",
        features: [
            {
                name: "Business Dashboard",
                icon: _jsx(BarChart3, { className: "w-5 h-5" }),
                status: "active",
                description: "Real-time business intelligence",
            },
            {
                name: "AI Business Analysis",
                icon: _jsx(Brain, { className: "w-5 h-5" }),
                status: "active",
                description: "Advanced AI-powered analysis",
            },
            {
                name: "Elite Analytics",
                icon: _jsx(TrendingUp, { className: "w-5 h-5" }),
                status: "premium",
                description: "Premium analytics suite",
            },
            {
                name: "Model Analysis",
                icon: _jsx(Activity, { className: "w-5 h-5" }),
                status: "ai",
                description: "Deep model performance analysis",
            },
        ],
    },
    {
        category: "Money Making",
        features: [
            {
                name: "Money Maker",
                icon: _jsx(DollarSign, { className: "w-5 h-5" }),
                status: "active",
                description: "AI-powered money generation",
            },
            {
                name: "AI Arbitrage",
                icon: _jsx(Target, { className: "w-5 h-5" }),
                status: "pro",
                description: "Arbitrage opportunity detection",
            },
            {
                name: "Elite Bankroll",
                icon: _jsx(Shield, { className: "w-5 h-5" }),
                status: "premium",
                description: "Advanced bankroll management",
            },
            {
                name: "AI Edge ML",
                icon: _jsx(Cpu, { className: "w-5 h-5" }),
                status: "ai",
                description: "Machine learning edge detection",
            },
        ],
    },
    {
        category: "Sports Intelligence",
        features: [
            {
                name: "Mega Sports",
                icon: _jsx(Zap, { className: "w-5 h-5" }),
                status: "mega",
                description: "Comprehensive sports analytics",
            },
            {
                name: "SQL Sports",
                icon: _jsx(Database, { className: "w-5 h-5" }),
                status: "active",
                description: "Advanced sports data queries",
            },
            {
                name: "Elite Sports",
                icon: _jsx(Award, { className: "w-5 h-5" }),
                status: "elite",
                description: "Premium sports intelligence",
            },
            {
                name: "Sports Advantage",
                icon: _jsx(TrendingUp, { className: "w-5 h-5" }),
                status: "pro",
                description: "Competitive sports advantage",
            },
        ],
    },
    {
        category: "Market & Trading",
        features: [
            {
                name: "Market Connector",
                icon: _jsx(Globe, { className: "w-5 h-5" }),
                status: "live",
                description: "Real-time market connections",
            },
            {
                name: "Trading Engine",
                icon: _jsx(Activity, { className: "w-5 h-5" }),
                status: "active",
                description: "Automated trading algorithms",
            },
            {
                name: "Risk Analysis",
                icon: _jsx(Shield, { className: "w-5 h-5" }),
                status: "premium",
                description: "Advanced risk assessment",
            },
            {
                name: "Portfolio Manager",
                icon: _jsx(BarChart3, { className: "w-5 h-5" }),
                status: "pro",
                description: "Smart portfolio optimization",
            },
        ],
    },
    {
        category: "Simulation & Testing",
        features: [
            {
                name: "Real Simulator",
                icon: _jsx(Play, { className: "w-5 h-5" }),
                status: "beta",
                description: "Real-time strategy simulation",
            },
            {
                name: "Strategy Tester",
                icon: _jsx(Target, { className: "w-5 h-5" }),
                status: "active",
                description: "Backtesting and validation",
            },
            {
                name: "ML Validator",
                icon: _jsx(Brain, { className: "w-5 h-5" }),
                status: "ai",
                description: "Machine learning validation",
            },
            {
                name: "Performance Monitor",
                icon: _jsx(Eye, { className: "w-5 h-5" }),
                status: "live",
                description: "Real-time performance tracking",
            },
        ],
    },
];
const statusConfig = {
    active: {
        color: "bg-green-500",
        textColor: "text-green-400",
        label: "ACTIVE",
    },
    pro: { color: "bg-purple-500", textColor: "text-purple-400", label: "PRO" },
    premium: {
        color: "bg-yellow-500",
        textColor: "text-yellow-400",
        label: "PREMIUM",
    },
    ai: { color: "bg-cyan-500", textColor: "text-cyan-400", label: "AI" },
    live: { color: "bg-red-500", textColor: "text-red-400", label: "LIVE" },
    beta: { color: "bg-orange-500", textColor: "text-orange-400", label: "BETA" },
    mega: { color: "bg-pink-500", textColor: "text-pink-400", label: "MEGA" },
    elite: {
        color: "bg-indigo-500",
        textColor: "text-indigo-400",
        label: "ELITE",
    },
};
// Navigation mapping for features to app sections
const featureNavigation = {
    "Business Dashboard": "analytics",
    "AI Business Analysis": "analytics",
    "Elite Analytics": "analytics",
    "Model Analysis": "ml-center",
    "Money Maker": "money-maker",
    "AI Arbitrage": "arbitrage",
    "Elite Bankroll": "money-maker",
    "AI Edge ML": "ml-center",
    "Mega Sports": "analytics",
    "SQL Sports": "analytics",
    "Elite Sports": "analytics",
    "Sports Advantage": "analytics",
    "Market Connector": "analytics",
    "Trading Engine": "arbitrage",
    "Risk Analysis": "analytics",
    "Portfolio Manager": "money-maker",
    "Real Simulator": "ai-predictions",
    "Strategy Tester": "ai-predictions",
    "ML Validator": "ml-center",
    "Performance Monitor": "analytics",
};
const EliteFeaturesOverview = ({ onNavigate, }) => {
    const [activeCategory, setActiveCategory] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate refresh
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsRefreshing(false);
    };
    const handleFeatureLaunch = (featureName) => {
        const navigationTarget = featureNavigation[featureName];
        if (navigationTarget && onNavigate) {
            onNavigate(navigationTarget);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent", children: "Elite Sports Intelligence Platform" }), _jsx("p", { className: "text-gray-400 mt-2", children: "Comprehensive suite of AI-powered sports betting and analytics tools" })] }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: handleRefresh, className: "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all", children: [_jsx(RefreshCw, { className: `w-5 h-5 ${isRefreshing ? "animate-spin" : ""}` }), isRefreshing ? "Refreshing..." : "Refresh All"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-green-400", children: "47" }), _jsx("p", { className: "text-sm text-green-300", children: "AI Models Active" })] }), _jsx(Brain, { className: "w-8 h-8 text-green-400" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-cyan-400", children: "12" }), _jsx("p", { className: "text-sm text-cyan-300", children: "Data Sources" })] }), _jsx(Database, { className: "w-8 h-8 text-cyan-400" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "p-6 bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-purple-400", children: "94.7%" }), _jsx("p", { className: "text-sm text-purple-300", children: "Accuracy Rate" })] }), _jsx(Target, { className: "w-8 h-8 text-purple-400" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "p-6 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-yellow-400", children: "$127K" }), _jsx("p", { className: "text-sm text-yellow-300", children: "Monthly Profit" })] }), _jsx(DollarSign, { className: "w-8 h-8 text-yellow-400" })] }) })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: eliteFeatures.map((category, index) => (_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveCategory(index), className: `px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeCategory === index
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black"
                        : "bg-gray-800/50 text-gray-400 hover:text-gray-300 border border-gray-700/50"}`, children: category.category }, category.category))) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: eliteFeatures[activeCategory].features.map((feature, index) => {
                    const config = statusConfig[feature.status];
                    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1 }, whileHover: { scale: 1.05, y: -5 }, onClick: () => handleFeatureLaunch(feature.name), className: "p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-xl cursor-pointer group transform hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 ${config.textColor} transition-all`, children: feature.icon }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${config.color} ${feature.status === "live" ? "animate-pulse" : ""}` }), _jsx("span", { className: `text-xs font-bold ${config.textColor}`, children: config.label })] })] }), _jsx("h3", { className: "text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors", children: feature.name }), _jsx("p", { className: "text-sm text-gray-400 group-hover:text-gray-300 transition-colors", children: feature.description }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(motion.button, { whileHover: { scale: 1.1 }, onClick: () => handleFeatureLaunch(feature.name), className: "flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all", children: "Launch" }), _jsx(motion.button, { whileHover: { scale: 1.1 }, className: "p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 transition-all", children: _jsx(Settings, { className: "w-4 h-4" }) })] })] }, feature.name));
                }) }, activeCategory), _jsxs("div", { className: "mt-8 p-6 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "System Status" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-3 h-3 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-green-400 font-semibold", children: "All Systems Operational" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-3 h-3 bg-cyan-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-cyan-400 font-semibold", children: "Real-time Data Streaming" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-3 h-3 bg-purple-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-purple-400 font-semibold", children: "AI Models Learning" })] })] })] })] }));
};
export default EliteFeaturesOverview;
