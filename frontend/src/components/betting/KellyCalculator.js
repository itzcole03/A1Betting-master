import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
const KellyCalculator = ({ prediction, confidence, marketEdge, }) => {
    const kellyValue = useMemo(() => {
        if (!prediction || !confidence || !marketEdge)
            return 0;
        // Kelly Criterion formula: f* = (bp - q) / b
        // where:
        // f* = fraction of bankroll to bet
        // b = odds received on bet (decimal odds - 1)
        // p = probability of winning
        // q = probability of losing (1 - p)
        const p = prediction * confidence;
        const q = 1 - p;
        const b = marketEdge;
        const kelly = (b * p - q) / b;
        return Math.max(0, Math.min(kelly, 0.5)); // Cap at 50% of bankroll
    }, [prediction, confidence, marketEdge]);
    const getRiskLevel = (value) => {
        if (value <= 0.05)
            return 'Conservative';
        if (value <= 0.15)
            return 'Moderate';
        return 'Aggressive';
    };
    const getRiskColor = (value) => {
        if (value <= 0.05)
            return 'text-green-500';
        if (value <= 0.15)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "premium-input-container p-4", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Kelly Value" }), _jsxs("div", { className: "text-2xl font-bold text-primary-500", children: [(kellyValue * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "premium-input-container p-4", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Risk Level" }), _jsx("div", { className: `text-2xl font-bold ${getRiskColor(kellyValue)}`, children: getRiskLevel(kellyValue) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-sm font-medium", children: "Recommended Bet Size" }), _jsx("div", { className: "relative h-4 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "absolute h-full bg-primary-500 transition-all duration-500", style: { width: `${kellyValue * 100}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "0%" }), _jsx("span", { children: "25%" }), _jsx("span", { children: "50%" })] })] }), _jsxs("div", { className: "text-sm text-gray-500", children: [_jsxs("p", { children: ["The Kelly Criterion suggests betting ", kellyValue.toFixed(3), " of your bankroll based on the prediction confidence and market edge. This is a", ' ', _jsx("span", { className: getRiskColor(kellyValue), children: getRiskLevel(kellyValue) }), " bet size."] }), _jsx("p", { className: "mt-2", children: "Note: Always consider your risk tolerance and never bet more than you can afford to lose." })] })] }));
};
export default React.memo(KellyCalculator);
