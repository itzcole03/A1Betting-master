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
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const wsUrl = url.startsWith("ws")
        ? url
        : `ws://${window.location.host}${url}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setState((prev) => ({
          ...prev,
          socket,
          isConnected: true,
          isConnecting: false,
          error: null,
          connectionAttempts: 0,
        }));
        onConnect?.();
        toast.success("Connected to real-time data stream");
      };

      socket.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setState((prev) => ({
          ...prev,
          socket: null,
          isConnected: false,
          isConnecting: false,
        }));
        onDisconnect?.();

        // Attempt to reconnect if enabled and within retry limits
        if (
          shouldReconnectRef.current &&
          state.connectionAttempts < reconnectAttempts &&
          !event.wasClean
        ) {
          setState((prev) => ({
            ...prev,
            connectionAttempts: prev.connectionAttempts + 1,
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Attempting to reconnect... (${state.connectionAttempts + 1}/${reconnectAttempts})`,
            );
            connect();
          }, reconnectInterval);
        } else if (state.connectionAttempts >= reconnectAttempts) {
          toast.error("Connection lost - maximum retry attempts reached");
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setState((prev) => ({
          ...prev,
          error: "WebSocket connection error",
          isConnecting: false,
        }));
        onError?.(error);
        toast.error("Connection error occurred");
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
    }
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
