import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const ArbitrageDetector = ({ data }) => {
    if (!data) {
        return _jsx("div", { className: "p-4 text-gray-500", children: "Waiting for market data..." });
    }
    // Simple arbitrage detection logic (to be expanded)
    const opportunities = Object.entries(data.odds).filter(([_, value]) => {
        if (typeof value === 'object' && value !== null) {
            const odds = Object.values(value);
            if (odds.length > 1) {
                const validOdds = odds.filter((odd) => typeof odd === 'number');
                return validOdds.length > 1 && Math.max(...validOdds) - Math.min(...validOdds) > 0.15;
            }
        }
        return false;
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Arbitrage Opportunities" }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [opportunities.map(([key, value], index) => (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg p-4 shadow-sm", initial: { opacity: 0, y: 20 }, transition: { delay: index * 0.1 }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-medium", children: key }), _jsx("span", { className: "text-lg font-bold text-green-600", children: typeof value === 'object' && value !== null
                                            ? (() => {
                                                const odds = Object.values(value).filter((odd) => typeof odd === 'number');
                                                return odds.length > 1
                                                    ? `${((Math.max(...odds) - Math.min(...odds)) * 100).toFixed(1)}% spread`
                                                    : 'N/A';
                                            })()
                                            : 'N/A' })] }), typeof value === 'object' && value !== null && (_jsx("div", { className: "mt-2 text-sm text-gray-600", children: Object.entries(value).map(([book, odds]) => (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: book }), _jsx("span", { children: typeof odds === 'number' ? odds.toFixed(2) : 'N/A' })] }, book))) }))] }, key))), opportunities.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No arbitrage opportunities found" }))] })] }));
};
export default React.memo(ArbitrageDetector);
