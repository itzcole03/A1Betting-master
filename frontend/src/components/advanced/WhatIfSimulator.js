import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from "react";
import { useUnifiedAnalytics } from "../../hooks/useUnifiedAnalytics";
export const WhatIfSimulator = ({ eventId = "sample-event", playerId = "sample-player", }) => {
    const [scenarios, setScenarios] = useState([]);
    const [simulationResults, setSimulationResults] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [activeScenario, setActiveScenario] = useState(null);
    const { ml, betting } = useUnifiedAnalytics({
        ml: { autoUpdate: true },
        betting: true,
    });
    // Predefined scenario templates
    const scenarioTemplates = useMemo(() => [
        {
            id: "odds_increase",
            name: "Odds Increase (+20%)",
            type: "odds_change",
            parameters: { oddsMultiplier: 1.2 },
            impact: 0.15,
        },
        {
            id: "key_injury",
            name: "Key Player Injury",
            type: "injury",
            parameters: { injuredPlayer: "star", severity: "high" },
            impact: -0.3,
        },
        {
            id: "weather_change",
            name: "Weather Impact (Rain)",
            type: "weather",
            parameters: { condition: "rain", windSpeed: 15 },
            impact: -0.1,
        },
        {
            id: "lineup_change",
            name: "Lineup Change",
            type: "lineup_change",
            parameters: { changedPositions: 2, quality: "upgrade" },
            impact: 0.08,
        },
        {
            id: "market_shift",
            name: "Market Sentiment Shift",
            type: "market_shift",
            parameters: { sentimentChange: -0.2, volume: "high" },
            impact: -0.12,
        },
    ], []);
    const addScenario = useCallback((template) => {
        const newScenario = {
            ...template,
            id: `${template.id}_${Date.now()}`,
        };
        setScenarios((prev) => [...prev, newScenario]);
    }, []);
    const removeScenario = useCallback((scenarioId) => {
        setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
        setSimulationResults((prev) => prev.filter((r) => r.scenarioId !== scenarioId));
    }, []);
    const simulateScenario = useCallback(async (scenario) => {
        setIsSimulating(true);
        setActiveScenario(scenario.id);
        try {
            // Simulate prediction adjustment based on scenario
            const baselinePrediction = 0.65; // Mock baseline
            const adjustmentFactor = scenario.impact * 0.5; // Dampen impact
            const adjustedPrediction = Math.max(0.05, Math.min(0.95, baselinePrediction + adjustmentFactor));
            const confidence = Math.max(0.3, 0.9 - Math.abs(adjustmentFactor));
            const riskLevel = Math.abs(adjustmentFactor) > 0.15
                ? "high"
                : Math.abs(adjustmentFactor) > 0.08
                    ? "medium"
                    : "low";
            // Generate factor breakdown
            const factors = [
                {
                    name: "Historical Performance",
                    originalValue: 0.2,
                    adjustedValue: 0.2 + (scenario.type === "injury" ? -0.05 : 0),
                    contribution: scenario.type === "injury" ? -0.05 : 0,
                },
                {
                    name: "Market Conditions",
                    originalValue: 0.15,
                    adjustedValue: 0.15 + (scenario.type === "odds_change" ? 0.03 : 0),
                    contribution: scenario.type === "odds_change" ? 0.03 : 0,
                },
                {
                    name: "Environmental Factors",
                    originalValue: 0.1,
                    adjustedValue: 0.1 + (scenario.type === "weather" ? -0.03 : 0),
                    contribution: scenario.type === "weather" ? -0.03 : 0,
                },
                {
                    name: "Team Dynamics",
                    originalValue: 0.12,
                    adjustedValue: 0.12 + (scenario.type === "lineup_change" ? 0.02 : 0),
                    contribution: scenario.type === "lineup_change" ? 0.02 : 0,
                },
            ];
            const result = {
                scenarioId: scenario.id,
                originalPrediction: baselinePrediction,
                adjustedPrediction,
                impact: adjustedPrediction - baselinePrediction,
                confidence,
                riskLevel,
                explanation: generateExplanation(scenario, adjustedPrediction - baselinePrediction),
                factors,
            };
            setSimulationResults((prev) => [
                ...prev.filter((r) => r.scenarioId !== scenario.id),
                result,
            ]);
        }
        catch (error) {
            console.error("Simulation error:", error);
        }
        finally {
            setIsSimulating(false);
            setActiveScenario(null);
        }
    }, []);
    const generateExplanation = (scenario, impact) => {
        const direction = impact > 0 ? "increases" : "decreases";
        const magnitude = Math.abs(impact) > 0.1 ? "significantly" : "moderately";
        switch (scenario.type) {
            case "odds_change":
                return `Odds adjustment ${magnitude} ${direction} prediction confidence due to market perception shifts.`;
            case "injury":
                return `Key player injury ${magnitude} ${direction} team performance expectations and prop outcomes.`;
            case "weather":
                return `Weather conditions ${magnitude} ${direction} game dynamics and player performance metrics.`;
            case "lineup_change":
                return `Lineup modifications ${magnitude} ${direction} team synergy and individual player opportunities.`;
            case "market_shift":
                return `Market sentiment changes ${magnitude} ${direction} betting value and prediction accuracy.`;
            default:
                return `Custom scenario ${magnitude} ${direction} overall prediction model outputs.`;
        }
    };
    const runAllScenarios = useCallback(async () => {
        for (const scenario of scenarios) {
            await simulateScenario(scenario);
            // Small delay to show progression
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }, [scenarios, simulateScenario]);
    const clearAll = useCallback(() => {
        setScenarios([]);
        setSimulationResults([]);
    }, []);
    const exportResults = useCallback(() => {
        const data = {
            eventId,
            playerId,
            timestamp: new Date().toISOString(),
            scenarios,
            results: simulationResults,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `what-if-simulation-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [eventId, playerId, scenarios, simulationResults]);
    return (_jsxs("div", { className: "what-if-simulator max-w-7xl mx-auto p-6 space-y-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\uD83D\uDD2C What-If Scenario Simulator" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-1", children: "Test different scenarios and see their impact on predictions" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: runAllScenarios, disabled: scenarios.length === 0 || isSimulating, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: isSimulating ? "Simulating..." : "Run All Scenarios" }), _jsx("button", { onClick: exportResults, disabled: simulationResults.length === 0, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Export Results" }), _jsx("button", { onClick: clearAll, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Clear All" })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Add Scenarios" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: scenarioTemplates.map((template) => (_jsx("button", { onClick: () => addScenario(template), className: "p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors", children: _jsxs("div", { className: "text-left", children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-white", children: template.name }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: ["Expected impact: ", template.impact > 0 ? "+" : "", (template.impact * 100).toFixed(1), "%"] })] }) }, template.id))) })] }), scenarios.length > 0 && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: ["Active Scenarios (", scenarios.length, ")"] }), _jsx("div", { className: "space-y-3", children: scenarios.map((scenario) => {
                            const result = simulationResults.find((r) => r.scenarioId === scenario.id);
                            return (_jsx("div", { className: `p-4 border rounded-lg ${activeScenario === scenario.id
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-300 dark:border-gray-600"}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-white", children: scenario.name }), result && (_jsxs("div", { className: "mt-2 space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-4 text-sm", children: [_jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: ["Impact:", " ", _jsxs("span", { className: result.impact > 0
                                                                                ? "text-green-600"
                                                                                : "text-red-600", children: [result.impact > 0 ? "+" : "", (result.impact * 100).toFixed(1), "%"] })] }), _jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: ["Confidence: ", (result.confidence * 100).toFixed(1), "%"] }), _jsxs("span", { className: `px-2 py-1 rounded text-xs font-medium ${result.riskLevel === "high"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : result.riskLevel === "medium"
                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                            : "bg-green-100 text-green-800"}`, children: [result.riskLevel, " risk"] })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: result.explanation })] }))] }), _jsxs("div", { className: "flex space-x-2 ml-4", children: [_jsx("button", { onClick: () => simulateScenario(scenario), disabled: isSimulating, className: "px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50", children: activeScenario === scenario.id
                                                        ? "Running..."
                                                        : "Simulate" }), _jsx("button", { onClick: () => removeScenario(scenario.id), className: "px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700", children: "Remove" })] })] }) }, scenario.id));
                        }) })] })), simulationResults.length > 0 && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Simulation Results Comparison" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Scenario" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Original" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Adjusted" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Impact" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Risk Level" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: simulationResults.map((result) => {
                                        const scenario = scenarios.find((s) => s.id === result.scenarioId);
                                        return (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white", children: scenario?.name }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300", children: [(result.originalPrediction * 100).toFixed(1), "%"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300", children: [(result.adjustedPrediction * 100).toFixed(1), "%"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsxs("span", { className: result.impact > 0
                                                            ? "text-green-600"
                                                            : "text-red-600", children: [result.impact > 0 ? "+" : "", (result.impact * 100).toFixed(1), "%"] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${result.riskLevel === "high"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                            : result.riskLevel === "medium"
                                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"}`, children: result.riskLevel }) })] }, result.scenarioId));
                                    }) })] }) })] })), scenarios.length === 0 && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD2C" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No Scenarios Added Yet" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Add scenarios from the templates above to start simulating different conditions and their impact on predictions." })] }))] }));
};
export default WhatIfSimulator;
