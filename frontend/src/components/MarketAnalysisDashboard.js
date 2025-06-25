import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button, Box, Grid, Chip, Alert, LinearProgress, Tooltip, IconButton, Divider, Paper, Stack, Select, MenuItem, FormControl, InputLabel, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";
import { TrendingUp, TrendingDown, Assessment, MonetizationOn, Warning, Download, Timeline, ExpandMore, Refresh, ShowChart, PieChart, BarChart, CandlestickChart, } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, } from "recharts";
import { MarketAnalysisService } from "../services/marketAnalysisService";
import { formatCurrency, formatPercentage, formatDateTime, } from "../utils/formatters";
const COLORS = {
    primary: "#1976d2",
    secondary: "#dc004e",
    success: "#2e7d32",
    warning: "#ed6c02",
    error: "#d32f2f",
    info: "#0288d1",
};
const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
export const MarketAnalysisDashboard = ({ eventId = "default", autoRefresh = true, refreshInterval = 30000, showAdvancedMetrics = true, }) => {
    // State Management
    const [activeTab, setActiveTab] = useState(0);
    const [timeRange, setTimeRange] = useState("6h");
    const [selectedMetric, setSelectedMetric] = useState("volume");
    // Market Data State
    const [metrics, setMetrics] = useState(null);
    const [efficiency, setEfficiency] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [oddsMovements, setOddsMovements] = useState([]);
    const [volumeAnalysis, setVolumeAnalysis] = useState(null);
    const [sentimentData, setSentimentData] = useState(null);
    const [arbitrageOpportunities, setArbitrageOpportunities] = useState([]);
    const [marketDepth, setMarketDepth] = useState(null);
    const [liquidityMetrics, setLiquidityMetrics] = useState(null);
    const [volatilityData, setVolatilityData] = useState(null);
    const [historicalSnapshots, setHistoricalSnapshots] = useState([]);
    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    // Service Instance
    const marketAnalysisService = useMemo(() => MarketAnalysisService.getInstance(), []);
    // Data Loading Functions
    const loadMarketData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Load all market data in parallel
            const [metricsData, efficiencyData, anomaliesData, oddsData, volumeData, sentimentInfo, arbitrageData, depthData, liquidityData, volatilityInfo,] = await Promise.all([
                marketAnalysisService.getMarketMetrics(eventId),
                marketAnalysisService.getMarketEfficiency(eventId),
                marketAnalysisService.getAnomalies(eventId),
                marketAnalysisService.getOddsMovements(eventId, timeRange),
                marketAnalysisService.getVolumeAnalysis(eventId, timeRange),
                marketAnalysisService.getSentimentData(eventId),
                marketAnalysisService.getArbitrageOpportunities(eventId),
                marketAnalysisService.getMarketDepth(eventId),
                marketAnalysisService.getLiquidityMetrics(eventId),
                marketAnalysisService.getVolatilityData(eventId, timeRange),
            ]);
            setMetrics(metricsData);
            setEfficiency(efficiencyData);
            setAnomalies(anomaliesData);
            setOddsMovements(oddsData);
            setVolumeAnalysis(volumeData);
            setSentimentData(sentimentInfo);
            setArbitrageOpportunities(arbitrageData);
            setMarketDepth(depthData);
            setLiquidityMetrics(liquidityData);
            setVolatilityData(volatilityInfo);
            // Create historical snapshot
            if (metricsData && efficiencyData && sentimentInfo) {
                const snapshot = {
                    timestamp: Date.now(),
                    totalVolume: metricsData.totalVolume,
                    avgOdds: metricsData.avgOdds,
                    volatility: volatilityInfo?.currentVolatility || 0,
                    efficiency: efficiencyData.overallEfficiency,
                    sentiment: sentimentInfo.overall,
                    arbitrageCount: arbitrageData.length,
                };
                setHistoricalSnapshots((prev) => {
                    const updated = [...prev, snapshot];
                    // Keep last 100 snapshots
                    return updated.slice(-100);
                });
            }
            setLastUpdate(new Date());
        }
        catch (err) {
            setError("Failed to load market data");
            console.error("Market data loading error:", err);
        }
        finally {
            setIsLoading(false);
        }
    }, [eventId, timeRange, marketAnalysisService]);
    // Auto-refresh Effect
    useEffect(() => {
        loadMarketData();
        if (autoRefresh) {
            const interval = setInterval(loadMarketData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [loadMarketData, autoRefresh, refreshInterval]);
    // Chart Data Preparation
    const chartData = useMemo(() => {
        if (!oddsMovements.length)
            return [];
        return oddsMovements.map((movement) => ({
            timestamp: new Date(movement.timestamp).toLocaleTimeString(),
            odds: movement.newOdds,
            volume: movement.volume,
            change: movement.percentageChange,
            efficiency: movement.efficiency || 0,
        }));
    }, [oddsMovements]);
    const sentimentChartData = useMemo(() => {
        if (!sentimentData)
            return [];
        return [
            {
                name: "Positive",
                value: sentimentData.positive,
                color: COLORS.success,
            },
            { name: "Neutral", value: sentimentData.neutral, color: COLORS.info },
            { name: "Negative", value: sentimentData.negative, color: COLORS.error },
        ];
    }, [sentimentData]);
    const volumeDistributionData = useMemo(() => {
        if (!volumeAnalysis)
            return [];
        return volumeAnalysis.hourlyDistribution.map((volume, index) => ({
            hour: `${index}:00`,
            volume,
            percentageOfTotal: (volume / volumeAnalysis.totalVolume) * 100,
        }));
    }, [volumeAnalysis]);
    const marketDepthData = useMemo(() => {
        if (!marketDepth)
            return { bids: [], asks: [] };
        return {
            bids: marketDepth.bids.map((bid, index) => ({
                price: bid.odds,
                cumulative: marketDepth.bids
                    .slice(0, index + 1)
                    .reduce((sum, b) => sum + b.volume, 0),
                volume: bid.volume,
            })),
            asks: marketDepth.asks.map((ask, index) => ({
                price: ask.odds,
                cumulative: marketDepth.asks
                    .slice(0, index + 1)
                    .reduce((sum, a) => sum + a.volume, 0),
                volume: ask.volume,
            })),
        };
    }, [marketDepth]);
    // Export Functions
    const exportAnalysis = useCallback(() => {
        const exportData = {
            timestamp: new Date().toISOString(),
            eventId,
            timeRange,
            metrics,
            efficiency,
            anomalies,
            arbitrageOpportunities,
            historicalSnapshots,
            summary: {
                totalAnomalies: anomalies.length,
                totalArbitrageOpportunities: arbitrageOpportunities.length,
                marketEfficiency: efficiency?.overallEfficiency,
                avgVolatility: volatilityData?.avgVolatility,
                sentimentScore: sentimentData?.overall,
            },
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `market-analysis-${eventId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [
        eventId,
        timeRange,
        metrics,
        efficiency,
        anomalies,
        arbitrageOpportunities,
        historicalSnapshots,
        volatilityData,
        sentimentData,
    ]);
    // Risk Assessment
    const riskAssessment = useMemo(() => {
        if (!metrics || !efficiency || !volatilityData)
            return null;
        const riskFactors = [];
        let riskScore = 0;
        if (efficiency.overallEfficiency < 0.7) {
            riskFactors.push("Low market efficiency detected");
            riskScore += 2;
        }
        if (volatilityData.currentVolatility > volatilityData.avgVolatility * 2) {
            riskFactors.push("High volatility levels");
            riskScore += 3;
        }
        if (anomalies.length > 5) {
            riskFactors.push("Multiple market anomalies detected");
            riskScore += 2;
        }
        if (liquidityMetrics && liquidityMetrics.bidAskSpread > 0.1) {
            riskFactors.push("Wide bid-ask spreads");
            riskScore += 1;
        }
        const riskLevel = riskScore >= 5 ? "high" : riskScore >= 3 ? "medium" : "low";
        return {
            level: riskLevel,
            score: riskScore,
            factors: riskFactors,
            recommendation: riskLevel === "high"
                ? "Exercise extreme caution"
                : riskLevel === "medium"
                    ? "Proceed with caution"
                    : "Market conditions are favorable",
        };
    }, [metrics, efficiency, volatilityData, anomalies, liquidityMetrics]);
    if (isLoading && !metrics) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 400, children: _jsx(LinearProgress, { sx: { width: "50%" } }) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", action: _jsx(Button, { color: "inherit", size: "small", onClick: loadMarketData, children: "Retry" }), children: error }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full", children: _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h5", component: "h2", sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(Assessment, {}), "Market Analysis Dashboard", _jsx(Chip, { label: eventId, color: "primary", size: "small", sx: { ml: 1 } })] }), _jsxs(Box, { display: "flex", gap: 1, alignItems: "center", children: [_jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Time Range" }), _jsxs(Select, { value: timeRange, onChange: (e) => setTimeRange(e.target.value), children: [_jsx(MenuItem, { value: "1h", children: "1 Hour" }), _jsx(MenuItem, { value: "6h", children: "6 Hours" }), _jsx(MenuItem, { value: "24h", children: "24 Hours" }), _jsx(MenuItem, { value: "7d", children: "7 Days" })] })] }), _jsx(Tooltip, { title: "Last updated", children: _jsx(Chip, { label: lastUpdate.toLocaleTimeString(), size: "small", icon: _jsx(Timeline, {}) }) }), _jsx(IconButton, { onClick: loadMarketData, disabled: isLoading, children: _jsx(Refresh, {}) }), _jsx(IconButton, { onClick: exportAnalysis, children: _jsx(Download, {}) })] })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "primary.main", children: formatCurrency(metrics?.totalVolume || 0) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Total Volume" }), _jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", mt: 1, children: [volumeAnalysis && volumeAnalysis.change24h > 0 ? (_jsx(TrendingUp, { color: "success", fontSize: "small" })) : (_jsx(TrendingDown, { color: "error", fontSize: "small" })), _jsx(Typography, { variant: "caption", sx: { ml: 0.5 }, children: formatPercentage((volumeAnalysis?.change24h || 0) / 100) })] })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "secondary.main", children: formatPercentage((efficiency?.overallEfficiency || 0) / 100) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Market Efficiency" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: (efficiency?.overallEfficiency || 0) > 0.8
                                                    ? "High"
                                                    : (efficiency?.overallEfficiency || 0) > 0.6
                                                        ? "Medium"
                                                        : "Low", color: (efficiency?.overallEfficiency || 0) > 0.8
                                                    ? "success"
                                                    : (efficiency?.overallEfficiency || 0) > 0.6
                                                        ? "warning"
                                                        : "error", size: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "warning.main", children: anomalies.length }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Market Anomalies" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: anomalies.length > 5
                                                    ? "High Alert"
                                                    : anomalies.length > 2
                                                        ? "Moderate"
                                                        : "Normal", color: anomalies.length > 5
                                                    ? "error"
                                                    : anomalies.length > 2
                                                        ? "warning"
                                                        : "success", size: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "success.main", children: arbitrageOpportunities.length }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Arbitrage Opportunities" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: arbitrageOpportunities.length > 3
                                                    ? "Excellent"
                                                    : arbitrageOpportunities.length > 1
                                                        ? "Good"
                                                        : "Limited", color: arbitrageOpportunities.length > 3
                                                    ? "success"
                                                    : arbitrageOpportunities.length > 1
                                                        ? "warning"
                                                        : "default", size: "small" }) })] }) })] }), riskAssessment && (_jsxs(Alert, { severity: riskAssessment.level === "high"
                            ? "error"
                            : riskAssessment.level === "medium"
                                ? "warning"
                                : "success", sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "subtitle2", gutterBottom: true, children: ["Risk Assessment: ", riskAssessment.level.toUpperCase(), " (Score:", " ", riskAssessment.score, "/10)"] }), _jsx(Typography, { variant: "body2", gutterBottom: true, children: riskAssessment.recommendation }), riskAssessment.factors.length > 0 && (_jsxs(Box, { mt: 1, children: [_jsx(Typography, { variant: "caption", color: "textSecondary", children: "Risk Factors:" }), _jsx("ul", { style: { margin: 0, paddingLeft: 16 }, children: riskAssessment.factors.map((factor, index) => (_jsx("li", { children: _jsx(Typography, { variant: "caption", children: factor }) }, index))) })] }))] })), _jsxs(Tabs, { value: activeTab, onChange: (_, newValue) => setActiveTab(newValue), sx: { borderBottom: 1, borderColor: "divider", mb: 2 }, children: [_jsx(Tab, { label: "Market Trends", icon: _jsx(ShowChart, {}) }), _jsx(Tab, { label: "Volume Analysis", icon: _jsx(BarChart, {}) }), _jsx(Tab, { label: "Sentiment", icon: _jsx(PieChart, {}) }), _jsx(Tab, { label: "Market Depth", icon: _jsx(CandlestickChart, {}) }), _jsx(Tab, { label: "Anomalies", icon: _jsx(Warning, {}) }), _jsx(Tab, { label: "Arbitrage", icon: _jsx(MonetizationOn, {}) })] }), activeTab === 0 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Odds Movement & Efficiency" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "odds", stroke: COLORS.primary, strokeWidth: 2, name: "Odds" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "efficiency", stroke: COLORS.success, strokeWidth: 2, name: "Efficiency" })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Volatility Analysis" }), volatilityData && (_jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Current Volatility" }), _jsx(Typography, { variant: "h4", color: volatilityData.currentVolatility >
                                                                volatilityData.avgVolatility * 1.5
                                                                ? "error.main"
                                                                : volatilityData.currentVolatility >
                                                                    volatilityData.avgVolatility
                                                                    ? "warning.main"
                                                                    : "success.main", children: formatPercentage(volatilityData.currentVolatility / 100) })] }), _jsx(Divider, {}), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "24h Average" }), _jsx(Typography, { variant: "body2", children: formatPercentage(volatilityData.avgVolatility / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "24h High" }), _jsx(Typography, { variant: "body2", children: formatPercentage(volatilityData.maxVolatility / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "24h Low" }), _jsx(Typography, { variant: "body2", children: formatPercentage(volatilityData.minVolatility / 100) })] })] }))] }) })] })), activeTab === 1 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Hourly Volume Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(RechartsBarChart, { data: volumeDistributionData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "hour" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Bar, { dataKey: "volume", fill: COLORS.primary })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Volume Metrics" }), volumeAnalysis && (_jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Peak Hour Volume" }), _jsx(Typography, { variant: "h5", children: formatCurrency(volumeAnalysis.peakHourVolume) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Average Hourly" }), _jsx(Typography, { variant: "h6", children: formatCurrency(volumeAnalysis.avgHourlyVolume) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "24h Change" }), _jsx(Typography, { variant: "body2", color: volumeAnalysis.change24h >= 0
                                                                ? "success.main"
                                                                : "error.main", children: formatPercentage(volumeAnalysis.change24h / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Volume Velocity" }), _jsx(Typography, { variant: "body2", children: volumeAnalysis.velocity.toFixed(2) })] })] }))] }) })] })), activeTab === 2 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Market Sentiment Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: sentimentChartData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: sentimentChartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(RechartsTooltip, {})] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Sentiment Analysis" }), sentimentData && (_jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Overall Sentiment Score" }), _jsxs(Typography, { variant: "h4", color: sentimentData.overall > 0.6
                                                                ? "success.main"
                                                                : sentimentData.overall > 0.4
                                                                    ? "warning.main"
                                                                    : "error.main", children: [(sentimentData.overall * 100).toFixed(0), "%"] })] }), _jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Sentiment Breakdown" }), _jsxs(Stack, { spacing: 1, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Positive" }), _jsx(Typography, { variant: "body2", color: "success.main", children: formatPercentage(sentimentData.positive / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Neutral" }), _jsx(Typography, { variant: "body2", children: formatPercentage(sentimentData.neutral / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Negative" }), _jsx(Typography, { variant: "body2", color: "error.main", children: formatPercentage(sentimentData.negative / 100) })] })] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Key Indicators" }), _jsxs(Stack, { spacing: 1, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Volume Sentiment" }), _jsx(Typography, { variant: "body2", children: sentimentData.volumeWeighted.toFixed(2) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Social Media Score" }), _jsx(Typography, { variant: "body2", children: sentimentData.socialMedia.toFixed(2) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "News Impact" }), _jsx(Typography, { variant: "body2", children: sentimentData.newsImpact.toFixed(2) })] })] })] })] }))] }) })] })), activeTab === 3 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Order Book Depth" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(AreaChart, { children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "price" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Area, { type: "monotone", dataKey: "cumulative", stackId: "1", stroke: COLORS.success, fill: COLORS.success, fillOpacity: 0.3, data: marketDepthData.bids, name: "Bids" }), _jsx(Area, { type: "monotone", dataKey: "cumulative", stackId: "2", stroke: COLORS.error, fill: COLORS.error, fillOpacity: 0.3, data: marketDepthData.asks, name: "Asks" })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Liquidity Metrics" }), liquidityMetrics && (_jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Bid-Ask Spread" }), _jsx(Typography, { variant: "h5", color: liquidityMetrics.bidAskSpread > 0.1
                                                                ? "error.main"
                                                                : liquidityMetrics.bidAskSpread > 0.05
                                                                    ? "warning.main"
                                                                    : "success.main", children: formatPercentage(liquidityMetrics.bidAskSpread / 100) })] }), _jsx(Divider, {}), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Market Impact" }), _jsx(Typography, { variant: "body2", children: liquidityMetrics.marketImpact.toFixed(4) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Depth Ratio" }), _jsx(Typography, { variant: "body2", children: liquidityMetrics.depthRatio.toFixed(2) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Turnover Rate" }), _jsx(Typography, { variant: "body2", children: formatPercentage(liquidityMetrics.turnoverRate / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Resilience Score" }), _jsx(Typography, { variant: "body2", children: liquidityMetrics.resilienceScore.toFixed(2) })] })] }))] }) })] })), activeTab === 4 && (_jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Market Anomalies" }), anomalies.length > 0 ? (_jsx(Stack, { spacing: 2, children: anomalies.map((anomaly, index) => (_jsxs(Accordion, { children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMore, {}), children: _jsxs(Box, { display: "flex", justifyContent: "space-between", width: "100%", children: [_jsx(Typography, { variant: "subtitle1", children: anomaly.type }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(Chip, { label: anomaly.severity, color: anomaly.severity === "high"
                                                                    ? "error"
                                                                    : anomaly.severity === "medium"
                                                                        ? "warning"
                                                                        : "info", size: "small" }), _jsx(Chip, { label: formatDateTime(anomaly.timestamp), size: "small", variant: "outlined" })] })] }) }), _jsx(AccordionDetails, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, md: 8, children: [_jsxs(Typography, { variant: "body2", gutterBottom: true, children: [_jsx("strong", { children: "Description:" }), " ", anomaly.description] }), _jsxs(Typography, { variant: "body2", gutterBottom: true, children: [_jsx("strong", { children: "Impact:" }), " ", anomaly.impact] }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Recommendation:" }), " ", anomaly.recommendation] })] }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "caption", children: "Confidence Score" }), _jsx(LinearProgress, { variant: "determinate", value: anomaly.confidence * 100, sx: { mt: 1, mb: 2 } }), _jsx(Typography, { variant: "body2", children: formatPercentage(anomaly.confidence) })] }) })] }) })] }, index))) })) : (_jsx(Alert, { severity: "success", children: "No market anomalies detected in the current time range." }))] })), activeTab === 5 && (_jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Arbitrage Opportunities" }), arbitrageOpportunities.length > 0 ? (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Market" }), _jsx(TableCell, { children: "Bookmaker 1" }), _jsx(TableCell, { children: "Bookmaker 2" }), _jsx(TableCell, { children: "Profit %" }), _jsx(TableCell, { children: "ROI" }), _jsx(TableCell, { children: "Risk Level" }), _jsx(TableCell, { children: "Action" })] }) }), _jsx(TableBody, { children: arbitrageOpportunities.map((opportunity, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: opportunity.market }), _jsxs(TableCell, { children: [opportunity.bookmaker1, " @ ", opportunity.odds1] }), _jsxs(TableCell, { children: [opportunity.bookmaker2, " @ ", opportunity.odds2] }), _jsx(TableCell, { children: _jsx(Typography, { color: "success.main", fontWeight: "bold", children: formatPercentage(opportunity.profitMargin / 100) }) }), _jsx(TableCell, { children: formatPercentage(opportunity.roi / 100) }), _jsx(TableCell, { children: _jsx(Chip, { label: opportunity.riskLevel, color: opportunity.riskLevel === "low"
                                                                ? "success"
                                                                : opportunity.riskLevel === "medium"
                                                                    ? "warning"
                                                                    : "error", size: "small" }) }), _jsx(TableCell, { children: _jsx(Button, { size: "small", variant: "outlined", children: "Execute" }) })] }, index))) })] }) })) : (_jsx(Alert, { severity: "info", children: "No arbitrage opportunities currently available." }))] }))] }) }) }));
};
export default MarketAnalysisDashboard;
