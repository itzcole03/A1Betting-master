import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, Button, Chip, LinearProgress, Skeleton, Alert, } from '@mui/material';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
export const BettingOpportunities = ({ opportunities, onBetPlacement, alerts, isLoading, }) => {
    if (isLoading) {
        return (_jsx(Box, { sx: {
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                },
                gap: 2,
            }, children: [1, 2, 3].map(index => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Skeleton, { variant: "text", width: "60%" }), _jsx(Skeleton, { height: 100, sx: { mt: 2 }, variant: "rectangular" })] }) }, index))) }));
    }
    if (opportunities.length === 0) {
        return (_jsx(Alert, { severity: "info", children: "No betting opportunities available at the moment. Please check back later." }));
    }
    return (_jsxs(Box, { children: [alerts.length > 0 && (_jsxs(Alert, { severity: "warning", sx: { mb: 3 }, children: [alerts.length, " active alert", alerts.length === 1 ? '' : 's', " require your attention"] })), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                }, children: opportunities.map((opportunity, index) => {
                    const hasAlert = alerts.some(alert => alert.metadata?.gameId === opportunity.event_id);
                    return (_jsxs(Card, { sx: {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }, children: [hasAlert && (_jsx(Chip, { color: "warning", label: "Alert", size: "small", sx: {
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                } })), _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: opportunity.event_id }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Confidence" }), _jsx(LinearProgress, { color: opportunity.confidence_score >= 0.8 ? 'success' : 'warning', sx: { height: 8, borderRadius: 4 }, value: opportunity.confidence_score * 100, variant: "determinate" }), _jsx(Typography, { color: "text.secondary", sx: { mt: 0.5 }, variant: "body2", children: formatPercentage(opportunity.confidence_score) })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Expected ROI: ", formatPercentage(opportunity.expected_roi)] }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Recommended Stake: ", formatCurrency(opportunity.recommended_stake)] })] }), _jsx(Button, { fullWidth: true, color: "primary", disabled: hasAlert, variant: "contained", onClick: () => onBetPlacement(opportunity), children: "Place Bet" })] })] }, index));
                }) })] }));
};
