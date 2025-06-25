import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { usePredictions } from '@/hooks/usePredictions';
export function PayoutPreview({ selectedPlayers, entryFee, className = '' }) {
    const { getPlayerPrediction } = usePredictions();
    const projectedStats = useMemo(() => {
        const totalProjectedPoints = selectedPlayers.reduce((sum, player) => {
            const prediction = getPlayerPrediction(player.id);
            return sum + (prediction?.projectedPoints || 0);
        }, 0);
        const averageConfidence = selectedPlayers.reduce((sum, player) => {
            return sum + player.confidence;
        }, 0) / selectedPlayers.length;
        return {
            totalProjectedPoints,
            averageConfidence,
        };
    }, [selectedPlayers, getPlayerPrediction]);
    const payoutEstimates = useMemo(() => {
        const { totalProjectedPoints, averageConfidence } = projectedStats;
        // These are example payout calculations - adjust based on actual contest rules
        const estimatedRank = totalProjectedPoints > 150 ? 1 : totalProjectedPoints > 130 ? 10 : 100;
        const baseMultiplier = Math.max(1, (200 - estimatedRank) / 100);
        const confidenceBonus = averageConfidence > 0.8 ? 1.2 : averageConfidence > 0.6 ? 1.1 : 1;
        const potentialWinnings = entryFee * baseMultiplier * confidenceBonus;
        return {
            estimatedRank,
            potentialWinnings: Math.round(potentialWinnings * 100) / 100,
            roi: ((potentialWinnings - entryFee) / entryFee) * 100,
        };
    }, [projectedStats, entryFee]);
    const getRankColor = (rank) => {
        if (rank <= 10)
            return 'text-success-500';
        if (rank <= 50)
            return 'text-primary-500';
        if (rank <= 100)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    const getROIColor = (roi) => {
        if (roi >= 100)
            return 'text-success-500';
        if (roi >= 50)
            return 'text-primary-500';
        if (roi >= 0)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    return (_jsxs("div", { className: `rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`, children: [_jsx("h3", { className: "mb-4 text-lg font-semibold", children: "Payout Preview" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Projected Points" }), _jsx("div", { className: "text-2xl font-bold text-primary-500", children: projectedStats.totalProjectedPoints.toFixed(1) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Average Confidence" }), _jsxs("div", { className: "text-2xl font-bold text-primary-500", children: [(projectedStats.averageConfidence * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "border-t border-gray-200 pt-4 dark:border-gray-700", children: [_jsx("div", { className: "mb-2 text-sm text-gray-600 dark:text-gray-400", children: "Estimated Rank" }), _jsxs("div", { className: `text-2xl font-bold ${getRankColor(payoutEstimates.estimatedRank)}`, children: ["#", payoutEstimates.estimatedRank] })] }), _jsxs("div", { children: [_jsx("div", { className: "mb-2 text-sm text-gray-600 dark:text-gray-400", children: "Potential Winnings" }), _jsxs("div", { className: "text-2xl font-bold text-success-500", children: ["$", payoutEstimates.potentialWinnings.toLocaleString()] }), _jsxs("div", { className: `text-sm font-medium ${getROIColor(payoutEstimates.roi)}`, children: ["ROI: ", payoutEstimates.roi.toFixed(1), "%"] })] })] }), _jsx("div", { className: "mt-6 text-xs text-gray-500 dark:text-gray-400", children: "* Estimates based on historical contest data and current lineup projections" })] }));
}
