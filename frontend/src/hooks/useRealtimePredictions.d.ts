interface UseRealtimePredictionsOptions {
    enabled?: boolean;
    channels?: string[];
    onError?: (error: Error) => void;
    reconnectAttempts?: number;
    reconnectInterval?: number;
}
export declare function useRealtimePredictions({ enabled, channels, onError, reconnectAttempts: maxReconnectAttempts, reconnectInterval, }?: UseRealtimePredictionsOptions): {
    isConnected: boolean;
    isConnecting: boolean;
    lastMessageTimestamp: number | null;
    isStale: boolean;
    reconnectAttempts: number;
    connect: () => void;
    disconnect: () => void;
};
export {};
