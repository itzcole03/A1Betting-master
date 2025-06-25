import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { usePrediction } from '../hooks/usePrediction';
export const PredictionDisplay = ({ propId, initialFeatures, context }) => {
    const { makePrediction, getInsights, isLoading, error, lastPrediction } = usePrediction();
    const [insights, setInsights] = useState([]);
    const [features, setFeatures] = useState(initialFeatures || {
        player_points: 0,
        team_points: 0,
        opponent_points: 0,
        minutes_played: 0,
        home_game: 0,
        days_rest: 0
    });
    const [featureContributions, setFeatureContributions] = useState([]);
    const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
    useEffect(() => {
        const loadInsights = async () => {
            try {
                const data = await getInsights();
                setInsights(data);
            }
            catch (err) {
                console.error('Failed to load insights:', err);
            }
        };
        loadInsights();
    }, [getInsights]);
    const handleFeatureChange = (key, value) => {
        setFeatures(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const handlePredict = async () => {
        try {
            const response = await makePrediction(features, propId, context);
            if (response.insights?.feature_contributions) {
                const contributions = Object.entries(response.insights.feature_contributions)
                    .map(([name, importance]) => ({
                    name,
                    value: features[name],
                    importance: importance
                }))
                    .sort((a, b) => b.importance - a.importance);
                setFeatureContributions(contributions);
            }
        }
        catch (err) {
            console.error('Prediction failed:', err);
        }
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8)
            return 'text-green-600';
        if (confidence >= 0.6)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-800", children: "ML Prediction" }), _jsx("div", { className: "grid grid-cols-2 gap-4 mb-6", children: Object.entries(features).map(([key, value]) => (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: key.replace(/_/g, ' ').toUpperCase() }), _jsx("input", { type: "number", value: value, onChange: (e) => handleFeatureChange(key, parseFloat(e.target.value)), className: "border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }, key))) }), _jsx("button", { onClick: handlePredict, disabled: isLoading, className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium", children: isLoading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Predicting..."] })) : 'Make Prediction' }), error && (_jsxs("div", { className: "mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded", children: [_jsx("p", { className: "font-medium", children: "Error" }), _jsx("p", { children: error.message })] })), lastPrediction && (_jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [_jsx("h3", { className: "font-semibold mb-3 text-gray-800", children: "Prediction Result" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-lg", children: ["Outcome: ", _jsx("span", { className: "font-medium", children: lastPrediction.predictedOutcome })] }), lastPrediction.confidence && (_jsxs("p", { className: `text-lg ${getConfidenceColor(lastPrediction.confidence)}`, children: ["Confidence: ", (lastPrediction.confidence * 100).toFixed(1), "%"] }))] }), featureContributions.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-medium mb-2 text-gray-700", children: "Feature Importance" }), _jsx("div", { className: "space-y-2", children: featureContributions.map(({ name, value, importance }) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-32 text-sm text-gray-600", children: name.replace(/_/g, ' ') }), _jsx("div", { className: "flex-1 h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500", style: { width: `${importance * 100}%` } }) }), _jsxs("div", { className: "w-16 text-right text-sm text-gray-600", children: [(importance * 100).toFixed(1), "%"] })] }, name))) })] })), _jsxs("button", { onClick: () => setShowAdvancedMetrics(!showAdvancedMetrics), className: "mt-4 text-sm text-blue-600 hover:text-blue-800", children: [showAdvancedMetrics ? 'Hide' : 'Show', " Advanced Metrics"] }), showAdvancedMetrics && lastPrediction.insights?.model_metrics && (_jsxs("div", { className: "mt-4 p-3 bg-gray-100 rounded", children: [_jsx("h4", { className: "font-medium mb-2 text-gray-700", children: "Model Performance" }), _jsx("div", { className: "grid grid-cols-2 gap-2 text-sm", children: Object.entries(lastPrediction.insights.model_metrics)
                                    .filter(([key]) => !key.includes('confusion_matrix'))
                                    .map(([key, value]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "text-gray-600", children: [key, ":"] }), _jsx("span", { className: "font-medium", children: value.toFixed(3) })] }, key))) })] }))] })), insights.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "font-semibold mb-3 text-gray-800", children: "ML Insights" }), _jsx("div", { className: "space-y-3", children: insights.map(insight => (_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors duration-200", children: [_jsx("p", { className: "text-sm text-gray-700", children: insight.text }), insight.confidence && (_jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsxs("span", { className: "text-xs text-gray-500", children: ["Source: ", insight.source] }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Confidence: ", (insight.confidence * 100).toFixed(1), "%"] })] }))] }, insight.id))) })] }))] }));
};
