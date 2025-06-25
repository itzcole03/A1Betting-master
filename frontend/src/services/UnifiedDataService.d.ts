type Listener = (...args: unknown[]) => void;
declare class SimpleEventEmitter {
    private listeners;
    on(event: string, listener: Listener): void;
    off(event: string, listener: Listener): void;
    emit(event: string, ...args: unknown[]): void;
}
export declare enum DataSource {
    PRIZEPICKS = "prizepicks",
    ESPN = "espn",
    ODDS_API = "odds_api"
}
export type DataResponse<T = unknown> = {
    source: DataSource;
    timestamp: number;
    data: T | null;
    status: 'success' | 'error';
};
export declare class UnifiedDataService extends SimpleEventEmitter {
    private static instance;
    private wsConnections;
    private cache;
    private constructor();
    static getInstance(): UnifiedDataService;
    private getBaseUrl;
    /**
     * Fetch data from a backend API, with caching and rate limiting.
     */
    fetchData: <T = unknown>(source: DataSource, endpoint: string, params?: Record<string, string | number> | undefined) => Promise<DataResponse<T>>;
    connectWebSocket(source: DataSource, options: {
        events: string[];
    }): void;
    disconnectWebSocket(source: DataSource): void;
    clearCache(): void;
}
export {};
