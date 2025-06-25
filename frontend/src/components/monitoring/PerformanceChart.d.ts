import React from 'react';
interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
}
interface PerformanceChartProps {
    metrics: PerformanceMetric[];
    title: string;
    yAxisLabel?: string;
    showLegend?: boolean;
    height?: number;
    width?: number;
    color?: string;
    tension?: number;
    fill?: boolean;
}
declare const _default: React.NamedExoticComponent<PerformanceChartProps>;
export default _default;
