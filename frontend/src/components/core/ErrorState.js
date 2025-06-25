import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            gap: 2,
            p: 3,
        }, children: [_jsx(ErrorIcon, { color: "error", sx: { fontSize: 48 } }), _jsx(Typography, { align: "center", color: "error", variant: "h6", children: message }), onRetry && (_jsx(Button, { color: "primary", sx: { mt: 2 }, variant: "contained", onClick: onRetry, children: "Try Again" }))] }));
};
export default React.memo(ErrorState);
