import React from 'react';
interface RealTimeMetricsProps {
    initialMetrics?: {
        predictions: number;
        opportunities: number;
        activeModels: number;
        totalProfit: number;
    };
}
export declare const RealTimeMetrics: React.FC<RealTimeMetricsProps>;
export {};
