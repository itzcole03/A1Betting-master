import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
const BestBetSelector = ({ predictions }) => {
    const bestBets = useMemo(() => {
        if (!predictions.length)
            return [];
        // Score each prediction based on multiple factors
        const scoredPredictions = predictions.map(pred => {
            const confidenceScore = pred.confidence * 0.4;
            const edgeScore = pred.marketEdge * 0.3;
            const kellyScore = pred.kellyValue * 0.3;
            // Calculate feature importance score from SHAP values
            const shapScore = Object.values(pred.shapValues).reduce((sum, val) => sum + Math.abs(val), 0) /
                Object.keys(pred.shapValues).length;
            const totalScore = confidenceScore + edgeScore + kellyScore + shapScore * 0.2;
            return {
                ...pred,
                score: totalScore,
            };
        });
        // Sort by score and return top 3
        return scoredPredictions.sort((a, b) => b.score - a.score).slice(0, 3);
    }, [predictions]);
    const getScoreColor = (score) => {
        if (score >= 0.8)
            return 'text-green-500';
        if (score >= 0.6)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    return (_jsxs("div", { className: "space-y-4", children: [bestBets.map((bet, index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "premium-input-container p-4", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-lg font-semibold", children: ["Prediction: ", (bet.prediction * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-gray-500", children: new Date(bet.timestamp).toLocaleString() })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-xl font-bold ${getScoreColor(bet.score)}`, children: ["Score: ", (bet.score * 100).toFixed(1), "%"] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Confidence: ", (bet.confidence * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Edge" }), _jsxs("div", { className: "font-semibold", children: [(bet.marketEdge * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Kelly" }), _jsxs("div", { className: "font-semibold", children: [(bet.kellyValue * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-500", children: "SHAP" }), _jsxs("div", { className: "font-semibold", children: [((Object.values(bet.shapValues).reduce((sum, val) => sum + Math.abs(val), 0) /
                                                Object.keys(bet.shapValues).length) *
                                                100).toFixed(1), "%"] })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Key Features" }), _jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(bet.shapValues)
                                    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                                    .slice(0, 3)
                                    .map(([feature, value]) => (_jsxs("span", { className: `px-2 py-1 rounded-full text-xs ${value > 0 ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`, children: [feature, ": ", value.toFixed(2)] }, feature))) })] })] }, bet.id))), !bestBets.length && (_jsx("div", { className: "text-center text-gray-500 py-8", children: "No predictions available. Generate some predictions to see the best bets." }))] }));
};
export default React.memo(BestBetSelector);
