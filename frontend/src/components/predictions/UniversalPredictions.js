import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Brain, Target, } from "lucide-react";
// Import consolidated systems
import { MegaButton, MegaInput } from "../mega/MegaUI";
import { useTheme } from "../../providers/SafeThemeProvider";
import { useToast, useDebounce, } from "../../hooks/UniversalHooks";
import { formatters, } from "../../utils/UniversalUtils";
// ============================================================================
// THEMED COMPONENTS
// ============================================================================
const ThemedText = ({ variant = "body", color = "primary", children, className = "", style = {}, }) => {
    const { theme } = useTheme();
    const variants = {
        title: { fontSize: "18px", fontWeight: "700", lineHeight: "28px" },
        body: { fontSize: "14px", fontWeight: "400", lineHeight: "20px" },
        caption: { fontSize: "12px", fontWeight: "400", lineHeight: "16px" },
    };
    const colors = {
        primary: theme.colors.text.primary,
        secondary: theme.colors.text.secondary,
        muted: theme.colors.text.muted,
        accent: theme.colors.primary,
    };
    return (_jsx("div", { className: className, style: {
            color: colors[color],
            ...variants[variant],
            ...style,
        }, children: children }));
};
const ThemedContainer = ({ children, className = "", style = {} }) => {
    const { theme } = useTheme();
    return (_jsx("div", { className: className, style: {
            background: theme.colors.surface,
            backdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "12px",
            padding: "24px",
            ...style,
        }, children: children }));
};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const UniversalPredictions = () => {
    // Theme
    const { theme, isDark } = useTheme();
    // State
    const [viewMode, setViewMode] = useState("cards");
    const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        sport: "all",
        market: "all",
        riskLevel: "all",
        status: "all",
        minConfidence: 0,
        minEdge: 0,
    });
    // Hooks
    const debouncedSearch = useDebounce(searchQuery, 300);
    const toast = useToast();
    // Mock data for demonstration
    const enhancedPredictions = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
        id: `pred-${i}`,
        homeTeam: ["Patriots", "Lakers", "Yankees", "Bruins"][i % 4],
        awayTeam: ["Chiefs", "Warriors", "Red Sox", "Rangers"][i % 4],
        sport: ["nfl", "nba", "mlb", "nhl"][i % 4],
        league: ["NFL", "NBA", "MLB", "NHL"][i % 4],
        market: ["Moneyline", "Spread", "Total", "Props"][i % 4],
        prediction: ["Home Win", "Away Win", "Over", "Under"][i % 4],
        odds: 1.5 + Math.random(),
        confidence: 60 + Math.random() * 35,
        valueEdge: Math.random() * 0.15,
        expectedValue: (Math.random() - 0.5) * 100,
        status: ["upcoming", "live", "completed"][i % 3],
        gameTime: new Date(Date.now() + i * 3600000).toISOString(),
        modelPredictions: Array.from({ length: 3 }, (_, j) => ({
            modelName: `Model ${j + 1}`,
            prediction: ["Home", "Away", "Over"][j],
            confidence: 70 + Math.random() * 25,
            factors: [
                { name: "Recent Form", weight: 0.3 },
                { name: "Head to Head", weight: 0.2 },
                { name: "Venue", weight: 0.15 },
            ],
        })),
        context: {
            weather: {
                temperature: 20 + Math.random() * 15,
                conditions: "Clear",
            },
            injuries: [],
            venue: {
                name: "Stadium Name",
                capacity: 50000,
                homeAdvantage: 3 + Math.random() * 7,
            },
            market: {
                volume: 1000000,
                liquidity: 85,
                efficiency: 80,
                movement: "stable",
            },
        },
        performance: {
            modelAccuracy: 75 + Math.random() * 20,
            recentPerformance: 80 + Math.random() * 15,
            consistencyScore: 70 + Math.random() * 25,
        },
        reasoning: {
            factors: [
                { factor: "Home advantage", impact: 0.15, confidence: 0.8 },
                { factor: "Recent form", impact: 0.12, confidence: 0.9 },
            ],
            keyInsights: ["Strong home record", "Favorable matchup"],
            riskFactors: ["Weather conditions", "Key player injury"],
        },
    })), []);
    // Filtering logic
    const filteredPredictions = useMemo(() => {
        let filtered = [...enhancedPredictions];
        if (filters.sport !== "all") {
            filtered = filtered.filter((pred) => pred.sport === filters.sport);
        }
        if (filters.market !== "all") {
            filtered = filtered.filter((pred) => pred.market === filters.market);
        }
        if (filters.status !== "all") {
            filtered = filtered.filter((pred) => pred.status === filters.status);
        }
        filtered = filtered.filter((pred) => pred.confidence >= filters.minConfidence &&
            pred.valueEdge >= filters.minEdge);
        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase();
            filtered = filtered.filter((pred) => pred.homeTeam.toLowerCase().includes(query) ||
                pred.awayTeam.toLowerCase().includes(query) ||
                pred.league.toLowerCase().includes(query) ||
                pred.market.toLowerCase().includes(query));
        }
        return filtered;
    }, [enhancedPredictions, filters, debouncedSearch]);
    // Render functions
    const renderPredictionCard = (prediction) => (_jsxs(ThemedContainer, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(ThemedText, { variant: "body", className: "font-semibold", children: [prediction.homeTeam, " vs ", prediction.awayTeam] }), _jsxs(ThemedText, { variant: "caption", color: "muted", children: [prediction.sport.toUpperCase(), " \u2022 ", prediction.league, " \u2022", " ", prediction.market] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("div", { className: `px-2 py-1 rounded text-xs ${prediction.status === "live"
                                ? "bg-red-500 text-white"
                                : prediction.status === "upcoming"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-500 text-white"}`, children: prediction.status.toUpperCase() }) })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs(ThemedText, { variant: "title", style: { color: theme.colors.primary }, children: [prediction.confidence.toFixed(1), "%"] }), _jsx(ThemedText, { variant: "caption", color: "muted", children: "Confidence" })] }), _jsxs("div", { className: "text-center", children: [_jsx(ThemedText, { variant: "title", style: { color: theme.colors.accent }, children: formatters.percentage(prediction.valueEdge * 100, 1) }), _jsx(ThemedText, { variant: "caption", color: "muted", children: "Value Edge" })] }), _jsxs("div", { className: "text-center", children: [_jsx(ThemedText, { variant: "title", style: { color: theme.colors.primary }, children: formatters.odds(prediction.odds) }), _jsx(ThemedText, { variant: "caption", color: "muted", children: "Odds" })] }), _jsxs("div", { className: "text-center", children: [_jsx(ThemedText, { variant: "title", style: { color: theme.colors.accent }, children: formatters.currency(prediction.expectedValue) }), _jsx(ThemedText, { variant: "caption", color: "muted", children: "Expected Value" })] })] }), _jsx(MegaButton, { variant: "primary", onClick: () => toast.success(`Betting slip updated for ${prediction.homeTeam} vs ${prediction.awayTeam}`), className: "w-full", children: "Add to Bet Slip" })] }, prediction.id));
    return (_jsxs("div", { className: "space-y-6 p-6", style: {
            background: theme.colors.background,
            color: theme.colors.text.primary,
            minHeight: "100vh",
        }, children: [_jsx(ThemedContainer, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(ThemedText, { variant: "title", style: { fontSize: "32px" }, children: "Universal Predictions" }), _jsx(ThemedText, { variant: "body", color: "secondary", children: "AI-Enhanced Prediction Engine with Real-Time Intelligence" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Brain, { size: 20, style: { color: theme.colors.primary } }), _jsxs(ThemedText, { variant: "body", style: { color: theme.colors.primary }, children: [enhancedPredictions.length, " Models Active"] })] })] }) }), _jsxs(ThemedContainer, { children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx(ThemedText, { variant: "caption", className: "mb-2", children: "Sport" }), _jsxs("select", { value: filters.sport, onChange: (e) => setFilters((prev) => ({ ...prev, sport: e.target.value })), style: {
                                            background: theme.colors.surface,
                                            border: `1px solid ${theme.colors.border}`,
                                            color: theme.colors.text.primary,
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            width: "100%",
                                        }, children: [_jsx("option", { value: "all", children: "All Sports" }), _jsx("option", { value: "nfl", children: "NFL" }), _jsx("option", { value: "nba", children: "NBA" }), _jsx("option", { value: "mlb", children: "MLB" }), _jsx("option", { value: "nhl", children: "NHL" })] })] }), _jsxs("div", { children: [_jsx(ThemedText, { variant: "caption", className: "mb-2", children: "Market" }), _jsxs("select", { value: filters.market, onChange: (e) => setFilters((prev) => ({ ...prev, market: e.target.value })), style: {
                                            background: theme.colors.surface,
                                            border: `1px solid ${theme.colors.border}`,
                                            color: theme.colors.text.primary,
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            width: "100%",
                                        }, children: [_jsx("option", { value: "all", children: "All Markets" }), _jsx("option", { value: "Moneyline", children: "Moneyline" }), _jsx("option", { value: "Spread", children: "Spread" }), _jsx("option", { value: "Total", children: "Total" }), _jsx("option", { value: "Props", children: "Props" })] })] }), _jsxs("div", { children: [_jsx(ThemedText, { variant: "caption", className: "mb-2", children: "Status" }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters((prev) => ({ ...prev, status: e.target.value })), style: {
                                            background: theme.colors.surface,
                                            border: `1px solid ${theme.colors.border}`,
                                            color: theme.colors.text.primary,
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            width: "100%",
                                        }, children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "upcoming", children: "Upcoming" }), _jsx("option", { value: "live", children: "Live" }), _jsx("option", { value: "completed", children: "Completed" })] })] }), _jsxs("div", { children: [_jsx(ThemedText, { variant: "caption", className: "mb-2", children: "View Mode" }), _jsxs("select", { value: viewMode, onChange: (e) => setViewMode(e.target.value), style: {
                                            background: theme.colors.surface,
                                            border: `1px solid ${theme.colors.border}`,
                                            color: theme.colors.text.primary,
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            width: "100%",
                                        }, children: [_jsx("option", { value: "cards", children: "Cards" }), _jsx("option", { value: "table", children: "Table" }), _jsx("option", { value: "detailed", children: "Detailed" }), _jsx("option", { value: "analytics", children: "Analytics" })] })] })] }), _jsx("div", { className: "mb-4", children: _jsx(MegaInput, { type: "text", placeholder: "Search teams, leagues, markets...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), icon: _jsx(Target, { size: 16 }) }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPredictions.map(renderPredictionCard) }), filteredPredictions.length === 0 && (_jsx(ThemedContainer, { children: _jsx("div", { className: "text-center py-8", children: _jsx(ThemedText, { variant: "body", color: "muted", children: "No predictions found matching your criteria." }) }) }))] }));
};
export default UniversalPredictions;
