import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, LinearProgress, Skeleton, } from '@mui/material';
const ShapVisualization = ({ features, title, maxFeatures = 8, isLoading = false, }) => {
    if (isLoading) {
        return (_jsxs(Box, { children: [_jsx(Skeleton, { variant: "text", width: "60%" }), [...Array(3)].map((_, index) => (_jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Skeleton, { variant: "text", width: "40%" }), _jsx(Skeleton, { height: 24, sx: { mt: 1 }, variant: "rectangular" })] }, index)))] }));
    }
    const sortedFeatures = [...features]
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, maxFeatures);
    const maxImpact = Math.max(...sortedFeatures.map(f => Math.abs(f.impact)));
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: title }), sortedFeatures.map((feature, index) => (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 0.5 }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: feature.name }), _jsxs(Typography, { color: feature.impact > 0 ? 'success.main' : 'error.main', variant: "body2", children: [feature.impact > 0 ? '+' : '', feature.impact.toFixed(3)] })] }), _jsx(LinearProgress, { color: feature.impact > 0 ? 'success' : 'error', sx: {
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                                transform: feature.impact < 0 ? 'scaleX(-1)' : 'none',
                            },
                        }, value: (Math.abs(feature.impact) / maxImpact) * 100, variant: "determinate" })] }, index)))] }));
};
export default React.memo(ShapVisualization);
