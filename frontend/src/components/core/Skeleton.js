import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Skeleton as MuiSkeleton, Box } from '@mui/material';
const Skeleton = ({ variant = 'rectangular', width = '100%', height = 20, animation = 'wave', }) => {
    return (_jsx(Box, { sx: { width, height }, children: _jsx(MuiSkeleton, { animation: animation, height: height, variant: variant, width: width }) }));
};
export default React.memo(Skeleton);
