import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
const fetchOpportunities = async () => {
    // Replace with real API call
    const res = await fetch('/api/arbitrage-opportunities');
    if (!res.ok)
        throw new Error('Failed to fetch arbitrage opportunities');
    return res.json();
};
const ArbitragePage = () => {
    const [minProfit, setMinProfit] = useState(10);
    const [selectedSports, setSelectedSports] = useState(['NBA', 'NFL', 'MLB']);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchOpportunities()
            .then((data) => {
            setOpportunities(data);
            setLoading(false);
        })
            .catch((err) => {
            setError(err.message || 'Failed to load data');
            setLoading(false);
        });
    }, []);
    const filteredOpportunities = opportunities.filter((opp) => opp.profit >= minProfit && selectedSports.includes(opp.sport));
    return (_jsx("div", { className: "p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold", children: "\uD83D\uDD04 Arbitrage Finder" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Min Profit $" }), _jsx("input", { className: "modern-input w-24", min: "0", step: "5", type: "number", value: minProfit, onChange: (e) => setMinProfit(Number(e.target.value)) })] }), _jsx("div", { className: "flex rounded-lg overflow-hidden", children: ['NBA', 'NFL', 'MLB'].map(sport => (_jsx("button", { className: `px-4 py-2 text-sm font-medium ${selectedSports.includes(sport)
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, onClick: () => setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]), children: sport }, sport))) })] })] }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "text-center py-12 text-gray-500 dark:text-gray-400", children: "Loading..." })) : error ? (_jsx("div", { className: "text-center py-12 text-red-600 dark:text-red-400", children: error })) : filteredOpportunities.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500 dark:text-gray-400", children: "No arbitrage opportunities available." })) : (filteredOpportunities.map((opp) => (_jsxs(GlassCard, { className: "p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: opp.event }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [opp.sport, " \u2022 ", opp.market] })] }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Profit" }), _jsxs("p", { className: "text-lg font-bold text-green-600", children: ["$", opp.profit.toFixed(2)] }), _jsxs("p", { className: "text-xs text-green-600", children: ["(", opp.profitPercentage.toFixed(2), "%)"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Expires" }), _jsx("p", { className: "text-sm", children: new Date(opp.expiresAt).toLocaleTimeString() })] })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs(GlassCard, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "font-medium", children: opp.bookmaker1.name }), _jsx("span", { className: "text-lg font-bold", children: opp.bookmaker1.odds })] }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Stake: $", opp.bookmaker1.stake.toFixed(2)] })] }), _jsxs(GlassCard, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "font-medium", children: opp.bookmaker2.name }), _jsx("span", { className: "text-lg font-bold", children: opp.bookmaker2.odds })] }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Stake: $", opp.bookmaker2.stake.toFixed(2)] })] })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx(GlowButton, { children: "Place Bets" }) })] }, opp.id)))) })] }) }));
};
export default ArbitragePage;
