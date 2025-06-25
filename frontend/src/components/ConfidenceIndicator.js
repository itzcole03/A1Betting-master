import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, LinearProgress } from '@mui/material';
export const ConfidenceIndicator = ({ confidence, kellyCriterion, }) => {
    const getConfidenceColor = (value) => {
        if (value >= 0.8)
            return '#4caf50';
        if (value >= 0.6)
            return '#ff9800';
        return '#f44336';
    };
    const getKellyColor = (value) => {
        if (value >= 0.1)
            return '#4caf50';
        if (value >= 0.05)
            return '#ff9800';
        return '#f44336';
    };
    return (_jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Box, { sx: { mb: 1 }, children: [_jsx(Typography, { color: "textSecondary", variant: "subtitle2", children: "Model Confidence" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Box, { sx: { width: '100%', mr: 1 }, children: _jsx(LinearProgress, { sx: {
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getConfidenceColor(confidence),
                                        },
                                    }, value: confidence * 100, variant: "determinate" }) }), _jsxs(Typography, { color: "textSecondary", variant: "body2", children: [(confidence * 100).toFixed(1), "%"] })] })] }), _jsxs(Box, { children: [_jsx(Typography, { color: "textSecondary", variant: "subtitle2", children: "Kelly Criterion" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Box, { sx: { width: '100%', mr: 1 }, children: _jsx(LinearProgress, { sx: {
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getKellyColor(kellyCriterion),
                                        },
                                    }, value: Math.min(kellyCriterion * 100, 100), variant: "determinate" }) }), _jsxs(Typography, { color: "textSecondary", variant: "body2", children: [(kellyCriterion * 100).toFixed(1), "%"] })] })] })] }));
};
