export interface AnalyticsConfig {
    ml?: {
        autoUpdate?: boolean;
        updateInterval?: number;
    };
    performance?: boolean;
    drift?: boolean;
    betting?: boolean;
    realtime?: boolean;
}
export interface MLAnalyticsResult {
    predictions: number[];
    probabilities: number[];
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
    insights: {
        featureImportance: Record<string, number>;
        shap: Record<string, number[]>;
        lime: Record<string, number>;
    };
}
export interface PerformanceMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
    mae: number;
    rmse: number;
}
export interface ModelPerformance {
    model: string;
    metrics: PerformanceMetrics;
    timestamp: string;
}
export interface DriftPoint {
    timestamp: string;
    value: number;
    threshold: number;
    is_drift: boolean;
    feature?: string;
}
export interface BettingAnalytics {
    roi: number;
    winRate: number;
    profitLoss: number;
    riskMetrics: {
        var: number;
        sharpe: number;
        sortino: number;
    };
    confidence: number;
}
export interface RealtimeMetrics {
    latency: number;
    throughput: number;
    errorRate: number;
    resourceUsage: {
        cpu: number;
        memory: number;
        network: number;
    };
}
export interface AnalyticsError {
    message: string;
    code?: string;
    context?: string;
}
export interface AnalyticsState {
    ml: {
        data: MLAnalyticsResult | null;
        loading: boolean;
        error: string | null;
    };
    performance: {
        data: ModelPerformance[] | null;
        loading: boolean;
        error: string | null;
    };
    drift: {
        data: DriftPoint[] | null;
        loading: boolean;
        error: string | null;
    };
    betting: {
        data: BettingAnalytics | null;
        loading: boolean;
        error: string | null;
    };
    realtime: {
        data: RealtimeMetrics | null;
        loading: boolean;
        error: string | null;
    };
}
export declare const useUnifiedAnalytics: (config?: AnalyticsConfig) => {
    ml: {
        data: MLAnalyticsResult | null;
        loading: boolean;
        error: string | null;
        refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<import("@tanstack/react-query").NoInfer<TQueryFnData>, AnalyticsError>>;
    };
    performance: {
        data: ModelPerformance[] | null;
        loading: boolean;
        error: string | null;
        refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<import("@tanstack/react-query").NoInfer<TQueryFnData>, AnalyticsError>>;
    };
    drift: {
        data: DriftPoint[] | null;
        loading: boolean;
        error: string | null;
        refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<DriftPoint[] | null, AnalyticsError>>;
    };
    betting: {
        data: BettingAnalytics | null;
        loading: boolean;
        error: string | null;
        refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<BettingAnalytics | null, AnalyticsError>>;
    };
    realtime: {
        data: RealtimeMetrics | null;
        loading: boolean;
        error: string | null;
        refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<RealtimeMetrics | null, AnalyticsError>>;
    };
    isLoading: boolean;
    error: string | null;
};
