import EventEmitter from "eventemitter3";
import { z } from "zod";
export declare enum DataSource {
    PRIZEPICKS = "prizepicks",
    ESPN = "espn",
    ODDS_API = "odds_api"
}
declare const DataResponseSchema: z.ZodObject<{
    source: z.ZodNativeEnum<typeof DataSource>;
    timestamp: z.ZodNumber;
    data: z.ZodUnknown;
    status: z.ZodEnum<["success", "error"]>;
}, "strip", z.ZodTypeAny, {
    source: DataSource;
    status: "error" | "success";
    timestamp: number;
    data?: unknown;
}, {
    source: DataSource;
    status: "error" | "success";
    timestamp: number;
    data?: unknown;
}>;
type DataResponse = z.infer<typeof DataResponseSchema>;
export declare class UnifiedDataService extends EventEmitter {
    private static instance;
    private apiClients;
    private wsConnections;
    private cache;
    private constructor();
    static getInstance(): UnifiedDataService;
    private initializeClients;
    private initializeWebSockets;
    private getBaseUrl;
    private getWebSocketUrl;
    fetchData<T>(source: DataSource, endpoint: string): Promise<T>;
    private getApiUrl;
    fetchDataFromApi(source: DataSource, endpoint: string, params?: Record<string, unknown>): Promise<DataResponse>;
    connectWebSocket(source: DataSource, options: {
        events: string[];
    }): void;
    disconnectWebSocket(source: DataSource): void;
    clearCache(): void;
}
export {};
