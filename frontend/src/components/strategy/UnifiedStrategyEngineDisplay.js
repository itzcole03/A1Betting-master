import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Target, Brain, AlertTriangle, } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// ============================================================================
// DEMO DATA
// ============================================================================
const DEMO_RECOMMENDATIONS = [
    {
        strategyId: "momentum-nba",
        strategyName: "NBA Momentum Strategy",
        confidence: 0.84,
        expectedReturn: 12.5,
        riskLevel: "medium",
        recommendation: "Strong Buy Signal - Lakers vs Warriors Over",
        reasoning: [
            "Both teams averaging 115+ points in last 5 games",
            "Historical pace indicates high-scoring matchup",
            "Weather conditions favor offensive play",
            "Key players healthy and in form",
        ],
        data: {
            winProbability: 0.67,
            expectedValue: 0.125,
            kellyFraction: 0.08,
            sharpeRatio: 1.4,
            maxDrawdown: 0.15,
        },
        timeframe: "24h",
        sport: "NBA",
        lastUpdated: Date.now() - 300000,
    },
    {
        strategyId: "value-nfl",
        strategyName: "NFL Value Betting",
        confidence: 0.92,
        expectedReturn: 18.7,
        riskLevel: "low",
        recommendation: "Patriots ML - Significant Value Detected",
        reasoning: [
            "Market overreacting to recent loss",
            "Key players returning from injury",
            "Strong defensive metrics vs opponent weakness",
            "Public betting creating line value",
        ],
        data: {
            winProbability: 0.78,
            expectedValue: 0.187,
            kellyFraction: 0.12,
            sharpeRatio: 2.1,
            maxDrawdown: 0.08,
        },
        timeframe: "3 days",
        sport: "NFL",
        lastUpdated: Date.now() - 600000,
    },
    {
        strategyId: "arbitrage-mlb",
        strategyName: "MLB Arbitrage Opportunity",
        confidence: 0.99,
        expectedReturn: 4.2,
        riskLevel: "low",
        recommendation: "Risk-Free Arbitrage - Yankees/Red Sox",
        reasoning: [
            "Price discrepancy across sportsbooks",
            "Guaranteed profit opportunity",
            "Low capital requirement",
            "Quick execution window",
        ],
        data: {
            winProbability: 1.0,
            expectedValue: 0.042,
            kellyFraction: 1.0,
            sharpeRatio: Infinity,
            maxDrawdown: 0.0,
        },
        timeframe: "2h",
        sport: "MLB",
        lastUpdated: Date.now() - 120000,
    },
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case "low":
            return "text-green-600 bg-green-100 border-green-200";
        case "medium":
            return "text-yellow-600 bg-yellow-100 border-yellow-200";
        case "high":
            return "text-red-600 bg-red-100 border-red-200";
        default:
            return "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
};
const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8)
        return "text-green-600";
    if (confidence >= 0.6)
        return "text-yellow-600";
    return "text-red-600";
};
const getSportIcon = (sport) => {
    const icons = {
        NBA: "🏀",
        NFL: "🏈",
        MLB: "⚾",
        NHL: "🏒",
        Soccer: "⚽",
    };
    return icons[sport] || "🏆";
};
const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};
// ============================================================================
// COMPONENTS
// ============================================================================
const StrategyCard = ({ recommendation, index, showDebug }) => {
    const { strategyName, confidence, expectedReturn, riskLevel, recommendation: rec, reasoning, data, timeframe, sport, lastUpdated, } = recommendation;
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1, duration: 0.5 }, children: _jsxs(Card, { className: "glass-card hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: getSportIcon(sport) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg font-bold text-gray-800 dark:text-white", children: strategyName }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [sport, " \u2022 ", timeframe] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-2xl font-bold ${getConfidenceColor(confidence)}`, children: [(confidence * 100).toFixed(0), "%"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Confidence" })] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/30", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Zap, { className: "w-5 h-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-blue-800 dark:text-blue-200 mb-1", children: "Recommendation" }), _jsx("div", { className: "text-sm text-gray-700 dark:text-gray-300", children: rec })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-center gap-1 mb-1", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Expected Return" })] }), _jsxs("div", { className: "text-lg font-bold text-green-600", children: ["+", expectedReturn.toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-center gap-1 mb-1", children: [_jsx(Target, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Win Probability" })] }), _jsxs("div", { className: "text-lg font-bold text-blue-600", children: [(data.winProbability * 100).toFixed(0), "%"] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-gray-500 dark:text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Risk Level:" })] }), _jsx(Badge, { variant: riskLevel, className: getRiskColor(riskLevel), children: riskLevel.toUpperCase() })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300", children: [_jsx(Brain, { className: "w-4 h-4" }), "AI Reasoning:"] }), _jsx("ul", { className: "space-y-1", children: reasoning.slice(0, 3).map((reason, idx) => (_jsxs("li", { className: "text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500 mt-1", children: "\u2022" }), _jsx("span", { children: reason })] }, idx))) })] }), showDebug && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, className: "border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2", children: [_jsx("div", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Advanced Metrics:" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { children: ["Kelly Fraction:", " ", _jsxs("span", { className: "font-mono", children: [(data.kellyFraction * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: ["Sharpe Ratio:", " ", _jsx("span", { className: "font-mono", children: data.sharpeRatio.toFixed(2) })] }), _jsxs("div", { children: ["Expected Value:", " ", _jsxs("span", { className: "font-mono", children: [(data.expectedValue * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: ["Max Drawdown:", " ", _jsxs("span", { className: "font-mono", children: [(data.maxDrawdown * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "text-xs text-gray-400 mt-2", children: ["Last Updated: ", formatTimeAgo(lastUpdated)] })] }))] })] }) }));
};
const EmptyState = () => (_jsx("div", { className: "text-center py-12", children: _jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.5 }, children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83E\uDDE0" }), _jsx("h3", { className: "text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "Strategy Engine Analyzing" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 max-w-md mx-auto", children: "Our AI is currently processing market data and generating personalized betting strategies. Check back in a few moments for the latest recommendations." }), _jsx("div", { className: "mt-6", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm text-blue-700 dark:text-blue-300", children: "Processing live data..." })] }) })] }) }));
// ============================================================================
// MAIN COMPONENT
// ============================================================================
const UnifiedStrategyEngineDisplay = ({ recommendations = [], showDebug = false, }) => {
    // Use demo data if no recommendations provided
    const displayRecommendations = recommendations.length > 0 ? recommendations : DEMO_RECOMMENDATIONS;
    if (displayRecommendations.length === 0) {
        return _jsx(EmptyState, {});
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\uD83E\uDDE0 Strategy Engine Intelligence" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto", children: "AI-powered betting strategies with real-time market analysis, risk assessment, and personalized recommendations." }), _jsxs("div", { className: "flex items-center justify-center gap-4 mt-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-green-600", children: "Live Analysis" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), _jsxs("span", { className: "text-blue-600", children: [displayRecommendations.length, " Active Strategies"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }), _jsx("span", { className: "text-purple-600", children: "Real-time Updates" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: displayRecommendations.map((recommendation, index) => (_jsx(StrategyCard, { recommendation: recommendation, index: index, showDebug: showDebug }, recommendation.strategyId))) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3, duration: 0.5 }, className: "mt-8", children: _jsx(Card, { className: "glass-card bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 border-0", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800 dark:text-white", children: "Strategy Performance Overview" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [Math.round(displayRecommendations.reduce((acc, r) => acc + r.expectedReturn, 0) / displayRecommendations.length), "%"] }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Avg Expected Return" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [Math.round((displayRecommendations.reduce((acc, r) => acc + r.confidence, 0) /
                                                        displayRecommendations.length) *
                                                        100), "%"] }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Avg Confidence" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: displayRecommendations.filter((r) => r.riskLevel === "low")
                                                    .length }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Low Risk Strategies" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: displayRecommendations.length }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Active Strategies" })] })] })] }) }) })] }));
};
export default UnifiedStrategyEngineDisplay;
