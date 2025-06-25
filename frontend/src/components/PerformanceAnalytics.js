import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useUnifiedAnalytics } from '../hooks/useUnifiedAnalytics';
import PerformanceMetrics from './PerformanceMetrics';
import { NoResultsFallback } from './NoResultsFallback';
const PerformanceAnalytics = () => {
    const { performance } = useUnifiedAnalytics({ performance: true });
    if (!performance || performance.loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading performance metrics..." });
    }
    if (performance.error) {
        return _jsx(NoResultsFallback, {});
    }
    if (!performance.performance.length) {
        return _jsx(NoResultsFallback, {});
    }
    // Transform performance data to metrics for the UI
    const metrics = performance.performance.map(modelPerf => ({
        label: modelPerf.model,
        trend: 'neutral', // TODO: Add trend logic
        value: modelPerf.metrics.f1,
        change: 0, // TODO: Add change logic
    }));
    return _jsx(PerformanceMetrics, { metrics: metrics });
};
export default React.memo(PerformanceAnalytics);
