import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button, Box, Grid, Chip, Alert, LinearProgress, IconButton, Paper, Stack, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Badge, Stepper, Step, StepLabel, } from "@mui/material";
import { MonetizationOn, Download, PlayArrow, Refresh, Calculate, CheckCircle, Error, Bookmark, BookmarkBorder, SwapHoriz, VerifiedUser, FlashOn, AccessTime, Cached, } from "@mui/icons-material";
import { formatCurrency, formatPercentage, formatOdds, } from "../utils/formatters";
const BOOKMAKER_COLORS = {
    DraftKings: "#ff6600",
    FanDuel: "#3d5afe",
    Bet365: "#00a852",
    Caesars: "#d4af37",
    BetMGM: "#1976d2",
    PointsBet: "#00bcd4",
    Pinnacle: "#9c27b0",
};
const COLORS = {
    primary: "#1976d2",
    secondary: "#dc004e",
    success: "#2e7d32",
    warning: "#ed6c02",
    error: "#d32f2f",
    info: "#0288d1",
};
export const ArbitrageOpportunities = () => {
    // State Management
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [executionPlan, setExecutionPlan] = useState(null);
    const [customStake, setCustomStake] = useState(1000);
    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [onlyBookmarked, setOnlyBookmarked] = useState(false);
    const [showExecutionDialog, setShowExecutionDialog] = useState(false);
    const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
    // Filters
    const [filters, setFilters] = useState({
        sport: "all",
        minProfit: 0,
        minMargin: 0,
        maxRisk: "high",
        bookmakerPair: "all",
        timeToExpiry: "all",
    });
    // Real-time Data Loading
    const loadArbitrageData = useCallback(async () => {
        try {
            // Simulate loading real-time arbitrage opportunities
            const mockOpportunities = [
                {
                    id: "arb-001",
                    sport: "Basketball",
                    league: "NBA",
                    event: "Lakers vs Warriors",
                    market: "Moneyline",
                    sideA: {
                        selection: "Lakers Win",
                        bookmaker: "DraftKings",
                        odds: 2.15,
                        stake: 465.12,
                        payout: 1000.0,
                    },
                    sideB: {
                        selection: "Warriors Win",
                        bookmaker: "FanDuel",
                        odds: 1.95,
                        stake: 534.88,
                        payout: 1043.02,
                    },
                    profitMargin: 0.043,
                    totalStake: 1000.0,
                    guaranteedProfit: 43.02,
                    roi: 0.043,
                    riskLevel: "low",
                    timeToExpiry: 3600000,
                    lastUpdate: new Date(Date.now() - 30000),
                    discoveryTime: new Date(Date.now() - 300000),
                    confidence: 0.95,
                    volume: {
                        sideA: 2450000,
                        sideB: 1890000,
                    },
                    liquidity: {
                        sideA: 0.92,
                        sideB: 0.88,
                    },
                    status: "active",
                    tags: ["high-volume", "low-risk", "trending"],
                    bookmakerPair: "DraftKings-FanDuel",
                    isBookmarked: true,
                },
                {
                    id: "arb-002",
                    sport: "Football",
                    league: "NFL",
                    event: "Chiefs vs Bills",
                    market: "Spread (-3.5)",
                    sideA: {
                        selection: "Chiefs -3.5",
                        bookmaker: "Bet365",
                        odds: 2.05,
                        stake: 487.8,
                        payout: 1000.0,
                    },
                    sideB: {
                        selection: "Bills +3.5",
                        bookmaker: "BetMGM",
                        odds: 1.98,
                        stake: 512.2,
                        payout: 1014.2,
                    },
                    profitMargin: 0.014,
                    totalStake: 1000.0,
                    guaranteedProfit: 14.2,
                    roi: 0.014,
                    riskLevel: "medium",
                    timeToExpiry: 7200000,
                    lastUpdate: new Date(Date.now() - 60000),
                    discoveryTime: new Date(Date.now() - 180000),
                    confidence: 0.87,
                    volume: {
                        sideA: 1560000,
                        sideB: 1780000,
                    },
                    liquidity: {
                        sideA: 0.85,
                        sideB: 0.91,
                    },
                    status: "active",
                    tags: ["primetime", "playoffs"],
                    bookmakerPair: "Bet365-BetMGM",
                    isBookmarked: false,
                },
                {
                    id: "arb-003",
                    sport: "Soccer",
                    league: "Premier League",
                    event: "Man City vs Liverpool",
                    market: "Over/Under 2.5 Goals",
                    sideA: {
                        selection: "Over 2.5",
                        bookmaker: "Pinnacle",
                        odds: 1.85,
                        stake: 540.54,
                        payout: 1000.0,
                    },
                    sideB: {
                        selection: "Under 2.5",
                        bookmaker: "Caesars",
                        odds: 2.2,
                        stake: 459.46,
                        payout: 1010.81,
                    },
                    profitMargin: 0.011,
                    totalStake: 1000.0,
                    guaranteedProfit: 10.81,
                    roi: 0.011,
                    riskLevel: "high",
                    timeToExpiry: 1800000,
                    lastUpdate: new Date(Date.now() - 15000),
                    discoveryTime: new Date(Date.now() - 120000),
                    confidence: 0.78,
                    volume: {
                        sideA: 890000,
                        sideB: 1200000,
                    },
                    liquidity: {
                        sideA: 0.79,
                        sideB: 0.83,
                    },
                    status: "active",
                    tags: ["classic", "high-stakes", "expiring-soon"],
                    bookmakerPair: "Pinnacle-Caesars",
                    isBookmarked: false,
                },
                {
                    id: "arb-004",
                    sport: "Tennis",
                    league: "ATP",
                    event: "Djokovic vs Nadal",
                    market: "Match Winner",
                    sideA: {
                        selection: "Djokovic",
                        bookmaker: "PointsBet",
                        odds: 1.78,
                        stake: 561.8,
                        payout: 1000.0,
                    },
                    sideB: {
                        selection: "Nadal",
                        bookmaker: "DraftKings",
                        odds: 2.35,
                        stake: 438.2,
                        payout: 1029.77,
                    },
                    profitMargin: 0.03,
                    totalStake: 1000.0,
                    guaranteedProfit: 29.77,
                    roi: 0.03,
                    riskLevel: "low",
                    timeToExpiry: 900000,
                    lastUpdate: new Date(Date.now() - 45000),
                    discoveryTime: new Date(Date.now() - 90000),
                    confidence: 0.91,
                    volume: {
                        sideA: 567000,
                        sideB: 789000,
                    },
                    liquidity: {
                        sideA: 0.88,
                        sideB: 0.92,
                    },
                    status: "executing",
                    executionTime: new Date(Date.now() - 30000),
                    tags: ["GOAT-match", "clay-court", "executing"],
                    bookmakerPair: "PointsBet-DraftKings",
                    isBookmarked: true,
                },
            ];
            setOpportunities(mockOpportunities);
        }
        catch (error) {
            console.error("Failed to load arbitrage data:", error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Load data on mount and auto-refresh
    useEffect(() => {
        loadArbitrageData();
        if (autoRefresh) {
            const interval = setInterval(loadArbitrageData, 10000); // Refresh every 10 seconds
            return () => clearInterval(interval);
        }
    }, [loadArbitrageData, autoRefresh]);
    // Filter opportunities
    useEffect(() => {
        let filtered = opportunities;
        if (filters.sport !== "all") {
            filtered = filtered.filter((opp) => opp.sport === filters.sport);
        }
        if (filters.minProfit > 0) {
            filtered = filtered.filter((opp) => opp.guaranteedProfit >= filters.minProfit);
        }
        if (filters.minMargin > 0) {
            filtered = filtered.filter((opp) => opp.profitMargin >= filters.minMargin);
        }
        if (filters.maxRisk !== "high") {
            const riskOrder = { low: 0, medium: 1, high: 2 };
            const maxRiskLevel = riskOrder[filters.maxRisk];
            filtered = filtered.filter((opp) => riskOrder[opp.riskLevel] <= maxRiskLevel);
        }
        if (filters.bookmakerPair !== "all") {
            filtered = filtered.filter((opp) => opp.bookmakerPair === filters.bookmakerPair);
        }
        if (onlyBookmarked) {
            filtered = filtered.filter((opp) => opp.isBookmarked);
        }
        // Sort by profit margin descending
        filtered.sort((a, b) => b.profitMargin - a.profitMargin);
        setFilteredOpportunities(filtered);
    }, [opportunities, filters, onlyBookmarked]);
    // Calculate arbitrage for custom stake
    const calculateArbitrage = useCallback((opportunity, stake) => {
        const { sideA, sideB } = opportunity;
        // Calculate optimal allocation
        const totalImpliedProb = 1 / sideA.odds + 1 / sideB.odds;
        const stakeA = stake / (sideA.odds * totalImpliedProb);
        const stakeB = stake / (sideB.odds * totalImpliedProb);
        const payoutA = stakeA * sideA.odds;
        const payoutB = stakeB * sideB.odds;
        const profit = Math.min(payoutA, payoutB) - stake;
        const margin = profit / stake;
        const roi = margin;
        return {
            stake,
            allocation: {
                sideA: stakeA,
                sideB: stakeB,
            },
            profit,
            margin,
            roi,
        };
    }, []);
    // Event Handlers
    const handleBookmark = useCallback((opportunityId) => {
        setOpportunities((prev) => prev.map((opp) => opp.id === opportunityId
            ? { ...opp, isBookmarked: !opp.isBookmarked }
            : opp));
    }, []);
    const handleExecute = useCallback((opportunity) => {
        // Create execution plan
        const plan = {
            opportunity,
            steps: [
                {
                    step: 1,
                    action: `Place bet on ${opportunity.sideA.selection}`,
                    bookmaker: opportunity.sideA.bookmaker,
                    amount: opportunity.sideA.stake,
                    odds: opportunity.sideA.odds,
                    status: "pending",
                },
                {
                    step: 2,
                    action: `Place bet on ${opportunity.sideB.selection}`,
                    bookmaker: opportunity.sideB.bookmaker,
                    amount: opportunity.sideB.stake,
                    odds: opportunity.sideB.odds,
                    status: "pending",
                },
            ],
            totalTime: 45, // seconds
            riskLevel: opportunity.riskLevel,
        };
        setExecutionPlan(plan);
        setShowExecutionDialog(true);
    }, []);
    const handleExecutePlan = useCallback(async () => {
        if (!executionPlan)
            return;
        try {
            // Simulate execution
            for (let i = 0; i < executionPlan.steps.length; i++) {
                const step = executionPlan.steps[i];
                // Update step status to executing
                setExecutionPlan((prev) => prev
                    ? {
                        ...prev,
                        steps: prev.steps.map((s, idx) => idx === i ? { ...s, status: "executing" } : s),
                    }
                    : null);
                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 2000));
                // Update step status to completed
                setExecutionPlan((prev) => prev
                    ? {
                        ...prev,
                        steps: prev.steps.map((s, idx) => idx === i ? { ...s, status: "completed" } : s),
                    }
                    : null);
            }
            // Update opportunity status
            setOpportunities((prev) => prev.map((opp) => opp.id === executionPlan.opportunity.id
                ? {
                    ...opp,
                    status: "completed",
                    executionTime: new Date(),
                    actualProfit: executionPlan.opportunity.guaranteedProfit,
                }
                : opp));
            setTimeout(() => {
                setShowExecutionDialog(false);
                setExecutionPlan(null);
            }, 2000);
        }
        catch (error) {
            console.error("Execution failed:", error);
        }
    }, [executionPlan]);
    const exportData = useCallback(() => {
        const exportData = {
            timestamp: new Date().toISOString(),
            opportunities: filteredOpportunities,
            summary: {
                totalOpportunities: opportunities.length,
                avgProfitMargin: opportunities.reduce((sum, opp) => sum + opp.profitMargin, 0) /
                    opportunities.length,
                totalPotentialProfit: opportunities.reduce((sum, opp) => sum + opp.guaranteedProfit, 0),
                bookmakerPairs: [
                    ...new Set(opportunities.map((opp) => opp.bookmakerPair)),
                ],
            },
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `arbitrage-opportunities-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [filteredOpportunities, opportunities]);
    // Summary metrics
    const summaryMetrics = useMemo(() => {
        const active = opportunities.filter((opp) => opp.status === "active");
        const avgMargin = active.reduce((sum, opp) => sum + opp.profitMargin, 0) /
            Math.max(active.length, 1);
        const totalProfit = active.reduce((sum, opp) => sum + opp.guaranteedProfit, 0);
        const avgConfidence = active.reduce((sum, opp) => sum + opp.confidence, 0) /
            Math.max(active.length, 1);
        return {
            activeCount: active.length,
            avgMargin,
            totalProfit,
            avgConfidence,
            executingCount: opportunities.filter((opp) => opp.status === "executing")
                .length,
        };
    }, [opportunities]);
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 400, children: _jsx(LinearProgress, { sx: { width: "50%" } }) }));
    }
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full", children: [_jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h5", component: "h2", sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(SwapHoriz, {}), "Arbitrage Opportunities", _jsx(Badge, { badgeContent: summaryMetrics.activeCount, color: "success", children: _jsx(MonetizationOn, {}) }), summaryMetrics.executingCount > 0 && (_jsx(Badge, { badgeContent: summaryMetrics.executingCount, color: "warning", children: _jsx(Cached, { className: "animate-spin" }) }))] }), _jsxs(Box, { display: "flex", gap: 1, alignItems: "center", children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: autoRefresh, onChange: (e) => setAutoRefresh(e.target.checked) }), label: "Auto Refresh" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: onlyBookmarked, onChange: (e) => setOnlyBookmarked(e.target.checked) }), label: "Bookmarked" }), _jsx(IconButton, { onClick: loadArbitrageData, children: _jsx(Refresh, {}) }), _jsx(IconButton, { onClick: exportData, children: _jsx(Download, {}) })] })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "success.main", children: summaryMetrics.activeCount }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Active Opportunities" }), _jsx(Box, { mt: 1, children: _jsx(Chip, { label: `${summaryMetrics.executingCount} executing`, color: "warning", size: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "primary.main", children: formatPercentage(summaryMetrics.avgMargin) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Avg Profit Margin" }), _jsx(Box, { mt: 1, children: _jsx(LinearProgress, { variant: "determinate", value: summaryMetrics.avgMargin * 1000, color: "primary" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "secondary.main", children: formatCurrency(summaryMetrics.totalProfit) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Total Potential Profit" }), _jsx(Box, { mt: 1, children: _jsx(MonetizationOn, { color: "secondary", fontSize: "small" }) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsxs(Paper, { sx: { p: 2, textAlign: "center" }, children: [_jsx(Typography, { variant: "h4", color: "info.main", children: formatPercentage(summaryMetrics.avgConfidence) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Avg Confidence" }), _jsx(Box, { mt: 1, children: _jsx(VerifiedUser, { color: "info", fontSize: "small" }) })] }) })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 2, children: _jsxs(FormControl, { fullWidth: true, size: "small", children: [_jsx(InputLabel, { children: "Sport" }), _jsxs(Select, { value: filters.sport, onChange: (e) => setFilters((prev) => ({ ...prev, sport: e.target.value })), children: [_jsx(MenuItem, { value: "all", children: "All Sports" }), _jsx(MenuItem, { value: "Basketball", children: "Basketball" }), _jsx(MenuItem, { value: "Football", children: "Football" }), _jsx(MenuItem, { value: "Soccer", children: "Soccer" }), _jsx(MenuItem, { value: "Tennis", children: "Tennis" })] })] }) }), _jsx(Grid, { item: true, xs: 2, children: _jsx(TextField, { fullWidth: true, size: "small", label: "Min Profit ($)", type: "number", value: filters.minProfit, onChange: (e) => setFilters((prev) => ({
                                            ...prev,
                                            minProfit: Number(e.target.value),
                                        })) }) }), _jsx(Grid, { item: true, xs: 2, children: _jsx(TextField, { fullWidth: true, size: "small", label: "Min Margin (%)", type: "number", value: filters.minMargin * 100, onChange: (e) => setFilters((prev) => ({
                                            ...prev,
                                            minMargin: Number(e.target.value) / 100,
                                        })) }) }), _jsx(Grid, { item: true, xs: 2, children: _jsxs(FormControl, { fullWidth: true, size: "small", children: [_jsx(InputLabel, { children: "Max Risk" }), _jsxs(Select, { value: filters.maxRisk, onChange: (e) => setFilters((prev) => ({ ...prev, maxRisk: e.target.value })), children: [_jsx(MenuItem, { value: "low", children: "Low Risk Only" }), _jsx(MenuItem, { value: "medium", children: "Low + Medium" }), _jsx(MenuItem, { value: "high", children: "All Risk Levels" })] })] }) }), _jsx(Grid, { item: true, xs: 2, children: _jsx(Button, { fullWidth: true, variant: "outlined", onClick: () => {
                                            setSelectedOpportunity(filteredOpportunities[0] || null);
                                            setShowCalculatorDialog(true);
                                        }, startIcon: _jsx(Calculate, {}), disabled: filteredOpportunities.length === 0, children: "Calculator" }) }), _jsx(Grid, { item: true, xs: 2, children: _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Showing ", filteredOpportunities.length, " of ", opportunities.length] }) })] }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Event & Market" }), _jsx(TableCell, { children: "Side A" }), _jsx(TableCell, { children: "Side B" }), _jsx(TableCell, { children: "Profit" }), _jsx(TableCell, { children: "Margin" }), _jsx(TableCell, { children: "Risk" }), _jsx(TableCell, { children: "Confidence" }), _jsx(TableCell, { children: "Expiry" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: filteredOpportunities.map((opportunity) => (_jsxs(TableRow, { sx: {
                                                "&:hover": { backgroundColor: "action.hover" },
                                                backgroundColor: opportunity.profitMargin > 0.03
                                                    ? "success.light"
                                                    : "inherit",
                                                opacity: opportunity.status === "expired" ? 0.6 : 1,
                                            }, children: [_jsx(TableCell, { children: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: "bold", children: opportunity.event }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: [opportunity.sport, " \u2022 ", opportunity.market] }), _jsx(Box, { display: "flex", gap: 0.5, mt: 0.5, children: opportunity.tags.slice(0, 2).map((tag) => (_jsx(Chip, { label: tag, size: "small", variant: "outlined" }, tag))) })] }) }), _jsx(TableCell, { children: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: "bold", children: opportunity.sideA.selection }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: [opportunity.sideA.bookmaker, " @", " ", formatOdds(opportunity.sideA.odds)] }), _jsxs(Typography, { variant: "caption", display: "block", children: ["Stake: ", formatCurrency(opportunity.sideA.stake)] })] }) }), _jsx(TableCell, { children: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: "bold", children: opportunity.sideB.selection }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: [opportunity.sideB.bookmaker, " @", " ", formatOdds(opportunity.sideB.odds)] }), _jsxs(Typography, { variant: "caption", display: "block", children: ["Stake: ", formatCurrency(opportunity.sideB.stake)] })] }) }), _jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", fontWeight: "bold", color: "success.main", children: formatCurrency(opportunity.guaranteedProfit) }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Total: ", formatCurrency(opportunity.totalStake)] })] }), _jsxs(TableCell, { children: [_jsx(Chip, { label: formatPercentage(opportunity.profitMargin), color: opportunity.profitMargin > 0.03
                                                                ? "success"
                                                                : opportunity.profitMargin > 0.015
                                                                    ? "warning"
                                                                    : "default", size: "small" }), _jsxs(Typography, { variant: "caption", display: "block", children: ["ROI: ", formatPercentage(opportunity.roi)] })] }), _jsx(TableCell, { children: _jsx(Chip, { label: opportunity.riskLevel, color: opportunity.riskLevel === "low"
                                                            ? "success"
                                                            : opportunity.riskLevel === "medium"
                                                                ? "warning"
                                                                : "error", size: "small" }) }), _jsx(TableCell, { children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(LinearProgress, { variant: "determinate", value: opportunity.confidence * 100, sx: { width: 40, height: 6 }, color: opportunity.confidence > 0.9
                                                                    ? "success"
                                                                    : opportunity.confidence > 0.8
                                                                        ? "warning"
                                                                        : "error" }), _jsx(Typography, { variant: "caption", children: formatPercentage(opportunity.confidence) })] }) }), _jsxs(TableCell, { children: [_jsxs(Typography, { variant: "caption", children: [Math.floor(opportunity.timeToExpiry / 60000), "m"] }), opportunity.timeToExpiry < 900000 && (_jsx(FlashOn, { color: "warning", fontSize: "small" }))] }), _jsx(TableCell, { children: _jsx(Chip, { label: opportunity.status, color: opportunity.status === "active"
                                                            ? "success"
                                                            : opportunity.status === "executing"
                                                                ? "warning"
                                                                : opportunity.status === "completed"
                                                                    ? "info"
                                                                    : opportunity.status === "expired"
                                                                        ? "error"
                                                                        : "default", size: "small", icon: opportunity.status === "active" ? (_jsx(CheckCircle, {})) : opportunity.status === "executing" ? (_jsx(Cached, { className: "animate-spin" })) : opportunity.status === "expired" ? (_jsx(AccessTime, {})) : undefined }) }), _jsx(TableCell, { children: _jsxs(Box, { display: "flex", gap: 0.5, children: [_jsx(IconButton, { size: "small", onClick: () => handleBookmark(opportunity.id), children: opportunity.isBookmarked ? (_jsx(Bookmark, {})) : (_jsx(BookmarkBorder, {})) }), opportunity.status === "active" && (_jsx(Button, { size: "small", variant: "contained", color: "success", onClick: () => handleExecute(opportunity), startIcon: _jsx(PlayArrow, {}), children: "Execute" })), _jsx(IconButton, { size: "small", onClick: () => {
                                                                    setSelectedOpportunity(opportunity);
                                                                    setShowCalculatorDialog(true);
                                                                }, children: _jsx(Calculate, {}) })] }) })] }, opportunity.id))) })] }) }), filteredOpportunities.length === 0 && (_jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "No arbitrage opportunities found matching your filters. Try adjusting the filters or wait for new opportunities to appear." }))] }) }), _jsxs(Dialog, { open: showExecutionDialog, onClose: () => setShowExecutionDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: "Execute Arbitrage Opportunity" }), _jsx(DialogContent, { children: executionPlan && (_jsxs(Box, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [executionPlan.opportunity.event, " -", " ", executionPlan.opportunity.market] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsxs(Grid, { item: true, xs: 4, children: [_jsx(Typography, { variant: "caption", children: "Guaranteed Profit" }), _jsx(Typography, { variant: "h5", color: "success.main", children: formatCurrency(executionPlan.opportunity.guaranteedProfit) })] }), _jsxs(Grid, { item: true, xs: 4, children: [_jsx(Typography, { variant: "caption", children: "Profit Margin" }), _jsx(Typography, { variant: "h5", children: formatPercentage(executionPlan.opportunity.profitMargin) })] }), _jsxs(Grid, { item: true, xs: 4, children: [_jsx(Typography, { variant: "caption", children: "Risk Level" }), _jsx(Chip, { label: executionPlan.riskLevel, color: executionPlan.riskLevel === "low"
                                                        ? "success"
                                                        : executionPlan.riskLevel === "medium"
                                                            ? "warning"
                                                            : "error" })] })] }), _jsx(Stepper, { activeStep: executionPlan.steps.findIndex((step) => step.status === "pending"), orientation: "vertical", children: executionPlan.steps.map((step, index) => (_jsxs(Step, { children: [_jsx(StepLabel, { icon: step.status === "completed" ? (_jsx(CheckCircle, { color: "success" })) : step.status === "executing" ? (_jsx(Cached, { className: "animate-spin" })) : step.status === "failed" ? (_jsx(Error, { color: "error" })) : (step.step), children: step.action }), _jsxs(Box, { sx: { ml: 3, mb: 2 }, children: [_jsxs(Typography, { variant: "body2", children: [step.bookmaker, " \u2022 ", formatCurrency(step.amount), " @", " ", formatOdds(step.odds)] }), _jsx(Chip, { label: step.status, size: "small", color: step.status === "completed"
                                                            ? "success"
                                                            : step.status === "executing"
                                                                ? "warning"
                                                                : step.status === "failed"
                                                                    ? "error"
                                                                    : "default" })] })] }, step.step))) })] })) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setShowExecutionDialog(false), children: "Cancel" }), executionPlan &&
                                executionPlan.steps.every((step) => step.status === "pending") && (_jsx(Button, { variant: "contained", color: "success", onClick: handleExecutePlan, startIcon: _jsx(PlayArrow, {}), children: "Execute Plan" }))] })] }), _jsxs(Dialog, { open: showCalculatorDialog, onClose: () => setShowCalculatorDialog(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Arbitrage Calculator" }), _jsx(DialogContent, { children: selectedOpportunity && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: selectedOpportunity.event }), _jsx(TextField, { fullWidth: true, label: "Total Stake", type: "number", value: customStake, onChange: (e) => setCustomStake(Number(e.target.value)), sx: { mb: 2 } }), (() => {
                                    const calc = calculateArbitrage(selectedOpportunity, customStake);
                                    return (_jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", children: "Stake Allocation" }), _jsxs(Typography, { variant: "body2", children: [selectedOpportunity.sideA.bookmaker, ":", " ", formatCurrency(calc.allocation.sideA)] }), _jsxs(Typography, { variant: "body2", children: [selectedOpportunity.sideB.bookmaker, ":", " ", formatCurrency(calc.allocation.sideB)] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", children: "Results" }), _jsxs(Typography, { variant: "body2", children: ["Guaranteed Profit:", " ", _jsx("strong", { children: formatCurrency(calc.profit) })] }), _jsxs(Typography, { variant: "body2", children: ["Profit Margin:", " ", _jsx("strong", { children: formatPercentage(calc.margin) })] }), _jsxs(Typography, { variant: "body2", children: ["ROI: ", _jsx("strong", { children: formatPercentage(calc.roi) })] })] })] }));
                                })()] })) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => setShowCalculatorDialog(false), children: "Close" }) })] })] }));
};
export default ArbitrageOpportunities;
