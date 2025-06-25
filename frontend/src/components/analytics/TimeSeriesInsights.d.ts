import React from 'react';
interface TimeSeriesInsightsProps {
    forecast: number[];
    confidence: {
        lower: number[];
        upper: number[];
    };
    metrics: {
        mse: number;
        mae: number;
        mape: number;
        r2: number;
    };
    seasonality: {
        trend: number[];
        seasonal: number[];
        residual: number[];
    };
    changePoints: {
        index: number;
        value: number;
        type: 'trend' | 'level' | 'volatility';
    }[];
    anomalies: {
        index: number;
        value: number;
        score: number;
    }[];
}
declare const _default: React.NamedExoticComponent<TimeSeriesInsightsProps>;
export default _default;
