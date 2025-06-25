import React from 'react';
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        fill?: boolean;
        tension?: number;
    }[];
}
interface AdvancedChartsProps {
    data: ChartData;
    type: 'line' | 'bar';
    title?: string;
    height?: number;
    options?: any;
}
/**
 * AdvancedCharts renders a high-performance, accessible chart using Chart.js.
 * - Wrapped in <figure> with <figcaption> for semantic context
 * - ARIA label and role for screen readers
 * - Keyboard accessible (tabIndex)
 */
export declare const AdvancedCharts: React.FC<AdvancedChartsProps>;
export declare const PredictionConfidenceChart: React.MemoExoticComponent<({ predictions }: {
    predictions: {
        confidence: number;
        label: string;
    }[];
}) => import("react/jsx-runtime").JSX.Element>;
export declare const ModelPerformanceChart: React.MemoExoticComponent<({ models }: {
    models: {
        name: string;
        performance: number;
    }[];
}) => import("react/jsx-runtime").JSX.Element>;
export declare const BettingPerformanceChart: React.MemoExoticComponent<({ performance }: {
    performance: {
        date: string;
        value: number;
    }[];
}) => import("react/jsx-runtime").JSX.Element>;
export {};
