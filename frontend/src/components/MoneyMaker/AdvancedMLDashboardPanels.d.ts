import React from 'react';
interface ModelPerformanceHistory {
    date: string;
    accuracy: number;
    f1: number;
}
interface AdvancedMLDashboardPanelsProps {
    eventId: string;
    modelId: string;
    modelPerformanceHistory: ModelPerformanceHistory[];
}
export declare const AdvancedMLDashboardPanels: React.FC<AdvancedMLDashboardPanelsProps>;
export {};
