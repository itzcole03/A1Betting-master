import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import GlassCard from './GlassCard';
// Simple Info icon component
const InfoIcon = () => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })] }));
// Simple tooltip component
const Tooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), className: "inline-flex items-center justify-center", children: children }), isVisible && (_jsxs("div", { className: "absolute z-10 px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap", children: [content, _jsx("div", { className: "absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" })] }))] }));
};
const getRiskLevelColor = (level) => {
    switch (level) {
        case 'low':
            return 'bg-green-500/20 text-green-400';
        case 'medium':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'high':
            return 'bg-red-500/20 text-red-400';
        default:
            return 'bg-gray-500/20 text-gray-400';
    }
};
export const PredictionSummaryCard = (props) => {
    // Destructure props with defaults first
    const { accuracy, payout, kelly, marketEdge, dataQuality, modelName, confidence, className = '', lastUpdated = new Date(), riskLevel = 'medium', onDetailsClick, onAddToBetslip, interactive = true } = props;
    const [isHovered, setIsHovered] = useState(false);
    // Format the date after destructuring
    const formattedDate = lastUpdated.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const handleDetailsClick = useCallback((e) => {
        e.stopPropagation();
        onDetailsClick?.();
    }, [onDetailsClick]);
    const handleAddToBetslip = useCallback((e) => {
        e.stopPropagation();
        onAddToBetslip?.();
    }, [onAddToBetslip]);
    // Determine if the card is clickable
    const isClickable = Boolean(onDetailsClick || onAddToBetslip);
    // Handle click on card
    const handleCardClick = useCallback((e) => {
        e.stopPropagation();
        if (onDetailsClick) {
            onDetailsClick();
        }
        else if (onAddToBetslip) {
            onAddToBetslip();
        }
    }, [onDetailsClick, onAddToBetslip]);
    // Handle keyboard events for accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onDetailsClick) {
                onDetailsClick();
            }
            else if (onAddToBetslip) {
                onAddToBetslip();
            }
        }
    };
    return (_jsx("div", { className: `w-full max-w-xl mx-auto transition-all duration-300 ${isClickable ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: isClickable ? handleCardClick : undefined, role: isClickable ? 'button' : undefined, tabIndex: isClickable ? 0 : -1, onKeyDown: isClickable ? handleKeyDown : undefined, "aria-label": `Prediction details for ${modelName || 'unknown model'}. ${riskLevel} risk level.`, "aria-expanded": isHovered, "data-testid": "prediction-summary-card", children: _jsxs(GlassCard, { className: "relative overflow-hidden", children: [isHovered && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent transition-opacity duration-300" })), _jsxs("div", { className: "relative z-10 p-6", "aria-live": "polite", "aria-atomic": "true", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [modelName && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h3", { className: "text-lg font-semibold text-primary-600 tracking-wide", children: modelName }), _jsx(Tooltip, { content: "Model performance metrics", children: _jsx(InfoIcon, {}) })] })), _jsx("div", { className: `text-xs px-2 py-1 rounded-full ${getRiskLevelColor(riskLevel)}`, "aria-label": `Risk level: ${riskLevel}`, children: _jsxs("span", { "aria-hidden": "true", children: [riskLevel.toUpperCase(), " RISK"] }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 w-full text-center", children: [_jsxs("div", { className: "bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-center space-x-1 text-xs text-gray-400", children: [_jsx("span", { className: "sr-only", children: "Accuracy:" }), _jsx("span", { "aria-hidden": "true", children: "Accuracy" }), _jsx(Tooltip, { content: "Model's prediction accuracy based on historical data", children: _jsx(InfoIcon, {}) })] }), _jsxs("div", { className: "text-2xl font-bold text-primary-500 mt-1", children: [accuracy.toFixed(1), "%"] })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-center space-x-1 text-xs text-gray-400", children: [_jsx("span", { className: "sr-only", children: "Payout:" }), _jsx("span", { "aria-hidden": "true", children: "Payout" }), _jsx(Tooltip, { content: "Expected payout multiplier", children: _jsx(InfoIcon, {}) })] }), _jsxs("div", { className: "text-2xl font-bold text-green-500 mt-1", children: [payout.toFixed(2), "x"] })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-center space-x-1 text-xs text-gray-400", children: [_jsx("span", { className: "sr-only", children: "Kelly Criterion:" }), _jsx("span", { "aria-hidden": "true", children: "Kelly" }), _jsx(Tooltip, { content: "Kelly Criterion - Recommended bet size", children: _jsx(InfoIcon, {}) })] }), _jsx("div", { className: `text-2xl font-bold ${kelly >= 0.5 ? 'text-green-500' : 'text-yellow-400'}`, children: kelly.toFixed(2) })] }), _jsxs("div", { className: "bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-center space-x-1 text-xs text-gray-400", children: [_jsx("span", { className: "sr-only", children: "Market Edge:" }), _jsx("span", { "aria-hidden": "true", children: "Market Edge" }), _jsx(Tooltip, { content: "Estimated advantage over the market", children: _jsx(InfoIcon, {}) })] }), _jsxs("div", { className: `text-2xl font-bold ${marketEdge > 0 ? 'text-green-500' : 'text-red-500'}`, children: [marketEdge > 0 ? '+' : '', marketEdge.toFixed(2), "%"] })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white/5 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-gray-400", children: "Data Quality" }), _jsxs("span", { className: "font-semibold text-purple-400", children: [dataQuality.toFixed(0), "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-1.5 mt-2", children: _jsx("div", { className: "bg-purple-500 h-1.5 rounded-full", style: { width: `${dataQuality}%` } }) })] }), confidence !== undefined && (_jsxs("div", { className: "bg-white/5 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-gray-400", children: "Confidence" }), _jsxs("span", { className: "font-semibold text-pink-400", children: [confidence.toFixed(0), "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-1.5 mt-2", children: _jsx("div", { className: "bg-pink-500 h-1.5 rounded-full", style: { width: `${confidence}%` } }) })] }))] }), _jsxs("div", { className: "mt-6 pt-4 border-t border-white/10", "aria-live": "polite", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("span", { className: "text-xs text-gray-400", children: ["Updated: ", formattedDate] }), _jsxs("div", { className: "flex space-x-2", role: "group", "aria-label": "Card actions", children: [onAddToBetslip && interactive && (_jsxs("button", { onClick: handleAddToBetslip, className: "px-3 py-1.5 text-xs font-medium rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900", "aria-label": "Add to betslip", children: [_jsx("span", { children: "Add to Betslip" }), _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) })] })), onDetailsClick && interactive && (_jsxs("button", { onClick: handleDetailsClick, className: "px-3 py-1.5 text-xs font-medium rounded-full border border-primary-500 text-primary-500 hover:bg-primary-500/10 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900", "aria-label": "View details", children: [_jsx("span", { children: "View Details" }), _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] }))] })] }), isHovered && interactive && onDetailsClick && (_jsx("div", { className: "text-xs text-gray-500 text-right animate-fade-in", children: "Click anywhere to view full prediction details" }))] })] })] }) }));
};
export default PredictionSummaryCard;
