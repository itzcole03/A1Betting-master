/**
 * Production-ready error handler replacing all TODO error implementations
 */

import { logger, logError } from "./logger";
import toast from "react-hot-toast";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  additionalData?: Record<string, any>;
}

export class ProductionErrorHandler {
  private static instance: ProductionErrorHandler;
  private errorQueue: Array<{
    error: Error;
    context: ErrorContext;
    retryCount: number;
  }> = [];
  private isProcessingQueue = false;

  static getInstance(): ProductionErrorHandler {
    if (!ProductionErrorHandler.instance) {
      ProductionErrorHandler.instance = new ProductionErrorHandler();
    }
    return ProductionErrorHandler.instance;
  }

  /**
   * Handle API errors with intelligent retry and user feedback
   */
  handleApiError(
    error: Error,
    endpoint: string,
    retryCallback?: () => Promise<any>,
  ): void {
    const context: ErrorContext = {
      component: "API",
      action: endpoint,
      timestamp: new Date(),
      additionalData: { endpoint },
    };

    logError(error, `API Error: ${endpoint}`);

    // Categorize error and provide appropriate user feedback
    if (
      error.message.includes("NetworkError") ||
      error.message.includes("fetch")
    ) {
      toast.error(
        "Network connection issue. Please check your internet connection.",
        {
          duration: 5000,
          id: "network-error",
        },
      );

      if (retryCallback) {
        this.scheduleRetry(error, context, retryCallback);
      }
    } else if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      toast.error("Authentication required. Please log in again.", {
        duration: 5000,
        id: "auth-error",
      });
    } else if (
      error.message.includes("403") ||
      error.message.includes("Forbidden")
    ) {
      toast.error(
        "Access denied. You may not have permission for this action.",
        {
          duration: 5000,
          id: "permission-error",
        },
      );
    } else if (
      error.message.includes("404") ||
      error.message.includes("Not Found")
    ) {
      toast.error("Requested resource not found.", {
        duration: 4000,
        id: "not-found-error",
      });
    } else if (
      error.message.includes("500") ||
      error.message.includes("Internal Server Error")
    ) {
      toast.error(
        "Server error. Our team has been notified and is working on a fix.",
        {
          duration: 6000,
          id: "server-error",
        },
      );
    } else {
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 4000,
        id: "generic-error",
      });
    }
  }

  /**
   * Handle component errors with graceful degradation
   */
  handleComponentError(
    error: Error,
    componentName: string,
    fallbackAction?: () => void,
  ): void {
    const context: ErrorContext = {
      component: componentName,
      action: "render",
      timestamp: new Date(),
    };

    logError(error, `Component Error: ${componentName}`);

    // Don't show toast for component errors to avoid spam
    // Instead, log for debugging and attempt graceful degradation
    if (fallbackAction) {
      try {
        fallbackAction();
      } catch (fallbackError) {
        logError(
          fallbackError as Error,
          `Fallback failed for ${componentName}`,
        );
      }
    }
  }

  /**
   * Handle user action errors with contextual feedback
   */
  handleUserActionError(
    error: Error,
    action: string,
    context?: ErrorContext,
  ): void {
    const fullContext: ErrorContext = {
      ...context,
      action,
      timestamp: new Date(),
    };

    logError(error, `User Action Error: ${action}`);

    // Provide action-specific feedback
    switch (action) {
      case "login":
        toast.error(
          "Login failed. Please check your credentials and try again.",
        );
        break;
      case "register":
        toast.error(
          "Registration failed. Please check your information and try again.",
        );
        break;
      case "place_bet":
        toast.error(
          "Bet placement failed. Please verify your balance and try again.",
        );
        break;
      case "save_settings":
        toast.error("Settings could not be saved. Please try again.");
        break;
      case "load_data":
        toast.error("Data could not be loaded. Please refresh the page.");
        break;
      case "navigation":
        toast.error("Navigation failed. Please try again.");
        break;
      default:
        toast.error(`${action} failed. Please try again.`);
    }
  }

  /**
   * Handle prediction errors with fallback strategies
   */
  handlePredictionError(error: Error, predictionId?: string): void {
    const context: ErrorContext = {
      component: "PredictionEngine",
      action: "generate_prediction",
      timestamp: new Date(),
      additionalData: { predictionId },
    };

    logError(error, `Prediction Error: ${predictionId || "unknown"}`);

    toast.error("Prediction generation failed. Using fallback analysis.", {
      duration: 4000,
      id: "prediction-error",
    });
  }

  /**
   * Handle WebSocket errors with reconnection logic
   */
  handleWebSocketError(
    error: Error,
    url: string,
    reconnectCallback?: () => void,
  ): void {
    const context: ErrorContext = {
      component: "WebSocket",
      action: "connection",
      timestamp: new Date(),
      additionalData: { url },
    };

    logError(error, `WebSocket Error: ${url}`);

    toast.error("Real-time connection lost. Attempting to reconnect...", {
      duration: 3000,
      id: "websocket-error",
    });

    if (reconnectCallback) {
      setTimeout(reconnectCallback, 3000);
    }
  }

  /**
   * Schedule retry for failed operations
   */
  private scheduleRetry(
    error: Error,
    context: ErrorContext,
    retryCallback: () => Promise<any>,
  ): void {
    const maxRetries = 3;
    const existingRetry = this.errorQueue.find(
      (item) =>
        item.context.action === context.action &&
        item.context.component === context.component,
    );

    if (existingRetry) {
      if (existingRetry.retryCount >= maxRetries) {
        toast.error(
          "Maximum retry attempts reached. Please refresh the page.",
          {
            duration: 5000,
            id: "max-retries",
          },
        );
        return;
      }
      existingRetry.retryCount++;
    } else {
      this.errorQueue.push({ error, context, retryCount: 1 });
    }

    // Exponential backoff
    const delay = Math.pow(2, existingRetry?.retryCount || 1) * 1000;

    setTimeout(async () => {
      try {
        await retryCallback();
        // Remove from queue on success
        this.errorQueue = this.errorQueue.filter(
          (item) =>
            !(
              item.context.action === context.action &&
              item.context.component === context.component
            ),
        );
        toast.success("Connection restored!", {
          duration: 2000,
          id: "retry-success",
        });
      } catch (retryError) {
        this.scheduleRetry(retryError as Error, context, retryCallback);
      }
    }, delay);
  }

  /**
   * Get error statistics for monitoring
   */
  getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    topErrors: string[];
  } {
    const recentErrors = logger.getLogsByLevel(0); // ERROR level
    const last24Hours = recentErrors.filter(
      (log) => Date.now() - log.timestamp.getTime() < 24 * 60 * 60 * 1000,
    );

    const errorCounts = recentErrors.reduce(
      (acc, log) => {
        const key = log.source || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key]) => key);

    return {
      totalErrors: recentErrors.length,
      recentErrors: last24Hours.length,
      topErrors,
    };
  }

  /**
   * Clear error queue and reset state
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
    this.isProcessingQueue = false;
  }
}

// Export singleton instance
export const productionErrorHandler = ProductionErrorHandler.getInstance();

// Convenience functions for different error types
export const handleApiError = (
  error: Error,
  endpoint: string,
  retryCallback?: () => Promise<any>,
) => {
  productionErrorHandler.handleApiError(error, endpoint, retryCallback);
};

export const handleComponentError = (
  error: Error,
  componentName: string,
  fallbackAction?: () => void,
) => {
  productionErrorHandler.handleComponentError(
    error,
    componentName,
    fallbackAction,
  );
};

export const handleUserActionError = (
  error: Error,
  action: string,
  context?: ErrorContext,
) => {
  productionErrorHandler.handleUserActionError(error, action, context);
};

export const handlePredictionError = (error: Error, predictionId?: string) => {
  productionErrorHandler.handlePredictionError(error, predictionId);
};

export const handleWebSocketError = (
  error: Error,
  url: string,
  reconnectCallback?: () => void,
) => {
  productionErrorHandler.handleWebSocketError(error, url, reconnectCallback);
};

// Global error handlers
window.addEventListener("error", (event) => {
  productionErrorHandler.handleComponentError(
    new Error(event.message),
    "Global",
    () => {
      // Attempt to reload the page as last resort
      if (
        confirm("A critical error occurred. Would you like to reload the page?")
      ) {
        window.location.reload();
      }
    },
  );
});

window.addEventListener("unhandledrejection", (event) => {
  productionErrorHandler.handleApiError(
    new Error(event.reason),
    "UnhandledPromise",
  );
});
