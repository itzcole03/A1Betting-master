import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
const LoadingScreen = ({ message = 'Loading...' }) => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
        }, children: [_jsx(CircularProgress, { size: 60 }), _jsx(Typography, { color: "text.secondary", variant: "h6", children: message })] }));
};
export default React.memo(LoadingScreen);
