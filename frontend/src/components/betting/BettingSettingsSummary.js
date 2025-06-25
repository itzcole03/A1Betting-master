import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Paper, Typography, Chip, Tooltip, LinearProgress } from '@mui/material';
import { useBettingSettings } from '../../hooks/useBettingSettings';
import { formatCurrency } from '../../utils/formatters';
export const BettingSettingsSummary = () => {
    const { settings } = useBettingSettings();
    const getRiskProfileColor = (profile) => {
        switch (profile) {
            case 'conservative':
                return 'success';
            case 'moderate':
                return 'warning';
            case 'aggressive':
                return 'error';
            default:
                return 'default';
        }
    };
    return (_jsxs(Paper, { elevation: 2, sx: { p: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Current Settings" }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }, children: [_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: "Risk Profile" }), _jsx(Chip, { color: getRiskProfileColor(settings.riskProfile), label: settings.riskProfile.charAt(0).toUpperCase() + settings.riskProfile.slice(1), size: "small" })] }), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: "Stake Size" }), _jsx(Typography, { variant: "body1", children: formatCurrency(settings.stakeSize) }), _jsx(Tooltip, { title: "Stake range", children: _jsxs(Typography, { color: "text.secondary", variant: "caption", children: ["Range: ", formatCurrency(settings.minStake), " - ", formatCurrency(settings.maxStake)] }) })] }), _jsxs(Box, { sx: { gridColumn: { xs: '1 / -1' } }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: "Confidence Threshold" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(LinearProgress, { sx: { flex: 1 }, value: settings.confidenceThreshold * 100, variant: "determinate" }), _jsxs(Typography, { variant: "body2", children: [(settings.confidenceThreshold * 100).toFixed(0), "%"] })] })] }), _jsxs(Box, { sx: { gridColumn: { xs: '1 / -1' } }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "subtitle2", children: "Selected Model" }), _jsx(Typography, { noWrap: true, variant: "body1", children: settings.modelId || 'No model selected' })] })] })] }));
};
