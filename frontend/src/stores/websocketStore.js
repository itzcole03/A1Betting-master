import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { webSocketManager } from '../services/unified/WebSocketManager';
const initialState = {
    isConnected: false,
    clientId: null,
    activeSubscriptions: [],
    lastMessage: null,
    error: null,
};
/**
 * Zustand store for WebSocket state, fully synchronized with WebSocketManager events.
 * On initialization, subscribes to connection, message, and error events.
 * Keeps all state reactive to the backend WebSocket.
 */
export const useWebSocketStore = create()(persist((set) => {
    // Subscribe to WebSocketManager events once on store initialization
    if (typeof window !== 'undefined' && !window.__webSocketStoreInitialized) {
        webSocketManager.on('connect', () => set({ isConnected: true }));
        webSocketManager.on('disconnect', () => set({ isConnected: false }));
        webSocketManager.on('message', (msg) => set({ lastMessage: msg }));
        webSocketManager.on('error', (err) => set({ error: err.message }));
        window.__webSocketStoreInitialized = true;
    }
    return {
        ...initialState,
        setConnected: (isConnected) => set({ isConnected }),
        setClientId: (clientId) => set({ clientId }),
        addSubscription: (subscription) => set(state => ({
            activeSubscriptions: [...state.activeSubscriptions, subscription],
        })),
        removeSubscription: (feedName) => set(state => ({
            activeSubscriptions: state.activeSubscriptions.filter(sub => sub.feedName !== feedName),
        })),
        setLastMessage: (message) => set({ lastMessage: message }),
        setError: (error) => set({ error }),
        reset: () => set(initialState),
    };
}, {
    name: 'websocket-storage',
}));
// All WebSocket state is now managed in sync with WebSocketManager.
// No direct WebSocket/EventBus code remains in the store.
// This enables robust, testable, and maintainable real-time state management.
