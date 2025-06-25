import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Sentry from '@sentry/react';
import { Component } from 'react';
class GlobalErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
        };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        Sentry.captureException(error);
        console.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900/80 to-red-700/80 text-white p-6 animate-fade-in", children: _jsxs("div", { className: "glass modern-card rounded-3xl shadow-2xl p-8 max-w-xl w-full text-center", children: [_jsx("h1", { className: "text-4xl font-extrabold text-red-200 mb-4 drop-shadow-lg", children: "Oops! Something went wrong." }), _jsx("p", { className: "text-lg mb-2 text-red-100", children: "We've been notified of the issue and are working to fix it." }), _jsx("p", { className: "text-md mb-4 text-red-100", children: "Please try refreshing the page or contact support if the problem persists." }), import.meta.env.DEV && this.state.error && (_jsxs("details", { className: "mt-4 p-4 bg-red-900/60 rounded-xl shadow-inner w-full max-w-2xl text-left text-red-200", children: [_jsx("summary", { className: "font-semibold cursor-pointer", children: "Error Details" }), _jsxs("pre", { className: "mt-2 text-sm whitespace-pre-wrap break-all", children: [this.state.error.toString(), this.state.errorInfo?.componentStack] })] })), _jsx("button", { onClick: () => window.location.reload(), className: "mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg transition-colors animate-bounce-subtle", children: "Refresh Page" })] }) }));
        }
        return this.props.children;
    }
}
export { GlobalErrorBoundary };
