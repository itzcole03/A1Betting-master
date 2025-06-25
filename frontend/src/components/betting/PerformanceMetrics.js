import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, CircularProgress, Alert, LinearProgress, } from '@mui/material';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
export const PerformanceMetrics = ({ metrics, loading, error, }) => {
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 3, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsxs(Alert, { severity: "error", sx: { m: 2 }, children: ["Error loading metrics: ", error.message] }));
    }
    const metricCards = [
        {
            title: 'Total Profit',
            value: formatCurrency(metrics.total_profit),
            color: metrics.total_profit >= 0 ? 'success.main' : 'error.main',
        },
        {
            title: 'ROI',
            value: formatPercentage(metrics.roi),
            color: metrics.roi >= 0 ? 'success.main' : 'error.main',
        },
        {
            title: 'Win Rate',
            value: formatPercentage(metrics.win_rate),
            color: metrics.win_rate >= 0.5 ? 'success.main' : 'warning.main',
        },
        {
            title: 'Total Bets',
            value: metrics.total_bets.toString(),
            color: 'text.primary',
        },
        {
            title: 'Average Stake',
            value: formatCurrency(metrics.average_stake),
            color: 'text.primary',
        },
        {
            title: 'Risk Score',
            value: formatPercentage(metrics.risk_score),
            color: metrics.risk_score <= 0.5 ? 'success.main' : 'warning.main',
        },
    ];
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Performance Metrics" }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 2 }, children: metricCards.map(card => (_jsx(Card, { sx: { flex: '1 1 250px', maxWidth: '100%' }, children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: card.title }), _jsx(Typography, { color: card.color, variant: "h6", children: card.value }), card.title === 'Win Rate' && (_jsx(LinearProgress, { color: metrics.win_rate >= 0.5 ? 'success' : 'warning', sx: { mt: 1 }, value: metrics.win_rate * 100, variant: "determinate" }))] }) }, card.title))) }), _jsxs(Box, { mt: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Recent Performance" }), _jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 2 }, children: [_jsxs(Box, { sx: { flex: '1 1 200px' }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Winning Bets" }), _jsx(Typography, { color: "success.main", variant: "h6", children: metrics.winning_bets })] }), _jsxs(Box, { sx: { flex: '1 1 200px' }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Losing Bets" }), _jsx(Typography, { color: "error.main", variant: "h6", children: metrics.losing_bets })] })] }) }) })] })] }));
};
