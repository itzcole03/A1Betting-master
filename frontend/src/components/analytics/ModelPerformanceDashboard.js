import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Alert, Button, Tabs, Tab, } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { useModelPerformance } from '../../hooks/useModelPerformance';
import { PerformanceAlerts } from './PerformanceAlerts';
import { PerformanceExport } from './PerformanceExport';
import { ModelComparison } from './ModelComparison';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
export const ModelPerformanceDashboard = ({ modelName, availableModels = [], }) => {
    const [showExport, setShowExport] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const { performance, history, isLoading, error, timeframe, setTimeframe } = useModelPerformance(modelName);
    if (isLoading) {
        return (_jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: "400px", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Box, { p: 2, children: _jsx(Alert, { severity: "error", children: error }) }));
    }
    if (!performance) {
        return (_jsx(Box, { p: 2, children: _jsx(Alert, { severity: "info", children: "No performance data available for this model." }) }));
    }
    const formatMetric = (value, type = 'number') => {
        if (type === 'percentage') {
            return `${(value * 100).toFixed(1)}%`;
        }
        if (type === 'currency') {
            return `$${value.toFixed(2)}`;
        }
        return value.toFixed(2);
    };
    const getMetricColor = (value, label) => {
        if (label === 'Max Drawdown') {
            return value > 0.2 ? 'error.main' : value > 0.1 ? 'warning.main' : 'success.main';
        }
        if (label === 'Calibration Score') {
            return value > 0.8 ? 'success.main' : value > 0.6 ? 'warning.main' : 'error.main';
        }
        if (label === 'Kelly Criterion') {
            return value > 0.1 ? 'success.main' : value > 0.05 ? 'warning.main' : 'error.main';
        }
        if (value > 0)
            return 'success.main';
        if (value < 0)
            return 'error.main';
        return 'text.primary';
    };
    const metrics = [
        { label: 'ROI', value: performance.roi, type: 'percentage' },
        { label: 'Win Rate', value: performance.winRate, type: 'percentage' },
        { label: 'Profit Factor', value: performance.profitFactor, type: 'number' },
        { label: 'Sharpe Ratio', value: performance.sharpeRatio, type: 'number' },
        { label: 'Max Drawdown', value: performance.maxDrawdown, type: 'percentage' },
        { label: 'Kelly Criterion', value: performance.kellyCriterion, type: 'percentage' },
        { label: 'Expected Value', value: performance.expectedValue, type: 'currency' },
        { label: 'Calibration Score', value: performance.calibrationScore, type: 'number' },
        { label: 'Total Predictions', value: performance.totalPredictions, type: 'number' },
        { label: 'Total Stake', value: performance.totalStake, type: 'currency' },
        { label: 'Total Payout', value: performance.totalPayout, type: 'currency' },
    ];
    return (_jsxs(Box, { p: 2, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 3, children: [_jsx(Typography, { component: "h2", variant: "h5", children: "Model Performance Dashboard" }), _jsxs(Box, { display: "flex", gap: 2, children: [_jsxs(FormControl, { sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Timeframe" }), _jsxs(Select, { label: "Timeframe", value: timeframe, onChange: e => setTimeframe(e.target.value), children: [_jsx(MenuItem, { value: "day", children: "Last 24 Hours" }), _jsx(MenuItem, { value: "week", children: "Last Week" }), _jsx(MenuItem, { value: "month", children: "Last Month" }), _jsx(MenuItem, { value: "all", children: "All Time" })] })] }), _jsx(Button, { startIcon: _jsx(FileDownloadIcon, {}), variant: "outlined", onClick: () => setShowExport(true), children: "Export Data" })] })] }), _jsxs(Tabs, { sx: { mb: 3 }, value: activeTab, onChange: (_, newValue) => setActiveTab(newValue), children: [_jsx(Tab, { label: "Performance Overview" }), availableModels.length > 0 && _jsx(Tab, { label: "Model Comparison" })] }), activeTab === 0 ? (_jsxs(_Fragment, { children: [_jsx(Grid, { container: true, mb: 4, spacing: 3, children: metrics.map(metric => (_jsx(Grid, { item: true, md: 3, sm: 6, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", children: metric.label }), _jsx(Typography, { color: getMetricColor(metric.value, metric.label), component: "div", variant: "h6", children: formatMetric(metric.value, metric.type) })] }) }) }, metric.label))) }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 8, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Performance History" }), _jsx(Box, { height: 400, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(LineChart, { data: history, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: timestamp => new Date(timestamp).toLocaleDateString() }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { orientation: "right", yAxisId: "right" }), _jsx(Tooltip, { formatter: (value) => formatMetric(value, 'percentage'), labelFormatter: timestamp => new Date(timestamp).toLocaleString() }), _jsx(Legend, {}), _jsx(Line, { dataKey: "metrics.roi", name: "ROI", stroke: "#8884d8", type: "monotone", yAxisId: "left" }), _jsx(Line, { dataKey: "metrics.winRate", name: "Win Rate", stroke: "#82ca9d", type: "monotone", yAxisId: "left" }), _jsx(Line, { dataKey: "metrics.profitFactor", name: "Profit Factor", stroke: "#ffc658", type: "monotone", yAxisId: "right" }), _jsx(Line, { dataKey: "metrics.calibrationScore", name: "Calibration Score", stroke: "#ff8042", type: "monotone", yAxisId: "right" })] }) }) })] }) }) }), _jsx(Grid, { item: true, md: 4, xs: 12, children: _jsx(PerformanceAlerts, { modelName: modelName }) })] })] })) : (_jsx(ModelComparison, { modelNames: [modelName, ...availableModels] })), showExport && (_jsx(PerformanceExport, { modelName: modelName, onClose: () => setShowExport(false) }))] }));
};
