import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { useUnifiedAnalytics } from '@/hooks/useUnifiedAnalytics';
const EnsembleInsights = () => {
    // Use unified analytics for model performance
    const { performance } = useUnifiedAnalytics({ performance: true });
    if (performance.loading) {
        return _jsx("div", { className: "p-4", children: "Loading model performance..." });
    }
    if (performance.error) {
        return _jsxs("div", { className: "p-4 text-red-600", children: ["Error: ", performance.error] });
    }
    if (!performance.data) {
        return _jsx("div", { className: "p-4 text-gray-500", children: "No model performance data available." });
    }
    // Example: Show a bar chart of model performance metrics
    const data = performance.data.map(item => ({
        name: item.model,
        accuracy: item.metrics.accuracy,
        precision: item.metrics.precision,
        recall: item.metrics.recall,
        f1: item.metrics.f1,
        roc_auc: item.metrics.roc_auc,
        mae: item.metrics.mae,
        rmse: item.metrics.rmse,
    }));
    return (_jsx("div", { className: "space-y-8", children: _jsxs("section", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Model Performance" }), _jsx(ResponsiveContainer, { height: 400, width: "100%", children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "accuracy", fill: "#3B82F6", name: "Accuracy" }), _jsx(Bar, { dataKey: "f1", fill: "#10B981", name: "F1 Score" }), _jsx(Bar, { dataKey: "roc_auc", fill: "#6366F1", name: "ROC AUC" })] }) })] }) }));
};
export default React.memo(EnsembleInsights);
