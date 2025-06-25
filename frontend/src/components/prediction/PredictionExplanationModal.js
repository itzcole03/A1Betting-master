import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Tabs, Tab, IconButton, Tooltip, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { ShapExplanation } from './ShapExplanation';
export const PredictionExplanationModal = ({ open, onClose, prediction, }) => {
    const [selectedModel, setSelectedModel] = React.useState(0);
    const handleModelChange = (event, newValue) => {
        setSelectedModel(newValue);
    };
    return (_jsxs(Dialog, { fullWidth: true, maxWidth: "lg", open: open, PaperProps: {
            sx: {
                minHeight: '80vh',
                maxHeight: '90vh',
            },
        }, onClose: onClose, children: [_jsx(DialogTitle, { children: _jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "h6", children: "Prediction Explanation" }), _jsxs(Box, { alignItems: "center", display: "flex", children: [_jsx(Tooltip, { title: "SHAP values show how each feature contributes to the prediction", children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, {}) }) }), _jsx(IconButton, { size: "small", onClick: onClose, children: _jsx(CloseIcon, {}) })] })] }) }), _jsxs(DialogContent, { dividers: true, children: [_jsxs(Box, { mb: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Overall Prediction" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 2, children: [_jsxs(Typography, { color: "primary", variant: "h4", children: [(prediction.prediction * 100).toFixed(1), "%"] }), _jsxs(Typography, { color: "textSecondary", variant: "body2", children: ["Confidence: ", (prediction.confidence * 100).toFixed(1), "%"] })] })] }), _jsx(Tabs, { scrollButtons: "auto", sx: { borderBottom: 1, borderColor: 'divider' }, value: selectedModel, variant: "scrollable", onChange: handleModelChange, children: prediction.explanations.map((explanation, index) => (_jsx(Tab, { id: `model-tab-${index}`, label: explanation.modelName }, explanation.modelName))) }), _jsx(Box, { mt: 2, children: prediction.explanations.map((explanation, index) => (_jsx(Box, { hidden: selectedModel !== index, id: `model-tabpanel-${index}`, role: "tabpanel", children: _jsx(ShapExplanation, { explanation: explanation }) }, explanation.modelName))) })] }), _jsx(DialogActions, { children: _jsx(Button, { color: "primary", onClick: onClose, children: "Close" }) })] }));
};
