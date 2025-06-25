import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
export const BookmakerAnalysis = ({ analysis, className = '', }) => {
    const getSuspiciousLevelColor = (level) => {
        if (level > 0.8)
            return 'text-red-500';
        if (level > 0.6)
            return 'text-orange-500';
        if (level > 0.4)
            return 'text-yellow-500';
        return 'text-green-500';
    };
    const getRiskScoreColor = (score) => {
        if (score > 0.8)
            return 'text-red-500';
        if (score > 0.6)
            return 'text-orange-500';
        if (score > 0.4)
            return 'text-yellow-500';
        return 'text-green-500';
    };
    return (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: `bg-gray-800 rounded-lg p-4 shadow-lg ${className}`, initial: { opacity: 0, y: 20 }, transition: { duration: 0.3 }, children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-white", children: "Bookmaker Analysis" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-gray-300", children: "Suspicious Level" }), _jsxs("span", { className: `font-bold ${getSuspiciousLevelColor(analysis.suspiciousLevel)}`, children: [Math.round(analysis.suspiciousLevel * 100), "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx(motion.div, { animate: { width: `${analysis.suspiciousLevel * 100}%` }, className: `h-full rounded-full ${getSuspiciousLevelColor(analysis.suspiciousLevel)}`, initial: { width: 0 }, transition: { duration: 0.5 } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-gray-300", children: "Adjusted Win Probability" }), _jsxs("span", { className: "text-blue-400 font-bold", children: [Math.round(analysis.adjustedProbability * 100), "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx(motion.div, { animate: { width: `${analysis.adjustedProbability * 100}%` }, className: "h-full rounded-full bg-blue-400", initial: { width: 0 }, transition: { duration: 0.5 } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-gray-300", children: "Risk Score" }), _jsxs("span", { className: `font-bold ${getRiskScoreColor(analysis.riskScore)}`, children: [Math.round(analysis.riskScore * 100), "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx(motion.div, { animate: { width: `${analysis.riskScore * 100}%` }, className: `h-full rounded-full ${getRiskScoreColor(analysis.riskScore)}`, initial: { width: 0 }, transition: { duration: 0.5 } }) })] }), analysis.warning && (_jsx(motion.div, { animate: { opacity: 1 }, className: "mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg", initial: { opacity: 0 }, transition: { delay: 0.3 }, children: _jsxs("div", { className: "flex items-start", children: [_jsx("svg", { className: "w-5 h-5 text-red-500 mr-2 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2" }) }), _jsx("p", { className: "text-red-100 text-sm", children: analysis.warning })] }) }))] })] }));
};
export default React.memo(BookmakerAnalysis);
