import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from '../components/ui/GlassCard';
import Tooltip from '../components/ui/Tooltip';
import { PatternStrengthMetrics } from '../components/analytics/PatternStrengthMetrics';
import ShapExplanation from '../components/analytics/ShapExplanation.tsx';
import PredictionConfidenceGraph from '../components/analytics/PredictionConfidenceGraph.tsx';
import RiskAssessmentMatrix from '../components/analytics/RiskAssessmentMatrix.tsx';
import ModelComparisonChart from '../components/analytics/ModelComparisonChart.tsx';
import TrendAnalysisChart from '../components/analytics/TrendAnalysisChart.tsx';
import { GlobalErrorBoundary } from '../components/common/ErrorBoundary.tsx';
import ToastContainer from '../components/shared/feedback/Toast.tsx';
// Alpha1 Advanced Widgets
import ConfidenceBands from '../components/ui/ConfidenceBands.tsx';
import RiskHeatMap from '../components/ui/RiskHeatMap.tsx';
import SourceHealthBar from '../components/ui/SourceHealthBar.tsx';
import WhatIfSimulator from '../components/advanced/WhatIfSimulator.tsx';
// TODO: Add tests for new widgets
const AnalyticsPage = () => {
    return (_jsx(ToastContainer, { children: _jsx(GlobalErrorBoundary, { children: _jsxs("div", { className: "p-6 space-y-8 bg-gradient-to-br from-blue-900/80 to-blue-700/80 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors", children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-6", children: "Analytics Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Prediction Confidence" }), _jsx(PredictionConfidenceGraph, {})] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Risk Assessment" }), _jsx(RiskAssessmentMatrix, {})] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Model Comparison" }), _jsx(ModelComparisonChart, {})] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Trend Analysis" }), _jsx(TrendAnalysisChart, {})] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "SHAP Explanation" }), _jsx(ShapExplanation, { eventId: '' })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Pattern Recognition Strength" }), _jsx(PatternStrengthMetrics, {})] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Advanced Widgets" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(ConfidenceBands, { lower: 42, upper: 68, mean: 55 }), _jsx(Tooltip, { content: "Model confidence interval (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs("div", { children: [_jsx(RiskHeatMap, { riskScores: [0.2, 0.6, 0.7] }), _jsx(Tooltip, { content: "Risk heat map (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs("div", { children: [_jsx(SourceHealthBar, { sources: [
                                                            { name: 'Sportradar', healthy: true },
                                                            { name: 'Weather', healthy: true },
                                                            { name: 'Injury', healthy: false },
                                                        ] }), _jsx(Tooltip, { content: "Source health status (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs("div", { children: [_jsx(WhatIfSimulator, {}), _jsx(Tooltip, { content: "What-if scenario simulator (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] })] })] })] })] }) }) }));
};
export default AnalyticsPage;
