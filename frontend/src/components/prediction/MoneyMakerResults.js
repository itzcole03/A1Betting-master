import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Badge, Button, Icon } from '../ui/UnifiedUI';
export const MoneyMakerResults = ({ event, market, selection, odds, modelOutput, kellyFraction, expectedValue, timestamp, onPlaceBet, className = '', }) => {
    const { confidenceScore, confidenceColor, modelMeta } = modelOutput;
    const getKellyColor = (fraction) => {
        if (fraction >= 0.1)
            return 'success';
        if (fraction >= 0.05)
            return 'warning';
        return 'danger';
    };
    const getEVColor = (ev) => {
        if (ev >= 0.1)
            return 'success';
        if (ev >= 0)
            return 'warning';
        return 'danger';
    };
    return (_jsxs(Card, { className: `p-4 ${className}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: event }), _jsxs("p", { className: "text-sm text-gray-600", children: [market, " - ", selection] })] }), _jsxs("div", { className: "flex flex-col items-end space-y-2", children: [_jsx(Badge, { variant: confidenceColor, children: confidenceScore.toFixed(2) }), _jsxs(Badge, { variant: getEVColor(expectedValue), children: ["EV: ", expectedValue.toFixed(2)] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Odds" }), _jsx("p", { className: "text-lg font-semibold", children: odds.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Kelly Fraction" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(kellyFraction * 100).toFixed(1), "%"] }), _jsx(Badge, { variant: getKellyColor(kellyFraction), children: kellyFraction >= 0.1 ? 'Strong' : kellyFraction >= 0.05 ? 'Moderate' : 'Weak' })] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-500", children: [_jsx(Icon, { className: "w-4 h-4", name: "info" }), _jsxs("span", { children: ["Model: ", modelMeta.type, " v", modelMeta.version] })] }), _jsx(Button, { "aria-label": "Place Bet", disabled: kellyFraction < 0.05 || expectedValue < 0, variant: "primary", onClick: onPlaceBet, children: "Place Bet" })] })] }));
};
