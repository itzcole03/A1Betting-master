import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { DollarSign, Target, Zap, Brain, } from "lucide-react";
import { useBetting, useUser } from "../../store/unified/UnifiedStoreManager";
const UltimateMoneyMaker = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [autoMode, setAutoMode] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [stakeAmount, setStakeAmount] = useState(0);
    const { bankroll, addBet, addOpportunity } = useBetting();
    const { preferences } = useUser();
    // Scan for opportunities
    const scanForOpportunities = async () => {
        setIsScanning(true);
        try {
            // Simulate scanning process
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const mockOpportunities = [
                {
                    id: "opp-1",
                    eventId: "game-lakers-warriors",
                    market: "moneyline",
                    description: "Lakers vs Warriors - Lakers ML",
                    currentOdds: 2.1,
                    predictedProbability: 0.52,
                    valueEdge: 0.092,
                    kellyFraction: 0.047,
                    recommendedStake: Math.min(bankroll * 0.02, bankroll * 0.047 * 0.25),
                    confidence: 0.78,
                    riskLevel: "medium",
                    maxStake: bankroll * 0.05,
                    expectedReturn: 0,
                },
                {
                    id: "opp-2",
                    eventId: "game-celtics-heat",
                    market: "total_points",
                    description: "Celtics vs Heat - Over 215.5",
                    currentOdds: 1.91,
                    predictedProbability: 0.58,
                    valueEdge: 0.108,
                    kellyFraction: 0.062,
                    recommendedStake: Math.min(bankroll * 0.03, bankroll * 0.062 * 0.25),
                    confidence: 0.82,
                    riskLevel: "low",
                    maxStake: bankroll * 0.05,
                    expectedReturn: 0,
                },
                {
                    id: "opp-3",
                    eventId: "game-mavs-suns",
                    market: "player_props",
                    description: "Luka Dončić Over 29.5 Points",
                    currentOdds: 1.85,
                    predictedProbability: 0.61,
                    valueEdge: 0.129,
                    kellyFraction: 0.071,
                    recommendedStake: Math.min(bankroll * 0.025, bankroll * 0.071 * 0.25),
                    confidence: 0.85,
                    riskLevel: "low",
                    maxStake: bankroll * 0.04,
                    expectedReturn: 0,
                },
            ];
            // Calculate expected returns
            mockOpportunities.forEach((opp) => {
                opp.expectedReturn =
                    opp.recommendedStake *
                        (opp.currentOdds - 1) *
                        opp.predictedProbability;
            });
            setOpportunities(mockOpportunities);
            // Add to betting store
            mockOpportunities.forEach((opp) => {
                addOpportunity({
                    id: opp.id,
                    eventId: opp.eventId,
                    market: opp.market,
                    odds: opp.currentOdds,
                    prediction: {
                        id: opp.id,
                        confidence: opp.confidence,
                        predictedValue: opp.predictedProbability,
                        factors: [],
                        timestamp: Date.now(),
                    },
                    valueEdge: opp.valueEdge,
                    kellyFraction: opp.kellyFraction,
                    recommendedStake: opp.recommendedStake,
                    timestamp: Date.now(),
                });
            });
        }
        catch (error) {
            console.error("Failed to scan for opportunities:", error);
        }
        finally {
            setIsScanning(false);
        }
    };
    // Place bet
    const placeBet = (opportunity, amount) => {
        addBet({
            eventId: opportunity.eventId,
            amount,
            odds: opportunity.currentOdds,
            status: "active",
            prediction: {
                id: opportunity.id,
                confidence: opportunity.confidence,
                predictedValue: opportunity.predictedProbability,
                factors: [],
                timestamp: Date.now(),
            },
        });
        setSelectedOpportunity(null);
        setStakeAmount(0);
    };
    // Auto-scan when component mounts
    useEffect(() => {
        scanForOpportunities();
    }, []);
    // Auto-mode scanning
    useEffect(() => {
        if (!autoMode)
            return;
        const interval = setInterval(() => {
            scanForOpportunities();
        }, 60000); // Scan every minute
        return () => clearInterval(interval);
    }, [autoMode]);
    const getRiskColor = (risk) => {
        switch (risk) {
            case "low":
                return "text-green-600 bg-green-100";
            case "medium":
                return "text-yellow-600 bg-yellow-100";
            case "high":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };
    const totalPotentialReturn = opportunities.reduce((sum, opp) => sum + opp.expectedReturn, 0);
    const averageConfidence = opportunities.length > 0
        ? opportunities.reduce((sum, opp) => sum + opp.confidence, 0) /
            opportunities.length
        : 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Ultimate Money Maker" }), _jsx("p", { className: "opacity-90", children: "AI-powered value betting opportunities" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-bold", children: ["$", totalPotentialReturn.toFixed(2)] }), _jsx("div", { className: "opacity-90", children: "Potential Return" })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Opportunity Scanner" }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: autoMode, onChange: (e) => setAutoMode(e.target.checked), className: "rounded" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Auto Mode" })] }), _jsx("button", { onClick: scanForOpportunities, disabled: isScanning, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2", children: isScanning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }), _jsx("span", { children: "Scanning..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-4 h-4" }), _jsx("span", { children: "Scan Now" })] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: opportunities.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Opportunities" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [(averageConfidence * 100).toFixed(0), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg Confidence" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["$", bankroll.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Bankroll" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: opportunities.filter((o) => o.riskLevel === "low").length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Low Risk" })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-4", children: "Current Opportunities" }), opportunities.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Brain, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: isScanning
                                    ? "Scanning for opportunities..."
                                    : "No opportunities found. Click scan to search for value bets." })] })) : (_jsx("div", { className: "space-y-4", children: opportunities.map((opportunity) => (_jsxs("div", { className: "border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: opportunity.description }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("span", { children: ["Odds: ", opportunity.currentOdds] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Edge: ", (opportunity.valueEdge * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${getRiskColor(opportunity.riskLevel)}`, children: opportunity.riskLevel.toUpperCase() }), _jsxs("span", { className: "text-lg font-bold text-green-600", children: ["$", opportunity.expectedReturn.toFixed(2)] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4 mb-3", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Confidence" }), _jsxs("div", { className: "font-semibold text-gray-900 dark:text-white", children: [(opportunity.confidence * 100).toFixed(0), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Probability" }), _jsxs("div", { className: "font-semibold text-gray-900 dark:text-white", children: [(opportunity.predictedProbability * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Kelly %" }), _jsxs("div", { className: "font-semibold text-gray-900 dark:text-white", children: [(opportunity.kellyFraction * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Recommended" }), _jsxs("div", { className: "font-semibold text-green-600", children: ["$", opportunity.recommendedStake.toFixed(2)] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Max Stake" }), _jsxs("div", { className: "font-semibold text-gray-900 dark:text-white", children: ["$", opportunity.maxStake.toFixed(2)] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx(Target, { className: "w-4 h-4" }), _jsxs("span", { children: ["Expected Return: $", opportunity.expectedReturn.toFixed(2)] })] }), _jsxs("button", { onClick: () => {
                                                setSelectedOpportunity(opportunity);
                                                setStakeAmount(opportunity.recommendedStake);
                                            }, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2", children: [_jsx(DollarSign, { className: "w-4 h-4" }), _jsx("span", { children: "Place Bet" })] })] })] }, opportunity.id))) }))] }), selectedOpportunity && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Place Bet" }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-2", children: selectedOpportunity.description }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-500", children: ["Odds: ", selectedOpportunity.currentOdds, " \u2022 Confidence:", " ", (selectedOpportunity.confidence * 100).toFixed(0), "%"] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Stake Amount" }), _jsx("input", { type: "number", value: stakeAmount, onChange: (e) => setStakeAmount(parseFloat(e.target.value) || 0), min: "1", max: selectedOpportunity.maxStake, step: "0.01", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1", children: [_jsxs("span", { children: ["Recommended: $", selectedOpportunity.recommendedStake.toFixed(2)] }), _jsxs("span", { children: ["Max: $", selectedOpportunity.maxStake.toFixed(2)] })] })] }), stakeAmount > 0 && (_jsxs("div", { className: "mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Potential Win:" }), _jsxs("span", { className: "font-semibold text-green-600", children: ["$", ((selectedOpportunity.currentOdds - 1) *
                                                    stakeAmount).toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Total Return:" }), _jsxs("span", { className: "font-semibold", children: ["$", (selectedOpportunity.currentOdds * stakeAmount).toFixed(2)] })] })] })), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => {
                                        setSelectedOpportunity(null);
                                        setStakeAmount(0);
                                    }, className: "flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700", children: "Cancel" }), _jsx("button", { onClick: () => placeBet(selectedOpportunity, stakeAmount), disabled: stakeAmount <= 0 ||
                                        stakeAmount > selectedOpportunity.maxStake ||
                                        stakeAmount > bankroll, className: "flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Confirm Bet" })] })] }) }))] }));
};
export default UltimateMoneyMaker;
