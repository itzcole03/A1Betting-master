import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, LinearProgress, Skeleton } from '@mui/material';
import { formatPercentage } from '@/utils/formatters';
export const PerformanceMetrics = ({ performance, isLoading, }) => {
    const metrics = [
        {
            label: 'Win Rate',
            value: performance.winRate,
            format: formatPercentage,
            color: performance.winRate >= 0.55 ? 'success' : 'warning',
        },
        {
            label: 'ROI',
            value: performance.roi,
            format: formatPercentage,
            color: performance.roi > 0 ? 'success' : 'error',
        },
        {
            label: 'Edge Retention',
            value: performance.edgeRetention,
            format: formatPercentage,
            color: performance.edgeRetention >= 0.7 ? 'success' : 'warning',
        },
        {
            label: 'Total Bets',
            value: performance.totalBets,
            format: (value) => value.toString(),
            color: 'primary',
        },
        {
            label: 'Average Odds',
            value: performance.averageOdds,
            format: (value) => value.toFixed(2),
            color: 'primary',
        },
        {
            label: 'Profit/Loss',
            value: performance.profitLoss,
            format: (value) => `$${value.toFixed(2)}`,
            color: performance.profitLoss > 0 ? 'success' : 'error',
        },
    ];
    if (isLoading) {
        return (_jsx(Box, { sx: {
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                },
                gap: 3,
            }, children: metrics.map((_, index) => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Skeleton, { variant: "text", width: "60%" }), _jsx(Skeleton, { height: 40, sx: { mt: 2 }, variant: "rectangular" })] }) }, index))) }));
    }
    return (_jsx(Box, { sx: {
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
            },
            gap: 3,
        }, children: metrics.map((metric, index) => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: metric.label }), _jsx(Typography, { gutterBottom: true, component: "div", variant: "h4", children: metric.format(metric.value) }), _jsx(LinearProgress, { color: metric.color, sx: { height: 8, borderRadius: 4 }, value: Math.min(Math.abs(metric.value) * 100, 100), variant: "determinate" })] }) }, index))) }));
};
