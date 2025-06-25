import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Target, Award, RefreshCw, } from "lucide-react";
import { useEnhancedRealDataSources } from "../../hooks/useEnhancedRealDataSources";
export function EnhancedPrizePicks() {
    const { state, addSelectedProp } = useApp();
    const { addToast } = useToasts();
    const [currentProps, setCurrentProps] = useState([]);
    const [selectedSport, setSelectedSport] = useState("All");
    const [loading, setLoading] = useState(false);
    const [displayedPropsCount, setDisplayedPropsCount] = useState(9);
    const [entryAmount, setEntryAmount] = useState(25);
    const { dataSources, players, loading: dataLoading, refreshData, getSourcesByCategory, } = useEnhancedRealDataSources();
    const validation = useRealDataValidation();
    useEffect(() => {
        loadPlayerProps();
    }, [selectedSport, players]);
    const loadPlayerProps = async () => {
        setLoading(true);
        try {
            // Get PrizePicks data from enhanced data sources
            const prizePicksSources = getSourcesByCategory("prizepicks");
            const propsData = prizePicksSources.find((s) => s.id === "prizepicks_props");
            if (propsData?.connected && propsData.data?.projections) {
                if (process.env.NODE_ENV === "development") {
                    console.log("📊 Loading real PrizePicks data:", propsData.data.projections.length, "projections");
                }
                const playerProps = propsData.data.projections.map((projection) => convertToPlayerProp(projection));
                setCurrentProps(playerProps);
            }
            else {
                console.warn("⚠️ No real PrizePicks data available, generating from player data");
                // Generate props from real player data
                const generatedProps = generatePropsFromPlayers();
                setCurrentProps(generatedProps);
            }
        }
        catch (error) {
            console.error("❌ Error loading player props:", error);
            // Fallback to generated props
            const fallbackProps = generatePropsFromPlayers();
            setCurrentProps(fallbackProps);
        }
        finally {
            setLoading(false);
        }
    };
    const convertToPlayerProp = (projection) => {
        return {
            id: projection.id,
            playerName: projection.player_name,
            team: projection.team || "TBD",
            position: projection.position || "Unknown",
            statType: projection.stat_type,
            line: projection.line,
            sport: projection.sport,
            realDataQuality: 0.95, // High quality for real PrizePicks data
            overConfidence: calculateConfidence(projection, "over"),
            underConfidence: calculateConfidence(projection, "under"),
            expectedValue: projection.expected_value || 0,
            source: "PRIZEPICKS_REAL_DATA",
            aiEnhancement: {
                valueRating: projection.value_rating,
                kellyOptimal: projection.kelly_optimal,
                marketEdge: projection.expected_value / 100,
                riskScore: 1 - projection.confidence_score,
                weatherImpact: projection.weather_impact,
                injuryImpact: projection.injury_status === "Healthy" ? 0 : 0.1,
                formTrend: calculateFormTrend(projection.recent_form),
                sharpMoney: projection.sharp_money,
                publicBetting: projection.public_betting,
                lineMovement: projection.line_movement,
                steamMove: projection.steam_move,
                reverseLineMovement: projection.reverse_line_movement,
            },
            patternAnalysis: {
                overallStrength: projection.confidence_score || 0.8,
                seasonalTrends: calculateSeasonalTrends(projection),
                matchupAdvantage: calculateMatchupAdvantage(projection),
                recentPerformance: projection.recent_form || [0.5, 0.6, 0.7, 0.8, 0.9],
                homeAwayFactor: projection.home_away === "Home" ? 1.05 : 0.95,
                restAdvantage: projection.rest_days > 1 ? 1.02 : 0.98,
                backToBackPenalty: projection.back_to_back ? 0.95 : 1.0,
            },
        };
    };
    const generatePropsFromPlayers = () => {
        const props = [];
        // Filter players by sport
        const filteredPlayers = selectedSport === "All"
            ? players
            : players.filter((p) => p.sport === selectedSport);
        if (process.env.NODE_ENV === "development") {
            console.log(`🎯 Generating props from ${filteredPlayers.length} real players`);
        }
        filteredPlayers.slice(0, 20).forEach((player) => {
            const statTypes = getStatTypesForSport(player.sport);
            statTypes.forEach((statType) => {
                const line = calculateRealLine(player, statType);
                props.push({
                    id: `${player.sport}_${player.name}_${statType}`
                        .replace(/\s+/g, "_")
                        .toLowerCase(),
                    playerName: player.name,
                    team: player.team,
                    position: player.position,
                    statType: statType,
                    line: line,
                    sport: player.sport,
                    realDataQuality: 0.85, // Good quality from real player data
                    overConfidence: DataGenerator.generateConfidence({
                        ...player,
                        statType,
                        choice: "over",
                    }),
                    underConfidence: DataGenerator.generateConfidence({
                        ...player,
                        statType,
                        choice: "under",
                    }),
                    expectedValue: DataGenerator.generateExpectedValue({
                        ...player,
                        statType,
                    }),
                    source: "REAL_PLAYER_DATA_ENHANCED",
                    aiEnhancement: {
                        valueRating: ["A+", "A", "B+", "B", "C+"][Math.floor(DataGenerator.generateConfidence(player) / 20)],
                        kellyOptimal: Math.abs(DataGenerator.generateExpectedValue(player)) / 100,
                        marketEdge: DataGenerator.generateExpectedValue(player) / 100,
                        riskScore: (100 - DataGenerator.generateConfidence(player)) / 100,
                        weatherImpact: isOutdoorSport(player.sport)
                            ? Math.abs(DataGenerator.generateExpectedValue(player)) / 200
                            : 0,
                        injuryImpact: 0.02, // Low injury impact for active players
                        formTrend: DataGenerator.generateExpectedValue(player) / 500,
                    },
                    patternAnalysis: {
                        overallStrength: DataGenerator.generateConfidence({ ...player, statType }) / 100,
                    },
                });
            });
        });
        return props;
    };
    const calculateRealLine = (player, statType) => {
        // Use realistic stat line generation
        return DataGenerator.generateStatLine(player.sport, statType, player.name);
    };
    const calculateConfidence = (projection, type) => {
        const baseConfidence = projection.confidence_score || 0.8;
        const formTrend = calculateFormTrend(projection.recent_form);
        const seasonAvg = projection.season_average || projection.line;
        const vsOpponentAvg = projection.vs_opponent_average || projection.line;
        let confidence = baseConfidence;
        // Adjust based on recent form
        if (type === "over") {
            confidence += formTrend * 0.1;
            if (seasonAvg > projection.line)
                confidence += 0.05;
            if (vsOpponentAvg > projection.line)
                confidence += 0.03;
        }
        else {
            confidence -= formTrend * 0.1;
            if (seasonAvg < projection.line)
                confidence += 0.05;
            if (vsOpponentAvg < projection.line)
                confidence += 0.03;
        }
        return Math.min(Math.max(confidence, 0.5), 0.98) * 100;
    };
    const calculateFormTrend = (recentForm) => {
        if (!recentForm || recentForm.length < 2)
            return 0;
        const recent = recentForm.slice(-5);
        const weights = [0.1, 0.15, 0.2, 0.25, 0.3];
        let weightedSum = 0;
        let totalWeight = 0;
        recent.forEach((form, index) => {
            const weight = weights[index] || 0.1;
            weightedSum += form * weight;
            totalWeight += weight;
        });
        return weightedSum / totalWeight - 0.5;
    };
    const calculateSeasonalTrends = (projection) => {
        const month = new Date().getMonth();
        const sport = projection.sport;
        let trend = 0.5;
        if (sport === "NBA") {
            trend = 0.4 + (month / 12) * 0.4;
        }
        else if (sport === "NFL") {
            trend = 0.6 - (month / 12) * 0.2;
        }
        else if (sport === "MLB") {
            trend = 0.5 + Math.sin(month / 2) * 0.1;
        }
        return trend;
    };
    const calculateMatchupAdvantage = (projection) => {
        const vsOpponentAvg = projection.vs_opponent_average || projection.line;
        const seasonAvg = projection.season_average || projection.line;
        if (seasonAvg === 0)
            return 0.5;
        return Math.min(Math.max(vsOpponentAvg / seasonAvg, 0.7), 1.3) - 1;
    };
    const getStatTypesForSport = (sport) => {
        const statTypes = {
            NBA: [
                "Points",
                "Rebounds",
                "Assists",
                "3-Pointers Made",
                "Steals",
                "Blocks",
            ],
            NFL: [
                "Passing Yards",
                "Rushing Yards",
                "Receptions",
                "Receiving Yards",
                "Touchdowns",
            ],
            MLB: ["Hits", "RBIs", "Runs", "Home Runs", "Strikeouts"],
            NHL: ["Goals", "Assists", "Shots", "Points"],
            Soccer: ["Goals", "Assists", "Shots", "Passes"],
            WNBA: ["Points", "Rebounds", "Assists", "3-Pointers Made"],
            MMA: ["Significant Strikes", "Takedowns", "Submission Attempts"],
            PGA: ["Birdies", "Eagles", "Fairways Hit", "Greens in Regulation"],
        };
        return statTypes[sport] || ["Points"];
    };
    const getBaseStatValue = (sport, statType) => {
        const baseValues = {
            NBA: {
                Points: 20,
                Rebounds: 8,
                Assists: 5,
                "3-Pointers Made": 2.5,
                Steals: 1.2,
                Blocks: 0.8,
            },
            NFL: {
                "Passing Yards": 250,
                "Rushing Yards": 80,
                Receptions: 5,
                "Receiving Yards": 60,
                Touchdowns: 1.5,
            },
            MLB: {
                Hits: 1.2,
                RBIs: 1,
                Runs: 0.8,
                "Home Runs": 0.3,
                Strikeouts: 1.5,
            },
            NHL: {
                Goals: 0.8,
                Assists: 1.2,
                Shots: 3.5,
                Points: 2,
            },
        };
        const sportValues = baseValues[sport] || { Points: 10 };
        return sportValues[statType] || 10;
    };
    const isOutdoorSport = (sport) => {
        return ["NFL", "MLB", "Soccer", "PGA"].includes(sport);
    };
    const handleSelectProp = (propId, choice) => {
        if (state.selectedProps.size >= 6) {
            return;
        }
        const key = `${propId}_${choice}`;
        const prop = currentProps.find((p) => p.id === propId);
        if (prop) {
            addSelectedProp(key, {
                propId,
                choice,
                enhanced: true,
                prop: prop,
                confidence: choice === "over" ? prop.overConfidence : prop.underConfidence,
                expectedValue: prop.expectedValue,
                source: prop.source,
            });
        }
    };
    const handleSubmitLineup = () => {
        // Validate lineup using PrizePicks rules
        const validation = validateLineup(state.selectedProps);
        if (!validation.canSubmit) {
            if (validation.errors.length > 0) {
                validation.errors.forEach((error) => {
                    addToast(error, "error");
                });
            }
            else {
                addToast("Please select 2-6 props to submit your lineup", "warning");
            }
            return;
        }
        const selectedPropsArray = Array.from(state.selectedProps.values());
        const avgConfidence = selectedPropsArray.reduce((sum, prop) => sum + (prop.confidence || 80), 0) / selectedPropsArray.length;
        const totalEV = selectedPropsArray.reduce((sum, prop) => sum + (prop.expectedValue || 0), 0);
        // Get unique teams and players for display
        const teams = new Set(selectedPropsArray.map((p) => p.prop.team));
        const sports = new Set(selectedPropsArray.map((p) => p.prop.sport));
        // Show success toast
        addToast(`🎯 Lineup submitted successfully! Entry: $${entryAmount}, Expected payout: $${(entryAmount * 3.5).toFixed(2)}`, "success");
        // Show warnings if any
        if (validation.warnings.length > 0) {
            validation.warnings.forEach((warning) => {
                addToast(warning, "warning");
            });
        }
        // Log detailed information for debugging
        console.log("✅ Lineup Submission Details:", {
            props: state.selectedProps.size,
            teams: Array.from(teams),
            sports: Array.from(sports),
            entry: entryAmount,
            avgConfidence: avgConfidence.toFixed(1),
            totalEV: totalEV.toFixed(1),
            dataSource: selectedPropsArray[0]?.source || "Real Player Data",
        });
    };
    const refreshProps = async () => {
        await refreshData();
        await loadPlayerProps();
    };
    const sports = SPORT_OPTIONS;
    const prizePicksConnected = getSourcesByCategory("prizepicks").some((s) => s.connected);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-3xl font-bold flex items-center space-x-3", children: [_jsx(Target, { className: "w-8 h-8 text-primary-600" }), _jsx("span", { className: "dark:text-white", children: "PrizePicks Intelligence Engine" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Real-time player props with advanced AI analysis, live data integration, and multi-sport coverage" }), _jsxs("div", { className: "flex items-center space-x-6 mt-3 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-green-600 font-medium", children: prizePicksConnected
                                                        ? "PrizePicks Data Active"
                                                        : "Real Player Data Mode" })] }), _jsx("div", { className: "text-gray-500", children: "\u2022" }), _jsxs("span", { className: "text-blue-600 font-medium", children: [currentProps.length, " Available Props"] }), _jsx("div", { className: "text-gray-500", children: "\u2022" }), _jsxs("span", { className: "text-purple-600 font-medium", children: [players.length, " Real Players"] }), _jsx("div", { className: "text-gray-500", children: "\u2022" }), _jsxs("span", { className: "text-yellow-600 font-medium", children: [sports.length - 1, " Sports"] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(RulesButton, {}), _jsx(SportSelector, { selectedSport: selectedSport, onSportChange: setSelectedSport, className: "", label: "" }), _jsxs("button", { onClick: refreshProps, disabled: loading || dataLoading, className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center space-x-2 disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${loading || dataLoading ? "animate-spin" : ""}` }), _jsx("span", { children: "Refresh Props" })] })] })] }) }), _jsx("div", { className: "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center", children: _jsx(Award, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-green-800 dark:text-green-300", children: prizePicksConnected
                                                ? "PrizePicks Data Connected"
                                                : "Real Player Data Active" }), _jsx("p", { className: "text-sm text-green-600 dark:text-green-400", children: prizePicksConnected
                                                ? `Live props from PrizePicks with ${currentProps.length} projections`
                                                : `Generated from ${players.length} real players across ${sports.length - 1} sports` })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: currentProps.length }), _jsx("div", { className: "text-xs text-green-500", children: "Available Props" })] })] }) }), !validation.isValid && (_jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4", children: [_jsx("h4", { className: "font-semibold text-yellow-800 dark:text-yellow-200 mb-2", children: "\u26A0\uFE0F Limited Functionality" }), _jsx("p", { className: "text-sm text-yellow-700 dark:text-yellow-300", children: "Some API keys are missing. Props are generated from available real player data. Add missing API keys for full PrizePicks integration." })] })), _jsxs("div", { className: "flex flex-col xl:flex-row gap-6 max-w-full", children: [_jsxs("div", { className: "flex-1 min-w-0 overflow-hidden", children: [loading || dataLoading ? (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: Array.from({ length: 9 }).map((_, i) => (_jsxs("div", { className: "bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4" }), _jsx("div", { className: "h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4" }), _jsx("div", { className: "h-20 bg-gray-300 dark:bg-gray-600 rounded" })] }, i))) })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: currentProps.slice(0, displayedPropsCount).map((prop) => (_jsx(PropCard, { prop: prop, onSelect: handleSelectProp, isPrizePicksData: prizePicksConnected }, prop.id))) })), !loading &&
                                !dataLoading &&
                                currentProps.length > displayedPropsCount && (_jsxs("div", { className: "text-center mt-6", children: [_jsxs("button", { onClick: () => {
                                            const newCount = Math.min(displayedPropsCount + 9, currentProps.length);
                                            setDisplayedPropsCount(newCount);
                                        }, className: "bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 mx-auto", children: [_jsx("span", { children: "View More" }), _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M6 9L12 15L18 9", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })] }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2", children: ["Showing ", displayedPropsCount, " of ", currentProps.length, " ", "available props"] })] })), !loading &&
                                !dataLoading &&
                                displayedPropsCount > 9 &&
                                displayedPropsCount >= currentProps.length && (_jsx("div", { className: "text-center mt-4", children: _jsxs("button", { onClick: () => {
                                        setDisplayedPropsCount(9);
                                        // Scroll back to top of props grid
                                        const propsGrid = document.querySelector(".xl\\:col-span-3");
                                        propsGrid?.scrollIntoView({ behavior: "smooth" });
                                    }, className: "bg-gray-600 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto", children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M18 15L12 9L6 15", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsx("span", { children: "View Less" })] }) })), !loading && !dataLoading && currentProps.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Target, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2", children: "No Props Available" }), _jsx("p", { className: "text-gray-500 dark:text-gray-500", children: "Try selecting a different sport or refreshing the data" })] }))] }), _jsx(LineupBuilder, { entryAmount: entryAmount, onEntryAmountChange: setEntryAmount, onSubmitLineup: handleSubmitLineup, prizePicksConnected: prizePicksConnected })] }), _jsx(DataDebug, {})] }));
}
// Mock implementations for missing imports
const SPORT_OPTIONS = ["All", "NBA", "NFL", "MLB", "NHL", "Soccer"];
const getSportDisplayName = (sport) => sport;
const getSportEmoji = (sport) => "🏀";
const PropCard = ({ prop, onSelect, isPrizePicksData }) => (_jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { children: prop.playerName }), _jsxs("p", { children: [prop.statType, ": ", prop.line] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { onClick: () => onSelect(prop.id, "over"), className: "px-3 py-1 bg-green-500 text-white rounded", children: "Over" }), _jsx("button", { onClick: () => onSelect(prop.id, "under"), className: "px-3 py-1 bg-red-500 text-white rounded", children: "Under" })] })] }));
const LineupBuilder = ({ entryAmount, onEntryAmountChange, onSubmitLineup, prizePicksConnected, }) => (_jsxs("div", { className: "bg-white p-4 rounded-lg shadow min-w-[300px]", children: [_jsx("h3", { className: "font-bold mb-4", children: "Lineup Builder" }), _jsx("input", { type: "number", value: entryAmount, onChange: (e) => onEntryAmountChange(Number(e.target.value)), className: "w-full p-2 border rounded mb-4", placeholder: "Entry Amount" }), _jsx("button", { onClick: onSubmitLineup, className: "w-full bg-blue-500 text-white py-2 rounded", children: "Submit Lineup" })] }));
const SportSelector = ({ selectedSport, onSportChange, className, label, }) => (_jsx("select", { value: selectedSport, onChange: (e) => onSportChange(e.target.value), className: "p-2 border rounded", children: SPORT_OPTIONS.map((sport) => (_jsx("option", { value: sport, children: sport }, sport))) }));
const RulesButton = () => (_jsx("button", { className: "px-3 py-1 bg-gray-500 text-white rounded text-sm", children: "Rules" }));
const DataDebug = () => (_jsxs("div", { className: "bg-gray-100 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold", children: "Data Debug Panel" }), _jsx("p", { className: "text-sm text-gray-600", children: "Debug information displayed here..." })] }));
// Mock implementations for missing hooks and utils
const useApp = () => ({
    state: { selectedProps: new Map() },
    addSelectedProp: (key, prop) => console.log("Added prop:", key, prop),
});
const useToasts = () => ({
    addToast: (message, type) => console.log(`Toast: ${type} - ${message}`),
});
const useRealDataValidation = () => ({
    isValid: true,
    errors: [],
    warnings: [],
    missingKeys: [],
});
const validateLineup = (props) => ({
    canSubmit: true,
    errors: [],
    warnings: [],
});
const DataGenerator = {
    generateConfidence: (player) => Math.floor(Math.random() * 100),
    generateExpectedValue: (player) => Math.random() * 10 - 5,
    generateStatLine: (sport, statType, playerName) => Math.random() * 20 + 10,
};
