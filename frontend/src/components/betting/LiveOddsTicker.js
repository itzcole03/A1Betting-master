import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Chip, IconButton, Tooltip, Stack, } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Info as InfoIcon, } from '@mui/icons-material';
import { formatOdds, formatDateTime } from '../../utils/formatters';
export const LiveOddsTicker = ({ events, onEventSelect, loading, error, }) => {
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 3, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsxs(Alert, { severity: "error", sx: { m: 2 }, children: ["Error loading live odds: ", error.message] }));
    }
    if (events.length === 0) {
        return (_jsx(Alert, { severity: "info", sx: { m: 2 }, children: "No live events available at the moment." }));
    }
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Live Odds" }), _jsx(Stack, { spacing: 2, children: events.map(event => (_jsx(Card, { sx: {
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                    }, onClick: () => onEventSelect(event), children: _jsxs(CardContent, { children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", children: event.name }), _jsx(Typography, { color: "text.secondary", variant: "body2", children: formatDateTime(event.startTime) })] }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(Typography, { variant: "h6", children: formatOdds(event.odds) }), event.animate && (_jsx(Chip, { color: event.odds > 0 ? 'success' : 'error', icon: event.odds > 0 ? _jsx(TrendingUpIcon, {}) : _jsx(TrendingDownIcon, {}), label: event.odds > 0 ? 'Up' : 'Down', size: "small" })), _jsx(Tooltip, { title: "View Details", children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, {}) }) })] })] }), event.prediction && (_jsx(Box, { mt: 1, children: _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Win Probability: ", formatOdds(event.prediction.home_win_probability)] }) }))] }) }, event.id))) })] }));
};
