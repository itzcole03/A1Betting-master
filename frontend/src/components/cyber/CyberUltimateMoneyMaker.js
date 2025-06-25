import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, } from "lucide-react";
// Import existing Money Maker component
import UltimateMoneyMaker from "../MoneyMaker/UltimateMoneyMaker";
// Cyber UI Components
import GlassCard from "../ui/GlassCard";
import CyberButton from "../ui/CyberButton";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";
// Existing services and types
import { useBetting, useUser } from "../../store/unified/UnifiedStoreManager";
const CyberUltimateMoneyMaker = () => {
    // State management
    const [state, setState] = useState({
        isScanning: false,
        autoMode: false,
        scanInterval: 30000, // 30 seconds
        opportunities: [],
        totalProfit: 0,
        successRate: 0,
        activeModels: 47,
        lastScanTime: null,
    });
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [isPlacingBet, setIsPlacingBet] = useState(false);
    // Existing store integration
    const { bankroll, addBet, addOpportunity } = useBetting();
    const { preferences } = useUser();
    // Generate mock opportunities with cyber enhancement
    const generateOpportunities = useCallback(async () => {
        // Simulate AI scanning process
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const mockOpportunities = [
            {
                id: "cyber-opp-1",
                description: "Lakers vs Warriors - Lakers Moneyline",
                sport: "NBA",
                event: "Lakers vs Warriors",
                market: "Moneyline",
                odds: 2.1,
                confidence: 0.847,
                expectedValue: 0.124,
                kellySize: 0.058,
                models: ["XGBoost-V3", "Neural-Net-Pro", "Quantum-Predictor"],
                recommendation: "STRONG_BUY",
                riskLevel: "medium",
                profit: 247.5,
                timeRemaining: "2h 15m",
            },
            {
                id: "cyber-opp-2",
                description: "Chiefs vs Bills - Over 47.5 Total Points",
                sport: "NFL",
                event: "Chiefs vs Bills",
                market: "Total Points",
                odds: 1.91,
                confidence: 0.923,
                expectedValue: 0.156,
                kellySize: 0.072,
                models: ["Ensemble-Alpha", "Deep-Learning-V2", "Statistical-Master"],
                recommendation: "STRONG_BUY",
                riskLevel: "low",
                profit: 334.8,
                timeRemaining: "1h 47m",
            },
            {
                id: "cyber-opp-3",
                description: "Luka Dončić Over 29.5 Points",
                sport: "NBA",
                event: "Mavs vs Suns",
                market: "Player Props",
                odds: 1.85,
                confidence: 0.789,
                expectedValue: 0.098,
                kellySize: 0.045,
                models: ["Player-Analytics-Pro", "Form-Tracker", "Injury-Predictor"],
                recommendation: "BUY",
                riskLevel: "low",
                profit: 186.2,
                timeRemaining: "3h 22m",
            },
        ];
        return mockOpportunities;
    }, []);
    // Cyber scanning function
    const performCyberScan = useCallback(async () => {
        setState((prev) => ({ ...prev, isScanning: true }));
        try {
            const opportunities = await generateOpportunities();
            const totalProfit = opportunities.reduce((sum, opp) => sum + opp.profit, 0);
            const avgConfidence = opportunities.reduce((sum, opp) => sum + opp.confidence, 0) /
                opportunities.length;
            setState((prev) => ({
                ...prev,
                opportunities,
                totalProfit,
                successRate: avgConfidence * 100,
                lastScanTime: new Date(),
                isScanning: false,
            }));
        }
        catch (error) {
            console.error("Cyber scan failed:", error);
            setState((prev) => ({ ...prev, isScanning: false }));
        }
    }, [generateOpportunities]);
    // Auto scanning effect
    useEffect(() => {
        let intervalId;
        if (state.autoMode) {
            intervalId = setInterval(performCyberScan, state.scanInterval);
        }
        return () => {
            if (intervalId)
                clearInterval(intervalId);
        };
    }, [state.autoMode, state.scanInterval, performCyberScan]);
    // Initial scan
    useEffect(() => {
        performCyberScan();
    }, [performCyberScan]);
    // Handle bet placement with cyber enhancement
    const handleCyberBetPlacement = async (opportunity) => {
        setIsPlacingBet(true);
        try {
            // Simulate bet placement process
            await new Promise((resolve) => setTimeout(resolve, 1500));
            // Add to betting store
            await addBet({
                id: `bet-${Date.now()}`,
                amount: bankroll * opportunity.kellySize,
                odds: opportunity.odds,
                sport: opportunity.sport,
                market: opportunity.market,
                description: opportunity.description,
                status: "pending",
                timestamp: Date.now(),
                confidence: opportunity.confidence,
                expectedValue: opportunity.expectedValue,
            });
            // Success notification would go here
            console.log(`✅ Cyber bet placed: ${opportunity.description}`);
        }
        catch (error) {
            console.error("❌ Cyber bet placement failed:", error);
        }
        finally {
            setIsPlacingBet(false);
            setSelectedOpportunity(null);
        }
    };
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case "low":
                return "text-green-400";
            case "medium":
                return "text-yellow-400";
            case "high":
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };
    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case "STRONG_BUY":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "BUY":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "HOLD":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "PASS":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };
    return (_jsxs("div", { className: "space-y-8 animate-slide-in-up", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-6xl mb-6 text-electric-400 float-element", children: _jsx(DollarSign, { className: "w-16 h-16 mx-auto" }) }), _jsx("h1", { className: "holographic text-4xl font-black mb-4", children: "CYBER MONEY MAKER" }), _jsx("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto", children: "AI-powered profit maximization with quantum-enhanced opportunity detection" })] }), _jsxs(GlassCard, { title: "Quantum Control Center", glowing: state.isScanning, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx(MetricCard, { label: "Total Profit", value: `$${state.totalProfit.toFixed(2)}`, icon: "fa-dollar-sign", change: "+12.4%", trend: "up" }), _jsx(MetricCard, { label: "Success Rate", value: `${state.successRate.toFixed(1)}%`, icon: "fa-target", change: "+3.2%", trend: "up" }), _jsx(MetricCard, { label: "Active Models", value: state.activeModels.toString(), icon: "fa-brain", change: "+2", trend: "up" }), _jsx(MetricCard, { label: "Opportunities", value: state.opportunities.length.toString(), icon: "fa-search", change: "+5", trend: "up" })] }), _jsxs("div", { className: "flex flex-wrap gap-4 items-center justify-center", children: [_jsx(CyberButton, { label: state.isScanning ? "SCANNING..." : "QUANTUM SCAN", onClick: performCyberScan, variant: "primary", size: "lg", icon: "fa-search", disabled: state.isScanning }), _jsx(CyberButton, { label: state.autoMode ? "AUTO MODE ON" : "AUTO MODE OFF", onClick: () => setState((prev) => ({ ...prev, autoMode: !prev.autoMode })), variant: state.autoMode ? "secondary" : "ghost", size: "md", icon: "fa-robot" }), _jsx("div", { className: "flex items-center space-x-4", children: _jsx(StatusIndicator, { status: state.isScanning ? "warning" : "active", label: state.lastScanTime
                                        ? `Last scan: ${state.lastScanTime.toLocaleTimeString()}`
                                        : "Ready to scan" }) })] })] }), _jsx(GlassCard, { title: "Quantum Opportunities", glowing: state.opportunities.length > 0, children: _jsxs("div", { className: "space-y-4", children: [state.opportunities.map((opportunity, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "glass-card rounded-xl p-6 hover:shadow-neon transition-all duration-300", style: {
                                background: "rgba(255, 255, 255, 0.05)",
                                backdropFilter: "blur(20px) saturate(180%)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-1", children: opportunity.description }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-400", children: [_jsx("span", { children: opportunity.sport }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: opportunity.market }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: getRiskColor(opportunity.riskLevel), children: [opportunity.riskLevel.toUpperCase(), " RISK"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `px-3 py-1 rounded-lg border text-xs font-bold ${getRecommendationColor(opportunity.recommendation)}`, children: opportunity.recommendation }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: opportunity.timeRemaining })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-4", children: [_jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsx("div", { className: "text-xl font-bold text-electric-400", children: opportunity.odds.toFixed(2) }), _jsx("div", { className: "text-xs text-gray-400", children: "Odds" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-xl font-bold text-green-400", children: [(opportunity.confidence * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Confidence" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-xl font-bold text-blue-400", children: [(opportunity.expectedValue * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Expected Value" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-xl font-bold text-purple-400", children: [(opportunity.kellySize * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Kelly Size" })] }), _jsxs("div", { className: "text-center p-3 glass-card rounded-lg", children: [_jsxs("div", { className: "text-xl font-bold text-yellow-400", children: ["$", opportunity.profit.toFixed(2)] }), _jsx("div", { className: "text-xs text-gray-400", children: "Est. Profit" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "text-sm text-gray-400 mb-2", children: "AI Models:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: opportunity.models.map((model, idx) => (_jsx("span", { className: "px-2 py-1 bg-electric-400/20 text-electric-400 rounded text-xs font-medium", children: model }, idx))) })] }), _jsx(CyberButton, { label: isPlacingBet && selectedOpportunity?.id === opportunity.id
                                        ? "PLACING BET..."
                                        : "PLACE QUANTUM BET", onClick: () => {
                                        setSelectedOpportunity(opportunity);
                                        handleCyberBetPlacement(opportunity);
                                    }, variant: "primary", className: "w-full", icon: "fa-rocket", disabled: isPlacingBet })] }, opportunity.id))), state.opportunities.length === 0 && !state.isScanning && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-4xl mb-4 text-gray-500", children: "\uD83D\uDD0D" }), _jsx("div", { className: "text-gray-400 mb-4", children: "No opportunities detected" }), _jsx(CyberButton, { label: "RUN QUANTUM SCAN", onClick: performCyberScan, variant: "ghost", icon: "fa-search" })] })), state.isScanning && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-4xl mb-4 text-electric-400 animate-pulse", children: "\u26A1" }), _jsx("div", { className: "text-electric-400 mb-2", children: "QUANTUM SCANNING IN PROGRESS" }), _jsx("div", { className: "text-sm text-gray-400", children: "Analyzing 47 neural networks across multiple markets..." })] }))] }) }), _jsx(GlassCard, { title: "Legacy Money Maker Integration", children: _jsx("div", { className: "p-4 glass-card rounded-lg", children: _jsx(UltimateMoneyMaker, { opportunities: state.opportunities.map((opp) => ({
                            id: opp.id,
                            description: opp.description,
                            odds: opp.odds,
                            confidence: opp.confidence,
                            expectedValue: opp.expectedValue,
                            kellySize: opp.kellySize,
                            models: opp.models,
                        })), onPlaceBet: async (opportunity) => {
                            await handleCyberBetPlacement(opportunity);
                        } }) }) })] }));
};
export default CyberUltimateMoneyMaker;
