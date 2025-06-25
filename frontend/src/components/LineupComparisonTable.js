import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import { LineupType } from '@/types';
import { motion } from 'framer-motion';
const tableVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};
const rowVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
};
export const LineupComparisonTable = ({ lineups, onSelect, }) => {
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [typeFilter, setTypeFilter] = useState('all');
    const getTypeColor = (type) => {
        switch (type) {
            case LineupType.SINGLE:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
            case LineupType.TEASER:
                return 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400';
            case LineupType.PARLAY:
                return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
        }
    };
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const getSortIcon = (field) => {
        if (field !== sortField)
            return _jsx(FaSort, { className: "w-4 h-4 text-gray-400" });
        return sortDirection === 'asc' ? (_jsx(FaSortUp, { className: "w-4 h-4 text-primary-500" })) : (_jsx(FaSortDown, { className: "w-4 h-4 text-primary-500" }));
    };
    const filteredAndSortedLineups = useMemo(() => {
        let result = [...lineups];
        if (typeFilter !== 'all') {
            result = result.filter(lineup => lineup.type === typeFilter);
        }
        result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [lineups, typeFilter]);
    return (_jsxs(motion.div, { animate: "animate", className: "glass-morphism rounded-xl overflow-hidden", exit: "exit", initial: "initial", variants: tableVariants, children: [_jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(FaFilter, { className: "w-4 h-4 text-primary-500" }), _jsxs("select", { className: "bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm", value: typeFilter, onChange: e => setTypeFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: LineupType.SINGLE, children: "Single" }), _jsx("option", { value: LineupType.TEASER, children: "Teaser" }), _jsx("option", { value: LineupType.PARLAY, children: "Parlay" })] })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 dark:bg-gray-800/50", children: [_jsx("th", { className: "px-6 py-3 text-left cursor-pointer", onClick: () => handleSort('name'), children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { children: "Name" }), getSortIcon('name')] }) }), _jsx("th", { className: "px-6 py-3 text-left cursor-pointer", onClick: () => handleSort('type'), children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { children: "Type" }), getSortIcon('type')] }) }), _jsx("th", { className: "px-6 py-3 text-left cursor-pointer", onClick: () => handleSort('winProbability'), children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { children: "Win Probability" }), getSortIcon('winProbability')] }) }), _jsx("th", { className: "px-6 py-3 text-left cursor-pointer", onClick: () => handleSort('projectedPayout'), children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { children: "Projected Payout" }), getSortIcon('projectedPayout')] }) })] }) }), _jsx("tbody", { children: filteredAndSortedLineups.map((lineup, index) => (_jsxs(motion.tr, { animate: "animate", className: "border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors", custom: index, initial: "initial", variants: rowVariants, onClick: () => onSelect?.(lineup), children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: lineup.name }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(lineup.createdAt).toLocaleDateString() })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `font-medium ${getTypeColor(lineup.type)}`, children: lineup.type }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-sm font-medium", children: lineup.status }) })] }, lineup.id))) })] }) })] }));
};
