import { EngineeredFeatures, FeatureMonitoringConfig } from '@/types';
interface MonitoringMetrics {
    timestamp: string;
    featureCounts: {
        numerical: number;
        categorical: number;
        temporal: number;
        derived: number;
    };
    qualityMetrics: {
        completeness: number;
        consistency: number;
        relevance: number;
        stability: number;
    };
    performanceMetrics: {
        processingTime: number;
        memoryUsage: number;
        errorRate: number;
    };
}
export declare class FeatureMonitor {
    private readonly config;
    private readonly logger;
    private readonly metrics;
    private monitoringInterval;
    constructor(config: FeatureMonitoringConfig);
    private initializeMonitoring;
    private startMonitoring;
    private collectMetrics;
    monitorFeatures(features: EngineeredFeatures, processingTime: number): Promise<void>;
    private calculateMetrics;
    private calculateQualityMetrics;
    private calculateCompleteness;
    private calculateConsistency;
    private calculateRelevance;
    private calculateStability;
    private calculatePerformanceMetrics;
    private calculateErrorRate;
    private calculateVariance;
    private calculateTrend;
    private calculateLinearRegressionSlope;
    private calculateSeasonality;
    private calculateAutocorrelation;
    private checkAlerts;
    getMetrics(): MonitoringMetrics[];
    getLatestMetrics(): MonitoringMetrics | null;
    isEnabled(): boolean;
    setEnabled(enabled: boolean): void;
    getMetricsInterval(): number;
    setMetricsInterval(interval: number): void;
}
export {};
