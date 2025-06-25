/**
 * Custom WebSocket hook for real-time data streaming
 * Provides connection management, reconnection, and typed message handling
 */

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  shouldReconnect?: boolean;
}

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  connectionAttempts: number;
}

export const useWebSocket = (
  url: string,
  options: UseWebSocketOptions = {},
) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
    shouldReconnect = true,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    connectionAttempts: 0,
  });

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(shouldReconnect);

  // Update shouldReconnect ref when option changes
  useEffect(() => {
    shouldReconnectRef.current = shouldReconnect;
  }, [shouldReconnect]);

  const connect = useCallback(() => {
    if (state.isConnecting || state.isConnected) {
      return Promise.resolve();
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    return new Promise<void>((resolve, reject) => {
      try {
        const wsUrl = url.startsWith("ws")
          ? url
          : `ws://${window.location.host}${url}`;

        // Check if URL is valid and accessible
        if (!url || url.trim() === '') {
          throw new Error('WebSocket URL is required');
        }

        const socket = new WebSocket(wsUrl);

        const connectionTimeout = setTimeout(() => {
          socket.close();
          const error = new Error('WebSocket connection timeout');
          setState((prev) => ({
            ...prev,
            error: "Connection timeout",
            isConnecting: false,
          }));
          reject(error);
        }, 10000); // 10 second timeout

        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log("WebSocket connected to:", wsUrl);
          setState((prev) => ({
            ...prev,
            socket,
            isConnected: true,
            isConnecting: false,
            error: null,
            connectionAttempts: 0,
          }));
          onConnect?.();
          // Don't show toast for background connections
          resolve();
        };

        socket.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log("WebSocket disconnected:", event.code, event.reason);
          setState((prev) => ({
            ...prev,
            socket: null,
            isConnected: false,
            isConnecting: false,
          }));
          onDisconnect?.();

          // Only attempt to reconnect if it was not a clean close and we haven't exceeded attempts
          if (
            shouldReconnectRef.current &&
            state.connectionAttempts < reconnectAttempts &&
            !event.wasClean &&
            event.code !== 1000 // Normal closure
          ) {
            setState((prev) => ({
              ...prev,
              connectionAttempts: prev.connectionAttempts + 1,
            }));

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(
                `Attempting to reconnect... (${state.connectionAttempts + 1}/${reconnectAttempts})`,
              );
              connect().catch((err) => {
                console.warn("Reconnection failed:", err);
              });
            }, reconnectInterval);
          }

          if (event.code !== 1000) { // If not normal closure, reject the promise
            reject(new Error(`WebSocket closed with code: ${event.code}`));
          }
        };

        socket.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("WebSocket error:", error);
          setState((prev) => ({
            ...prev,
            error: "WebSocket connection error",
            isConnecting: false,
          }));
          onError?.(error);
          reject(new Error("WebSocket connection error"));
        };

        socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setState((prev) => ({ ...prev, lastMessage: message }));
            onMessage?.(message);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to create connection",
          isConnecting: false,
        }));
        reject(error);
      }
    });
  }, [
    url,
    state.isConnecting,
    state.isConnected,
    state.connectionAttempts,
    reconnectAttempts,
    reconnectInterval,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  ]);
  }, [
    url,
    state.isConnecting,
    state.isConnected,
    state.connectionAttempts,
    reconnectAttempts,
    reconnectInterval,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  ]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (state.socket) {
      state.socket.close(1000, "Manual disconnect");
    }

    setState((prev) => ({
      ...prev,
      socket: null,
      isConnected: false,
      isConnecting: false,
      connectionAttempts: 0,
    }));
  }, [state.socket]);

  const sendMessage = useCallback(
    (message: any) => {
      if (state.socket && state.isConnected) {
        try {
          const messageString =
            typeof message === "string" ? message : JSON.stringify(message);
          state.socket.send(messageString);
          return true;
        } catch (error) {
          console.error("Failed to send WebSocket message:", error);
          toast.error("Failed to send message");
          return false;
        }
      } else {
        console.warn("WebSocket is not connected");
        toast.warning("Connection not available");
        return false;
      }
    },
    [state.socket, state.isConnected],
  );

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (state.socket) {
        state.socket.close(1000, "Component unmount");
      }
    };
  }, [url]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Connection state
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    connectionAttempts: state.connectionAttempts,

    // Data
    lastMessage: state.lastMessage,

    // Actions
    connect,
    disconnect,
    sendMessage,

    // Connection info
    readyState: state.socket?.readyState,
  };
};

// Named export only to prevent import confusion