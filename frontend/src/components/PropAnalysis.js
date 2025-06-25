import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmakerAnalysis } from './BookmakerAnalysis';
import { useBookmakerAnalysis } from '../hooks/useBookmakerAnalysis';
export const PropAnalysis = ({ playerId, playerName, propType, projectedValue, tag, currentOdds, historicalAverage, className = '', }) => {
    const { isLoading, error, analysis, refreshAnalysis } = useBookmakerAnalysis({
        playerId,
        propType,
        projectedValue,
        tag,
        currentOdds,
        historicalAverage,
    });
    const getTagIcon = (tag) => {
        switch (tag) {
            case 'demon':
                return (_jsx("svg", { className: "w-6 h-6 text-red-500", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", fillRule: "evenodd" }) }));
            case 'goblin':
                return (_jsx("svg", { className: "w-6 h-6 text-green-500", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", fillRule: "evenodd" }) }));
            default:
                return (_jsx("svg", { className: "w-6 h-6 text-gray-500", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z", fillRule: "evenodd" }) }));
        }
    };
    return (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: `bg-gray-900 rounded-xl p-6 shadow-xl ${className}`, initial: { opacity: 0, y: 20 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: playerName }), _jsx("p", { className: "text-gray-400", children: propType })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [getTagIcon(tag), _jsx("span", { className: "text-lg font-semibold text-white", children: projectedValue })] })] }), _jsx(AnimatePresence, { mode: "wait", children: isLoading ? (_jsx(motion.div, { animate: { opacity: 1 }, className: "flex justify-center py-8", exit: { opacity: 0 }, initial: { opacity: 0 }, children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-white" }) }, "loading")) : error ? (_jsxs(motion.div, { animate: { opacity: 1 }, className: "bg-red-900/50 border border-red-500/50 rounded-lg p-4", exit: { opacity: 0 }, initial: { opacity: 0 }, children: [_jsx("p", { className: "text-red-100", children: error }), _jsx("button", { className: "mt-2 text-red-300 hover:text-red-100 text-sm", onClick: refreshAnalysis, children: "Try Again" })] }, "error")) : analysis ? (_jsxs(motion.div, { animate: { opacity: 1 }, exit: { opacity: 0 }, initial: { opacity: 0 }, children: [_jsx(BookmakerAnalysis, { analysis: analysis }), _jsxs("div", { className: "mt-6 p-4 bg-gray-800/50 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Historical Stats" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Average" }), _jsx("p", { className: "text-xl font-bold text-white", children: historicalAverage.toFixed(1) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400", children: "Current Odds" }), _jsx("p", { className: "text-xl font-bold text-white", children: currentOdds.toFixed(2) })] })] })] }), _jsx("button", { className: "mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors", onClick: refreshAnalysis, children: "Refresh Analysis" })] }, "analysis")) : null })] }));
};
export default React.memo(PropAnalysis);
