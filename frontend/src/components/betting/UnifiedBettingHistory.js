import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { Card, Button, Input, Select, Spinner, Toast, Badge, Modal } from '../ui/UnifiedUI';
export const UnifiedBettingHistory = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const analyticsService = serviceRegistry.getService('analytics');
    const stateService = serviceRegistry.getService('state');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    // State
    const [bets, setBets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [filters, setFilters] = useState({
        dateRange: 'month',
        status: 'all',
        marketType: 'all',
        minOdds: 0,
        maxOdds: 100,
        minStake: 0,
        maxStake: 1000000,
        searchQuery: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedBet, setSelectedBet] = useState(null);
    const [showBetDetails, setShowBetDetails] = useState(false);
    // Load betting history
    useEffect(() => {
        loadBettingHistory();
    }, [filters]);
    const loadBettingHistory = async () => {
        try {
            setLoading(true);
            const [betsData, statsData] = await Promise.all([
                analyticsService.getBettingHistory(filters),
                analyticsService.getBettingStats(filters),
            ]);
            setBets(betsData);
            setStats(statsData);
        }
        catch (error) {
            handleError('Failed to load betting history', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const resetFilters = () => {
        setFilters({
            dateRange: 'month',
            status: 'all',
            marketType: 'all',
            minOdds: 0,
            maxOdds: 100,
            minStake: 0,
            maxStake: 1000000,
            searchQuery: '',
        });
    };
    const handleError = (message, error) => {
        setError(message);
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'BETTING_HISTORY_ERROR',
            source: 'UnifiedBettingHistory',
            details: { message },
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const formatPercentage = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value / 100);
    };
    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            won: 'success',
            lost: 'danger',
            cancelled: 'secondary',
        };
        return _jsx(Badge, { variant: variants[status], children: status.toUpperCase() });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Spinner, { size: "large" }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Betting History" }), _jsx(Button, { variant: "secondary", onClick: () => setShowFilters(!showFilters), children: showFilters ? 'Hide Filters' : 'Show Filters' })] }), stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Performance" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Win Rate" }), _jsx("span", { className: "font-medium", children: formatPercentage(stats.winRate) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "ROI" }), _jsx("span", { className: `font-medium ${stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatPercentage(stats.roi) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Current Streak" }), _jsx("span", { className: "font-medium", children: stats.currentStreak })] })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Bets" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total Bets" }), _jsx("span", { className: "font-medium", children: stats.totalBets })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Won" }), _jsx("span", { className: "font-medium text-green-600", children: stats.wonBets })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Lost" }), _jsx("span", { className: "font-medium text-red-600", children: stats.lostBets })] })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Stakes & Returns" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total Stake" }), _jsx("span", { className: "font-medium", children: formatCurrency(stats.totalStake) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total Profit" }), _jsx("span", { className: `font-medium ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`, children: formatCurrency(stats.totalProfit) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Average Odds" }), _jsx("span", { className: "font-medium", children: stats.averageOdds.toFixed(2) })] })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Best & Worst" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Best Win" }), _jsx("span", { className: "font-medium text-green-600", children: formatCurrency(stats.bestWin) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Worst Loss" }), _jsx("span", { className: "font-medium text-red-600", children: formatCurrency(stats.worstLoss) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Best Streak" }), _jsx("span", { className: "font-medium", children: stats.bestStreak })] })] })] })] })), showFilters && (_jsxs(Card, { className: "mb-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Date Range" }), _jsx(Select, { options: [
                                                    { value: 'day', label: 'Today' },
                                                    { value: 'week', label: 'This Week' },
                                                    { value: 'month', label: 'This Month' },
                                                    { value: 'year', label: 'This Year' },
                                                    { value: 'all', label: 'All Time' },
                                                ], value: filters.dateRange, onChange: e => handleFilterChange('dateRange', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Status" }), _jsx(Select, { options: [
                                                    { value: 'all', label: 'All' },
                                                    { value: 'pending', label: 'Pending' },
                                                    { value: 'won', label: 'Won' },
                                                    { value: 'lost', label: 'Lost' },
                                                    { value: 'cancelled', label: 'Cancelled' },
                                                ], value: filters.status, onChange: e => handleFilterChange('status', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Market Type" }), _jsx(Select, { options: [
                                                    { value: 'all', label: 'All Markets' },
                                                    { value: 'match_winner', label: 'Match Winner' },
                                                    { value: 'over_under', label: 'Over/Under' },
                                                    { value: 'both_teams_to_score', label: 'Both Teams to Score' },
                                                    // Add more market types
                                                ], value: filters.marketType, onChange: e => handleFilterChange('marketType', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Search" }), _jsx(Input, { placeholder: "Search bets...", type: "text", value: filters.searchQuery, onChange: e => handleFilterChange('searchQuery', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Min Odds" }), _jsx(Input, { min: "0", step: "0.01", type: "number", value: filters.minOdds, onChange: e => handleFilterChange('minOdds', parseFloat(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Max Odds" }), _jsx(Input, { min: "0", step: "0.01", type: "number", value: filters.maxOdds, onChange: e => handleFilterChange('maxOdds', parseFloat(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Min Stake" }), _jsx(Input, { min: "0", step: "0.01", type: "number", value: filters.minStake, onChange: e => handleFilterChange('minStake', parseFloat(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Max Stake" }), _jsx(Input, { min: "0", step: "0.01", type: "number", value: filters.maxStake, onChange: e => handleFilterChange('maxStake', parseFloat(e.target.value)) })] })] }), _jsxs("div", { className: "flex justify-end mt-4", children: [_jsx(Button, { className: "mr-4", variant: "secondary", onClick: resetFilters, children: "Reset Filters" }), _jsx(Button, { variant: "primary", onClick: loadBettingHistory, children: "Apply Filters" })] })] })), _jsx(Card, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Event" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Market" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Selection" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Odds" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Stake" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Potential Return" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Placed" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700", children: bets.map(bet => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: bet.eventName }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: bet.marketType }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900 dark:text-white", children: bet.selection }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900 dark:text-white", children: bet.odds.toFixed(2) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900 dark:text-white", children: formatCurrency(bet.stake) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900 dark:text-white", children: formatCurrency(bet.potentialReturn) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(bet.status) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: new Date(bet.placedAt).toLocaleString() }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsx(Button, { size: "small", variant: "secondary", onClick: () => {
                                                            setSelectedBet(bet);
                                                            setShowBetDetails(true);
                                                        }, children: "Details" }) })] }, bet.id))) })] }) }) })] }), _jsx(Modal, { isOpen: showBetDetails, title: "Bet Details", onClose: () => setShowBetDetails(false), children: selectedBet && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Event Details" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: selectedBet.eventName })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Bet Details" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Market Type" }), _jsx("span", { children: selectedBet.marketType })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Selection" }), _jsx("span", { children: selectedBet.selection })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Odds" }), _jsx("span", { children: selectedBet.odds.toFixed(2) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Stake" }), _jsx("span", { children: formatCurrency(selectedBet.stake) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Potential Return" }), _jsx("span", { children: formatCurrency(selectedBet.potentialReturn) })] })] })] }), selectedBet.result && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Result" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Outcome" }), _jsx("span", { children: selectedBet.result.outcome })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Profit/Loss" }), _jsx("span", { className: selectedBet.result.profit >= 0 ? 'text-green-600' : 'text-red-600', children: formatCurrency(selectedBet.result.profit) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "ROI" }), _jsx("span", { className: selectedBet.result.roi >= 0 ? 'text-green-600' : 'text-red-600', children: formatPercentage(selectedBet.result.roi) })] })] })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Timeline" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Placed At" }), _jsx("span", { children: new Date(selectedBet.placedAt).toLocaleString() })] }), selectedBet.settledAt && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Settled At" }), _jsx("span", { children: new Date(selectedBet.settledAt).toLocaleString() })] }))] })] })] })) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
