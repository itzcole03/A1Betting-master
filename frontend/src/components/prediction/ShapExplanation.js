import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, LineChart, Line, Cell, } from 'recharts';
import { Box, Paper, Typography, Tabs, Tab, Chip, Stack, } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { "aria-labelledby": `shap-tab-${index}`, hidden: value !== index, id: `shap-tabpanel-${index}`, role: "tabpanel", ...other, children: value === index && _jsx(Box, { sx: { p: 3 }, children: children }) }));
};
export const ShapExplanation = ({ explanation, className = '', }) => {
    const [tabValue, setTabValue] = useState(0);
    const { shapExplanation, modelName, confidence } = explanation;
    // Prepare data for different visualizations
    const barChartData = (shapExplanation?.shapValues ?? []).map(value => ({
        feature: value.feature,
        impact: value.impact,
        direction: value.direction,
        value: value.value,
        confidence: value.confidence || 0.8,
    }));
    const scatterData = (shapExplanation?.shapValues ?? []).map(value => ({
        feature: value.feature,
        impact: value.impact,
        value: value.value,
        confidence: value.confidence || 0.8,
    }));
    const waterfallData = (shapExplanation?.shapValues ?? []).reduce((acc, value, index) => {
        const prevValue = index === 0 ? shapExplanation.baseValue : acc[index - 1].end;
        return [
            ...acc,
            {
                feature: value.feature,
                start: prevValue,
                end: prevValue + value.impact,
                impact: value.impact,
                confidence: value.confidence || 0.8,
            },
        ];
    }, []);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    // Calculate feature impact statistics
    const positiveFeatures = barChartData.filter(f => f.impact > 0);
    const negativeFeatures = barChartData.filter(f => f.impact < 0);
    const totalImpact = barChartData.reduce((sum, f) => sum + Math.abs(f.impact), 0);
    const topFeatures = [...barChartData]
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, 3);
    return (_jsxs(Paper, { className: `p-4 ${className}`, elevation: 3, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", children: modelName }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 2, children: [_jsx(Chip, { color: "success", icon: _jsx(TrendingUpIcon, {}), label: `${positiveFeatures.length} Positive Features`, size: "small" }), _jsx(Chip, { color: "error", icon: _jsx(TrendingDownIcon, {}), label: `${negativeFeatures.length} Negative Features`, size: "small" }), _jsx(Chip, { color: "primary", label: `Total Impact: ${totalImpact.toFixed(3)}`, size: "small" })] })] }), _jsxs(Box, { mb: 2, children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", variant: "subtitle2", children: "Top Influential Features" }), _jsx(Stack, { direction: "row", spacing: 1, children: topFeatures.map((feature, index) => (_jsx(Chip, { color: feature.impact > 0 ? 'success' : 'error', label: `${feature.feature}: ${feature.impact.toFixed(3)}`, size: "small" }, index))) })] }), _jsxs(Tabs, { centered: true, value: tabValue, onChange: handleTabChange, children: [_jsx(Tab, { label: "Feature Impact" }), _jsx(Tab, { label: "Feature Dependence" }), _jsx(Tab, { label: "Waterfall" })] }), _jsx(TabPanel, { index: 0, value: tabValue, children: _jsx(Box, { height: 400, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(BarChart, { data: barChartData, layout: "vertical", children: [_jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "feature", tick: { fontSize: 12 }, type: "category", width: 150 }), _jsx(Tooltip, { formatter: (value, name, props) => {
                                        const item = barChartData[props.payload.index];
                                        return [
                                            `${item.impact.toFixed(4)} (${item.impact > 0 ? 'Positive' : 'Negative'} Impact)`,
                                            'Impact',
                                        ];
                                    }, labelFormatter: (label) => `Feature: ${label}` }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "impact", fill: "#8884d8", isAnimationActive: false, label: { position: 'right' }, children: barChartData.map((entry, index) => (_jsx(Cell, { fill: entry.impact > 0 ? '#4caf50' : '#f44336', opacity: entry.confidence }, `cell-${index}`))) })] }) }) }) }), _jsx(TabPanel, { index: 1, value: tabValue, children: _jsx(Box, { height: 400, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(ScatterChart, { children: [_jsx(XAxis, { dataKey: "value", name: "Feature Value" }), _jsx(YAxis, { dataKey: "impact", name: "Impact" }), _jsx(Tooltip, { formatter: (value, name, props) => {
                                        const item = scatterData[props.payload.index];
                                        return [
                                            `${item.impact.toFixed(4)} (${item.impact > 0 ? 'Positive' : 'Negative'} Impact)`,
                                            'Impact',
                                        ];
                                    }, labelFormatter: (label) => `Feature: ${label}` }), _jsx(Legend, {}), _jsx(Scatter, { data: scatterData, fill: "#8884d8", isAnimationActive: false, children: scatterData.map((entry, index) => (_jsx(Cell, { fill: entry.impact > 0 ? '#4caf50' : '#f44336', opacity: entry.confidence }, `cell-${index}`))) })] }) }) }) }), _jsx(TabPanel, { index: 2, value: tabValue, children: _jsx(Box, { height: 400, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(LineChart, { data: waterfallData, children: [_jsx(XAxis, { dataKey: "feature" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value, name, props) => {
                                        const item = waterfallData[props.payload.index];
                                        return [
                                            `${item.impact.toFixed(4)} (${item.impact > 0 ? 'Positive' : 'Negative'} Impact)`,
                                            'Impact',
                                        ];
                                    }, labelFormatter: (label) => `Feature: ${label}` }), _jsx(Legend, {}), _jsx(Line, { dataKey: "end", dot: { fill: '#8884d8' }, isAnimationActive: false, stroke: "#8884d8", type: "monotone" })] }) }) }) })] }));
};
