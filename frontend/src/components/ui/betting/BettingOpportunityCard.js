import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { memo } from 'react';
import { ModelConfidenceIndicator } from '../ml-status-indicators';
import { PredictionConfidenceChart } from '../advanced-charts';
export const BettingOpportunityCard = memo(({ opportunity, onPlaceBet, isActive = false }) => {
    const [betAmount, setBetAmount] = React.useState(0);
    const handlePlaceBet = () => {
        if (betAmount > 0) {
            onPlaceBet(betAmount);
            setBetAmount(0);
        }
    };
    return (_jsxs("div", { className: `glass-premium p-4 rounded-xl transition-all ${isActive ? 'ring-2 ring-primary-500' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold", children: opportunity.event }), _jsx("p", { className: "text-sm text-gray-500", children: opportunity.market })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Odds" }), _jsx("p", { className: "text-xl font-bold text-primary-500", children: opportunity.odds.toFixed(2) })] }), _jsx(ModelConfidenceIndicator, { confidence: opportunity.confidence })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Expected Value" }), _jsx("p", { className: `text-lg font-semibold ${opportunity.expectedValue >= 0 ? 'text-success-500' : 'text-error-500'}`, children: opportunity.expectedValue.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Kelly Fraction" }), _jsxs("p", { className: "text-lg font-semibold text-primary-500", children: [(opportunity.kellyFraction * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Model Consensus" }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx(PredictionConfidenceChart, { data: Object.entries(opportunity.modelBreakdown).map(([model, value]) => ({
                                        model,
                                        value,
                                    })), height: 40 }) })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500", min: "0", placeholder: "Enter bet amount", step: "1", type: "number", value: betAmount, onChange: e => setBetAmount(Number(e.target.value)) }), _jsx("button", { className: "px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed", disabled: betAmount <= 0, onClick: handlePlaceBet, children: "Place Bet" })] })] }));
});
BettingOpportunityCard.displayName = 'BettingOpportunityCard';
