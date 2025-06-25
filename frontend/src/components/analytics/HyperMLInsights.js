import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useUnifiedAnalytics } from '@/hooks/useUnifiedAnalytics';
const safeNumber = (n) => (typeof n === 'number' && !isNaN(n) ? n : 0);
const exportToJson = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hyperml-insights.json';
    a.click();
    URL.revokeObjectURL(url);
};
const HyperMLInsights = ({ autoUpdateInterval = 60000, showMarketAnalysis = true, showRiskMetrics = true, showInefficiencies = true, showHedging = true, showRecommendation = true, }) => {
    const { ml, betting } = useUnifiedAnalytics({
        ml: { autoUpdate: true, updateInterval: autoUpdateInterval },
        betting: true,
    });
    if (ml.loading || betting.loading) {
        return (_jsx("div", { "aria-live": "polite", className: "flex items-center justify-center h-96", role: "status", children: _jsx("div", { "aria-label": "Loading", className: "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" }) }));
    }
    if (ml.error || betting.error) {
        return (_jsxs("div", { className: "p-4 bg-red-100 border border-red-400 text-red-700 rounded", role: "alert", children: [_jsx("h3", { className: "font-bold", children: "Error" }), _jsx("p", { children: ml.error || betting.error }), _jsx("button", { className: "mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", onClick: () => {
                        ml.refetch();
                        betting.refetch();
                    }, children: "Retry" })] }));
    }
    const mlResult = ml.data;
    const bettingResult = betting.data;
    if (!mlResult) {
        return (_jsx("div", { className: "p-4 text-gray-500", role: "status", children: "No HyperML analytics available." }));
    }
    // BettingAnalytics type: { roi, winRate, profitLoss, riskMetrics: { var, sharpe, sortino }, confidence }
    // Remove kelly, use only available fields
    return (_jsxs("div", { className: "space-y-8", "data-testid": "hypermlinsights-root", children: [showMarketAnalysis && (_jsxs("section", { "aria-labelledby": "hyperml-market-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "hyperml-market-heading", children: "Deep Market Analysis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Market VaR" }), _jsxs("div", { className: "font-mono text-2xl", children: ["$", safeNumber(bettingResult?.riskMetrics?.var).toFixed(2)] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Sharpe Ratio" }), _jsx("div", { className: "font-mono text-2xl", children: safeNumber(bettingResult?.riskMetrics?.sharpe).toFixed(2) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Win Rate" }), _jsxs("div", { className: "font-mono text-2xl", children: [safeNumber(bettingResult?.winRate).toFixed(2), "%"] })] })] })] })), showRiskMetrics && (_jsxs("section", { "aria-labelledby": "hyperml-risk-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "hyperml-risk-heading", children: "Advanced Risk Analysis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Sortino Ratio" }), _jsx("div", { className: "font-mono text-2xl", children: safeNumber(bettingResult?.riskMetrics?.sortino).toFixed(2) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Profit/Loss" }), _jsxs("div", { className: "font-mono text-2xl", children: ["$", safeNumber(bettingResult?.profitLoss).toFixed(2)] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "ROI" }), _jsxs("div", { className: "font-mono text-2xl", children: [safeNumber(bettingResult?.roi).toFixed(2), "%"] })] })] })] })), showInefficiencies && (_jsxs("section", { "aria-labelledby": "hyperml-inefficiencies-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "hyperml-inefficiencies-heading", children: "Market Inefficiencies" }), _jsx("div", { className: "text-gray-500", children: "(Unified analytics: see feature importance and model insights for inefficiency signals.)" })] })), showHedging && (_jsxs("section", { "aria-labelledby": "hyperml-hedging-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "hyperml-hedging-heading", children: "Hedging Opportunities" }), _jsx("div", { className: "text-gray-500", children: "(Unified analytics: hedging strategies available in advanced betting modules.)" })] })), showRecommendation && (_jsxs("section", { "aria-labelledby": "hyperml-recommendation-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "hyperml-recommendation-heading", children: "AI Recommendation" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "font-bold text-lg", children: safeNumber(bettingResult?.confidence) > 0.7 ? 'Place Bet' : 'Hold' }), _jsxs("span", { className: "px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800", children: [(safeNumber(bettingResult?.confidence) * 100).toFixed(1), "% Confidence"] })] }), _jsxs("div", { className: "flex justify-end mt-4 gap-2", children: [_jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", onClick: () => {
                                    ml.refetch();
                                    betting.refetch();
                                }, children: "Refresh Analysis" }), _jsx("button", { className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300", onClick: () => exportToJson({ mlResult, bettingResult }), children: "Export JSON" })] })] }))] }));
};
export default React.memo(HyperMLInsights);
