/**
 * Custom WebSocket hook for real-time data streaming
 * Provides connection management, reconnection, and typed message handling
 * Fixed to handle promises properly and prevent unhandled rejections
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
  autoConnect?: boolean;
  silent?: boolean; // Don't show toast notifications
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
    reconnectAttempts = 3,
    reconnectInterval = 3000,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
    shouldReconnect = false, // Changed to false by default
    autoConnect = true,
    silent = true, // Changed to true by default to reduce noise
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
  const connectionPromiseRef = useRef<Promise<void> | null>(null);

  // Update shouldReconnect ref when option changes
  useEffect(() => {
    shouldReconnectRef.current = shouldReconnect;
  }, [shouldReconnect]);

  const connect = useCallback((): Promise<void> => {
    // If already connecting or connected, return existing promise or resolve immediately
    if (state.isConnected) {
      return Promise.resolve();
    }

    if (state.isConnecting && connectionPromiseRef.current) {
      return connectionPromiseRef.current;
    }

    // Validate URL
    if (!url || url.trim() === "") {
      const error = new Error("WebSocket URL is required");
      setState((prev) => ({
        ...prev,
        error: "Invalid URL",
        isConnecting: false,
      }));
      return Promise.reject(error);
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    const connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        const wsUrl = url.startsWith("ws")
          ? url
          : `ws://${window.location.host}${url}`;

        console.log("Attempting to connect to WebSocket:", wsUrl);
        const socket = new WebSocket(wsUrl);

        const connectionTimeout = setTimeout(() => {
          if (socket.readyState === WebSocket.CONNECTING) {
            socket.close();
            const timeoutError = new Error("WebSocket connection timeout");
            setState((prev) => ({
              ...prev,
              error: "Connection timeout",
              isConnecting: false,
            }));
            reject(timeoutError);
          }
        }, 10000); // 10 second timeout

        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log("WebSocket connected successfully");
          setState((prev) => ({
            ...prev,
            socket,
            isConnected: true,
            isConnecting: false,
            error: null,
            connectionAttempts: 0,
          }));

          try {
            onConnect?.();
          } catch (err) {
            console.warn("Error in onConnect callback:", err);
          }

          if (!silent) {
            toast.success("Connected to real-time data");
          }
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

          try {
            onDisconnect?.();
          } catch (err) {
            console.warn("Error in onDisconnect callback:", err);
          }

          // Only attempt to reconnect for unexpected closures
          if (
            shouldReconnectRef.current &&
            state.connectionAttempts < reconnectAttempts &&
            !event.wasClean &&
            event.code !== 1000 && // Normal closure
            event.code !== 1001 // Going away
          ) {
            setState((prev) => ({
              ...prev,
              connectionAttempts: prev.connectionAttempts + 1,
            }));

            if (!silent) {
              console.log(
                `Attempting to reconnect... (${state.connectionAttempts + 1}/${reconnectAttempts})`,
              );
            }

            reconnectTimeoutRef.current = setTimeout(() => {
              connect().catch((err) => {
                if (!silent) {
                  console.warn("Reconnection failed:", err);
                }
              });
            }, reconnectInterval);
          }

          // For unexpected closures, this is considered an error
          if (event.code !== 1000 && event.code !== 1001) {
            const closeError = new Error(
              `WebSocket closed unexpectedly: ${event.code} ${event.reason}`,
            );
            reject(closeError);
          }
        };

        socket.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("WebSocket error:", error);

          setState((prev) => ({
            ...prev,
            error: "Connection error",
            isConnecting: false,
          }));

          try {
            onError?.(error);
          } catch (err) {
            console.warn("Error in onError callback:", err);
          }

          if (!silent) {
            toast.error("Connection error");
          }

          reject(new Error("WebSocket connection error"));
        };

        socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setState((prev) => ({ ...prev, lastMessage: message }));

            try {
              onMessage?.(message);
            } catch (err) {
              console.warn("Error in onMessage callback:", err);
            }
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
        reject(
          error instanceof Error ? error : new Error("Unknown WebSocket error"),
        );
      }
    });

    connectionPromiseRef.current = connectionPromise;

    // Clear the promise reference when it completes
    connectionPromise.finally(() => {
      connectionPromiseRef.current = null;
    });

    return connectionPromise;
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
    silent,
  ]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (state.socket) {
      // Use normal closure code
      state.socket.close(1000, "Manual disconnect");
    }

    setState((prev) => ({
      ...prev,
      socket: null,
      isConnected: false,
      isConnecting: false,
      connectionAttempts: 0,
      error: null,
    }));
  }, [state.socket]);

  const sendMessage = useCallback(
    (message: any) => {
      if (
        state.socket &&
        state.isConnected &&
        state.socket.readyState === WebSocket.OPEN
      ) {
        try {
          const messageString =
            typeof message === "string" ? message : JSON.stringify(message);
          state.socket.send(messageString);
          return true;
        } catch (error) {
          console.error("Failed to send WebSocket message:", error);
          if (!silent) {
            toast.error("Failed to send message");
          }
          return false;
        }
      } else {
        console.warn("WebSocket not connected, cannot send message");
        return false;
      }
    },
    [state.socket, state.isConnected, silent],
  );

  // Auto-connect on mount with proper error handling
  useEffect(() => {
    if (!autoConnect) {
      return;
    }

    if (!url || url.trim() === "") {
      console.warn("WebSocket URL is empty, skipping connection");
      return;
    }

    // Only connect to local development URLs or explicitly allowed URLs
    if (
      url.includes("localhost") ||
      url.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development"
    ) {
      connect().catch((error) => {
        if (!silent) {
          console.warn("WebSocket connection failed:", error.message);
        }
        // Don't propagate the error to avoid unhandled rejection
      });
    } else {
      console.warn(
        "WebSocket connection skipped for non-local URL in production:",
        url,
      );
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, url, silent]); // Removed connect/disconnect dependencies to avoid loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.close(1000, "Component unmounting");
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
  };
};

export default useWebSocket;
