import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Clock, Star, } from "lucide-react";
import { useUnifiedStore } from "../store/unified/UnifiedStoreManager";
const PrizePicksPageEnhanced = () => {
    const [projections, setProjections] = useState([]);
    const [filteredProjections, setFilteredProjections] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSport, setSelectedSport] = useState("basketball_nba");
    const [selectedPosition, setSelectedPosition] = useState("all");
    const [minConfidence, setMinConfidence] = useState(0.6);
    const [isLoading, setIsLoading] = useState(true);
    const { actions } = useUnifiedStore();
    // Mock data - in real app, this would come from PrizePicks API
    useEffect(() => {
        const loadProjections = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const mockProjections = [
                    {
                        id: "1",
                        playerName: "LeBron James",
                        team: "LAL",
                        position: "SF",
                        statType: "Points",
                        line: 25.5,
                        over: 1.9,
                        under: 1.9,
                        confidence: 0.78,
                        trend: "up",
                        recent: [28, 31, 22, 29, 26],
                    },
                    {
                        id: "2",
                        playerName: "Stephen Curry",
                        team: "GSW",
                        position: "PG",
                        statType: "Points",
                        line: 27.5,
                        over: 1.85,
                        under: 1.95,
                        confidence: 0.82,
                        trend: "up",
                        recent: [30, 25, 33, 28, 31],
                    },
                    {
                        id: "3",
                        playerName: "Giannis Antetokounmpo",
                        team: "MIL",
                        position: "PF",
                        statType: "Rebounds",
                        line: 11.5,
                        over: 1.92,
                        under: 1.88,
                        confidence: 0.73,
                        trend: "stable",
                        recent: [12, 14, 9, 13, 11],
                    },
                    {
                        id: "4",
                        playerName: "Luka Dončić",
                        team: "DAL",
                        position: "PG",
                        statType: "Assists",
                        line: 8.5,
                        over: 1.88,
                        under: 1.92,
                        confidence: 0.85,
                        trend: "up",
                        recent: [10, 11, 7, 9, 12],
                    },
                    {
                        id: "5",
                        playerName: "Joel Embiid",
                        team: "PHI",
                        position: "C",
                        statType: "Points",
                        line: 30.5,
                        over: 1.95,
                        under: 1.85,
                        confidence: 0.69,
                        trend: "down",
                        recent: [28, 25, 33, 27, 31],
                    },
                ];
                setProjections(mockProjections);
                setFilteredProjections(mockProjections);
                actions.addToast({
                    type: "success",
                    title: "Projections Loaded",
                    message: `${mockProjections.length} player projections loaded`,
                    duration: 3000,
                });
            }
            catch (error) {
                actions.addToast({
                    type: "error",
                    title: "Load Failed",
                    message: "Failed to load PrizePicks projections",
                    duration: 5000,
                });
            }
            finally {
                setIsLoading(false);
            }
        };
        loadProjections();
    }, [actions]);
    // Filter projections based on search and filters
    useEffect(() => {
        let filtered = projections.filter((proj) => {
            const matchesSearch = proj.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proj.team.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPosition = selectedPosition === "all" || proj.position === selectedPosition;
            const matchesConfidence = proj.confidence >= minConfidence;
            return matchesSearch && matchesPosition && matchesConfidence;
        });
        setFilteredProjections(filtered);
    }, [projections, searchTerm, selectedPosition, minConfidence]);
    const getTrendIcon = (trend) => {
        switch (trend) {
            case "up":
                return _jsx(TrendingUp, { className: "w-4 h-4 text-green-500" });
            case "down":
                return _jsx(TrendingDown, { className: "w-4 h-4 text-red-500" });
            default:
                return _jsx(Clock, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8)
            return "text-green-600 bg-green-100";
        if (confidence >= 0.7)
            return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };
    const calculateAverage = (values) => {
        return values.reduce((a, b) => a + b, 0) / values.length;
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "PrizePicks Enhanced" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "AI-powered player prop analysis with ML predictions" })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search players...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" })] }), _jsx("div", { children: _jsxs("select", { value: selectedPosition, onChange: (e) => setSelectedPosition(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "All Positions" }), _jsx("option", { value: "PG", children: "Point Guard" }), _jsx("option", { value: "SG", children: "Shooting Guard" }), _jsx("option", { value: "SF", children: "Small Forward" }), _jsx("option", { value: "PF", children: "Power Forward" }), _jsx("option", { value: "C", children: "Center" })] }) }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-600 dark:text-gray-400 mb-1", children: ["Min Confidence: ", (minConfidence * 100).toFixed(0), "%"] }), _jsx("input", { type: "range", min: "0.5", max: "1", step: "0.05", value: minConfidence, onChange: (e) => setMinConfidence(parseFloat(e.target.value)), className: "w-full" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("button", { onClick: () => window.location.reload(), className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Refresh" })] }) })] }) }), isLoading && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading projections..." })] })), !isLoading && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredProjections.map((projection) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900 dark:text-white", children: projection.playerName }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: projection.team }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: projection.position })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [getTrendIcon(projection.trend), _jsx(Star, { className: "w-4 h-4 text-yellow-500" })] })] }), _jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: projection.line }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: projection.statType })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("div", { className: "text-center p-2 bg-green-50 dark:bg-green-900/20 rounded", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Over" }), _jsx("div", { className: "font-semibold text-green-600", children: projection.over })] }), _jsxs("div", { className: "text-center p-2 bg-red-50 dark:bg-red-900/20 rounded", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Under" }), _jsx("div", { className: "font-semibold text-red-600", children: projection.under })] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: ["Last 5 Games (Avg:", " ", calculateAverage(projection.recent).toFixed(1), ")"] }), _jsx("div", { className: "flex space-x-1", children: projection.recent.map((value, index) => (_jsx("div", { className: `flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${value > projection.line
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"}`, children: value }, index))) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "ML Confidence" }), _jsxs("span", { className: `px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(projection.confidence)}`, children: [(projection.confidence * 100).toFixed(0), "%"] })] })] }, projection.id))) })), !isLoading && filteredProjections.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-400 text-6xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No projections found" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Try adjusting your filters or search terms" })] }))] }) }));
};
export default PrizePicksPageEnhanced;
