import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
/**
 * BankrollPage integrates with the backend API to fetch and display transaction history.
 * All integration points are type-safe and robust, with error and loading handling.
 * API endpoint: GET /api/transactions
 */
const BankrollPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [timeframe, setTimeframe] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch transactions on mount
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('/api/transactions');
                setTransactions(res.data);
            }
            catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message || 'Failed to load transactions');
                }
                else if (err instanceof Error) {
                    setError(err.message);
                }
                else {
                    setError('Failed to load transactions');
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchTransactions();
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
    return (_jsx("main", { className: "section space-y-6 lg:space-y-8 animate-fade-in", children: _jsxs("div", { className: "modern-card p-6 lg:p-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold", children: "\uD83D\uDCB0 Bankroll Management" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { className: "modern-button", children: "Deposit" }), _jsx("button", { className: "modern-button bg-gray-500 hover:bg-gray-600", children: "Withdraw" })] })] }), loading ? (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400", children: "Loading..." })) : error ? (_jsx("div", { className: "text-center text-red-600", children: error })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Current Balance" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", currentBalance.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Profit/Loss" }), _jsxs("p", { className: `text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [profitLoss >= 0 ? '+' : '', profitLoss.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "ROI" }), _jsxs("p", { className: `text-2xl font-bold ${Number(roi) >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [Number(roi) >= 0 ? '+' : '', roi, "%"] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Active Bets" }), _jsx("p", { className: "text-2xl font-bold", children: "0" })] })] }), _jsxs("div", { className: "modern-card p-6 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "Balance History" }), _jsx("div", { className: "flex rounded-lg overflow-hidden", children: ['7d', '30d', '90d', 'all'].map(t => (_jsx("button", { className: `px-4 py-2 text-sm font-medium ${timeframe === t
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, onClick: () => setTimeframe(t), children: t === 'all' ? 'All Time' : t }, t))) })] }), _jsx("div", { className: "h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", children: "Chart Placeholder" })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Transaction History" }), _jsx("div", { className: "overflow-x-auto", children: transactions.length === 0 ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "No transactions available." })) : (_jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Description" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Balance" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: transactions.map(tx => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: new Date(tx.date).toLocaleString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `capitalize ${getTransactionColor(tx.type)}`, children: tx.type }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: getTransactionColor(tx.type), children: [tx.type === 'withdrawal' || tx.type === 'loss' ? '-' : '+', "$", Math.abs(tx.amount).toFixed(2)] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: tx.description }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap font-medium", children: ["$", tx.balance.toFixed(2)] })] }, tx.id))) })] })) })] })] }))] }) }));
};
export default React.memo(BankrollPage);
