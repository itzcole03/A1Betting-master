import React from 'react';
import { RiskProfileType, BetRecommendation } from '@/types/betting';
interface PerformanceMetricsProps {
    bankroll: number;
    profit: number;
    riskProfile: RiskProfileType;
    recommendations: BetRecommendation[];
}
export declare const PerformanceMetrics: React.FC<PerformanceMetricsProps>;
declare const _default: React.NamedExoticComponent<PerformanceMetricsProps>;
export default _default;
