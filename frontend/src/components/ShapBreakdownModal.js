import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Tooltip, } from '@mui/material';
import { Info } from '@mui/icons-material';
export const ShapBreakdownModal = ({ isOpen, onClose, feature, }) => {
    const getImpactColor = (impact) => {
        if (impact > 0)
            return 'success.main';
        if (impact < 0)
            return 'error.main';
        return 'text.secondary';
    };
    const getImpactLabel = (impact) => {
        if (impact > 0)
            return 'Positive Impact';
        if (impact < 0)
            return 'Negative Impact';
        return 'Neutral Impact';
    };
    return (_jsxs(Dialog, { fullWidth: true, maxWidth: "sm", open: isOpen, PaperProps: {
            sx: {
                borderRadius: 2,
                boxShadow: 24,
            },
        }, onClose: onClose, children: [_jsx(DialogTitle, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Typography, { variant: "h6", children: "Feature Impact Analysis" }), _jsx(Tooltip, { title: "SHAP values show how each feature contributes to the prediction", children: _jsx(Info, { color: "action", fontSize: "small" }) })] }) }), _jsxs(DialogContent, { children: [_jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: feature.feature }), feature.description && (_jsx(Typography, { paragraph: true, color: "text.secondary", variant: "body2", children: feature.description }))] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Impact Analysis" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsxs(Typography, { color: getImpactColor(feature.impact), sx: { fontWeight: 'bold' }, variant: "h4", children: [feature.impact > 0 ? '+' : '', feature.impact.toFixed(3)] }), _jsx(Typography, { color: "text.secondary", variant: "body2", children: getImpactLabel(feature.impact) })] })] }), feature.details && (_jsxs(_Fragment, { children: [_jsx(Divider, { sx: { my: 2 } }), _jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Additional Details" }), _jsx(Typography, { color: "text.secondary", variant: "body2", children: feature.details })] })), feature.weight !== undefined && (_jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Feature Weight" }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["This feature contributes ", feature.weight.toFixed(2), "% to the overall prediction"] })] }))] }), _jsx(DialogActions, { children: _jsx(Button, { color: "primary", onClick: onClose, children: "Close" }) })] }));
};
