import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import { useUnifiedAnalytics } from '../hooks/useUnifiedAnalytics';
import { Box, Typography, Paper, LinearProgress, Tooltip, IconButton, Menu, MenuItem, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, } from 'recharts';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { NoResultsFallback } from './NoResultsFallback';
const PredictionContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
}));
const ConfidenceBar = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
        borderRadius: 4,
    },
}));
const ShapContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    height: 300,
    position: 'relative',
}));
const ControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const ValueDisplay = styled(Box)(({ theme, changed }) => ({
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: changed ? theme.palette.primary.light : 'transparent',
    transition: `background-color 0.3s`,
}));
export const PredictionDisplay = ({ eventId }) => {
    // Unified analytics for prediction data
    const { ml } = useUnifiedAnalytics({ ml: { autoUpdate: false } });
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType, setFilterType] = useState('all');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [changedValues, setChangedValues] = useState(new Set());
    // Memoize prediction for performance
    const prediction = useMemo(() => {
        if (!ml || !ml.mlResult)
            return null;
        // Find prediction for this eventId if available
        // (Assume mlResult.predictions is an array of objects with eventId)
        if (Array.isArray(ml.mlResult.predictions)) {
            return ml.mlResult.predictions.find((p) => p.eventId === eventId) || null;
        }
        return null;
    }, [ml, eventId]);
    useEffect(() => {
        if (prediction) {
            const newChangedValues = new Set();
            if (prediction.confidence)
                newChangedValues.add('confidence');
            if (prediction.recommended_stake)
                newChangedValues.add('stake');
            setChangedValues(newChangedValues);
            const timeout = setTimeout(() => setChangedValues(new Set()), 1000);
            return () => clearTimeout(timeout);
        }
    }, [prediction]);
    if (ml?.isLoading) {
        return (_jsx(PredictionContainer, { children: _jsx(Typography, { color: "textSecondary", variant: "body2", children: "Loading prediction..." }) }));
    }
    if (ml?.error) {
        return _jsx(NoResultsFallback, {});
    }
    if (!prediction) {
        return _jsx(NoResultsFallback, {});
    }
    // Transform SHAP values for visualization
    const shapData = useMemo(() => {
        if (!prediction.shap_values)
            return [];
        return Object.entries(prediction.shap_values)
            .map(([feature, value]) => ({
            feature,
            value: value,
            absValue: Math.abs(value),
        }))
            .filter(item => {
            if (filterType === 'positive')
                return item.value > 0;
            if (filterType === 'negative')
                return item.value < 0;
            return true;
        })
            .sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (b.absValue - a.absValue);
        })
            .slice(0, 10);
    }, [prediction, filterType, sortOrder]);
    const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
    const handleSortClick = (event) => setSortAnchorEl(event.currentTarget);
    const handleFilterClose = () => setFilterAnchorEl(null);
    const handleSortClose = () => setSortAnchorEl(null);
    return (_jsxs(PredictionContainer, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Prediction Analysis" }), _jsxs(ValueDisplay, { changed: changedValues.has('confidence'), children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Confidence Level" }), _jsx(ConfidenceBar, { color: prediction.confidence > 0.7 ? 'success' : 'primary', value: prediction.confidence * 100, variant: "determinate" }), _jsxs(Typography, { color: "textSecondary", mt: 1, variant: "body2", children: [prediction.confidence.toFixed(2), " (", prediction.risk_level, ")"] })] }), _jsxs(ValueDisplay, { changed: changedValues.has('stake'), children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Recommended Stake" }), _jsxs(Typography, { color: "primary", variant: "h6", children: ["$", prediction.recommended_stake?.toFixed(2) ?? '0.00'] })] }), _jsxs(Box, { mt: 2, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { variant: "subtitle2", children: "Feature Impact (SHAP Values)" }), _jsxs(ControlsContainer, { children: [_jsx(Tooltip, { title: "Filter", children: _jsx(IconButton, { "aria-label": "Filter SHAP values", size: "small", onClick: handleFilterClick, children: _jsx(FilterListIcon, {}) }) }), _jsx(Tooltip, { title: "Sort", children: _jsx(IconButton, { "aria-label": "Sort SHAP values", size: "small", onClick: handleSortClick, children: _jsx(SortIcon, {}) }) })] })] }), _jsxs(Menu, { anchorEl: filterAnchorEl, open: Boolean(filterAnchorEl), onClose: handleFilterClose, children: [_jsx(MenuItem, { onClick: () => {
                                    setFilterType('all');
                                    handleFilterClose();
                                }, children: "All Features" }), _jsx(MenuItem, { onClick: () => {
                                    setFilterType('positive');
                                    handleFilterClose();
                                }, children: "Positive Impact" }), _jsx(MenuItem, { onClick: () => {
                                    setFilterType('negative');
                                    handleFilterClose();
                                }, children: "Negative Impact" })] }), _jsxs(Menu, { anchorEl: sortAnchorEl, open: Boolean(sortAnchorEl), onClose: handleSortClose, children: [_jsx(MenuItem, { onClick: () => {
                                    setSortOrder('desc');
                                    handleSortClose();
                                }, children: "Highest Impact First" }), _jsx(MenuItem, { onClick: () => {
                                    setSortOrder('asc');
                                    handleSortClose();
                                }, children: "Lowest Impact First" })] }), _jsx(ShapContainer, { children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(BarChart, { "aria-label": "SHAP Feature Impact Bar Chart", data: shapData, layout: "vertical", children: [_jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "feature", tick: { fontSize: 12 }, type: "category", width: 150 }), _jsx(RechartsTooltip, { formatter: (value, name, props) => {
                                            const item = shapData[props.payload.index];
                                            return [
                                                `${item.value.toFixed(4)} (${item.value > 0 ? 'Positive' : 'Negative'} Impact)`,
                                                'SHAP Value',
                                            ];
                                        }, labelFormatter: (label) => `Feature: ${label}` }), _jsx(Bar, { animationDuration: 500, dataKey: "absValue", children: shapData.map((entry, index) => (_jsx(Cell, { fill: entry.value > 0 ? '#4caf50' : '#f44336' }, `cell-${index}`))) })] }) }) })] })] }));
};
