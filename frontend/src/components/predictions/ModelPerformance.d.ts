import React from 'react';
interface ModelMetrics {
    winRate: number;
    roi: number;
    totalBets: number;
    profitLoss: number;
    averageConfidence: number;
    accuracy: number;
    precision: number;
    recall: number;
}
interface ModelPerformanceProps {
    metrics: ModelMetrics;
}
export declare const ModelPerformance: React.FC<ModelPerformanceProps>;
export {};
