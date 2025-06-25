import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Target, Zap, } from "lucide-react";
export const UltimateMoneyMaker = ({ className = "", }) => {
    const [opportunities, setOpportunities] = useState([
        {
            id: "1",
            description: "NFL Over/Under Arbitrage",
            expectedProfit: 1250.75,
            confidence: 94.2,
            riskLevel: "low",
            timeframe: "2h 34m",
        },
        {
            id: "2",
            description: "NBA Spread Value Bet",
            expectedProfit: 850.25,
            confidence: 87.8,
            riskLevel: "medium",
            timeframe: "4h 12m",
        },
        {
            id: "3",
            description: "MLB ML Edge Play",
            expectedProfit: 650.5,
            confidence: 82.3,
            riskLevel: "low",
            timeframe: "6h 45m",
        },
    ]);
    const [isScanning, setIsScanning] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState(24750.85);
    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            // Simulate finding new opportunities
        }, 3000);
    };
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent", children: "Ultimate Money Maker" }), _jsx("p", { className: "text-gray-400 mt-1", children: "AI-powered profit generation system" })] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: handleScan, disabled: isScanning, className: "px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 transition-all", children: isScanning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block" }), "Scanning..."] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-5 h-5 mr-2 inline" }), "Scan Markets"] })) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold text-green-400", children: ["$", totalEarnings.toLocaleString()] }), _jsx("p", { className: "text-sm text-green-300", children: "Total Earnings" })] }), _jsx(DollarSign, { className: "w-8 h-8 text-green-400" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "p-6 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-blue-400", children: opportunities.length }), _jsx("p", { className: "text-sm text-blue-300", children: "Active Opportunities" })] }), _jsx(Target, { className: "w-8 h-8 text-blue-400" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "p-6 bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-purple-400", children: "91.2%" }), _jsx("p", { className: "text-sm text-purple-300", children: "Success Rate" })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-purple-400" })] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Current Opportunities" }), opportunities.map((opportunity, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl hover:border-green-500/50 transition-all cursor-pointer group", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-white group-hover:text-green-400 transition-colors", children: opportunity.description }), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("span", { className: "text-green-400 font-bold", children: ["+$", opportunity.expectedProfit.toLocaleString()] }), _jsxs("span", { className: "text-cyan-400", children: [opportunity.confidence, "% confidence"] }), _jsxs("span", { className: `px-2 py-1 rounded-full text-xs font-bold ${opportunity.riskLevel === "low"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : opportunity.riskLevel === "medium"
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : "bg-red-500/20 text-red-400"}`, children: [opportunity.riskLevel.toUpperCase(), " RISK"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Expires in" }), _jsx("p", { className: "text-white font-bold", children: opportunity.timeframe })] })] }) }, opportunity.id)))] })] }));
};
export default UltimateMoneyMaker;
