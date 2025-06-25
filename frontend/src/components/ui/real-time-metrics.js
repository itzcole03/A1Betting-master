import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import WebSocketManager from '@/services/unified/WebSocketManager';
export const RealTimeMetrics = ({ initialMetrics = {
    predictions: 0,
    opportunities: 0,
    activeModels: 0,
    totalProfit: 0
} }) => {
    const [metrics, setMetrics] = useState(initialMetrics);
    useEffect(() => {
        WebSocketManager.instance.subscribe('metrics:update', (data) => {
            setMetrics(prev => ({
                ...prev,
                ...data
            }));
        });
        return () => {
            WebSocketManager.instance.unsubscribe('metrics:update');
        };
    }, []);
    return (_jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(MetricCard, { title: "Active Predictions", value: metrics.predictions, icon: "\uD83D\uDCCA", trend: metrics.predictions > initialMetrics.predictions ? 'up' : 'down' }), _jsx(MetricCard, { title: "Betting Opportunities", value: metrics.opportunities, icon: "\uD83C\uDFAF", trend: metrics.opportunities > initialMetrics.opportunities ? 'up' : 'down' }), _jsx(MetricCard, { title: "Active Models", value: metrics.activeModels, icon: "\uD83E\uDD16", trend: metrics.activeModels > initialMetrics.activeModels ? 'up' : 'down' }), _jsx(MetricCard, { title: "Total Profit", value: `$${metrics.totalProfit.toFixed(2)}`, icon: "\uD83D\uDCB0", trend: metrics.totalProfit > initialMetrics.totalProfit ? 'up' : 'down', isMonetary: true })] }));
};
const MetricCard = ({ title, value, icon, trend, isMonetary }) => {
    const getTrendColor = (t) => {
        return t === 'up' ? 'text-success-500' : 'text-error-500';
    };
    const getTrendIcon = (t) => {
        return t === 'up' ? '↑' : '↓';
    };
    return (_jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-2xl", children: icon }), _jsx("div", { className: `text-sm font-medium ${getTrendColor(trend)}`, children: getTrendIcon(trend) })] }), _jsx("div", { className: "text-sm text-gray-500", children: title }), _jsx("div", { className: `text-2xl font-bold ${isMonetary ? 'text-success-500' : ''}`, children: value })] }));
};
