import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, CircularProgress, Typography } from '@mui/material';
export const LoadingScreen = ({ message = 'Loading...' }) => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
        }, children: [_jsx(CircularProgress, { size: 60, sx: {
                    color: 'primary.main',
                    mb: 2,
                }, thickness: 4 }), _jsx(Typography, { color: "text.secondary", sx: {
                    mt: 2,
                    textAlign: 'center',
                }, variant: "h6", children: message })] }));
};
