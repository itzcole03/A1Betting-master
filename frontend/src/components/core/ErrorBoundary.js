import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: null,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs(Box, { sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    p: 3,
                    textAlign: 'center',
                }, children: [_jsx(Typography, { gutterBottom: true, color: "error", variant: "h4", children: "Something went wrong" }), _jsx(Typography, { paragraph: true, color: "text.secondary", variant: "body1", children: this.state.error?.message || 'An unexpected error occurred' }), _jsx(Button, { color: "primary", variant: "contained", onClick: () => window.location.reload(), children: "Reload Page" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
