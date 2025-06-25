import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Tooltip, IconButton, } from '@mui/material';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
const ArbitrageOpportunities = ({ opportunities, onPlaceBet, }) => {
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Typography, { gutterBottom: true, variant: "h5", children: ["Arbitrage Opportunities", _jsx(Tooltip, { title: "Risk-free profit opportunities across different bookmakers", children: _jsx(IconButton, { children: _jsx(InfoIcon, {}) }) })] }), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                }, children: opportunities.map((opportunity, index) => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h6", children: opportunity.event_id }), _jsx(Chip, { color: "success", icon: _jsx(TrendingUpIcon, {}), label: `${formatPercentage(opportunity.profit_percentage)} Profit` })] }), _jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Total Probability: ", formatPercentage(opportunity.total_probability)] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Required Stakes:" }), Object.entries(opportunity.stakes).map(([bookmaker, stake]) => (_jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 1,
                                        }, children: [_jsx(Typography, { variant: "body2", children: bookmaker }), _jsx(Typography, { variant: "body2", children: formatCurrency(stake) })] }, bookmaker)))] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Available Bookmakers:" }), _jsx(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap' }, children: opportunity.bookmakers.map(bookmaker => (_jsx(Chip, { label: bookmaker, size: "small", variant: "outlined" }, bookmaker))) })] }), _jsx(Button, { fullWidth: true, color: "primary", sx: { mt: 2 }, variant: "contained", onClick: () => onPlaceBet(opportunity), children: "Place Arbitrage Bets" })] }) }, index))) })] }));
};
export default React.memo(ArbitrageOpportunities);
