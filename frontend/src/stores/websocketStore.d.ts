export interface WebSocketState {
    isConnected: boolean;
    clientId: string | null;
    activeSubscriptions: Array<{
        feedName: string;
        parameters?: Record<string, unknown>;
    }>;
    lastMessage: unknown;
    error: string | null;
    setConnected: (isConnected: boolean) => void;
    setClientId: (clientId: string) => void;
    addSubscription: (subscription: {
        feedName: string;
        parameters?: Record<string, unknown>;
    }) => void;
    removeSubscription: (feedName: string) => void;
    setLastMessage: (message: unknown) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}
/**
 * Zustand store for WebSocket state, fully synchronized with WebSocketManager events.
 * On initialization, subscribes to connection, message, and error events.
 * Keeps all state reactive to the backend WebSocket.
 */
export declare const useWebSocketStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<WebSocketState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<WebSocketState, {
            setConnected: (isConnected: boolean) => void;
            setClientId: (clientId: string) => void;
            addSubscription: (subscription: {
                feedName: string;
                parameters?: Record<string, unknown>;
            }) => void;
            removeSubscription: (feedName: string) => void;
            setLastMessage: (message: unknown) => void;
            setError: (error: string | null) => void;
            reset: () => void;
            error: string | null;
            lastMessage: unknown;
            isConnected: boolean;
            activeSubscriptions: Array<{
                feedName: string;
                parameters?: Record<string, unknown>;
            }>;
            clientId: string | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WebSocketState) => void) => () => void;
        onFinishHydration: (fn: (state: WebSocketState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<WebSocketState, {
            setConnected: (isConnected: boolean) => void;
            setClientId: (clientId: string) => void;
            addSubscription: (subscription: {
                feedName: string;
                parameters?: Record<string, unknown>;
            }) => void;
            removeSubscription: (feedName: string) => void;
            setLastMessage: (message: unknown) => void;
            setError: (error: string | null) => void;
            reset: () => void;
            error: string | null;
            lastMessage: unknown;
            isConnected: boolean;
            activeSubscriptions: Array<{
                feedName: string;
                parameters?: Record<string, unknown>;
            }>;
            clientId: string | null;
        }>>;
    };
}>;
