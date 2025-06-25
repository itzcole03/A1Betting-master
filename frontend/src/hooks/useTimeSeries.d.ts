interface TimeSeriesPoint {
    timestamp: string;
    value: number;
    forecast?: number;
    lower_bound?: number;
    upper_bound?: number;
    feature?: string;
}
export declare const useTimeSeries: () => {
    timeSeries: TimeSeriesPoint[];
    loading: boolean;
    error: string | null;
    fetchTimeSeries: () => Promise<void>;
    getLatestTimeSeries: () => TimeSeriesPoint | null;
    getTimeSeriesHistory: (feature?: string) => TimeSeriesPoint[];
    getTimeSeriesTrend: (feature?: string) => {
        timestamp: string;
        value: number;
        forecast: number | undefined;
        lower_bound: number | undefined;
        upper_bound: number | undefined;
    }[];
    getTimeSeriesFeatures: () => string[];
    getTimeSeriesSummary: () => {
        total_points: number;
        features: number;
        time_range: {
            start: string;
            end: string;
        };
        feature_stats: {
            feature: string;
            count: number;
            mean: number;
            min: number;
            max: number;
        }[];
    };
    getForecastAccuracy: (feature?: string) => number | null;
    getConfidenceIntervals: (feature?: string) => TimeSeriesPoint[];
};
export {};
