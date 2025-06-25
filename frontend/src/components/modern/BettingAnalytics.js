import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useBettingAnalytics } from '../../hooks/useBettingAnalytics';
import { RiskReasoningDisplay } from '../shared/RiskReasoningDisplay';
export function BettingAnalytics({ market, initialOdds, initialStake, className = '', }) {
    const [odds, setOdds] = useState(initialOdds);
    const [stake, setStake] = useState(initialStake);
    const { analysis, isLoading, error, strategies, addStrategy, removeStrategy, calculatePotentialProfit, getRecommendedStake, getRiskAssessment, } = useBettingAnalytics({
        market,
        odds,
        stake,
        autoRefresh: true,
    });
    const handleAddStrategy = () => {
        const newStrategy = {
            id: crypto.randomUUID(),
            name: 'Custom Strategy',
            riskLevel: 'medium',
            stakePercentage: 5,
            minOdds: 1.5,
            maxOdds: 3.0,
        };
        addStrategy(newStrategy);
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: _jsxs("p", { children: ["Error loading analysis: ", error.message] }) }));
    }
    const riskAssessment = getRiskAssessment();
    const recommendedStake = getRecommendedStake();
    const potentialProfit = calculatePotentialProfit(stake);
    return (_jsx("div", { className: `bg-white rounded-lg shadow-lg p-6 ${className}`, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Market Analysis" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Odds" }), _jsx("input", { className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: "1", step: "0.01", type: "number", value: odds, onChange: e => setOdds(Number(e.target.value)) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Stake" }), _jsx("input", { className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: "0", step: "1", type: "number", value: stake, onChange: e => setStake(Number(e.target.value)) })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Risk Assessment" }), _jsxs("div", { className: `p-4 rounded-lg ${riskAssessment.level === 'low'
                                ? 'bg-green-50 text-green-700'
                                : riskAssessment.level === 'medium'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-red-50 text-red-700'}`, children: [_jsxs("p", { className: "font-semibold capitalize", children: ["Risk Level: ", riskAssessment.level] }), _jsx("ul", { className: "mt-2 space-y-1", children: riskAssessment.factors.map((factor, index) => (_jsxs("li", { children: ["\u00022 ", factor] }, index))) }), analysis?.risk_reasoning && (_jsx(RiskReasoningDisplay, { riskReasoning: analysis.risk_reasoning, className: "mt-3" }))] })] }), _jsxs("div", { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900", children: "Recommended Stake" }), _jsxs("p", { className: "text-2xl font-bold text-blue-600", children: ["$", recommendedStake.toFixed(2)] })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-green-900", children: "Potential Profit" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["$", potentialProfit.toFixed(2)] })] }), _jsxs("div", { className: "bg-purple-50 rounded-lg p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-purple-900", children: "Prediction Confidence" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: analysis?.predictionConfidence
                                        ? `${(analysis.predictionConfidence * 100).toFixed(1)}%`
                                        : 'N/A' })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Active Strategies" }), _jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", onClick: handleAddStrategy, children: "Add Strategy" })] }), _jsxs("div", { className: "space-y-4", children: [strategies.map(strategy => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 rounded-lg p-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: strategy.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Risk: ", strategy.riskLevel, " | Stake: ", strategy.stakePercentage, "%"] })] }), _jsx("button", { className: "text-red-600 hover:text-red-800", onClick: () => removeStrategy(strategy.id), children: "Remove" })] }, strategy.id))), strategies.length === 0 && (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No active strategies" }))] })] }), analysis?.hedgingOpportunities && analysis.hedgingOpportunities.length > 0 && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Hedging Opportunities" }), _jsx("div", { className: "space-y-4", children: analysis.hedgingOpportunities.map((opportunity, index) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: opportunity.market }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Odds: ", opportunity.odds, " | Recommended Stake: $", opportunity.recommendedStake.toFixed(2)] })] }), _jsx("button", { className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600", children: "Place Hedge" })] }, index))) })] }))] }) }));
}
