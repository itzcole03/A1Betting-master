import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
const MLFactorViz = ({ playerId, metric, prediction, strategy }) => {
    const insights = useMemo(() => {
        if (!playerId || !metric || !prediction || !strategy) {
            return [];
        }
        return [
            {
                factor: 'Historical Performance',
                impact: strategy.confidence || 0,
                confidence: prediction.confidence,
                description: `Based on ${playerId}'s historical ${metric} performance`,
            },
            {
                factor: 'Market Trends',
                impact: strategy.expectedValue || 0,
                confidence: prediction.confidence * 0.9,
                description: 'Current market movement and betting patterns',
            },
            {
                factor: 'Player Condition',
                impact: 0.75,
                confidence: 0.85,
                description: 'Recent performance and health status',
            },
        ];
    }, [playerId, metric, prediction, strategy]);
    const getImpactColor = (impact) => {
        if (impact >= 0.7)
            return 'bg-green-500';
        if (impact >= 0.4)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.7)
            return 'text-green-600';
        if (confidence >= 0.4)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    if (!playerId || !metric) {
        return (_jsx("div", { className: "p-4 text-gray-500", children: "Select a player and metric to view ML factor analysis" }));
    }
    if (!prediction || !strategy) {
        return _jsx("div", { className: "p-4 text-gray-500", children: "Loading ML factor analysis..." });
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "ML Factor Analysis" }), _jsx("div", { className: "space-y-6", children: insights.map((insight, index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg p-4 shadow-sm", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium", children: insight.factor }), _jsxs("span", { className: `text-sm ${getConfidenceColor(insight.confidence)}`, children: [Math.round(insight.confidence * 100), "% confidence"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2.5 mb-2", children: _jsx(motion.div, { animate: { width: `${insight.impact * 100}%` }, className: `h-2.5 rounded-full ${getImpactColor(insight.impact)}`, initial: { width: 0 }, transition: { duration: 0.5 } }) }), _jsx("p", { className: "text-sm text-gray-600", children: insight.description })] }, insight.factor))) })] }));
};
export default React.memo(MLFactorViz);
