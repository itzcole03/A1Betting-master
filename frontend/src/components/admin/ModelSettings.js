import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Slider, Select, MenuItem, FormControl, InputLabel, Button, Paper, Grid, } from '@mui/material';
import { predictionService } from '../../services/predictionService';
export const ModelSettings = ({ onSettingsChange }) => {
    const [modelType, setModelType] = useState('xgboost');
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
    const [kellyThreshold, setKellyThreshold] = useState(0.1);
    const [performance, setPerformance] = useState(null);
    useEffect(() => {
        const fetchPerformance = async () => {
            const data = await predictionService.getModelPerformance(modelType);
            setPerformance(data);
        };
        fetchPerformance();
    }, [modelType]);
    const handleModelChange = (event) => {
        const newModelType = event.target.value;
        setModelType(newModelType);
        if (onSettingsChange) {
            onSettingsChange({
                modelType: newModelType,
                confidenceThreshold,
                kellyThreshold,
            });
        }
    };
    const handleConfidenceChange = (_, newValue) => {
        setConfidenceThreshold(newValue);
        if (onSettingsChange) {
            onSettingsChange({
                modelType,
                confidenceThreshold: newValue,
                kellyThreshold,
            });
        }
    };
    const handleKellyChange = (_, newValue) => {
        setKellyThreshold(newValue);
        if (onSettingsChange) {
            onSettingsChange({
                modelType,
                confidenceThreshold,
                kellyThreshold: newValue,
            });
        }
    };
    const handleClearCache = async () => {
        predictionService.clearCaches();
    };
    return (_jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Model Settings" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { sx: { width: { xs: '100%', md: '33.33%' } }, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Model Type" }), _jsxs(Select, { label: "Model Type", value: modelType, onChange: handleModelChange, children: [_jsx(MenuItem, { value: "xgboost", children: "XGBoost" }), _jsx(MenuItem, { value: "lightgbm", children: "LightGBM" }), _jsx(MenuItem, { value: "catboost", children: "CatBoost" }), _jsx(MenuItem, { value: "neuralNetwork", children: "Neural Network" }), _jsx(MenuItem, { value: "randomForest", children: "Random Forest" })] })] }) }), _jsxs(Grid, { sx: { width: { xs: '100%', md: '33.33%' } }, children: [_jsx(Typography, { gutterBottom: true, children: "Confidence Threshold" }), _jsx(Slider, { max: 1, min: 0, step: 0.05, value: confidenceThreshold, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleConfidenceChange })] }), _jsxs(Grid, { sx: { width: { xs: '100%', md: '33.33%' } }, children: [_jsx(Typography, { gutterBottom: true, children: "Kelly Criterion Threshold" }), _jsx(Slider, { max: 0.5, min: 0, step: 0.01, value: kellyThreshold, valueLabelDisplay: "auto", valueLabelFormat: value => `${(value * 100).toFixed(0)}%`, onChange: handleKellyChange })] }), _jsx(Grid, { sx: { width: '100%' }, children: _jsx(Button, { color: "secondary", sx: { mt: 2 }, variant: "contained", onClick: handleClearCache, children: "Clear Cache" }) }), performance && (_jsx(Grid, { sx: { width: '100%' }, children: _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Model Performance" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { sx: { width: '33.33%' }, children: [_jsx(Typography, { variant: "body2", children: "Accuracy" }), _jsxs(Typography, { variant: "h6", children: [(performance.accuracy * 100).toFixed(1), "%"] })] }), _jsxs(Grid, { sx: { width: '33.33%' }, children: [_jsx(Typography, { variant: "body2", children: "ROI" }), _jsxs(Typography, { variant: "h6", children: [(performance.roi * 100).toFixed(1), "%"] })] }), _jsxs(Grid, { sx: { width: '33.33%' }, children: [_jsx(Typography, { variant: "body2", children: "Win Rate" }), _jsxs(Typography, { variant: "h6", children: [(performance.win_rate * 100).toFixed(1), "%"] })] })] })] }) }))] })] }));
};
