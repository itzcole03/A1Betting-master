import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Grid, TextField, MenuItem, Box, IconButton, Tooltip, } from '@mui/material';
import { Sort as SortIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, } from '@mui/icons-material';
import { BettingOpportunity } from './BettingOpportunity'; // Remove .tsx extension for correct import
export const OpportunitiesList = ({ opportunities, onPlaceBet, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('edge');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType, setFilterType] = useState('all');
    const [minEdge, setMinEdge] = useState(0);
    const [minConfidence, setMinConfidence] = useState(0);
    const filteredAndSortedOpportunities = useMemo(() => {
        let filtered = opportunities;
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(opp => opp.event.homeTeam.toLowerCase().includes(searchLower) ||
                opp.event.awayTeam.toLowerCase().includes(searchLower) ||
                opp.selection.toLowerCase().includes(searchLower) ||
                opp.market.toLowerCase().includes(searchLower));
        }
        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(opp => {
                switch (filterType) {
                    case 'value':
                        return opp.edge > 0;
                    case 'arbitrage':
                        return !!opp.arbitrage;
                    case 'sentiment':
                        return !!opp.sentiment;
                    case 'statistical':
                        return !!opp.stats;
                    default:
                        return true;
                }
            });
        }
        // Apply edge and confidence filters
        filtered = filtered.filter(opp => opp.edge >= minEdge && opp.confidence >= minConfidence);
        // Apply sorting
        return filtered.sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            const aValue = a[sortField];
            const bValue = b[sortField];
            return (aValue - bValue) * multiplier;
        });
    }, [opportunities, searchTerm, sortField, sortOrder, filterType, minEdge, minConfidence]);
    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortOrder('desc');
        }
    };
    const getSortIcon = (field) => {
        if (field !== sortField)
            return null;
        return sortOrder === 'asc' ? _jsx(TrendingUpIcon, {}) : _jsx(TrendingDownIcon, {});
    };
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Betting Opportunities" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, md: 4, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Search", size: "small", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsx(Grid, { item: true, md: 4, xs: 12, children: _jsxs(TextField, { fullWidth: true, select: true, label: "Filter Type", size: "small", value: filterType, onChange: (e) => setFilterType(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Opportunities" }), _jsx(MenuItem, { value: "value", children: "Value Bets" }), _jsx(MenuItem, { value: "arbitrage", children: "Arbitrage" }), _jsx(MenuItem, { value: "sentiment", children: "Sentiment Based" }), _jsx(MenuItem, { value: "statistical", children: "Statistical" })] }) }), _jsx(Grid, { item: true, md: 4, xs: 12, children: _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(TextField, { fullWidth: true, label: "Min Edge %", size: "small", type: "number", value: minEdge, onChange: (e) => setMinEdge(Number(e.target.value)) }), _jsx(TextField, { fullWidth: true, label: "Min Confidence", size: "small", type: "number", value: minConfidence, onChange: (e) => setMinConfidence(Number(e.target.value)) })] }) })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 3, children: _jsx(Box, { alignItems: "center", display: "flex", gap: 1, children: _jsx(Typography, { variant: "subtitle2", children: "Event" }) }) }), _jsx(Grid, { item: true, xs: 2, children: _jsx(Box, { alignItems: "center", display: "flex", gap: 1, children: _jsx(Typography, { variant: "subtitle2", children: "Market" }) }) }), _jsx(Grid, { item: true, xs: 1, children: _jsx(Tooltip, { title: "Sort by Edge", children: _jsxs(IconButton, { size: "small", onClick: () => handleSort('edge'), children: [_jsx(SortIcon, {}), getSortIcon('edge')] }) }) }), _jsx(Grid, { item: true, xs: 1, children: _jsx(Tooltip, { title: "Sort by Confidence", children: _jsxs(IconButton, { size: "small", onClick: () => handleSort('confidence'), children: [_jsx(SortIcon, {}), getSortIcon('confidence')] }) }) }), _jsx(Grid, { item: true, xs: 1, children: _jsx(Tooltip, { title: "Sort by Odds", children: _jsxs(IconButton, { size: "small", onClick: () => handleSort('odds'), children: [_jsx(SortIcon, {}), getSortIcon('odds')] }) }) }), _jsx(Grid, { item: true, xs: 1, children: _jsx(Tooltip, { title: "Sort by Volume", children: _jsxs(IconButton, { size: "small", onClick: () => handleSort('volume'), children: [_jsx(SortIcon, {}), getSortIcon('volume')] }) }) }), _jsx(Grid, { item: true, xs: 1, children: _jsx(Tooltip, { title: "Sort by Probability", children: _jsxs(IconButton, { size: "small", onClick: () => handleSort('probability'), children: [_jsx(SortIcon, {}), getSortIcon('probability')] }) }) }), _jsx(Grid, { item: true, xs: 2, children: _jsx(Typography, { variant: "subtitle2", children: "Actions" }) })] }), _jsxs(Grid, { container: true, spacing: 2, children: [filteredAndSortedOpportunities.map(opportunity => (_jsx(Grid, { item: true, xs: 12, children: _jsx(BettingOpportunity, { opportunity: opportunity, onPlaceBet: onPlaceBet }) }, opportunity.id))), filteredAndSortedOpportunities.length === 0 && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { align: "center", color: "textSecondary", variant: "body1", children: "No opportunities match your criteria" }) }))] })] }) }));
};
