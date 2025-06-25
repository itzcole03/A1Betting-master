import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, Typography, Box, Chip, LinearProgress, Tooltip, IconButton, } from '@mui/material';
import { Info, AttachMoney, Timeline } from '@mui/icons-material';
const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case 'low':
            return 'success';
        case 'medium':
            return 'warning';
        case 'high':
            return 'error';
        default:
            return 'default';
    }
};
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};
export const BetRecommendationCard = ({ recommendation, onViewDetails, }) => {
    const { prediction, confidence, stake, riskLevel, expectedValue, metadata } = recommendation;
    return (_jsx(Card, { sx: { mb: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { component: "div", variant: "h6", children: prediction.type }), _jsx(Chip, { color: getRiskColor(riskLevel), label: riskLevel.toUpperCase(), size: "small" })] }), _jsxs(Box, { mb: 2, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Confidence" }), _jsxs(Box, { alignItems: "center", display: "flex", children: [_jsx(LinearProgress, { sx: { flexGrow: 1, mr: 1 }, value: confidence * 100, variant: "determinate" }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: [(confidence * 100).toFixed(1), "%"] })] })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Recommended Stake" }), _jsx(Typography, { color: "primary", variant: "h6", children: formatCurrency(stake) })] }), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Expected Value" }), _jsx(Typography, { color: expectedValue >= 0 ? 'success.main' : 'error.main', variant: "h6", children: formatCurrency(expectedValue) })] })] }), _jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsxs(Box, { display: "flex", gap: 1, children: [_jsx(Tooltip, { title: "Model Agreement", children: _jsx(Chip, { icon: _jsx(Timeline, {}), label: `${(metadata.modelAgreement * 100).toFixed(0)}% Agreement`, size: "small" }) }), _jsx(Tooltip, { title: "Bankroll Percentage", children: _jsx(Chip, { icon: _jsx(AttachMoney, {}), label: `${(metadata.bankrollPercentage * 100).toFixed(0)}% Bankroll`, size: "small" }) })] }), onViewDetails && (_jsx(IconButton, { size: "small", onClick: onViewDetails, children: _jsx(Info, {}) }))] })] }) }));
};
