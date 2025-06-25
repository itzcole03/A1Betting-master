import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { webSocketManager } from '../services/unified/WebSocketManager';
import { errorLogger } from '../utils/errorLogger';
const WebSocketContext = createContext(undefined);
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
            errorLogger.logInfo('WebSocket connected', { context: 'WebSocketProvider' });
        };
        const handleDisconnect = () => {
            setIsConnected(false);
            errorLogger.logWarning('WebSocket disconnected', { context: 'WebSocketProvider' });
        };
        const handleError = (error) => {
            errorLogger.logError(error, { context: 'WebSocketProvider' });
        };
        const handleMessage = (message) => {
            setLastMessage(message);
        };
        // Subscribe to WebSocketManager events
        webSocketManager.on('connect', handleConnect);
        webSocketManager.on('disconnect', handleDisconnect);
        webSocketManager.on('error', handleError);
        webSocketManager.on('message', handleMessage);
        // Cleanup on unmount
        return () => {
            webSocketManager.off('connect', handleConnect);
            webSocketManager.off('disconnect', handleDisconnect);
            webSocketManager.off('error', handleError);
            webSocketManager.off('message', handleMessage);
        };
    }, []);
    /**
     * Provides WebSocket context with unified event-driven API.
     * Use subscribe/unsubscribe to listen for specific events.
     */
    const value = {
        isConnected,
        lastMessage,
        subscribe: (event, callback) => webSocketManager.on(event, callback),
        unsubscribe: (event, callback) => webSocketManager.off(event, callback),
    };
    return (_jsx(WebSocketContext.Provider, { value: value, children: children }));
};
