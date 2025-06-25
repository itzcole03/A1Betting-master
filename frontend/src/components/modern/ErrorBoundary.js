import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4", children: _jsxs("div", { className: "modern-card max-w-lg w-full p-6 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE22" }), _jsx("h1", { className: "text-2xl font-bold mb-4", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists." }), _jsxs("div", { className: "space-x-4", children: [_jsx("button", { className: "modern-button", onClick: () => window.location.reload(), children: "Refresh Page" }), _jsx("button", { className: "modern-button bg-gray-500 hover:bg-gray-600", onClick: () => this.setState({ hasError: false }), children: "Try Again" })] }), process.env.NODE_ENV === 'development' && this.state.error && (_jsx("div", { className: "mt-8 text-left", children: _jsxs("details", { className: "bg-red-50 dark:bg-red-900/20 p-4 rounded-lg", children: [_jsx("summary", { className: "text-red-600 dark:text-red-400 font-medium cursor-pointer", children: "Error Details" }), _jsxs("pre", { className: "mt-4 text-sm text-red-800 dark:text-red-200 overflow-auto", children: [this.state.error.toString(), this.state.errorInfo?.componentStack] })] }) }))] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
