import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { FaCalculator, FaExchangeAlt, FaClock, FaChartLine } from 'react-icons/fa';
import { UnifiedInput } from './base/UnifiedInput';
import { calculateArbitrage, formatCurrency, formatPercentage } from '../utils/odds';
import { motion } from 'framer-motion';
const Arbitrage = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [stake, setStake] = useState(1000);
    const [calculatorOdds, setCalculatorOdds] = useState({
        book1: -110,
        book2: +100,
    });
    useEffect(() => {
        // Simulate fetching arbitrage opportunities
        const mockOpportunities = [
            {
                id: '1',
                sport: 'NBA',
                player: {
                    id: '1',
                    name: 'LeBron James',
                    team: {
                        id: '1',
                        name: 'Los Angeles Lakers',
                        abbreviation: 'LAL',
                        sport: 'NBA',
                        colors: {
                            primary: '#552583',
                            secondary: '#FDB927',
                        },
                    },
                    position: 'SF',
                    imageUrl: 'https://example.com/lebron.jpg',
                    stats: {},
                    form: 85,
                },
                propType: 'points',
                books: [
                    { name: 'DraftKings', odds: -110, line: 26.5 },
                    { name: 'FanDuel', odds: +120, line: 26.5 },
                ],
                potentialProfit: 45.23,
                expiresAt: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
            },
            // Add more mock opportunities
        ];
        setOpportunities(mockOpportunities);
    }, []);
    const handleCalculatorChange = (book, value) => {
        setCalculatorOdds(prev => ({
            ...prev,
            [book]: parseInt(value) || 0,
        }));
    };
    const calculateOptimalStakes = () => {
        const result = calculateArbitrage(calculatorOdds.book1, calculatorOdds.book2, stake);
        return result;
    };
    const getTimeRemaining = (expiresAt) => {
        const remaining = new Date(expiresAt).getTime() - Date.now();
        const minutes = Math.floor(remaining / 60000);
        return `${minutes}m`;
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaCalculator, { className: "w-5 h-5 mr-2 text-primary-500" }), "Arbitrage Calculator"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx("div", { children: _jsx(UnifiedInput, { label: "Book 1 Odds", placeholder: "-110", type: "number", value: calculatorOdds.book1, onChange: e => handleCalculatorChange('book1', e.target.value) }) }), _jsx("div", { children: _jsx(UnifiedInput, { label: "Book 2 Odds", placeholder: "+100", type: "number", value: calculatorOdds.book2, onChange: e => handleCalculatorChange('book2', e.target.value) }) }), _jsx("div", { children: _jsx(UnifiedInput, { label: "Total Stake", placeholder: "1000", type: "number", value: stake, onChange: e => setStake(Number(e.target.value)) }) })] }), _jsx("div", { className: "mt-4", children: (() => {
                            const result = calculateOptimalStakes();
                            if (result) {
                                return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Book 1 Stake" }), _jsx("p", { className: "text-lg font-bold text-primary-500", children: formatCurrency(result.split[0]) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Book 2 Stake" }), _jsx("p", { className: "text-lg font-bold text-primary-500", children: formatCurrency(result.split[1]) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Guaranteed Profit" }), _jsx("p", { className: "text-lg font-bold text-green-500", children: formatCurrency(result.profit) })] })] }));
                            }
                            return (_jsx("p", { className: "text-sm text-red-500", children: "No arbitrage opportunity found with these odds" }));
                        })() })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.2 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaExchangeAlt, { className: "w-5 h-5 mr-2 text-primary-500" }), "Live Arbitrage Opportunities"] }), _jsx("div", { className: "space-y-4", children: opportunities.map(opp => (_jsxs(motion.div, { animate: { opacity: 1, x: 0 }, className: "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow", initial: { opacity: 0, x: -20 }, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-medium", children: opp.player.name }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: opp.player.team.abbreviation }), _jsx("span", { className: "text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded", children: opp.propType })] }), _jsx("div", { className: "mt-2 grid grid-cols-2 gap-4", children: opp.books.map(book => (_jsxs("div", { className: "text-sm", children: [_jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [book.name, ":"] }), _jsxs("span", { className: "ml-1 font-medium", children: [book.line, " @ ", book.odds > 0 ? '+' : '', book.odds] })] }, book.name))) })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaClock, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: getTimeRemaining(opp.expiresAt) })] }), _jsxs("div", { className: "mt-2", children: [_jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Potential Profit" }), _jsx("p", { className: "text-lg font-bold text-green-500", children: formatCurrency(opp.potentialProfit) })] })] })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx("button", { className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition", onClick: () => {
                                            // Handle execution
                                        }, children: "Execute Trade" }) })] }, opp.id))) })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "grid grid-cols-1 md:grid-cols-3 gap-6", initial: { opacity: 0, y: 20 }, transition: { delay: 0.4 }, children: [_jsxs("div", { className: "glass-morphism p-6 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Total Profit (30d)" }), _jsx(FaChartLine, { className: "w-5 h-5 text-green-500" })] }), _jsx("p", { className: "text-2xl font-bold text-green-500 mt-2", children: formatCurrency(12450) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "From 45 executed trades" })] }), _jsxs("div", { className: "glass-morphism p-6 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Average ROI" }), _jsx(FaChartLine, { className: "w-5 h-5 text-primary-500" })] }), _jsx("p", { className: "text-2xl font-bold text-primary-500 mt-2", children: formatPercentage(0.0845) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Per trade average" })] }), _jsxs("div", { className: "glass-morphism p-6 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Success Rate" }), _jsx(FaChartLine, { className: "w-5 h-5 text-primary-500" })] }), _jsx("p", { className: "text-2xl font-bold text-primary-500 mt-2", children: formatPercentage(0.982) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Based on 250 trades" })] })] })] }));
};
export default React.memo(Arbitrage);
