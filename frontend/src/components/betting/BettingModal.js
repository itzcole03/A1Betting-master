import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRiskProfile } from '@/hooks/useRiskProfile';
import { useState } from 'react';
import { RiskReasoningDisplay } from '../shared/RiskReasoningDisplay';
import { Badge, Button, Card, Icon, Spinner } from '../ui/UnifiedUI';
export const BettingModal = ({ isOpen, onClose, event, market, selection, odds, confidenceScore, expectedValue, kellyFraction, riskProfile, selectedStrategy, onStrategyChange, stake, onStakeChange, onPlaceBet, isLoading, error: externalError, }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [error, setError] = useState(null);
    const { validateBet } = useRiskProfile();
    if (!isOpen)
        return null;
    const getStrategyDescription = (strategy) => {
        switch (strategy) {
            case 'kelly':
                return 'Kelly Criterion: Optimal bet sizing based on edge and odds';
            case 'fixed':
                return 'Fixed Stake: Consistent bet size regardless of edge';
            case 'martingale':
                return 'Martingale: Double stake after losses';
            case 'fibonacci':
                return 'Fibonacci: Progressive stake based on Fibonacci sequence';
            default:
                return '';
        }
    };
    const getRecommendedStake = () => {
        switch (selectedStrategy) {
            case 'kelly':
                return kellyFraction * 100;
            case 'fixed':
                return 10; // Default fixed stake
            case 'martingale':
                return stake * 2; // Double previous stake
            case 'fibonacci':
                // Simple Fibonacci sequence implementation
                const fib = [1, 1, 2, 3, 5, 8, 13, 21];
                return fib[Math.min(fib.length - 1, Math.floor(stake / 10))] * 10;
            default:
                return stake;
        }
    };
    const handlePlaceBet = () => {
        const betData = {
            stake,
            confidence: confidenceScore,
            kellyFraction,
            sport: event.sport || '',
            market: market.name || '',
            eventId: event.id || '',
        };
        const validation = validateBet(betData);
        if (!validation.isValid) {
            setError('Bet does not meet risk profile: ' + validation.errors.join(', '));
            return;
        }
        setError(null);
        onPlaceBet();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(Card, { className: "w-full max-w-2xl p-6", variant: "bordered", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold", children: "Place Bet" }), _jsxs("p", { className: "text-gray-600", children: [event.name, " - ", market.name] })] }), _jsx(Button, { size: "small", variant: "ghost", onClick: onClose, children: _jsx(Icon, { className: "w-5 h-5", name: "x-mark" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Selection" }), _jsx("p", { className: "font-medium", children: selection.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Odds" }), _jsx("p", { className: "font-medium", children: odds.value.toFixed(2) })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Confidence" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "font-medium", children: [(confidenceScore * 100).toFixed(1), "%"] }), _jsx(Badge, { variant: confidenceScore >= 0.7
                                                        ? 'success'
                                                        : confidenceScore >= 0.5
                                                            ? 'warning'
                                                            : 'danger', children: confidenceScore >= 0.7 ? 'High' : confidenceScore >= 0.5 ? 'Medium' : 'Low' })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Expected Value" }), _jsxs("p", { className: `font-medium ${expectedValue >= 0 ? 'text-green-500' : 'text-red-500'}`, children: [(expectedValue * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Kelly Fraction" }), _jsxs("p", { className: "font-medium", children: [(kellyFraction * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Betting Strategy" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: ['kelly', 'fixed', 'martingale', 'fibonacci'].map(strategy => (_jsxs(Button, { className: "justify-start", size: "small", variant: selectedStrategy === strategy ? 'primary' : 'secondary', onClick: () => onStrategyChange(strategy), children: [_jsx(Icon, { className: "w-4 h-4 mr-2", name: selectedStrategy === strategy ? 'check-circle' : 'circle' }), strategy.charAt(0).toUpperCase() + strategy.slice(1)] }, strategy))) }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: getStrategyDescription(selectedStrategy) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Stake" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { className: "w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", min: "0", step: "0.01", type: "number", value: stake, onChange: e => onStakeChange(Number(e.target.value)) }), _jsx(Button, { size: "small", variant: "secondary", onClick: () => onStakeChange(getRecommendedStake()), children: "Use Recommended" })] })] }), _jsxs("div", { children: [_jsxs(Button, { className: "flex items-center", size: "small", variant: "ghost", onClick: () => setShowAdvanced(!showAdvanced), children: [_jsx(Icon, { className: "w-4 h-4 mr-2", name: showAdvanced ? 'chevron-up' : 'chevron-down' }), "Advanced Options"] }), showAdvanced && (_jsx("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Risk Profile" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: riskProfile.riskLevel.toLowerCase(), children: riskProfile.riskLevel }), _jsx("p", { className: "text-sm text-gray-600", children: riskProfile.recommendation })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Top Risk Factors" }), _jsx("div", { className: "space-y-2", children: riskProfile.factors.map((factor, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm", children: factor.name }), _jsx(Badge, { variant: factor.severity.toLowerCase(), children: factor.severity })] }, index))) }), Array.isArray(riskProfile.risk_reasoning) && riskProfile.risk_reasoning.length > 0 && (_jsx(RiskReasoningDisplay, { riskReasoning: riskProfile.risk_reasoning, className: "mt-3" }))] })] }) }))] }), error && (_jsxs("div", { className: "text-red-500 text-center", children: [_jsx(Icon, { className: "w-5 h-5 mx-auto mb-2", name: "exclamation-circle" }), _jsx("p", { children: error })] })), externalError && !error && (_jsxs("div", { className: "text-red-500 text-center", children: [_jsx(Icon, { className: "w-5 h-5 mx-auto mb-2", name: "exclamation-circle" }), _jsx("p", { children: externalError })] })), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { disabled: isLoading, variant: "secondary", onClick: onClose, children: "Cancel" }), _jsx(Button, { disabled: isLoading || stake <= 0, variant: "primary", onClick: handlePlaceBet, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { className: "mr-2", size: "small" }), "Placing Bet..."] })) : ('Place Bet') })] })] })] }) }));
};
