import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { CircularProgress, Box } from '@mui/material';
const LoadingSpinner = ({ size = 24, color = 'primary' }) => {
    return (_jsx(Box, { sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
        }, children: _jsx(CircularProgress, { color: color, size: size }) }));
};
export default React.memo(LoadingSpinner);
