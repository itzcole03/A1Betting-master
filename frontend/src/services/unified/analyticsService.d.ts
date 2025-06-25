import type { BettingMetrics, ModelPerformance, BettingStats, LineMovement, ArbitrageOpportunity } from "../../types/betting";
interface AnalyticsConfig {
    autoRefresh: boolean;
    refreshInterval: number;
    metricsWindow: "day" | "week" | "month" | "year";
    includeArbitrage: boolean;
    includeLineMovement: boolean;
}
declare class UnifiedAnalyticsService {
    private static instance;
    private readonly predictionService;
    private readonly bettingService;
    private config;
    private readonly apiUrl;
    private metricsCache;
    private lastUpdate;
    protected constructor();
    static getInstance(): UnifiedAnalyticsService;
    getBettingMetrics(): Promise<BettingMetrics>;
    private getDefaultMetrics;
    getModelPerformance(): Promise<ModelPerformance[]>;
    getBettingStats(): Promise<BettingStats>;
    private getDefaultStats;
    getLineMovements(marketId: string): Promise<LineMovement[]>;
    getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]>;
    getPerformanceBreakdown(): Promise<any>;
    getRiskAnalysis(): Promise<any>;
    setConfig(newConfig: Partial<AnalyticsConfig>): void;
    getConfig(): AnalyticsConfig;
    private clearCache;
    isCacheValid(): boolean;
    refreshData(): Promise<void>;
}
export default UnifiedAnalyticsService;
