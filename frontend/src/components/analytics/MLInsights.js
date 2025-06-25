import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useUnifiedAnalytics } from '@/hooks/useUnifiedAnalytics';
const safeNumber = (n) => (typeof n === 'number' && !isNaN(n) ? n : 0);
const exportToJson = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ml-insights.json';
    a.click();
    URL.revokeObjectURL(url);
};
const MLInsights = ({ autoUpdateInterval = 60000, showFeatureImportance = true, showPerformance = true, }) => {
    const { ml } = useUnifiedAnalytics({
        ml: { autoUpdate: true, updateInterval: autoUpdateInterval },
    });
    const [showInfo, setShowInfo] = useState(false);
    if (ml.loading) {
        return (_jsx("div", { "aria-live": "polite", className: "flex items-center justify-center h-96", role: "status", children: _jsx("div", { "aria-label": "Loading", className: "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" }) }));
    }
    if (ml.error) {
        return (_jsxs("div", { className: "p-4 bg-red-100 border border-red-400 text-red-700 rounded", role: "alert", children: [_jsx("h3", { className: "font-bold", children: "Error" }), _jsx("p", { children: ml.error }), _jsx("button", { className: "mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", "data-testid": "mlinsights-retry", onClick: () => ml.refetch(), children: "Retry" })] }));
    }
    const mlResult = ml.data;
    if (!mlResult) {
        return (_jsx("div", { className: "p-4 text-gray-500", role: "status", children: "No ML analytics available." }));
    }
    return (_jsx("div", { className: "space-y-8", "data-testid": "mlinsights-root", children: showPerformance && (_jsxs("section", { "aria-labelledby": "ml-performance-heading", className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", id: "ml-performance-heading", children: "ML Predictions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Model Performance" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Accuracy:" }), _jsx("span", { className: "font-mono", "data-testid": "mlinsights-accuracy", children: safeNumber(mlResult.metrics?.accuracy).toFixed(4) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Precision:" }), _jsx("span", { className: "font-mono", children: safeNumber(mlResult.metrics?.precision).toFixed(4) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Recall:" }), _jsx("span", { className: "font-mono", children: safeNumber(mlResult.metrics?.recall).toFixed(4) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "F1 Score:" }), _jsx("span", { className: "font-mono", children: safeNumber(mlResult.metrics?.f1Score).toFixed(4) })] })] })] }), showFeatureImportance && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("h3", { className: "text-lg font-semibold mr-2", children: "Feature Importance" }), _jsx("button", { "aria-label": "What is feature importance?", className: "ml-1 text-blue-500 hover:underline", type: "button", onClick: () => setShowInfo(v => !v), children: "?" }), showInfo && (_jsx("span", { className: "ml-2 text-xs bg-blue-100 text-blue-800 rounded px-2 py-1", role: "note", children: "Feature importance shows which input variables most influenced the model\u2019s predictions (e.g., via SHAP values)." }))] }), _jsx("div", { style: { width: 300, height: 200 }, children: _jsxs(BarChart, { data: Object.entries(mlResult.insights?.featureImportance || {}).map(([key, value]) => ({ name: key, value: safeNumber(value) })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#3B82F6" })] }) })] }))] }), _jsxs("div", { className: "flex justify-end mt-4 gap-2", children: [_jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", "data-testid": "mlinsights-refresh", onClick: () => ml.refetch(), children: "Refresh Analysis" }), _jsx("button", { className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300", "data-testid": "mlinsights-export", onClick: () => exportToJson(mlResult), children: "Export JSON" })] })] })) }));
};
export default React.memo(MLInsights);
