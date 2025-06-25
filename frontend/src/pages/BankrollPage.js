import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import Tooltip from '../components/ui/Tooltip';
const fetchTransactions = async () => {
    // Replace with real API call
    const res = await fetch('/api/transactions');
    if (!res.ok)
        throw new Error('Failed to fetch transactions');
    return res.json();
};
const fetchActiveBetsCount = async () => {
    // Replace with real API call
    const res = await fetch('/api/active-bets/count');
    if (!res.ok)
        throw new Error('Failed to fetch active bets count');
    const data = await res.json();
    return data.count;
};
const BankrollPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [activeBetsCount, setActiveBetsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('30d');
    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([fetchTransactions(), fetchActiveBetsCount()])
            .then(([txs, betsCount]) => {
            setTransactions(txs);
            setActiveBetsCount(betsCount);
            setLoading(false);
        })
            .catch((err) => {
            setError(err.message || 'Failed to load data');
            setLoading(false);
        });
    }, []);
    const currentBalance = transactions[transactions.length - 1]?.balance || 0;
    const initialBalance = transactions[0]?.balance || 0;
    const profitLoss = currentBalance - initialBalance;
    const roi = initialBalance !== 0 ? ((profitLoss / initialBalance) * 100).toFixed(2) : '0.00';
    const getTransactionColor = (type) => {
        switch (type) {
            case 'deposit':
                return 'text-blue-600 dark:text-blue-400';
            case 'withdrawal':
                return 'text-orange-600 dark:text-orange-400';
            case 'win':
                return 'text-green-600 dark:text-green-400';
            case 'loss':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    return (_jsxs("div", { className: "p-6 space-y-8 min-h-screen bg-gradient-to-br from-green-900/80 to-green-700/80 dark:from-gray-900 dark:to-gray-800 transition-colors", children: [_jsxs(GlassCard, { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-green-900 dark:text-green-100 mb-4", children: "Bankroll Overview" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx(Tooltip, { content: "Your current bankroll balance.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Current Balance" }) }), _jsxs("div", { className: "text-2xl font-bold text-primary-600", children: ["$", currentBalance.toLocaleString()] })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Your initial balance for this period.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Initial Balance" }) }), _jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["$", initialBalance.toLocaleString()] })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Your profit or loss for this period.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Profit / Loss" }) }), _jsxs("div", { className: `text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["$", profitLoss.toLocaleString()] })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Return on investment (ROI) for this period.", children: _jsx("div", { className: "text-xs text-gray-400", children: "ROI" }) }), _jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [roi, "%"] })] })] }), _jsxs("div", { className: "flex gap-4 mb-4", children: [_jsx(GlowButton, { onClick: () => setTimeframe('7d'), className: timeframe === '7d' ? 'bg-primary-500' : '', children: "7D" }), _jsx(GlowButton, { onClick: () => setTimeframe('30d'), className: timeframe === '30d' ? 'bg-primary-500' : '', children: "30D" }), _jsx(GlowButton, { onClick: () => setTimeframe('90d'), className: timeframe === '90d' ? 'bg-primary-500' : '', children: "90D" }), _jsx(GlowButton, { onClick: () => setTimeframe('all'), className: timeframe === 'all' ? 'bg-primary-500' : '', children: "All" })] })] }), _jsxs(GlassCard, { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Transaction History" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-gray-400", children: [_jsx("th", { children: "Date" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Balance" })] }) }), _jsx("tbody", { children: transactions.map((tx) => (_jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("td", { className: "py-2", children: tx.date }), _jsx("td", { className: `py-2 ${getTransactionColor(tx.type)}`, children: tx.type }), _jsxs("td", { className: "py-2", children: ["$", tx.amount.toLocaleString()] }), _jsx("td", { className: "py-2", children: tx.description }), _jsxs("td", { className: "py-2", children: ["$", tx.balance.toLocaleString()] })] }, tx.id))) })] }) })] })] }));
};
export default BankrollPage;
