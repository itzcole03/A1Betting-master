import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ViteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ViteErrorBoundary caught an error:", error, errorInfo);

    // Check if this is a Vite error overlay issue
    if (
      error.message?.includes(
        "Cannot read properties of undefined (reading 'frame')",
      )
    ) {
      console.warn("Vite error overlay issue detected, suppressing error");
      // Don't show error UI for Vite overlay issues
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            border: "2px solid #ef4444",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Something went wrong
          </h2>
          <p style={{ margin: "0 0 16px 0" }}>
            An error occurred in the application. Please refresh the page to
            continue.
          </p>
          <details style={{ marginTop: "16px" }}>
            <summary
              style={{
                cursor: "pointer",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Error details (click to expand)
            </summary>
            <pre
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "12px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ViteErrorBoundary;
