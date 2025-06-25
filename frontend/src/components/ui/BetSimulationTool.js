import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Grid, Chip, Alert, LinearProgress, IconButton, Divider, Paper, Stack, Switch, FormControlLabel, } from "@mui/material";
import { PlayArrow, TrendingUp, TrendingDown, Assessment, Warning, Download, Settings, } from "@mui/icons-material";
import { useSimulationStore } from "../../store/slices/simulationSlice";
import { confidenceService } from "../../services/analytics/confidenceService";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
const predefinedScenarios = [
    {
        id: "conservative",
        name: "Conservative Play",
        stake: 50,
        odds: 1.8,
        eventId: "NBA-LAL-BOS-2024",
        player: "LeBron James",
        market: "points",
        iterations: 1000,
        riskLevel: "low",
    },
    {
        id: "moderate",
        name: "Moderate Risk",
        stake: 100,
        odds: 2.2,
        eventId: "NBA-GSW-LAC-2024",
        player: "Stephen Curry",
        market: "threePointers",
        iterations: 1000,
        riskLevel: "medium",
    },
    {
        id: "aggressive",
        name: "High Risk/Reward",
        stake: 200,
        odds: 3.5,
        eventId: "NBA-MIA-DEN-2024",
        player: "Nikola Jokic",
        market: "rebounds",
        iterations: 1000,
        riskLevel: "high",
    },
];
export const BetSimulationTool = () => {
    // State Management
    const [activeTab, setActiveTab] = useState("single");
    const [scenario, setScenario] = useState(predefinedScenarios[0]);
    const [scenarios, setScenarios] = useState([]);
    const [results, setResults] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [realTimeMode, setRealTimeMode] = useState(false);
    // Store Integration
    const setInput = useSimulationStore((s) => s.setInput);
    const storeResult = useSimulationStore((s) => s.result);
    const setStoreResult = useSimulationStore((s) => s.setResult);
    const clear = useSimulationStore((s) => s.clear);
    // Computed Values
    const currentResult = useMemo(() => {
        return results.find((r) => r.scenario.id === scenario.id);
    }, [results, scenario.id]);
    // Simulation Logic
    const runSingleSimulation = useCallback(async (simScenario) => {
        const prediction = confidenceService.getPredictionWithConfidence(simScenario.eventId, simScenario.player, simScenario.market);
        const simInput = {
            stake: simScenario.stake,
            odds: simScenario.odds,
            confidenceBand: prediction.confidenceBand,
            winProbability: prediction.winProbability,
            iterations: simScenario.iterations,
        };
        setInput(simInput);
        // Enhanced simulation with Monte Carlo analysis
        let wins = 0;
        let totalPayout = 0;
        let totalLoss = 0;
        const outcomes = [];
        for (let i = 0; i < simScenario.iterations; i++) {
            const randomValue = Math.random();
            if (randomValue <= prediction.winProbability) {
                wins++;
                const payout = simScenario.stake * (simScenario.odds - 1);
                totalPayout += payout;
                outcomes.push(payout);
            }
            else {
                totalLoss += simScenario.stake;
                outcomes.push(-simScenario.stake);
            }
        }
        const losses = simScenario.iterations - wins;
        const expectedPayout = totalPayout / simScenario.iterations;
        const expectedLoss = totalLoss / simScenario.iterations;
        const expectedValue = expectedPayout - expectedLoss;
        // Kelly Criterion calculation
        const p = prediction.winProbability;
        const b = simScenario.odds - 1;
        const kellyFraction = (b * p - (1 - p)) / b;
        // ROI calculation
        const roi = (expectedValue / simScenario.stake) * 100;
        // Risk assessment
        const riskLevel = kellyFraction > 0.25 ? "high" : kellyFraction > 0.1 ? "medium" : "low";
        const riskFactors = [];
        if (simScenario.odds > 3.0)
            riskFactors.push("High odds indicate lower probability");
        if (kellyFraction < 0)
            riskFactors.push("Negative expected value");
        if (prediction.confidenceBand.lower < 0.6)
            riskFactors.push("Low prediction confidence");
        // Statistical calculations
        const mean = outcomes.reduce((a, b) => a + b, 0) / outcomes.length;
        const variance = outcomes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
            outcomes.length;
        const standardDev = Math.sqrt(variance);
        const sharpeRatio = mean / standardDev;
        // Confidence interval (95%)
        const confidenceInterval = 1.96 * (standardDev / Math.sqrt(simScenario.iterations));
        const result = {
            scenario: simScenario,
            winProbability: prediction.winProbability,
            expectedPayout,
            expectedLoss,
            expectedValue,
            kellyFraction: Math.max(0, kellyFraction),
            roi,
            riskAssessment: {
                level: riskLevel,
                factors: riskFactors,
                recommendation: kellyFraction > 0
                    ? kellyFraction > 0.25
                        ? "Reduce stake size"
                        : "Proceed with caution"
                    : "Avoid this bet",
            },
            breakdown: {
                wins,
                losses,
                totalPayout,
                totalLoss,
                variance,
                sharpeRatio,
            },
            confidence: {
                lower: mean - confidenceInterval,
                upper: mean + confidenceInterval,
                interval: 95,
            },
        };
        setStoreResult(result);
        return result;
    }, [setInput, setStoreResult]);
    // Event Handlers
    const handleSingleSimulation = async () => {
        setIsSimulating(true);
        try {
            const result = await runSingleSimulation(scenario);
            setResults((prev) => {
                const filtered = prev.filter((r) => r.scenario.id !== scenario.id);
                return [...filtered, result];
            });
        }
        catch (error) {
            console.error("Simulation failed:", error);
        }
        finally {
            setIsSimulating(false);
        }
    };
    const handleBatchSimulation = async () => {
        if (scenarios.length === 0)
            return;
        setIsSimulating(true);
        try {
            const batchResults = [];
            for (const scenario of scenarios) {
                const result = await runSingleSimulation(scenario);
                batchResults.push(result);
            }
            setResults(batchResults);
        }
        catch (error) {
            console.error("Batch simulation failed:", error);
        }
        finally {
            setIsSimulating(false);
        }
    };
    const addScenario = () => {
        const newScenario = {
            ...scenario,
            id: `custom_${Date.now()}`,
            name: `Scenario ${scenarios.length + 1}`,
        };
        setScenarios((prev) => [...prev, newScenario]);
    };
    const removeScenario = (id) => {
        setScenarios((prev) => prev.filter((s) => s.id !== id));
        setResults((prev) => prev.filter((r) => r.scenario.id !== id));
    };
    const exportResults = () => {
        const exportData = {
            timestamp: new Date().toISOString(),
            scenarios: scenarios.length || 1,
            results: results.map((r) => ({
                scenario: r.scenario.name,
                expectedValue: r.expectedValue,
                roi: r.roi,
                winProbability: r.winProbability,
                riskLevel: r.riskAssessment.level,
                recommendation: r.riskAssessment.recommendation,
            })),
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bet-simulation-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    // Real-time updates
    useEffect(() => {
        if (!realTimeMode)
            return;
        const interval = setInterval(async () => {
            if (!isSimulating && scenario) {
                await handleSingleSimulation();
            }
        }, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [realTimeMode, isSimulating, scenario, handleSingleSimulation]);
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full", children: _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h5", component: "h2", sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx(Assessment, {}), "Advanced Bet Simulation Tool"] }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: realTimeMode, onChange: (e) => setRealTimeMode(e.target.checked) }), label: "Real-time" }), _jsx(IconButton, { onClick: exportResults, disabled: results.length === 0, children: _jsx(Download, {}) }), _jsx(IconButton, { onClick: () => setShowAdvanced(!showAdvanced), children: _jsx(Settings, {}) })] })] }), _jsx(Box, { sx: { borderBottom: 1, borderColor: "divider", mb: 2 }, children: _jsx(Stack, { direction: "row", spacing: 2, children: ["single", "batch", "comparison"].map((tab) => (_jsxs(Button, { variant: activeTab === tab ? "contained" : "outlined", onClick: () => setActiveTab(tab), sx: { textTransform: "capitalize" }, children: [tab, " Simulation"] }, tab))) }) }), activeTab === "single" && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Simulation Parameters" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Stake ($)", type: "number", value: scenario.stake, onChange: (e) => setScenario((prev) => ({
                                                            ...prev,
                                                            stake: Number(e.target.value),
                                                        })), inputProps: { min: 1 } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Odds", type: "number", value: scenario.odds, onChange: (e) => setScenario((prev) => ({
                                                            ...prev,
                                                            odds: Number(e.target.value),
                                                        })), inputProps: { min: 1.01, step: 0.01 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Event ID", value: scenario.eventId, onChange: (e) => setScenario((prev) => ({
                                                            ...prev,
                                                            eventId: e.target.value,
                                                        })) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Player", value: scenario.player, onChange: (e) => setScenario((prev) => ({
                                                            ...prev,
                                                            player: e.target.value,
                                                        })) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Market" }), _jsxs(Select, { value: scenario.market, onChange: (e) => setScenario((prev) => ({
                                                                    ...prev,
                                                                    market: e.target.value,
                                                                })), children: [_jsx(MenuItem, { value: "points", children: "Points" }), _jsx(MenuItem, { value: "rebounds", children: "Rebounds" }), _jsx(MenuItem, { value: "assists", children: "Assists" }), _jsx(MenuItem, { value: "threePointers", children: "Three Pointers" }), _jsx(MenuItem, { value: "steals", children: "Steals" }), _jsx(MenuItem, { value: "blocks", children: "Blocks" })] })] }) }), showAdvanced && (_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Simulation Iterations", type: "number", value: scenario.iterations, onChange: (e) => setScenario((prev) => ({
                                                            ...prev,
                                                            iterations: Number(e.target.value),
                                                        })), inputProps: { min: 100, max: 100000, step: 100 } }) }))] }), _jsx(Box, { mt: 2, children: _jsx(Button, { variant: "contained", onClick: handleSingleSimulation, disabled: isSimulating, startIcon: isSimulating ? (_jsx(LinearProgress, { sx: { width: 20 } })) : (_jsx(PlayArrow, {})), fullWidth: true, size: "large", children: isSimulating ? "Simulating..." : "Run Simulation" }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: currentResult && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 }, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Simulation Results" }), _jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Expected Value" }), _jsx(Typography, { variant: "h4", color: currentResult.expectedValue >= 0
                                                                    ? "success.main"
                                                                    : "error.main", children: formatCurrency(currentResult.expectedValue) })] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsxs(Box, { textAlign: "center", children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Win Probability" }), _jsx(Typography, { variant: "h6", children: formatPercentage(currentResult.winProbability) })] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Box, { textAlign: "center", children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "ROI" }), _jsx(Typography, { variant: "h6", color: currentResult.roi >= 0
                                                                                ? "success.main"
                                                                                : "error.main", children: formatPercentage(currentResult.roi / 100) })] }) })] }), _jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Risk Assessment" }), _jsx(Chip, { label: currentResult.riskAssessment.level.toUpperCase(), color: currentResult.riskAssessment.level === "low"
                                                                    ? "success"
                                                                    : currentResult.riskAssessment.level ===
                                                                        "medium"
                                                                        ? "warning"
                                                                        : "error", icon: currentResult.riskAssessment.level === "low" ? (_jsx(TrendingUp, {})) : currentResult.riskAssessment.level ===
                                                                    "medium" ? (_jsx(Warning, {})) : (_jsx(TrendingDown, {})) }), _jsx(Typography, { variant: "body2", sx: { mt: 1 }, children: currentResult.riskAssessment.recommendation })] }), currentResult.riskAssessment.factors.length > 0 && (_jsxs(Alert, { severity: "warning", icon: _jsx(Warning, {}), children: [_jsx(Typography, { variant: "subtitle2", children: "Risk Factors:" }), _jsx("ul", { style: { margin: 0, paddingLeft: 16 }, children: currentResult.riskAssessment.factors.map((factor, index) => (_jsx("li", { children: factor }, index))) })] })), showAdvanced && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Advanced Metrics" }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Kelly Fraction" }), _jsx(Typography, { variant: "body2", children: formatPercentage(currentResult.kellyFraction) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Sharpe Ratio" }), _jsx(Typography, { variant: "body2", children: currentResult.breakdown.sharpeRatio.toFixed(3) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Confidence (95%)" }), _jsxs(Typography, { variant: "body2", children: [formatCurrency(currentResult.confidence.lower), " ", "-", " ", formatCurrency(currentResult.confidence.upper)] })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: "Variance" }), _jsx(Typography, { variant: "body2", children: currentResult.breakdown.variance.toFixed(2) })] })] })] })] }))] })] }) })) })] })), activeTab === "batch" && (_jsxs(Box, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Batch Simulation" }), _jsxs(Box, { children: [_jsx(Button, { onClick: addScenario, variant: "outlined", sx: { mr: 1 }, children: "Add Scenario" }), _jsx(Button, { onClick: handleBatchSimulation, variant: "contained", disabled: scenarios.length === 0 || isSimulating, startIcon: isSimulating ? (_jsx(LinearProgress, { sx: { width: 20 } })) : (_jsx(PlayArrow, {})), children: "Run Batch" })] })] }), _jsx(Grid, { container: true, spacing: 2, children: scenarios.map((scenario, index) => (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, children: [_jsx(Typography, { variant: "subtitle1", children: scenario.name }), _jsx(Button, { size: "small", onClick: () => removeScenario(scenario.id), children: "Remove" })] }), _jsxs(Typography, { variant: "body2", children: ["$", scenario.stake, " @ ", scenario.odds, " odds -", " ", scenario.player, " ", scenario.market] }), results.find((r) => r.scenario.id === scenario.id) && (_jsx(Box, { mt: 1, children: _jsx(Chip, { size: "small", label: `EV: ${formatCurrency(results.find((r) => r.scenario.id === scenario.id).expectedValue)}`, color: results.find((r) => r.scenario.id === scenario.id).expectedValue >= 0
                                                        ? "success"
                                                        : "error" }) }))] }) }, scenario.id))) }), scenarios.length === 0 && (_jsx(Alert, { severity: "info", children: "Add scenarios to run batch simulations. You can start with predefined scenarios or create custom ones." }))] })), activeTab === "comparison" && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Simulation Comparison" }), results.length > 0 ? (_jsx(Grid, { container: true, spacing: 2, children: results.map((result) => (_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: result.scenario.name }), _jsxs(Stack, { spacing: 1, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Expected Value" }), _jsx(Typography, { variant: "body2", color: result.expectedValue >= 0
                                                                    ? "success.main"
                                                                    : "error.main", children: formatCurrency(result.expectedValue) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "ROI" }), _jsx(Typography, { variant: "body2", children: formatPercentage(result.roi / 100) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "caption", children: "Risk Level" }), _jsx(Chip, { size: "small", label: result.riskAssessment.level, color: result.riskAssessment.level === "low"
                                                                    ? "success"
                                                                    : result.riskAssessment.level === "medium"
                                                                        ? "warning"
                                                                        : "error" })] })] })] }) }, result.scenario.id))) })) : (_jsx(Alert, { severity: "info", children: "Run simulations to compare results. Switch to Single or Batch tabs to create simulations." }))] }))] }) }) }));
};
