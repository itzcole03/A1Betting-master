import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
export const ErrorMessage = ({ error, onRetry }) => {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
        }, children: [_jsx(ErrorIcon, { color: "error", sx: { fontSize: 48, mb: 2 } }), _jsx(Typography, { gutterBottom: true, color: "error", variant: "h6", children: "Error" }), _jsx(Typography, { paragraph: true, color: "text.secondary", variant: "body1", children: errorMessage }), onRetry && (_jsx(Button, { color: "primary", sx: { mt: 2 }, variant: "contained", onClick: onRetry, children: "Retry" }))] }));
};
