import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Chart } from 'react-chartjs-2';
import { useShapData } from '../../hooks/useShapData';
import { useSportsNews } from '../../hooks/useSportsNews';
import { ShapValueDisplay } from '../features/analytics/ShapValueDisplay';
export const AdvancedMLDashboardPanels = ({ eventId, modelId, modelPerformanceHistory }) => {
    // SHAP Feature Importance
    const { features: shapFeatures, loading: shapLoading, error: shapError } = useShapData({ eventId, modelType: modelId });
    // Model Performance Chart
    const perfChartData = {
        labels: modelPerformanceHistory.map(d => d.date),
        datasets: [
            {
                label: 'Accuracy',
                data: modelPerformanceHistory.map(d => d.accuracy),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'F1 Score',
                data: modelPerformanceHistory.map(d => d.f1),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                yAxisID: 'y1',
            },
        ],
    };
    // Sports News
    const { articles, loading: newsLoading, error: newsError } = useSportsNews();
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Model Performance Over Time" }), _jsx("div", { className: "h-64", children: _jsx(Chart, { type: "line", data: perfChartData, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                interaction: { mode: 'index', intersect: false },
                                stacked: false,
                                plugins: { legend: { position: 'top' } },
                                scales: {
                                    y: {
                                        type: 'linear',
                                        display: true,
                                        position: 'left',
                                        min: 0,
                                        max: 1,
                                        title: { display: true, text: 'Accuracy' },
                                    },
                                    y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        min: 0,
                                        max: 1,
                                        grid: { drawOnChartArea: false },
                                        title: { display: true, text: 'F1 Score' },
                                    },
                                },
                            } }) })] }), _jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Feature Importance (SHAP)" }), shapLoading && _jsx("div", { children: "Loading SHAP data..." }), shapError && _jsxs("div", { className: "text-error-500", children: ["Error: ", shapError] }), !shapLoading && !shapError && shapFeatures.length > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: shapFeatures.map(f => (_jsx(ShapValueDisplay, { feature: f }, f.feature))) }))] }), _jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Latest Sports News" }), newsLoading && _jsx("div", { children: "Loading news..." }), newsError && _jsxs("div", { className: "text-error-500", children: ["Error: ", newsError] }), !newsLoading && !newsError && articles.length > 0 && (_jsx("ul", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: articles.slice(0, 5).map(article => (_jsxs("li", { className: "py-2", children: [_jsx("a", { href: article.url, target: "_blank", rel: "noopener noreferrer", className: "font-medium text-blue-600 dark:text-blue-400 hover:underline", children: article.title }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: new Date(article.publishedAt).toLocaleString() }), _jsx("div", { className: "text-sm mt-1", children: article.summary })] }, article.id))) }))] })] }));
};
