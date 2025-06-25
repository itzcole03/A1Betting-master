import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

export class ApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOffline: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isOffline: false };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("API Error Boundary caught an error:", error, errorInfo);

    // Check if it's a network error
    const isNetworkError =
      error.message.includes("Network Error") ||
      error.message.includes("404") ||
      error.message.includes("Failed to fetch");

    this.setState({ isOffline: isNetworkError });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, isOffline: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-black/30 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              {this.state.isOffline ? (
                <Wifi className="w-16 h-16 text-red-400" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-red-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4 text-red-400">
              {this.state.isOffline
                ? "Connection Issue"
                : "Something went wrong"}
            </h2>

            <p className="text-gray-300 mb-6">
              {this.state.isOffline
                ? "Unable to connect to the backend services. This could be due to network issues or the backend being offline."
                : "An unexpected error occurred while loading the application. Please try refreshing the page."}
            </p>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Retry Connection
              </button>

              <div className="text-sm text-gray-400 mt-4">
                <p>
                  Environment:{" "}
                  {import.meta.env.DEV ? "Development" : "Production"}
                </p>
                <p>Backend: {this.state.isOffline ? "Offline" : "Error"}</p>
              </div>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-gray-900/50 rounded-lg text-xs text-gray-300 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
