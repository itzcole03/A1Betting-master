import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import Dashboard from '../components/modern/Dashboard.tsx';
import { UnifiedPredictionInterface } from '../components/prediction/UnifiedPredictionInterface.tsx';
import PredictionConfidenceGraph from '../components/analytics/PredictionConfidenceGraph.tsx';
import RiskAssessmentMatrix from '../components/analytics/RiskAssessmentMatrix.tsx';
import ModelComparisonChart from '../components/analytics/ModelComparisonChart.tsx';
import TrendAnalysisChart from '../components/analytics/TrendAnalysisChart.tsx';
import ShapExplanation from '../components/analytics/ShapExplanation.tsx';
import UserStats from '../components/analytics/UserStats.tsx';
import MLInsights from '../components/insights/MLInsights.tsx';
import { GlobalErrorBoundary } from '../components/common/ErrorBoundary.tsx';
import { LoadingSpinner } from '../components/shared/ui/LoadingSpinner.tsx';
import ToastContainer from '../components/shared/feedback/Toast.tsx';
// Alpha1 Advanced Widgets
import ConfidenceBands from '../components/ui/ConfidenceBands.tsx';
import RiskHeatMap from '../components/ui/RiskHeatMap.tsx';
import SourceHealthBar from '../components/ui/SourceHealthBar.tsx';
import WhatIfSimulator from '../components/advanced/WhatIfSimulator.tsx';
// Personalization overlay
// import { userPersonalizationService } from '../services/analytics/userPersonalizationService.ts';
import { Accordion } from '../components/Accordion.tsx';
import { Alert } from '../components/Alert.tsx';
import Analytics from '../components/Analytics.tsx';
import ApiHealthIndicator from '../components/ApiHealthIndicator.jsx';
// TODO: Add tests for new widgets
const DashboardPage = () => {
    return (_jsxs(_Fragment, { children: [_jsx(ToastContainer, {}), _jsx(GlobalErrorBoundary, { children: _jsxs("div", { className: "p-4 md:p-6 lg:p-8 bg-gradient-to-br from-primary-900/80 to-primary-700/80 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors", children: [_jsx("div", { className: "mb-4", children: _jsx(Alert, { type: "info", title: "Welcome to the AI Sports Analytics Platform!", message: "Stay tuned for real-time updates, new features, and important announcements.", closable: false }) }), _jsxs(React.Suspense, { fallback: _jsx(LoadingSpinner, {}), children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsx(ApiHealthIndicator, {}) }), _jsx(Dashboard, {}), _jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsx(UnifiedPredictionInterface, {}), _jsx(PredictionConfidenceGraph, {}), _jsx(RiskAssessmentMatrix, {}), _jsx(ModelComparisonChart, {}), _jsx(TrendAnalysisChart, {}), _jsx(ShapExplanation, { eventId: '' }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Your Analytics" }), _jsx(Analytics, {})] }), _jsxs(React.Suspense, { fallback: _jsx(LoadingSpinner, {}), children: [_jsxs("div", { className: "mt-4", children: [_jsx(ConfidenceBands, { lower: 45, upper: 65, mean: 55 }), _jsx("span", { className: "tooltip", children: "Model confidence interval (hover for details)" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(RiskHeatMap, { riskScores: [0.1, 0.5, 0.8] }), _jsx("span", { className: "tooltip", children: "Risk heat map (hover for details)" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(SourceHealthBar, { sources: [
                                                                        { name: 'Sportradar', healthy: true },
                                                                        { name: 'Weather', healthy: false },
                                                                        { name: 'Injury', healthy: true },
                                                                    ] }), _jsx("span", { className: "tooltip", children: "Source health status (hover for details)" })] }), _jsxs("div", { className: "mt-4", children: [_jsx(WhatIfSimulator, {}), _jsx("span", { className: "tooltip", children: "What-if scenario simulator (hover for details)" })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Frequently Asked Questions" }), _jsx(Accordion, { items: [
                                                                        {
                                                                            title: 'How do I use the AI Sports Analytics Platform?',
                                                                            content: (_jsx("span", { children: "Navigate through the dashboard to view predictions, analytics, and insights. Use the widgets to explore advanced features." })),
                                                                        },
                                                                        {
                                                                            title: 'What do the confidence bands mean?',
                                                                            content: (_jsx("span", { children: "The confidence bands show the range in which the model expects the true value to fall, based on historical data." })),
                                                                        },
                                                                        {
                                                                            title: 'How can I simulate what-if scenarios?',
                                                                            content: (_jsx("span", { children: "Use the What-If Simulator widget to adjust parameters and see how predictions change in real time." })),
                                                                        },
                                                                        {
                                                                            title: 'Who can I contact for support?',
                                                                            content: (_jsx("span", { children: "Please use the in-app chat or email support@ultimatesportsbetting.com for assistance." })),
                                                                        },
                                                                    ], variant: "bordered", allowMultiple: true })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(UserStats, {}), _jsx(MLInsights, {}), _jsx("div", { className: "mt-4" })] })] })] })] }) })] }));
};
export default DashboardPage;
