/**
 * Chart Wrapper Component
 * Provides bulletproof chart rendering with error boundaries and cleanup
 */

import React, { ErrorBoundary } from "react";
import { BarChart3, AlertTriangle, RefreshCw } from "lucide-react";

interface ChartWrapperProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  height?: string;
  onRetry?: () => void;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ChartErrorBoundary extends React.Component<
  ChartWrapperProps,
  ChartErrorBoundaryState
> {
  constructor(props: ChartWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chart Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-700 ${this.props.height || "h-64"}`}
        >
          <div className="text-center p-6">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              {this.props.fallbackTitle || "Chart Rendering Error"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Unable to display chart data
            </p>
            {this.props.onRetry && (
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  this.props.onRetry?.();
                }}
                className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`relative ${this.props.height || "h-64"}`}>
        {this.props.children}
      </div>
    );
  }
}

const ChartWrapper: React.FC<ChartWrapperProps> = (props) => {
  return <ChartErrorBoundary {...props} />;
};

export default ChartWrapper;
