import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const LiveOddsTicker = ({ data, className = '' }) => {
    if (!data || Object.keys(data).length === 0) {
        return _jsx("div", { className: `p-4 text-gray-500 ${className}`, children: "No live odds available" });
    }
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Live Odds" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: Object.entries(data).map(([market, bookOdds], index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg p-4 shadow-sm", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsx("div", { className: "flex justify-between items-center mb-2", children: _jsx("span", { className: "font-medium", children: market }) }), _jsx("div", { className: "space-y-1", children: Object.entries(bookOdds).map(([bookmaker, odds]) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: bookmaker }), _jsx("span", { className: "font-medium", children: odds.toFixed(2) })] }, bookmaker))) })] }, market))) })] }));
};
export default React.memo(LiveOddsTicker);
