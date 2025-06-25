interface WebSocketMessage<T = unknown> {
    type: string;
    data: T;
    timestamp: number;
}
interface UseRealtimeDataOptions<T> {
    url: string;
    initialData?: T | null;
    onMessage?: (message: WebSocketMessage<T>) => void;
    onError?: (error: Error) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
    reconnectAttempts?: number;
    reconnectDelay?: number;
    heartbeatInterval?: number;
    subscriptions?: string[];
}
interface UseRealtimeDataResult<T> {
    data: T | null;
    isConnected: boolean;
    error: Error | null;
    send: (message: any) => void;
    subscribe: (channel: string) => void;
    unsubscribe: (channel: string) => void;
    reconnect: () => void;
}
export declare function useRealtimeData<T>({ url, initialData, onMessage, onError, onConnected, onDisconnected, reconnectAttempts, reconnectDelay, heartbeatInterval, subscriptions, }: UseRealtimeDataOptions<T>): UseRealtimeDataResult<T>;
export {};
