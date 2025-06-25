interface HealthStatus {
    healthy: boolean;
    lastChecked: number;
    error?: string;
}
export declare const useHealthCheck: () => {
    healthStatus: HealthStatus;
};
export {};
