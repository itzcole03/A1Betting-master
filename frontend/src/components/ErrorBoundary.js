import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Theme ErrorBoundary caught an error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (this.props.fallback || (_jsxs("div", { style: {
                    padding: "20px",
                    margin: "20px",
                    border: "1px solid #ff4757",
                    borderRadius: "8px",
                    backgroundColor: "#fff5f5",
                    color: "#dc2626",
                }, children: [_jsx("h2", { children: "Theme Error" }), _jsx("p", { children: "Something went wrong with the theme system." }), _jsxs("details", { style: { marginTop: "10px" }, children: [_jsx("summary", { children: "Error details:" }), _jsx("pre", { style: { marginTop: "10px", fontSize: "12px" }, children: this.state.error?.toString() })] }), _jsx("button", { onClick: () => window.location.reload(), style: {
                            marginTop: "10px",
                            padding: "8px 16px",
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }, children: "Reload Page" })] })));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
