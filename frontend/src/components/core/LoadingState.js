import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
const LoadingState = ({ message = 'Loading...', size = 40 }) => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            gap: 2,
        }, children: [_jsx(CircularProgress, { size: size }), _jsx(Typography, { color: "text.secondary", variant: "body1", children: message })] }));
};
export default React.memo(LoadingState);
