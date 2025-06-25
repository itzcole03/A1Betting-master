import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Chip, Skeleton } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { useAppStore } from '../../stores/useAppStore';
export const PropCards = ({ data, isLoading }) => {
    const { addToBetSlip } = useAppStore();
    if (isLoading) {
        return (_jsx(Grid, { container: true, spacing: 2, children: [1, 2, 3, 4].map(index => (_jsx(Grid, { item: true, md: 4, sm: 6, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Skeleton, { variant: "text", width: "60%" }), _jsx(Skeleton, { variant: "text", width: "40%" }), _jsx(Skeleton, { variant: "text", width: "80%" }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Skeleton, { height: 36, variant: "rectangular" }) })] }) }) }, index))) }));
    }
    return (_jsx(Grid, { container: true, spacing: 2, children: data.map(prop => (_jsx(Grid, { item: true, md: 4, sm: 6, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { component: "div", variant: "h6", children: prop.title }), _jsx(Chip, { color: "primary", label: prop.category, size: "small", variant: "outlined" })] }), _jsx(Typography, { gutterBottom: true, color: "text.secondary", children: prop.description }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(TrendingUpIcon, { color: "success", sx: { mr: 1 } }), _jsx(Typography, { color: "success.main", variant: "body2", children: prop.prediction })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Typography, { color: "primary", variant: "h6", children: prop.odds.toFixed(2) }), _jsx(Button, { color: "primary", variant: "contained", onClick: () => addToBetSlip({
                                        id: prop.id,
                                        selection: prop.title,
                                        odds: prop.odds,
                                        stake: 0,
                                    }), children: "Add to Bet Slip" })] })] }) }) }, prop.id))) }));
};
export default React.memo(PropCards);
