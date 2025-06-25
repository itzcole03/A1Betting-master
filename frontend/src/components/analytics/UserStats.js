import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
// Temporary static UserStats component to prevent infinite loop issues
// TODO: Restore dynamic functionality once store subscription issues are resolved
const UserStats = () => {
    // Static mock data to prevent store subscription issues
    const mockStats = {
        totalBets: 12,
        winRate: 83.3,
        totalProfitLoss: 1247.5,
        roi: 15.2,
    };
    return (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-blue-100/60 to-blue-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-blue-700 font-semibold mb-1", children: "Total Bets" }), _jsx("p", { className: "text-2xl font-extrabold text-blue-900", children: mockStats.totalBets })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-green-100/60 to-green-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-green-700 font-semibold mb-1", children: "Win Rate" }), _jsxs("p", { className: "text-2xl font-extrabold text-green-700", children: [mockStats.winRate, "%"] })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-yellow-100/60 to-yellow-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-yellow-700 font-semibold mb-1", children: "Profit/Loss" }), _jsxs("p", { className: `text-2xl font-extrabold ${mockStats.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`, children: ["$", mockStats.totalProfitLoss.toFixed(2)] })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-purple-100/60 to-purple-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-purple-700 font-semibold mb-1", children: "ROI" }), _jsxs("p", { className: "text-2xl font-extrabold text-purple-700", children: [mockStats.roi, "%"] })] })] }));
};
export default React.memo(UserStats);
