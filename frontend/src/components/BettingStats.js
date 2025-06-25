import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Tooltip, IconButton, } from '@mui/material';
import { formatCurrency, formatPercentage, formatTimeAgo } from '@/utils/formatters';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';
const BettingStats = ({ stats, modelPerformance }) => {
    const getTrendIcon = (value) => {
        return value >= 0 ? _jsx(TrendingUpIcon, { color: "success" }) : _jsx(TrendingDownIcon, { color: "error" });
    };
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Typography, { gutterBottom: true, variant: "h5", children: ["Performance Overview", _jsx(Tooltip, { title: "Statistics for the selected time period", children: _jsx(IconButton, { children: _jsx(InfoIcon, {}) }) })] }), _jsxs(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                }, children: [_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Overall Performance" }), _jsxs(Box, { sx: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 2,
                                    }, children: [_jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Total Bets" }), _jsx(Typography, { variant: "h6", children: stats.total_bets })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Win Rate" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h6", children: formatPercentage(stats.win_rate) }), getTrendIcon(stats.win_rate - 0.5)] })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Total Profit" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h6", children: formatCurrency(stats.total_profit) }), getTrendIcon(stats.total_profit)] })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "ROI" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h6", children: formatPercentage(stats.roi) }), getTrendIcon(stats.roi)] })] })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Model Performance" }), modelPerformance.map(model => (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: model.model_name }), _jsx(Typography, { color: model.roi >= 0 ? 'success.main' : 'error.main', variant: "body2", children: formatPercentage(model.roi) })] }), _jsx(LinearProgress, { color: model.roi >= 0 ? 'success' : 'error', sx: { height: 8, borderRadius: 4 }, value: Math.abs(model.roi) * 100, variant: "determinate" }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 0.5 }, children: [_jsxs(Typography, { color: "text.secondary", variant: "caption", children: [model.wins, "W / ", model.losses, "L"] }), _jsxs(Typography, { color: "text.secondary", variant: "caption", children: ["Updated ", formatTimeAgo(new Date(model.last_updated))] })] })] }, model.model_name)))] }) }), _jsx(Card, { sx: { gridColumn: { xs: '1', md: '1 / -1' } }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: {
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: 'repeat(2, 1fr)',
                                    },
                                    gap: 2,
                                }, children: [_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Best Performing Model" }), _jsx(Typography, { color: "success.main", variant: "h6", children: stats.best_performing_model })] }), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Worst Performing Model" }), _jsx(Typography, { color: "error.main", variant: "h6", children: stats.worst_performing_model })] })] }) }) })] })] }));
};
export default React.memo(BettingStats);
