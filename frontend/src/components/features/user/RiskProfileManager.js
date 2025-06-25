import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRiskProfileStore } from '../stores/riskProfileStore';
import { Box, Typography, Paper, Slider, TextField, Select, MenuItem, FormControl, InputLabel, } from '@mui/material';
import { styled } from '@mui/material/styles';
const ProfileContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
}));
const SliderContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));
export const RiskProfileManager = () => {
    const { currentProfile, bankroll, updateRiskProfile, updateBankroll } = useRiskProfileStore();
    const handleProfileTypeChange = (event) => {
        updateRiskProfile({ profile_type: event.target.value });
    };
    const handleMaxStakeChange = (_, newValue) => {
        updateRiskProfile({ max_stake_percentage: newValue });
    };
    const handleMaxDailyLossChange = (_, newValue) => {
        updateRiskProfile({ max_daily_loss: newValue });
    };
    const handleMaxConcurrentBetsChange = (event) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value)) {
            updateRiskProfile({ max_concurrent_bets: value });
        }
    };
    const handleMinConfidenceChange = (_, newValue) => {
        updateRiskProfile({ min_confidence: newValue });
    };
    const handleKellyFractionChange = (_, newValue) => {
        updateRiskProfile({ kelly_fraction: newValue });
    };
    const handleBankrollChange = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            updateBankroll(value);
        }
    };
    return (_jsxs(ProfileContainer, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Risk Profile Settings" }), _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "Risk Profile Type" }), _jsxs(Select, { label: "Risk Profile Type", value: currentProfile.profile_type, onChange: handleProfileTypeChange, children: [_jsx(MenuItem, { value: "conservative", children: "Conservative" }), _jsx(MenuItem, { value: "moderate", children: "Moderate" }), _jsx(MenuItem, { value: "aggressive", children: "Aggressive" })] })] }), _jsxs(SliderContainer, { children: [_jsx(Typography, { gutterBottom: true, children: "Maximum Stake Percentage" }), _jsx(Slider, { max: 0.2, min: 0.01, step: 0.01, value: currentProfile.max_stake_percentage, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleMaxStakeChange })] }), _jsxs(SliderContainer, { children: [_jsx(Typography, { gutterBottom: true, children: "Maximum Daily Loss" }), _jsx(Slider, { max: 0.3, min: 0.05, step: 0.05, value: currentProfile.max_daily_loss, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleMaxDailyLossChange })] }), _jsx(TextField, { fullWidth: true, inputProps: { min: 1, max: 10 }, label: "Maximum Concurrent Bets", margin: "normal", type: "number", value: currentProfile.max_concurrent_bets, onChange: handleMaxConcurrentBetsChange }), _jsxs(SliderContainer, { children: [_jsx(Typography, { gutterBottom: true, children: "Minimum Confidence" }), _jsx(Slider, { max: 0.9, min: 0.5, step: 0.05, value: currentProfile.min_confidence, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleMinConfidenceChange })] }), _jsxs(SliderContainer, { children: [_jsx(Typography, { gutterBottom: true, children: "Kelly Criterion Fraction" }), _jsx(Slider, { max: 1, min: 0.1, step: 0.1, value: currentProfile.kelly_fraction, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleKellyFractionChange })] }), _jsx(TextField, { fullWidth: true, inputProps: { min: 0, step: 100 }, InputProps: {
                    startAdornment: _jsx(Typography, { children: "$" }),
                }, label: "Bankroll", margin: "normal", type: "number", value: bankroll, onChange: handleBankrollChange })] }));
};
