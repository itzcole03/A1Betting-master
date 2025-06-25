import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export function RealTimePredictions({ predictions: propPredictions, loading: propLoading, } = {}) {
    // State declarations first
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSport, setSelectedSport] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const types = ["All", "game", "player_prop"];
    // Mock data setup
    useEffect(() => {
        if (!propPredictions) {
            setLoading(true);
            // Simulate loading and then set mock data
            setTimeout(() => {
                setPredictions([
                    {
                        id: "1",
                        sport: "NBA",
                        type: "game",
                        game: "Lakers vs Warriors",
                        prediction: "Over 235.5 Points",
                        confidence: 89,
                        odds: 1.85,
                        valueGrade: "A",
                        risk: 0.15,
                        expectedValue: 12.3,
                        timestamp: new Date(),
                    },
                    {
                        id: "2",
                        sport: "NBA",
                        type: "player_prop",
                        game: "Celtics vs Heat",
                        prediction: "LeBron Over 28.5 Points",
                        confidence: 84,
                        odds: 1.92,
                        valueGrade: "B+",
                        risk: 0.22,
                        expectedValue: 8.7,
                        timestamp: new Date(),
                    },
                    {
                        id: "3",
                        sport: "NFL",
                        type: "game",
                        game: "Chiefs vs Bills",
                        prediction: "Chiefs -3.5",
                        confidence: 91,
                        odds: 1.95,
                        valueGrade: "A+",
                        risk: 0.12,
                        expectedValue: 15.8,
                        timestamp: new Date(),
                    },
                ]);
                setLoading(false);
            }, 1000);
        }
        else {
            setPredictions(propPredictions || []);
            setLoading(propLoading || false);
        }
    }, [propPredictions, propLoading]);
    // Safe filtering with proper checks
    const safePredictions = Array.isArray(predictions) ? predictions : [];
    const filteredPredictions = safePredictions.filter((pred) => {
        if (!pred)
            return false; // Additional safety check
        const sportMatch = selectedSport === "All" || pred.sport === selectedSport;
        const typeMatch = selectedType === "All" || pred.type === selectedType;
        return sportMatch && typeMatch;
    });
    const getValueGradeColor = (grade) => {
        const colors = {
            "A+": "text-green-600 bg-green-100 dark:bg-green-900/30",
            A: "text-green-500 bg-green-50 dark:bg-green-900/20",
            "B+": "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
            B: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
            "C+": "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
            C: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
            D: "text-red-600 bg-red-100 dark:bg-red-900/30",
        };
        return colors[grade] || colors["C"];
    };
    const getRiskColor = (risk) => {
        if (risk < 0.2)
            return "text-green-600";
        if (risk < 0.4)
            return "text-yellow-600";
        return "text-red-600";
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 85)
            return "text-green-600";
        if (confidence >= 75)
            return "text-yellow-600";
        return "text-red-600";
    };
    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(timestamp);
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold", children: "Real-Time Predictions" }), _jsx("div", { className: "animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" })] }), _jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "animate-pulse", children: _jsx("div", { className: "h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" }) }, i))) })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Real-Time Predictions" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm text-green-600 dark:text-green-400", children: "Live" })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("select", { value: selectedSport, onChange: (e) => setSelectedSport(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "All", children: "All Sports" }), _jsx("option", { value: "NBA", children: "NBA" }), _jsx("option", { value: "NFL", children: "NFL" }), _jsx("option", { value: "MLB", children: "MLB" }), _jsx("option", { value: "NHL", children: "NHL" })] }), _jsx("select", { value: selectedType, onChange: (e) => setSelectedType(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: types.map((type) => (_jsx("option", { value: type, children: type === "All"
                                ? "All Types"
                                : type.replace("_", " ").toUpperCase() }, type))) })] }), _jsx("div", { className: "space-y-3", children: filteredPredictions.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No predictions available for the selected filters." })) : (filteredPredictions.map((prediction) => (_jsx("div", { className: "p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("span", { className: "px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded", children: prediction.sport }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: prediction.game })] }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: prediction.prediction }), _jsxs("div", { className: "flex items-center space-x-4 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Confidence:" }), _jsxs("span", { className: `font-semibold ${getConfidenceColor(prediction.confidence)}`, children: [prediction.confidence, "%"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Odds:" }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: prediction.odds })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Risk:" }), _jsxs("span", { className: `font-semibold ${getRiskColor(prediction.risk)}`, children: [(prediction.risk * 100).toFixed(1), "%"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getValueGradeColor(prediction.valueGrade)}`, children: prediction.valueGrade }), _jsxs("div", { className: "mt-2 text-lg font-bold text-green-600 dark:text-green-400", children: ["+", prediction.expectedValue.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatTimestamp(prediction.timestamp) })] })] }) }, prediction.id)))) })] }));
}
