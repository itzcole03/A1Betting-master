import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Target, Activity, ChevronRight, Flame, Zap, Eye, } from "lucide-react";
const mockOpportunities = [
    {
        id: "1",
        game: "Lakers vs Warriors",
        teams: { home: "Lakers", away: "Warriors" },
        prediction: "Over 235.5 Points",
        predictionType: "total",
        confidence: 94,
        odds: 1.85,
        expectedValue: 12.3,
        valueRating: "hot",
        timeUntilGame: "2h 15m",
        currentLine: 235.5,
        recommendedLine: 238.0,
        edgePercentage: 12.3,
        bookmaker: "DraftKings",
        lastUpdated: new Date(),
        volume: 85000,
        marketMovement: "up",
    },
    {
        id: "2",
        game: "Celtics vs Heat",
        teams: { home: "Celtics", away: "Heat" },
        prediction: "Celtics -5.5",
        predictionType: "spread",
        confidence: 87,
        odds: 1.92,
        expectedValue: 8.7,
        valueRating: "warm",
        timeUntilGame: "4h 32m",
        currentLine: -5.5,
        recommendedLine: -4.0,
        edgePercentage: 8.7,
        bookmaker: "FanDuel",
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        volume: 62000,
        marketMovement: "stable",
    },
    {
        id: "3",
        game: "Nuggets vs Suns",
        teams: { home: "Nuggets", away: "Suns" },
        prediction: "Under 228.5 Points",
        predictionType: "total",
        confidence: 81,
        odds: 1.78,
        expectedValue: 6.2,
        valueRating: "cool",
        timeUntilGame: "6h 45m",
        currentLine: 228.5,
        recommendedLine: 225.0,
        edgePercentage: 6.2,
        bookmaker: "BetMGM",
        lastUpdated: new Date(Date.now() - 10 * 60 * 1000),
        volume: 43000,
        marketMovement: "down",
    },
    {
        id: "4",
        game: "Bucks vs Nets",
        teams: { home: "Bucks", away: "Nets" },
        prediction: "Giannis Over 28.5 Points",
        predictionType: "player_prop",
        confidence: 92,
        odds: 1.95,
        expectedValue: 15.8,
        valueRating: "hot",
        timeUntilGame: "1h 45m",
        currentLine: 28.5,
        recommendedLine: 26.0,
        edgePercentage: 15.8,
        bookmaker: "Caesars",
        lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
        volume: 71000,
        marketMovement: "up",
    },
];
const getValueRatingConfig = (rating) => {
    switch (rating) {
        case "hot":
            return {
                icon: _jsx(Flame, { size: 16, className: "text-red-400" }),
                gradient: "from-red-500/20 to-orange-500/20",
                border: "border-red-500/30",
                badge: "bg-red-500/20 text-red-400",
                emoji: "🔥",
            };
        case "warm":
            return {
                icon: _jsx(Zap, { size: 16, className: "text-yellow-400" }),
                gradient: "from-yellow-500/20 to-orange-500/20",
                border: "border-yellow-500/30",
                badge: "bg-yellow-500/20 text-yellow-400",
                emoji: "⚡",
            };
        case "cool":
            return {
                icon: _jsx(Target, { size: 16, className: "text-blue-400" }),
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30",
                badge: "bg-blue-500/20 text-blue-400",
                emoji: "🎯",
            };
        default:
            return {
                icon: _jsx(Activity, { size: 16, className: "text-gray-400" }),
                gradient: "from-gray-500/20 to-gray-600/20",
                border: "border-gray-500/30",
                badge: "bg-gray-500/20 text-gray-400",
                emoji: "📊",
            };
    }
};
const getMovementIcon = (movement) => {
    switch (movement) {
        case "up":
            return _jsx(TrendingUp, { size: 12, className: "text-green-400" });
        case "down":
            return _jsx(TrendingDown, { size: 12, className: "text-red-400" });
        default:
            return _jsx(Activity, { size: 12, className: "text-gray-400" });
    }
};
export const LiveOpportunities = ({ className = "", maxItems = 4, showHeader = true, }) => {
    const [opportunities, setOpportunities] = useState(mockOpportunities);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setOpportunities((prev) => prev.map((opp) => ({
                ...opp,
                lastUpdated: new Date(),
                confidence: Math.max(75, Math.min(95, opp.confidence + (Math.random() - 0.5) * 2)),
                expectedValue: Math.max(3, Math.min(20, opp.expectedValue + (Math.random() - 0.5) * 1)),
            })));
        }, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);
    const displayOpportunities = opportunities.slice(0, maxItems);
    return (_jsxs("div", { className: className, children: [showHeader && (_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20", children: _jsx(TrendingUp, { size: 20, className: "text-green-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Live Opportunities" }), _jsx("p", { className: "text-sm text-gray-400", children: "AI-powered betting opportunities updated in real-time" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm text-green-400 font-medium", children: "Live" })] })] })), _jsx("div", { className: "space-y-4", children: displayOpportunities.map((opportunity, index) => {
                    const config = getValueRatingConfig(opportunity.valueRating);
                    const isSelected = selectedOpportunity === opportunity.id;
                    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, whileHover: { scale: 1.02 }, className: `
                relative p-6 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all
                bg-gradient-to-r ${config.gradient} ${config.border}
                ${isSelected ? "ring-2 ring-blue-500/50" : ""}
                hover:shadow-xl hover:border-opacity-60
              `, onClick: () => setSelectedOpportunity(isSelected ? null : opportunity.id), children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: `px-3 py-1 rounded-full text-sm font-bold ${config.badge}`, children: [config.emoji, " ", opportunity.valueRating.toUpperCase()] }), _jsxs("div", { className: "flex items-center space-x-2 text-gray-400", children: [_jsx(Clock, { size: 14 }), _jsx("span", { className: "text-sm", children: opportunity.timeUntilGame })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-green-400", children: ["+", opportunity.expectedValue.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Expected Value" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-1", children: opportunity.game }), _jsx("p", { className: "text-blue-400 font-medium", children: opportunity.prediction })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Confidence" }), _jsxs("div", { className: "text-lg font-bold text-white", children: [opportunity.confidence, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Odds" }), _jsx("div", { className: "text-lg font-bold text-white", children: opportunity.odds })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Edge" }), _jsxs("div", { className: "text-lg font-bold text-green-400", children: [opportunity.edgePercentage, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Book" }), _jsx("div", { className: "text-sm font-medium text-white", children: opportunity.bookmaker })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-1 text-gray-400", children: [_jsx(Eye, { size: 12 }), _jsxs("span", { children: ["$", opportunity.volume?.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [getMovementIcon(opportunity.marketMovement), _jsx("span", { className: "text-gray-400", children: "Market" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-gray-400", children: "View Details" }), _jsx(ChevronRight, { size: 14, className: "text-gray-400" })] })] }), _jsx(AnimatePresence, { children: isSelected && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "mt-4 pt-4 border-t border-gray-700/50", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Current Line:" }), _jsx("span", { className: "ml-2 text-white font-medium", children: opportunity.currentLine })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Recommended:" }), _jsx("span", { className: "ml-2 text-green-400 font-medium", children: opportunity.recommendedLine })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Last Updated:" }), _jsx("span", { className: "ml-2 text-white", children: opportunity.lastUpdated.toLocaleTimeString() })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Type:" }), _jsx("span", { className: "ml-2 text-blue-400 capitalize", children: opportunity.predictionType.replace("_", " ") })] })] }), _jsxs("div", { className: "mt-4 flex space-x-3", children: [_jsx("button", { className: "flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all", children: "Place Bet" }), _jsx("button", { className: "px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all", children: "Track" })] })] })) })] }, opportunity.id));
                }) }), opportunities.length > maxItems && (_jsx("div", { className: "mt-6 text-center", children: _jsxs("button", { className: "px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 font-medium rounded-lg transition-all", children: ["View All ", opportunities.length, " Opportunities"] }) }))] }));
};
export default LiveOpportunities;
