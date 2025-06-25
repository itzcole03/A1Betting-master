import { PerformanceMetrics, TrendDelta, RiskProfile } from '../types/analytics';
interface AnalyticsResult {
    metrics: PerformanceMetrics;
    trendDelta: TrendDelta;
    riskProfile: RiskProfile;
    isLoading: boolean;
    error: string | null;
}
export declare const useAnalytics: (event: string, market: string, selection: string) => AnalyticsResult;
export {};
