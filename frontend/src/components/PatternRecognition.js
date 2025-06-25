import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Tooltip, IconButton, LinearProgress, } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Info as InfoIcon, Warning as WarningIcon, } from '@mui/icons-material';
import { formatPercentage, formatTimeAgo } from '@/utils/formatters';
const PatternRecognition = ({ patterns, lineMovement, onPatternSelect, }) => {
    const getSignificanceColor = (significance) => {
        switch (significance) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
        }
    };
    const getSignificanceIcon = (significance) => {
        switch (significance) {
            case 'high':
                return _jsx(TrendingUpIcon, {});
            case 'medium':
                return _jsx(WarningIcon, {});
            case 'low':
                return _jsx(TrendingDownIcon, {});
        }
    };
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Typography, { gutterBottom: true, variant: "h5", children: ["Pattern Recognition", _jsx(Tooltip, { title: "Historical patterns and line movement analysis", children: _jsx(IconButton, { children: _jsx(InfoIcon, {}) }) })] }), _jsxs(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                    },
                    gap: 3,
                }, children: [_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Line Movement" }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Initial Line" }), _jsx(Typography, { variant: "body2", children: lineMovement.initial })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Current Line" }), _jsx(Typography, { variant: "body2", children: lineMovement.current })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Change" }), _jsxs(Typography, { color: lineMovement.change > 0 ? 'success.main' : 'error.main', variant: "body2", children: [lineMovement.change > 0 ? '+' : '', lineMovement.change] })] })] }), _jsx(Chip, { color: getSignificanceColor(lineMovement.significance), icon: getSignificanceIcon(lineMovement.significance), label: `${lineMovement.significance.toUpperCase()} Significance` }), _jsxs(Typography, { color: "text.secondary", sx: { display: 'block', mt: 1 }, variant: "caption", children: ["Updated ", formatTimeAgo(lineMovement.timestamp)] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Identified Patterns" }), patterns.map((pattern, index) => (_jsxs(Box, { sx: {
                                        mb: 2,
                                        p: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                    }, onClick: () => onPatternSelect(pattern), children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "subtitle2", children: pattern.name }), _jsx(Chip, { color: pattern.matchScore >= 0.8 ? 'success' : 'warning', label: `${formatPercentage(pattern.matchScore)} Match`, size: "small" })] }), _jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: pattern.description }), _jsxs(Box, { sx: { mt: 1 }, children: [_jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "caption", children: "Success Rate" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(LinearProgress, { color: pattern.successRate >= 0.6 ? 'success' : 'warning', sx: { flexGrow: 1, height: 4, borderRadius: 2 }, value: pattern.successRate * 100, variant: "determinate" }), _jsx(Typography, { variant: "caption", children: formatPercentage(pattern.successRate) })] })] }), _jsxs(Typography, { color: "text.secondary", sx: { display: 'block', mt: 1 }, variant: "caption", children: ["Last seen ", formatTimeAgo(pattern.lastOccurrence), " \u2022 ", pattern.sampleSize, " samples"] })] }, index)))] }) })] })] }));
};
export default React.memo(PatternRecognition);
