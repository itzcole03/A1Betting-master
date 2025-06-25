import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// BankrollTracker.tsx
// Visualizes the user's current bankroll, profit/loss, and stats
import React from 'react';
import { useBankrollStore } from '../../store/slices/bankrollSlice';
export const BankrollTracker = () => {
    const stats = useBankrollStore((s) => s.stats);
    const refreshStats = useBankrollStore((s) => s.refreshStats);
    React.useEffect(() => {
        refreshStats();
    }, [refreshStats]);
    return (_jsx("section", { className: "w-full p-4 bg-white shadow rounded mb-4 flex flex-col md:flex-row md:items-center md:justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-lg font-bold mb-2", children: "Bankroll Tracker" }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [_jsxs("div", { children: ["Current Balance: ", _jsxs("b", { children: ["$", stats.currentBalance.toFixed(2)] })] }), _jsxs("div", { children: ["Net Profit: ", _jsxs("b", { className: stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600', children: ["$", stats.netProfit.toFixed(2)] })] }), _jsxs("div", { children: ["ROI: ", _jsxs("b", { children: [(stats.roi * 100).toFixed(2), "%"] })] }), _jsxs("div", { children: ["Win Rate: ", _jsxs("b", { children: [(stats.winRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: ["Largest Win: ", _jsxs("b", { children: ["$", stats.largestWin.toFixed(2)] })] }), _jsxs("div", { children: ["Largest Loss: ", _jsxs("b", { children: ["$", stats.largestLoss.toFixed(2)] })] })] })] }) }));
};
