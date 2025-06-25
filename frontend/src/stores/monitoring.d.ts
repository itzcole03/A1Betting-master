export interface StorePerformanceMetrics {
    updateCount: number;
    lastUpdate: number | null;
    averageUpdateDuration: number;
    totalUpdateDuration: number;
    minUpdateDuration: number | null;
    maxUpdateDuration: number | null;
}
export declare const usePerformanceMetrics: import("zustand").UseBoundStore<import("zustand").StoreApi<StorePerformanceMetrics>>;
export declare function updatePerformanceMetrics(duration: number): void;
