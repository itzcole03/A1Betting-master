import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Slider, Typography, Paper, TextField, InputAdornment, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { bettingService } from '../../services/bettingService';
import { formatCurrency } from '../../utils/formatters';
export const StakeSizingControl = ({ onStakeChange, maxStake = 1000, minStake = 10, defaultStake = 100, }) => {
    const [stake, setStake] = useState(defaultStake);
    const [inputValue, setInputValue] = useState(defaultStake.toString());
    // Fetch bankroll metrics for stake validation
    const { data: metrics } = useQuery({
        queryKey: ['bankroll-metrics'],
        queryFn: () => bettingService.getBankrollMetrics(),
        staleTime: 30000, // Cache for 30 seconds
    });
    useEffect(() => {
        onStakeChange(stake);
    }, [stake, onStakeChange]);
    const handleSliderChange = (_, newValue) => {
        const value = newValue;
        setStake(value);
        setInputValue(value.toString());
    };
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
            const clampedValue = Math.min(Math.max(numericValue, minStake), maxStake);
            setStake(clampedValue);
        }
    };
    const handleBlur = () => {
        const numericValue = Number(inputValue);
        if (isNaN(numericValue)) {
            setInputValue(stake.toString());
        }
        else {
            const clampedValue = Math.min(Math.max(numericValue, minStake), maxStake);
            setStake(clampedValue);
            setInputValue(clampedValue.toString());
        }
    };
    const getStakePercentage = () => {
        if (!metrics?.currentBalance)
            return 0;
        return (stake / metrics.currentBalance) * 100;
    };
    return (_jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Stake Size" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(Slider, { max: maxStake, min: minStake, step: 10, sx: { flex: 1 }, value: stake, onChange: handleSliderChange }), _jsx(TextField, { InputProps: {
                            startAdornment: _jsx(InputAdornment, { position: "start", children: "$" }),
                        }, sx: { width: '120px' }, value: inputValue, onBlur: handleBlur, onChange: handleInputChange })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Typography, { color: "text.secondary", variant: "body2", children: [formatCurrency(minStake), " - ", formatCurrency(maxStake)] }), _jsx(Tooltip, { title: "Percentage of current bankroll", children: _jsxs(Typography, { color: "text.secondary", variant: "body2", children: [getStakePercentage().toFixed(1), "% of bankroll"] }) })] })] }));
};
