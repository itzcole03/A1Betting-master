export declare class ModelPerformanceTracker {
    private static performanceHistory;
    static logPrediction(modelId: string, result: any): void;
    static getPerformance(modelId: string): any[];
    static getStats(modelId: string): {
        accuracy: number;
        errorRate: number;
        edge: number;
    } | null;
}
export default ModelPerformanceTracker;
