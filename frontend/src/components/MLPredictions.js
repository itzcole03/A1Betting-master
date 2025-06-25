import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePredictions } from "../store/unified/UnifiedStoreManager";
import { mlEngine } from "../services/ml/UnifiedMLEngine";
export const MLPredictions = ({ eventId, sport = "basketball_nba", }) => {
    const { predictions, latestPredictions, updatePrediction } = usePredictions();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(eventId || "");
    const generatePrediction = async () => {
        if (!selectedEventId)
            return;
        setIsGenerating(true);
        try {
            const input = {
                eventId: selectedEventId,
                sport,
                homeTeam: "Team A",
                awayTeam: "Team B",
                features: {
                    elo_difference: 50,
                    player_recent_form: 0.8,
                    home_court_advantage: 2.5,
                    rest_days: 1,
                    injury_impact: 0.1,
                },
                market: "moneyline",
                timestamp: Date.now(),
            };
            const prediction = await mlEngine.generatePrediction(input);
            updatePrediction(selectedEventId, {
                id: selectedEventId,
                confidence: prediction.confidence,
                predictedValue: prediction.finalPrediction,
                factors: prediction.factors,
                timestamp: Date.now(),
                metadata: {
                    modelVersion: "ensemble_v1.0",
                    features: input.features,
                },
            });
        }
        catch (error) {
            console.error("Failed to generate prediction:", error);
        }
        finally {
            setIsGenerating(false);
        }
    };
    const formatConfidence = (confidence) => {
        return (confidence * 100).toFixed(1);
    };
    const formatPrediction = (value) => {
        return (value * 100).toFixed(1);
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: "ML Predictions" }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex space-x-4 mb-4", children: [_jsx("input", { type: "text", placeholder: "Enter Event ID", value: selectedEventId, onChange: (e) => setSelectedEventId(e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: generatePrediction, disabled: !selectedEventId || isGenerating, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: isGenerating ? "Generating..." : "Generate Prediction" })] }) }), selectedEventId && predictions[selectedEventId] && (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-3", children: ["Event: ", selectedEventId] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [formatPrediction(predictions[selectedEventId].predictedValue), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-300", children: "Win Probability" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [formatConfidence(predictions[selectedEventId].confidence), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-300", children: "Confidence" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: predictions[selectedEventId].factors.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-300", children: "Key Factors" })] })] }), predictions[selectedEventId].factors.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Key Factors" }), _jsx("div", { className: "space-y-2", children: predictions[selectedEventId].factors
                                        .slice(0, 5)
                                        .map((factor, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: factor.name
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l) => l.toUpperCase()) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-16 h-2 rounded-full ${factor.direction === "positive"
                                                            ? "bg-green-200"
                                                            : "bg-red-200"}`, children: _jsx("div", { className: `h-full rounded-full ${factor.direction === "positive"
                                                                ? "bg-green-500"
                                                                : "bg-red-500"}`, style: {
                                                                width: `${Math.abs(factor.impact) * 100}%`,
                                                            } }) }), _jsxs("span", { className: `text-sm font-medium ${factor.direction === "positive"
                                                            ? "text-green-600"
                                                            : "text-red-600"}`, children: [factor.direction === "positive" ? "+" : "-", (Math.abs(factor.impact) * 100).toFixed(1), "%"] })] })] }, index))) })] }))] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Recent Predictions" }), latestPredictions.length === 0 ? (_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-center py-8", children: "No predictions yet. Generate your first prediction above." })) : (_jsx("div", { className: "space-y-3", children: latestPredictions.slice(0, 10).map((prediction) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-medium text-gray-900 dark:text-white", children: ["Event ", prediction.id] }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: new Date(prediction.timestamp).toLocaleString() })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-semibold text-blue-600", children: [formatPrediction(prediction.predictedValue), "%"] }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [formatConfidence(prediction.confidence), "% confidence"] })] })] }, prediction.id))) }))] })] }) }));
};
export default MLPredictions;
