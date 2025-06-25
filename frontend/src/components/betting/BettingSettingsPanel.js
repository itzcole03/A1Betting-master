import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Paper, Typography, Divider, Alert, CircularProgress, Stack, Button, } from '@mui/material';
import { RiskProfileSelector } from './RiskProfileSelector';
import { StakeSizingControl } from './StakeSizingControl';
import { ModelSelector } from './ModelSelector';
import { useBettingSettings } from '../../hooks/useBettingSettings';
export const BettingSettingsPanel = () => {
    const { settings, isLoading, error, handleRiskProfileChange, handleStakeChange, handleModelChange, resetSettings, } = useBettingSettings();
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 3, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { m: 2 }, children: error }));
    }
    return (_jsxs(Paper, { elevation: 3, sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", children: "Betting Settings" }), _jsx(Button, { color: "primary", variant: "outlined", onClick: resetSettings, children: "Reset to Default" })] }), _jsxs(Stack, { spacing: 3, children: [_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Risk Profile" }), _jsx(RiskProfileSelector, { currentProfile: settings.riskProfile, onProfileChange: handleRiskProfileChange })] }), _jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Stake Size" }), _jsx(StakeSizingControl, { defaultStake: settings.stakeSize, maxStake: settings.maxStake, minStake: settings.minStake, onStakeChange: handleStakeChange })] }), _jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Prediction Model" }), _jsx(ModelSelector, { selectedModel: settings.modelId, onModelChange: handleModelChange })] })] })] }));
};
