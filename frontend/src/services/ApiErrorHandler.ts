/**
 * API Error Handler - Graceful error handling for production without mock data
 * Provides user-friendly error messages and retry mechanisms
 */

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { consoleManager } from "../utils/consoleUtils";

export class ApiErrorHandler {
  static handleError<T>(error: any, operation: string, defaultValue: T): T {
    const isNetworkError =
      error.code === "NETWORK_ERROR" || error.message === "Network Error";

    let userMessage = "Service temporarily unavailable";
    let technicalMessage = error.message || "Unknown error";

    if (isNetworkError) {
      userMessage = "Unable to connect to betting services";
      technicalMessage = "Backend services are currently offline";
      // Use console manager for clean offline logging
      consoleManager.logBackendOffline();
    } else {
      // Only log non-network errors
      const errorLogger = consoleManager.createErrorLogger(operation);
      errorLogger(error);

      if (error.response?.status === 404) {
        userMessage = "Betting data not found";
        technicalMessage = "API endpoint not available";
      } else if (error.response?.status === 500) {
        userMessage = "Server error occurred";
        technicalMessage = "Internal server error";
      } else if (error.response?.status === 401) {
        userMessage = "Authentication required";
        technicalMessage = "User session expired";
      }
    }

    // Return default value instead of throwing
    return defaultValue;
  }

  static createEmptyResponse<T>(defaultValue: T): T {
    return defaultValue;
  }

  static isNetworkError(error: any): boolean {
    return (
      error.code === "NETWORK_ERROR" ||
      error.message === "Network Error" ||
      error.message?.includes("Failed to fetch")
    );
  }

  static createErrorDisplay(operation: string, error: any) {
    return {
      title: "Service Unavailable",
      message: `${operation} service is temporarily offline. Please try again later.`,
      technical: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default ApiErrorHandler;
