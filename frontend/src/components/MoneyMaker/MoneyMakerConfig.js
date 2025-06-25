import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Paper, Typography, Slider, Select, MenuItem, FormControl, InputLabel, Button, Grid, } from '@mui/material';
const sports = [
    { value: 'nba', label: 'NBA' },
    { value: 'nfl', label: 'NFL' },
    { value: 'mlb', label: 'MLB' },
    { value: 'nhl', label: 'NHL' },
];
const strategies = [
    { value: 'maximum', label: 'Maximum Points' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'contrarian', label: 'Contrarian' },
    { value: 'value', label: 'Value' },
];
export const MoneyMakerConfig = ({ onConfigChange, onActivate, onDeactivate, isActive, }) => {
    const [config, setConfig] = React.useState({
        entry: 100,
        timeWindow: '60',
        minWinRate: 84,
        strategy: 'maximum',
        maxLegs: 3,
        sport: 'nba',
    });
    const handleSelectChange = (field) => (event) => {
        const newConfig = { ...config, [field]: event.target.value };
        setConfig(newConfig);
        onConfigChange(newConfig);
    };
    const handleSliderChange = (field) => (_, value) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        onConfigChange(newConfig);
    };
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Configuration" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Sport" }), _jsx(Select, { label: "Sport", value: config.sport, onChange: handleSelectChange('sport'), children: sports.map(sport => (_jsx(MenuItem, { value: sport.value, children: sport.label }, sport.value))) })] }) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Strategy" }), _jsx(Select, { label: "Strategy", value: config.strategy, onChange: handleSelectChange('strategy'), children: strategies.map(strategy => (_jsx(MenuItem, { value: strategy.value, children: strategy.label }, strategy.value))) })] }) }), _jsxs(Grid, { item: true, md: 6, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Entry Amount ($)" }), _jsx(Slider, { max: 1000, min: 10, step: 10, value: config.entry, valueLabelDisplay: "auto", onChange: handleSliderChange('entry') })] }), _jsxs(Grid, { item: true, md: 6, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Time Window (minutes)" }), _jsx(Slider, { max: 120, min: 15, step: 15, value: parseInt(config.timeWindow), valueLabelDisplay: "auto", onChange: handleSliderChange('timeWindow') })] }), _jsxs(Grid, { item: true, md: 6, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Minimum Win Rate (%)" }), _jsx(Slider, { max: 95, min: 50, step: 1, value: config.minWinRate, valueLabelDisplay: "auto", onChange: handleSliderChange('minWinRate') })] }), _jsxs(Grid, { item: true, md: 6, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Maximum Legs" }), _jsx(Slider, { max: 6, min: 2, step: 1, value: config.maxLegs, valueLabelDisplay: "auto", onChange: handleSliderChange('maxLegs') })] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', mt: 2 }, children: _jsxs(Button, { color: isActive ? 'error' : 'primary', size: "large", variant: "contained", onClick: isActive ? onDeactivate : onActivate, children: [isActive ? 'Deactivate' : 'Activate', " Money Maker"] }) }) })] })] }));
};
