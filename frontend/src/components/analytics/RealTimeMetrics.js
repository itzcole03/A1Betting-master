import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, Badge, Icon, Spinner } from '../ui/UnifiedUI.js';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry.js';
export const RealTimeMetrics = ({ eventId, marketId, selectionId, className = '', }) => {
    const [metrics, setMetrics] = useState(null);
    const [trendDelta, setTrendDelta] = useState(null);
    const [riskProfile, setRiskProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const analyticsService = serviceRegistry.getService('analytics');
    const webSocketService = serviceRegistry.getService('websocket');
    useEffect(() => {
        const loadMetrics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                if (!analyticsService) {
                    setError('Analytics service is not available.');
                    setIsLoading(false);
                    return;
                }
                const [metricsData, trendData, riskData] = await Promise.all([
                    analyticsService.getPerformanceMetrics(eventId, marketId, selectionId),
                    analyticsService.getTrendDelta(eventId, marketId, selectionId, 'day'),
                    analyticsService.getRiskProfile(eventId, marketId, selectionId),
                ]);
                setMetrics(metricsData);
                setTrendDelta(trendData);
                setRiskProfile(riskData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load metrics');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadMetrics();
        // Subscribe to real-time updates
        let unsubscribe = () => { };
        if (webSocketService) {
            unsubscribe = webSocketService.subscribe('metrics', (data) => {
                // Type guard to ensure data has the expected structure
                if (data &&
                    typeof data === 'object' &&
                    'eventId' in data &&
                    'marketId' in data &&
                    'metrics' in data &&
                    'trendDelta' in data &&
                    'riskProfile' in data) {
                    const typedData = data;
                    if (typedData.eventId === eventId && typedData.marketId === marketId) {
                        setMetrics(typedData.metrics);
                        setTrendDelta(typedData.trendDelta);
                        setRiskProfile(typedData.riskProfile);
                    }
                }
            });
        }
        return () => unsubscribe();
    }, [eventId, marketId, selectionId, analyticsService, webSocketService]);
    const getMetricColor = (value, type) => {
        if (type === 'positive') {
            return value >= 0 ? 'text-green-500' : 'text-red-500';
        }
        return value <= 0 ? 'text-green-500' : 'text-red-500';
    };
    const getTrendIcon = (value) => {
        if (value > 0)
            return 'arrow-trending-up';
        if (value < 0)
            return 'arrow-trending-down';
        return 'minus';
    };
    const getRiskBadgeVariant = (riskLevel) => {
        switch (riskLevel.toLowerCase()) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'danger';
            default:
                return 'info';
        }
    };
    if (isLoading) {
        return (_jsx(Card, { "aria-live": "polite", className: `p-6 ${className}`, children: _jsx("div", { className: "flex justify-center items-center h-32", children: _jsx(Spinner, { size: "large" }) }) }));
    }
    if (error) {
        return (_jsx(Card, { "aria-live": "polite", className: `p-6 ${className}`, children: _jsxs("div", { className: "text-red-500 text-center", children: [_jsx(Icon, { className: "w-8 h-8 mx-auto mb-2", name: "exclamation-circle" }), _jsx("p", { children: error })] }) }));
    }
    if (!metrics || !trendDelta || !riskProfile) {
        return null;
    }
    return (_jsxs(Card, { "aria-live": "polite", className: `p-6 ${className}`, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Real-Time Metrics" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Accuracy" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.accuracy * 100).toFixed(1), "%"] }), _jsx(Icon, { "aria-label": trendDelta.accuracyDelta > 0
                                            ? 'Positive accuracy trend'
                                            : trendDelta.accuracyDelta < 0
                                                ? 'Negative accuracy trend'
                                                : 'No accuracy trend', className: `w-4 h-4 ${getMetricColor(trendDelta.accuracyDelta, 'positive')}`, name: getTrendIcon(trendDelta.accuracyDelta) })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Precision" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.precision * 100).toFixed(1), "%"] }), _jsx(Icon, { className: `w-4 h-4 ${getMetricColor(trendDelta.precisionDelta, 'positive')}`, name: getTrendIcon(trendDelta.precisionDelta) })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Recall" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.recall * 100).toFixed(1), "%"] }), _jsx(Icon, { className: `w-4 h-4 ${getMetricColor(trendDelta.recallDelta, 'positive')}`, name: getTrendIcon(trendDelta.recallDelta) })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Profit/Loss" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: ["$", metrics.profitLoss.toFixed(2)] }), _jsx(Icon, { className: `w-4 h-4 ${getMetricColor(metrics.profitLoss, 'positive')}`, name: getTrendIcon(metrics.profitLoss) })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Risk Profile" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: getRiskBadgeVariant(riskProfile.riskLevel), children: riskProfile.riskLevel }), _jsx("p", { className: "text-sm text-gray-600", children: riskProfile.recommendation })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Top Risk Factors" }), _jsx("div", { className: "space-y-2", children: Array.isArray(riskProfile.factors) && riskProfile.factors.length > 0 ? (riskProfile.factors.map((factor, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm", children: factor }), _jsx(Badge, { variant: "warning", children: "Risk Factor" })] }, index)))) : (_jsx("p", { className: "text-sm", children: "No risk factors available." })) })] })] })] }));
};
