import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Brain, Target, Zap, Activity, Shield, BarChart3, Calculator, } from "lucide-react";
export const CleanMoneyMaker = () => {
    const [opportunities, setOpportunities] = useState([
        {
            id: "1",
            sport: "NBA",
            game: "Lakers vs Warriors",
            prediction: "Over 235.5 Points",
            confidence: 94,
            odds: 1.85,
            expectedValue: 12.3,
            edge: 8.5,
            recommendedStake: 250,
            maxStake: 500,
            riskLevel: "low",
            timeLeft: "2h 15m",
            bookmaker: "DraftKings",
            model: "NBA Advanced Model v3.2",
            lastUpdated: new Date(),
        },
        {
            id: "2",
            sport: "NBA",
            game: "Celtics vs Heat",
            prediction: "Celtics -5.5",
            confidence: 87,
            odds: 1.92,
            expectedValue: 8.7,
            edge: 6.2,
            recommendedStake: 180,
            maxStake: 400,
            riskLevel: "medium",
            timeLeft: "4h 32m",
            bookmaker: "FanDuel",
            model: "Ensemble Model v2.1",
            lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
            id: "3",
            sport: "NFL",
            game: "Chiefs vs Bills",
            prediction: "Josh Allen Over 2.5 TD",
            confidence: 89,
            odds: 2.15,
            expectedValue: 15.8,
            edge: 12.4,
            recommendedStake: 320,
            maxStake: 600,
            riskLevel: "low",
            timeLeft: "6h 45m",
            bookmaker: "BetMGM",
            model: "Player Props AI v1.8",
            lastUpdated: new Date(Date.now() - 10 * 60 * 1000),
        },
    ]);
    const [portfolio, setPortfolio] = useState({
        totalValue: 12847.63,
        totalStaked: 8500.0,
        expectedReturn: 15234.88,
        roi: 51.2,
        winRate: 73.8,
        activePositions: 8,
        diversificationScore: 8.7,
        riskScore: 4.2,
    });
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState(new Date());
    // Simulate opportunity scanning
    useEffect(() => {
        const interval = setInterval(() => {
            setOpportunities((prev) => prev.map((opp) => ({
                ...opp,
                confidence: Math.max(75, Math.min(95, opp.confidence + (Math.random() - 0.5) * 2)),
                expectedValue: Math.max(3, Math.min(25, opp.expectedValue + (Math.random() - 0.5) * 1)),
                edge: Math.max(1, Math.min(15, opp.edge + (Math.random() - 0.5) * 0.5)),
                lastUpdated: new Date(),
            })));
            setLastScan(new Date());
        }, 15000);
        return () => clearInterval(interval);
    }, []);
    const runScan = async () => {
        setIsScanning(true);
        // Simulate AI scanning process
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsScanning(false);
        setLastScan(new Date());
    };
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case "low":
                return "text-green-400 bg-green-500/10 border-green-500/20";
            case "medium":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "high":
                return "text-red-400 bg-red-500/10 border-red-500/20";
            default:
                return "text-gray-400 bg-gray-500/10 border-gray-500/20";
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "relative p-8 rounded-2xl bg-gradient-to-br from-green-900/30 via-blue-900/20 to-purple-900/30 border border-gray-700/50 backdrop-blur-xl overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 opacity-10", children: [_jsx("div", { className: "absolute top-1/4 left-1/4 w-32 h-32 bg-green-500 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl" })] }), _jsxs("div", { className: "relative flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl font-bold text-white mb-2 flex items-center space-x-3", children: [_jsx(DollarSign, { size: 40, className: "text-green-400" }), _jsx("span", { children: "AI Money Maker" })] }), _jsx("p", { className: "text-xl text-gray-300", children: "AI-powered opportunity detection with advanced portfolio optimization" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-bold text-green-400", children: ["+$", portfolio.expectedReturn.toLocaleString()] }), _jsx("div", { className: "text-gray-400", children: "Expected Return" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-green-500/20", children: _jsx(DollarSign, { size: 24, className: "text-green-400" }) }), _jsx("div", { className: "text-sm text-green-400 font-bold", children: "+51.2%" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: ["$", portfolio.totalValue.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Portfolio Value" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-blue-500/20", children: _jsx(Target, { size: 24, className: "text-blue-400" }) }), _jsx("div", { className: "text-sm text-blue-400 font-bold", children: "+3.2%" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: [portfolio.winRate, "%"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Win Rate" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-purple-500/20", children: _jsx(Activity, { size: 24, className: "text-purple-400" }) }), _jsx("div", { className: "text-sm text-purple-400 font-bold", children: "Live" })] }), _jsx("div", { className: "text-2xl font-bold text-white mb-1", children: portfolio.activePositions }), _jsx("div", { className: "text-sm text-gray-400", children: "Active Positions" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-yellow-500/20", children: _jsx(Shield, { size: 24, className: "text-yellow-400" }) }), _jsx("div", { className: "text-sm text-yellow-400 font-bold", children: "Low" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: [portfolio.riskScore, "/10"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Risk Score" })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [_jsxs("div", { className: "xl:col-span-2 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20", children: _jsx(Brain, { size: 20, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "AI Opportunities" }), _jsx("p", { className: "text-sm text-gray-400", children: "47 models analyzing live data" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "text-sm text-gray-400", children: ["Last scan: ", lastScan.toLocaleTimeString()] }), _jsx("button", { onClick: runScan, disabled: isScanning, className: "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-all flex items-center space-x-2", children: isScanning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Scanning..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { size: 16 }), _jsx("span", { children: "Run Scan" })] })) })] })] }), _jsx("div", { className: "space-y-4", children: opportunities.map((opportunity, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl hover:border-gray-600/50 transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("span", { className: "px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-bold", children: opportunity.sport }), _jsxs("span", { className: `px-2 py-1 rounded text-sm font-bold ${getRiskColor(opportunity.riskLevel)}`, children: [opportunity.riskLevel, " risk"] })] }), _jsx("h3", { className: "text-lg font-bold text-white", children: opportunity.game }), _jsx("p", { className: "text-blue-400 font-medium", children: opportunity.prediction })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-green-400", children: ["+", opportunity.expectedValue.toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Expected Value" })] })] }), _jsxs("div", { className: "grid grid-cols-5 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Confidence" }), _jsxs("div", { className: "text-lg font-bold text-white", children: [opportunity.confidence, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Odds" }), _jsx("div", { className: "text-lg font-bold text-white", children: opportunity.odds })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Edge" }), _jsxs("div", { className: "text-lg font-bold text-green-400", children: [opportunity.edge, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Stake" }), _jsxs("div", { className: "text-lg font-bold text-white", children: ["$", opportunity.recommendedStake] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Time" }), _jsx("div", { className: "text-lg font-bold text-white", children: opportunity.timeLeft })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-400", children: [opportunity.model, " \u2022 ", opportunity.bookmaker] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all", children: "Place Bet" }), _jsx("button", { className: "px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all", children: "Analyze" })] })] })] }, opportunity.id))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-blue-500/20", children: _jsx(Calculator, { size: 18, className: "text-blue-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Kelly Calculator" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Win Probability (%)" }), _jsx("input", { type: "number", className: "w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white", placeholder: "85" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Decimal Odds" }), _jsx("input", { type: "number", step: "0.01", className: "w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white", placeholder: "1.85" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Bankroll ($)" }), _jsx("input", { type: "number", className: "w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white", placeholder: "10000" })] }), _jsx("button", { className: "w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all", children: "Calculate Optimal Stake" })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-red-500/20", children: _jsx(Shield, { size: 18, className: "text-red-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Risk Management" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Daily Limit" }), _jsx("span", { className: "text-sm text-white", children: "$2,500 / $5,000" })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full", style: { width: "50%" } }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Weekly Limit" }), _jsx("span", { className: "text-sm text-white", children: "$8,200 / $15,000" })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full", style: { width: "55%" } }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Max Position" }), _jsx("span", { className: "text-sm text-white", children: "5% of bankroll" })] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-green-500/20", children: _jsx(BarChart3, { size: 18, className: "text-green-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "This Week" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Profit" }), _jsx("span", { className: "text-sm text-green-400 font-bold", children: "+$2,847" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Bets Placed" }), _jsx("span", { className: "text-sm text-white", children: "23" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Win Rate" }), _jsx("span", { className: "text-sm text-white", children: "78.3%" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Best Bet" }), _jsx("span", { className: "text-sm text-green-400", children: "+$485" })] })] })] })] })] })] }));
};
export default CleanMoneyMaker;
