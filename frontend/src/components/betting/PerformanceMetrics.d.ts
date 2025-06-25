import React from 'react';
import { BettingMetrics } from '../../types/betting';
interface PerformanceMetricsProps {
    metrics: BettingMetrics;
    loading: boolean;
    error: Error | null;
}
export declare const PerformanceMetrics: React.FC<PerformanceMetricsProps>;
export {};
