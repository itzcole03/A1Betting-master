/**
 * WebSocket Error Handler Utility
 * Prevents common WebSocket connection errors from causing unhandled promise rejections
 */

// List of WebSocket error patterns to catch and handle gracefully
const WEBSOCKET_ERROR_PATTERNS = [
  "WebSocket closed without opened",
  "WebSocket connection error",
  "Connection timeout",
  "WebSocket is not open",
  "Failed to construct 'WebSocket'",
  "NetworkError: WebSocket connection failed",
];

/**
 * Checks if an error is WebSocket-related
 */
export function isWebSocketError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.toString() || "";

  return WEBSOCKET_ERROR_PATTERNS.some((pattern) =>
    errorMessage.includes(pattern),
  );
}

/**
 * Safely handles WebSocket errors without throwing unhandled rejections
 */
export function handleWebSocketError(
  error: any,
  context: string = "WebSocket",
): void {
  if (isWebSocketError(error)) {
    console.warn(
      `${context}: WebSocket connection issue (expected in development):`,
      error.message || error,
    );
    return;
  }

  // If it's not a WebSocket error, log it as a regular error
  console.error(`${context}: Non-WebSocket error:`, error);
}

/**
 * Wraps a WebSocket operation to catch and handle errors gracefully
 */
export function safeWebSocketOperation<T>(
  operation: () => Promise<T>,
  context: string = "WebSocket operation",
): Promise<T | null> {
  return operation().catch((error) => {
    handleWebSocketError(error, context);
    return null;
  });
}

/**
 * Creates a WebSocket with error handling
 */
export function createSafeWebSocket(
  url: string,
  protocols?: string | string[],
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(url, protocols);

      const connectionTimeout = setTimeout(() => {
        ws.close();
        reject(new Error("WebSocket connection timeout"));
      }, 10000);

      ws.addEventListener("open", () => {
        clearTimeout(connectionTimeout);
        resolve(ws);
      });

      ws.addEventListener("error", (event) => {
        clearTimeout(connectionTimeout);
        reject(new Error("WebSocket connection failed"));
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Global setup for WebSocket error handling
 * Call this once in your app initialization
 */
export function setupGlobalWebSocketErrorHandling(): void {
  // Add global handlers if they don't already exist
  if (!window.__websocketErrorHandlerSetup) {
    window.addEventListener("unhandledrejection", (event) => {
      if (isWebSocketError(event.reason)) {
        console.warn(
          "WebSocket connection issue handled globally:",
          event.reason?.message || event.reason,
        );
        event.preventDefault(); // Prevent the unhandled rejection from being logged
      }
    });

    window.__websocketErrorHandlerSetup = true;
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    __websocketErrorHandlerSetup?: boolean;
  }
}
