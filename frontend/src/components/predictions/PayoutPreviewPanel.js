import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const PayoutPreviewPanel = ({ prediction, stake }) => {
    const [customStake, setCustomStake] = useState(stake);
    const calculatePayout = (stakeAmount) => {
        return stakeAmount * prediction.odds;
    };
    const calculateProfit = (stakeAmount) => {
        return calculatePayout(stakeAmount) - stakeAmount;
    };
    const handleStakeChange = (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setCustomStake(value);
        }
    };
    return (_jsxs("div", { className: "modern-card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20", children: [_jsx("h4", { className: "font-medium mb-4", children: "Payout Preview" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium", htmlFor: "stake", children: "Stake Amount" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500", id: "stake", min: "0", step: "0.01", type: "number", value: customStake, onChange: handleStakeChange }), _jsx("span", { className: "text-sm text-gray-500", children: "%" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Potential Payout" }), _jsxs("p", { className: "text-lg font-semibold text-green-600 dark:text-green-400", children: ["$", calculatePayout(customStake).toFixed(2)] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Potential Profit" }), _jsxs("p", { className: "text-lg font-semibold text-blue-600 dark:text-blue-400", children: ["$", calculateProfit(customStake).toFixed(2)] })] })] }), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("p", { children: ["Odds: ", prediction.odds.toFixed(2)] }), _jsxs("p", { children: ["Risk Level: ", prediction.riskLevel] })] })] })] }));
};
export default React.memo(PayoutPreviewPanel);
