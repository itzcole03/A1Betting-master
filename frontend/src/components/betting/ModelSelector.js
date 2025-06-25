import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Tooltip, Chip, } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { bettingService } from '../../services/bettingService';
export const ModelSelector = ({ selectedModel, onModelChange }) => {
    // Fetch available models
    const { data: models, isLoading } = useQuery({
        queryKey: ['betting-models'],
        queryFn: () => bettingService.getAvailableModels(),
        staleTime: 300000, // Cache for 5 minutes
    });
    const handleChange = (event) => {
        onModelChange(event.target.value);
    };
    const selectedModelData = models?.find(m => m.id === selectedModel);
    return (_jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Prediction Model" }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "model-select-label", children: "Select Model" }), _jsx(Select, { disabled: isLoading, label: "Select Model", labelId: "model-select-label", value: selectedModel, onChange: handleChange, children: models?.map(model => (_jsx(MenuItem, { value: model.id, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", children: model.name }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Accuracy: ", model.accuracy.toFixed(1), "% | Win Rate: ", model.winRate.toFixed(1), "%"] })] }) }, model.id))) })] }), selectedModelData && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: selectedModelData.description }), _jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }, children: selectedModelData.features.map(feature => (_jsx(Tooltip, { title: `Model uses ${feature} for predictions`, children: _jsx(Chip, { label: feature, size: "small", variant: "outlined" }) }, feature))) }), _jsxs(Typography, { color: "text.secondary", sx: { display: 'block', mt: 1 }, variant: "caption", children: ["Last updated: ", new Date(selectedModelData.lastUpdated).toLocaleString()] })] }))] }));
};
