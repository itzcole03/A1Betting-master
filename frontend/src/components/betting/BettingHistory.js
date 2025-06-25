import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, Badge, Icon, Spinner } from '../ui/UnifiedUI.js';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry.js';
export const BettingHistory = ({ eventId, marketId, selectionId, className = '', }) => {
    const [bets, setBets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const bettingService = serviceRegistry.getService('betting');
    useEffect(() => {
        const loadBets = async () => {
            try {
                setIsLoading(true);
                setError(null);
                if (!bettingService) {
                    setError('Betting service unavailable');
                    setBets([]);
                    return;
                }
                const history = await bettingService.getBettingHistory(eventId, marketId, selectionId);
                setBets(history);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load betting history');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadBets();
    }, [eventId, marketId, selectionId, bettingService]);
    const getOutcomeColor = (outcome) => {
        switch (outcome) {
            case 'won':
                return 'text-green-500';
            case 'lost':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };
    const getOutcomeIcon = (outcome) => {
        switch (outcome) {
            case 'won':
                return 'check-circle';
            case 'lost':
                return 'x-circle';
            default:
                return 'clock';
        }
    };
    if (isLoading) {
        return (_jsx(Card, { className: `p-6 ${className}`, children: _jsx("div", { className: "flex justify-center items-center h-32", children: _jsx(Spinner, { size: "large" }) }) }));
    }
    if (error) {
        return (_jsx(Card, { className: `p-6 ${className}`, children: _jsxs("div", { className: "text-red-500 text-center", children: [_jsx(Icon, { className: "w-8 h-8 mx-auto mb-2", name: "exclamation-circle" }), _jsx("p", { children: error })] }) }));
    }
    if (bets.length === 0) {
        return (_jsx(Card, { className: `p-6 ${className}`, children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx(Icon, { className: "w-8 h-8 mx-auto mb-2", name: "document-text" }), _jsx("p", { children: "No betting history available" })] }) }));
    }
    return (_jsxs(Card, { className: `p-6 ${className}`, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Betting History" }), _jsx("div", { className: "space-y-4", children: bets.map(bet => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", role: "listitem", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Icon, { "aria-label": `Outcome: ${bet.outcome}`, className: `w-6 h-6 ${getOutcomeColor(bet.outcome)}`, name: getOutcomeIcon(bet.outcome) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: bet.marketName }), _jsx("p", { className: "text-sm text-gray-600", children: new Date(bet.timestamp).toLocaleString() })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: bet.outcome === 'won'
                                                ? 'success'
                                                : bet.outcome === 'lost'
                                                    ? 'danger'
                                                    : 'info', children: bet.outcome }), _jsxs("p", { className: `font-semibold ${getOutcomeColor(bet.outcome)}`, children: [bet.outcome === 'won' ? '+' : bet.outcome === 'lost' ? '-' : '', bet.stake.toFixed(2)] })] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Odds: ", bet.odds.toFixed(2)] })] })] }, bet.id))) }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Bets" }), _jsx("p", { className: "text-lg font-semibold", children: bets.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Win Rate" }), _jsxs("p", { className: "text-lg font-semibold", children: [((bets.filter(b => b.outcome === 'won').length / bets.length) * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Profit/Loss" }), _jsx("p", { className: "text-lg font-semibold", children: bets
                                        .reduce((acc, bet) => {
                                        if (bet.outcome === 'won')
                                            return acc + (bet.stake * bet.odds - bet.stake);
                                        if (bet.outcome === 'lost')
                                            return acc - bet.stake;
                                        return acc;
                                    }, 0)
                                        .toFixed(2) })] })] }) })] }));
};
