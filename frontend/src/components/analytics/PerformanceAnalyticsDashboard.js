import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button, Box, Grid, Chip, Alert, LinearProgress, Tooltip, IconButton, Divider, Paper, Stack, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Avatar, Badge, } from "@mui/material";
import { TrendingUp, TrendingDown, Assessment, Warning, Download, Timeline, Refresh, ShowChart, Analytics, Psychology, EmojiEvents, PieChart, Insights, PrecisionManufacturing, } from "@mui/icons-material";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ComposedChart, } from "recharts";
import { useUnifiedAnalytics } from "../../hooks/useUnifiedAnalytics";
import { formatCurrency, formatPercentage, } from "../../utils/formatters";
const COLORS = {
    primary: "#1976d2",
    secondary: "#dc004e",
    success: "#2e7d32",
    warning: "#ed6c02",
    error: "#d32f2f",
    info: "#0288d1",
};
const PIE_COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
];
export const PerformanceAnalyticsDashboard = ({ userId = "default", timeRange = "30d", showAdvancedMetrics = true }) => {
    // State Management
    const [activeTab, setActiveTab] = useState(0);
    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showComparison, setShowComparison] = useState(false);
    const [benchmarkData, setBenchmarkData] = useState(null);
    // Performance Data State
    const [metrics, setMetrics] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [categoryPerformance, setCategoryPerformance] = useState([]);
    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    // Analytics Hook
    const { performance, ml, betting } = useUnifiedAnalytics({
        performance: {
            autoUpdate: true,
            updateInterval: 60000,
            timeRange: selectedTimeRange,
            userId,
        },
        ml: { autoUpdate: true },
        betting: { autoUpdate: true },
    });
    // Load Performance Data
    const loadPerformanceData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulate loading performance data
            const mockMetrics = {
                totalBets: 1247,
                winRate: 0.624,
                roi: 0.142,
                profitLoss: 8432.5,
                avgOdds: 2.15,
                avgStake: 125.0,
                sharpeRatio: 1.73,
                maxDrawdown: -0.085,
                winStreak: 12,
                lossStreak: 5,
                profitFactor: 1.89,
                kellyOptimal: 0.08,
                consistencyScore: 0.78,
                riskAdjustedReturn: 0.196,
                confidenceAccuracy: 0.856,
                modelAccuracy: 0.681,
            };
            const mockPredictions = [
                {
                    modelName: "Ensemble ML",
                    accuracy: 0.725,
                    precision: 0.698,
                    recall: 0.742,
                    f1Score: 0.719,
                    calibration: 0.891,
                    coverage: 0.856,
                    totalPredictions: 456,
                    profitContribution: 3247.8,
                    avgConfidence: 0.724,
                    riskAdjustedScore: 0.832,
                },
                {
                    modelName: "Deep Learning",
                    accuracy: 0.689,
                    precision: 0.672,
                    recall: 0.698,
                    f1Score: 0.685,
                    calibration: 0.823,
                    coverage: 0.779,
                    totalPredictions: 389,
                    profitContribution: 2156.4,
                    avgConfidence: 0.689,
                    riskAdjustedScore: 0.756,
                },
                {
                    modelName: "Random Forest",
                    accuracy: 0.651,
                    precision: 0.634,
                    recall: 0.669,
                    f1Score: 0.651,
                    calibration: 0.778,
                    coverage: 0.712,
                    totalPredictions: 402,
                    profitContribution: 1843.3,
                    avgConfidence: 0.651,
                    riskAdjustedScore: 0.698,
                },
            ];
            // Generate time series data
            const mockTimeSeriesData = [];
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(selectedTimeRange.replace(/\D/g, "")) ||
                30);
            let cumulativeProfit = 0;
            for (let i = 0; i < 30; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const dailyReturn = (Math.random() - 0.45) * 200; // Slight positive bias
                cumulativeProfit += dailyReturn;
                mockTimeSeriesData.push({
                    timestamp: date.toISOString().split("T")[0],
                    cumulativeProfit,
                    winRate: 0.55 + (Math.random() - 0.5) * 0.2,
                    roi: 0.12 + (Math.random() - 0.5) * 0.1,
                    confidence: 0.7 + (Math.random() - 0.5) * 0.3,
                    volume: Math.floor(Math.random() * 50) + 20,
                    drawdown: Math.min(0, cumulativeProfit -
                        Math.max(...mockTimeSeriesData.map((d) => d.cumulativeProfit), 0)),
                });
            }
            const mockCategoryPerformance = [
                {
                    category: "NBA Points",
                    bets: 234,
                    winRate: 0.647,
                    roi: 0.178,
                    profit: 2341.5,
                    avgOdds: 1.95,
                    riskLevel: "medium",
                },
                {
                    category: "NFL Spreads",
                    bets: 187,
                    winRate: 0.598,
                    roi: 0.142,
                    profit: 1876.2,
                    avgOdds: 1.91,
                    riskLevel: "high",
                },
                {
                    category: "MLB Over/Under",
                    bets: 156,
                    winRate: 0.673,
                    roi: 0.203,
                    profit: 1987.4,
                    avgOdds: 2.08,
                    riskLevel: "low",
                },
                {
                    category: "Soccer Goals",
                    bets: 98,
                    winRate: 0.612,
                    roi: 0.089,
                    profit: 789.6,
                    avgOdds: 2.45,
                    riskLevel: "high",
                },
            ];
            setMetrics(mockMetrics);
            setPredictions(mockPredictions);
            setTimeSeriesData(mockTimeSeriesData);
            setCategoryPerformance(mockCategoryPerformance);
            setLastUpdate(new Date());
        }
        catch (err) {
            setError("Failed to load performance data");
            console.error("Performance data loading error:", err);
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedTimeRange, userId]);
    // Load data on mount and when dependencies change
    useEffect(() => {
        loadPerformanceData();
    }, [loadPerformanceData]);
    // Computed Values
    const filteredCategoryData = useMemo(() => {
        if (selectedCategory === "all")
            return categoryPerformance;
        return categoryPerformance.filter((cat) => cat.category === selectedCategory);
    }, [categoryPerformance, selectedCategory]);
    const performanceGrade = useMemo(() => {
        if (!metrics)
            return "N/A";
        const score = (metrics.winRate > 0.6 ? 20 : metrics.winRate * 33.33) +
            (metrics.roi > 0.15 ? 20 : metrics.roi * 133.33) +
            (metrics.sharpeRatio > 1.5 ? 20 : metrics.sharpeRatio * 13.33) +
            metrics.consistencyScore * 20 +
            (metrics.riskAdjustedReturn > 0.15
                ? 20
                : metrics.riskAdjustedReturn * 133.33);
        if (score >= 85)
            return "A+";
        if (score >= 80)
            return "A";
        if (score >= 75)
            return "B+";
        if (score >= 70)
            return "B";
        if (score >= 65)
            return "C+";
        if (score >= 60)
            return "C";
        return "D";
    }, [metrics]);
    const radarChartData = useMemo(() => {
        if (!metrics)
            return [];
        return [
            {
                metric: "Win Rate",
                value: metrics.winRate * 100,
                fullMark: 100,
            },
            {
                metric: "ROI",
                value: Math.min(metrics.roi * 500, 100), // Scale to 100
                fullMark: 100,
            },
            {
                metric: "Sharpe Ratio",
                value: Math.min(metrics.sharpeRatio * 33.33, 100),
                fullMark: 100,
            },
            {
                metric: "Consistency",
                value: metrics.consistencyScore * 100,
                fullMark: 100,
            },
            {
                metric: "Confidence Accuracy",
                value: metrics.confidenceAccuracy * 100,
                fullMark: 100,
            },
            {
                metric: "Model Accuracy",
                value: metrics.modelAccuracy * 100,
                fullMark: 100,
            },
        ];
    }, [metrics]);
    // Export Function
    const exportPerformanceReport = useCallback(() => {
        const exportData = {
            timestamp: new Date().toISOString(),
            userId,
            timeRange: selectedTimeRange,
            performanceGrade,
            metrics,
            predictions,
            categoryPerformance,
            summary: {
                totalProfit: metrics?.profitLoss || 0,
                winRate: metrics?.winRate || 0,
                roi: metrics?.roi || 0,
                sharpeRatio: metrics?.sharpeRatio || 0,
                bestCategory: categoryPerformance.reduce((best, cat) => (cat.roi > best.roi ? cat : best), categoryPerformance[0] || {})?.category || "N/A",
                topModel: predictions.reduce((top, pred) => (pred.accuracy > top.accuracy ? pred : top), predictions[0] || {})?.modelName || "N/A",
            },
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `performance-report-${userId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [
        userId,
        selectedTimeRange,
        performanceGrade,
        metrics,
        predictions,
        categoryPerformance,
    ]);
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 400, children: _jsx(CircularProgress, { size: 60 }) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", action: _jsx(Button, { color: "inherit", size: "small", onClick: loadPerformanceData, children: "Retry" }), children: error }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full", children: _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h5", component: "h2", sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(Analytics, {}), "Performance Analytics Dashboard", _jsx(Badge, { badgeContent: performanceGrade, color: performanceGrade.startsWith("A")
                                            ? "success"
                                            : performanceGrade.startsWith("B")
                                                ? "warning"
                                                : "error", sx: { ml: 1 }, children: _jsx(EmojiEvents, {}) })] }), _jsxs(Box, { display: "flex", gap: 1, alignItems: "center", children: [_jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Time Range" }), _jsxs(Select, { value: selectedTimeRange, onChange: (e) => setSelectedTimeRange(e.target.value), children: [_jsx(MenuItem, { value: "7d", children: "7 Days" }), _jsx(MenuItem, { value: "30d", children: "30 Days" }), _jsx(MenuItem, { value: "90d", children: "90 Days" }), _jsx(MenuItem, { value: "1y", children: "1 Year" }), _jsx(MenuItem, { value: "all", children: "All Time" })] })] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: showComparison, onChange: (e) => setShowComparison(e.target.checked) }), label: "Benchmark" }), _jsx(Tooltip, { title: "Last updated", children: _jsx(Chip, { label: lastUpdate.toLocaleTimeString(), size: "small", icon: _jsx(Timeline, {}) }) }), _jsx(IconButton, { onClick: loadPerformanceData, children: _jsx(Refresh, {}) }), _jsx(IconButton, { onClick: exportPerformanceReport, children: _jsx(Download, {}) })] })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "primary.main", children: formatCurrency(metrics?.profitLoss || 0) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Total P&L" }), _jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", mt: 1, children: (metrics?.profitLoss || 0) > 0 ? (_jsx(TrendingUp, { color: "success", fontSize: "small" })) : (_jsx(TrendingDown, { color: "error", fontSize: "small" })) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "secondary.main", children: formatPercentage(metrics?.winRate || 0) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Win Rate" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: (metrics?.winRate || 0) > 0.6
                                                    ? "Excellent"
                                                    : (metrics?.winRate || 0) > 0.55
                                                        ? "Good"
                                                        : "Needs Improvement", color: (metrics?.winRate || 0) > 0.6
                                                    ? "success"
                                                    : (metrics?.winRate || 0) > 0.55
                                                        ? "warning"
                                                        : "error", size: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "success.main", children: formatPercentage(metrics?.roi || 0) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "ROI" }), _jsx(Box, { mt: 1, children: _jsx(LinearProgress, { variant: "determinate", value: Math.min((metrics?.roi || 0) * 500, 100), color: (metrics?.roi || 0) > 0.15
                                                    ? "success"
                                                    : (metrics?.roi || 0) > 0.05
                                                        ? "warning"
                                                        : "error" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "info.main", children: (metrics?.sharpeRatio || 0).toFixed(2) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Sharpe Ratio" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: (metrics?.sharpeRatio || 0) > 1.5
                                                    ? "Excellent"
                                                    : (metrics?.sharpeRatio || 0) > 1.0
                                                        ? "Good"
                                                        : "Fair", color: (metrics?.sharpeRatio || 0) > 1.5
                                                    ? "success"
                                                    : (metrics?.sharpeRatio || 0) > 1.0
                                                        ? "warning"
                                                        : "default", size: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "warning.main", children: formatPercentage(Math.abs(metrics?.maxDrawdown || 0)) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Max Drawdown" }), _jsx(Box, { mt: 1, children: _jsx(Warning, { color: Math.abs(metrics?.maxDrawdown || 0) > 0.15
                                                    ? "error"
                                                    : Math.abs(metrics?.maxDrawdown || 0) > 0.1
                                                        ? "warning"
                                                        : "disabled", fontSize: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", children: metrics?.totalBets || 0 }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Total Bets" }), _jsxs(Typography, { variant: "caption", display: "block", color: "textSecondary", children: [metrics?.winStreak || 0, "W / ", metrics?.lossStreak || 0, "L streak"] })] }) })] }), _jsxs(Tabs, { value: activeTab, onChange: (_, newValue) => setActiveTab(newValue), sx: { borderBottom: 1, borderColor: "divider", mb: 2 }, children: [_jsx(Tab, { label: "Performance Trends", icon: _jsx(ShowChart, {}) }), _jsx(Tab, { label: "Model Analysis", icon: _jsx(PrecisionManufacturing, {}) }), _jsx(Tab, { label: "Category Breakdown", icon: _jsx(PieChart, {}) }), _jsx(Tab, { label: "Risk Analysis", icon: _jsx(Assessment, {}) }), _jsx(Tab, { label: "Insights", icon: _jsx(Insights, {}) })] }), activeTab === 0 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Cumulative Performance" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(ComposedChart, { data: timeSeriesData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Area, { yAxisId: "left", type: "monotone", dataKey: "cumulativeProfit", fill: COLORS.primary, fillOpacity: 0.3, stroke: COLORS.primary, name: "Cumulative Profit" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "winRate", stroke: COLORS.success, strokeWidth: 2, name: "Win Rate" }), _jsx(Bar, { yAxisId: "right", dataKey: "volume", fill: COLORS.secondary, opacity: 0.6, name: "Daily Volume" })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2, height: 450 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Performance Radar" }), _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(RadarChart, { data: radarChartData, children: [_jsx(PolarGrid, {}), _jsx(PolarAngleAxis, { dataKey: "metric" }), _jsx(PolarRadiusAxis, { angle: 90, domain: [0, 100], tick: false }), _jsx(Radar, { name: "Performance", dataKey: "value", stroke: COLORS.primary, fill: COLORS.primary, fillOpacity: 0.3, strokeWidth: 2 })] }) })] }) })] })), activeTab === 1 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Model Performance Comparison" }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Model" }), _jsx(TableCell, { children: "Accuracy" }), _jsx(TableCell, { children: "Precision" }), _jsx(TableCell, { children: "Recall" }), _jsx(TableCell, { children: "F1 Score" }), _jsx(TableCell, { children: "Calibration" }), _jsx(TableCell, { children: "Profit Contribution" }), _jsx(TableCell, { children: "Risk Score" })] }) }), _jsx(TableBody, { children: predictions.map((model) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(Avatar, { sx: { width: 32, height: 32, fontSize: 12 }, children: model.modelName
                                                                                    .split(" ")
                                                                                    .map((n) => n[0])
                                                                                    .join("") }), _jsx(Typography, { variant: "body2", children: model.modelName })] }) }), _jsx(TableCell, { children: _jsx(Chip, { label: formatPercentage(model.accuracy), color: model.accuracy > 0.7
                                                                            ? "success"
                                                                            : model.accuracy > 0.6
                                                                                ? "warning"
                                                                                : "error", size: "small" }) }), _jsx(TableCell, { children: formatPercentage(model.precision) }), _jsx(TableCell, { children: formatPercentage(model.recall) }), _jsx(TableCell, { children: model.f1Score.toFixed(3) }), _jsx(TableCell, { children: _jsx(LinearProgress, { variant: "determinate", value: model.calibration * 100, sx: { width: 60 } }) }), _jsx(TableCell, { children: _jsx(Typography, { color: model.profitContribution > 0
                                                                            ? "success.main"
                                                                            : "error.main", children: formatCurrency(model.profitContribution) }) }), _jsx(TableCell, { children: _jsx(Chip, { label: model.riskAdjustedScore.toFixed(2), color: model.riskAdjustedScore > 0.8
                                                                            ? "success"
                                                                            : model.riskAdjustedScore > 0.7
                                                                                ? "warning"
                                                                                : "error", size: "small" }) })] }, model.modelName))) })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Model Contributions" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: predictions.map((p) => ({
                                                            name: p.modelName,
                                                            value: p.profitContribution,
                                                            color: PIE_COLORS[predictions.indexOf(p) % PIE_COLORS.length],
                                                        })), dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: ({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`, children: predictions.map((_, index) => (_jsx(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))) }), _jsx(RechartsTooltip, { formatter: (value) => formatCurrency(value) })] }) })] }) })] })), activeTab === 2 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsxs(Box, { display: "flex", justifyContent: "between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Category Performance" }), _jsxs(FormControl, { size: "small", sx: { minWidth: 150 }, children: [_jsx(InputLabel, { children: "Category" }), _jsxs(Select, { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Categories" }), categoryPerformance.map((cat) => (_jsx(MenuItem, { value: cat.category, children: cat.category }, cat.category)))] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(RechartsBarChart, { data: filteredCategoryData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category" }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Bar, { yAxisId: "left", dataKey: "profit", fill: COLORS.success, name: "Profit" }), _jsx(Bar, { yAxisId: "right", dataKey: "winRate", fill: COLORS.primary, name: "Win Rate" })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Category Summary" }), _jsx(Stack, { spacing: 2, children: categoryPerformance.map((category) => (_jsxs(Box, { sx: {
                                                    p: 2,
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                    backgroundColor: selectedCategory === category.category
                                                        ? "action.selected"
                                                        : "inherit",
                                                }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, children: [_jsx(Typography, { variant: "subtitle2", children: category.category }), _jsx(Chip, { label: category.riskLevel, color: category.riskLevel === "low"
                                                                    ? "success"
                                                                    : category.riskLevel === "medium"
                                                                        ? "warning"
                                                                        : "error", size: "small" })] }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Bets" }), _jsx(Typography, { variant: "body2", children: category.bets })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Win Rate" }), _jsx(Typography, { variant: "body2", children: formatPercentage(category.winRate) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "ROI" }), _jsx(Typography, { variant: "body2", color: category.roi >= 0
                                                                            ? "success.main"
                                                                            : "error.main", children: formatPercentage(category.roi) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Profit" }), _jsx(Typography, { variant: "body2", color: category.profit >= 0
                                                                            ? "success.main"
                                                                            : "error.main", children: formatCurrency(category.profit) })] })] })] }, category.category))) })] }) })] })), activeTab === 3 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Risk Metrics" }), _jsxs(Stack, { spacing: 3, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Value at Risk (VaR)" }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h5", color: "error.main", children: formatCurrency((metrics?.profitLoss || 0) * 0.05) }), _jsx(Typography, { variant: "caption", children: "95% Confidence" })] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Expected Shortfall" }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h5", color: "warning.main", children: formatCurrency((metrics?.profitLoss || 0) * 0.08) }), _jsx(Typography, { variant: "caption", children: "Conditional VaR" })] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Kelly Optimal Fraction" }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h5", color: "info.main", children: formatPercentage(metrics?.kellyOptimal || 0) }), _jsx(Typography, { variant: "caption", children: "Recommended Size" })] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Risk-Adjusted Return" }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h5", color: "success.main", children: formatPercentage(metrics?.riskAdjustedReturn || 0) }), _jsx(Typography, { variant: "caption", children: "Return per Unit Risk" })] })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Drawdown Analysis" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: timeSeriesData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Area, { type: "monotone", dataKey: "drawdown", stroke: COLORS.error, fill: COLORS.error, fillOpacity: 0.3, name: "Drawdown" })] }) }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Max Drawdown Duration" }), _jsx(Typography, { variant: "h6", children: "14 days" })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Recovery Time" }), _jsx(Typography, { variant: "h6", children: "8 days" })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Calmar Ratio" }), _jsx(Typography, { variant: "h6", children: ((metrics?.roi || 0) /
                                                                Math.abs(metrics?.maxDrawdown || 0.01)).toFixed(2) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Sterling Ratio" }), _jsx(Typography, { variant: "h6", children: ((metrics?.roi || 0) /
                                                                (Math.abs(metrics?.maxDrawdown || 0.01) + 0.1)).toFixed(2) })] })] })] }) })] })), activeTab === 4 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Performance Insights" }), _jsxs(Stack, { spacing: 2, children: [_jsxs(Alert, { severity: "success", icon: _jsx(TrendingUp, {}), children: [_jsx(Typography, { variant: "subtitle2", children: "Strong Performance Detected" }), _jsxs(Typography, { variant: "body2", children: ["Your ", formatPercentage(metrics?.winRate || 0), " win rate is above the 75th percentile. Consider increasing position sizes within Kelly criteria."] })] }), _jsxs(Alert, { severity: "info", icon: _jsx(Assessment, {}), children: [_jsx(Typography, { variant: "subtitle2", children: "Model Optimization Opportunity" }), _jsxs(Typography, { variant: "body2", children: ["Ensemble ML model shows", " ", formatPercentage(predictions[0]?.accuracy || 0), " ", "accuracy. Consider ensemble weighting adjustments for improved performance."] })] }), _jsxs(Alert, { severity: "warning", icon: _jsx(Warning, {}), children: [_jsx(Typography, { variant: "subtitle2", children: "Risk Management Note" }), _jsxs(Typography, { variant: "body2", children: ["Maximum drawdown of", " ", formatPercentage(Math.abs(metrics?.maxDrawdown || 0)), " ", "suggests implementing stricter position sizing during losing streaks."] })] }), _jsxs(Alert, { severity: "info", icon: _jsx(Psychology, {}), children: [_jsx(Typography, { variant: "subtitle2", children: "Category Performance Insight" }), _jsxs(Typography, { variant: "body2", children: ["NBA Points category shows highest ROI at", " ", formatPercentage(categoryPerformance[0]?.roi || 0), ". Consider increasing allocation to this market segment."] })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Recommendations" }), _jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "success.main", gutterBottom: true, children: "\u2713 Optimal Kelly Sizing" }), _jsxs(Typography, { variant: "body2", children: ["Current ", formatPercentage(metrics?.kellyOptimal || 0), " ", "allocation is appropriate."] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "warning.main", gutterBottom: true, children: "\u26A0 Model Diversification" }), _jsx(Typography, { variant: "body2", children: "Consider adding momentum-based models to ensemble." })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "info.main", gutterBottom: true, children: "\u2139 Market Expansion" }), _jsx(Typography, { variant: "body2", children: "Explore tennis and esports markets for diversification." })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "error.main", gutterBottom: true, children: "\u26D4 Risk Control" }), _jsx(Typography, { variant: "body2", children: "Implement dynamic position sizing based on recent performance." })] })] })] }) })] }))] }) }) }));
};
export default PerformanceAnalyticsDashboard;
