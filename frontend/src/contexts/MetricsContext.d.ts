import React from 'react';
import { UnifiedMetrics } from '../unified/metrics/types';
export declare const MetricsContext: React.Context<any>;
interface MetricsProviderProps {
    metrics: UnifiedMetrics;
    children: React.ReactNode;
}
export declare const MetricsProvider: React.FC<MetricsProviderProps>;
export {};
