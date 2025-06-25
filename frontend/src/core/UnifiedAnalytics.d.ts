interface AnalyticsMetrics {
    totalEvents: number;
    eventsByType: Map<string, number>;
    averageLatency: number;
    errorRate: number;
    lastProcessed: number;
}
interface AnalyticsConfig {
    enabled: boolean;
    sampleRate: number;
    retentionPeriod: number;
    batchSize: number;
    flushInterval: number;
}
export declare class UnifiedAnalytics {
    private static instance;
    private readonly eventBus;
    private readonly configManager;
    private readonly monitor;
    private readonly eventQueue;
    private readonly metrics;
    private config;
    private flushTimer;
    private constructor();
    static getInstance(): UnifiedAnalytics;
    private setupEventListeners;
    private startFlushTimer;
    trackEvent(type: string, data: Record<string, any>, metadata?: Record<string, any>): void;
    private updateMetrics;
    private flushEvents;
    private processEvents;
    getMetrics(): AnalyticsMetrics;
    updateConfig(updates: Partial<AnalyticsConfig>): void;
    cleanup(): Promise<void>;
}
export {};
