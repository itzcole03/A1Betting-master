import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Grid, Paper, Button, Tabs, Tab, Divider } from '@mui/material';
import { useBettingStore } from '../../stores/bettingStore';
const OddsDisplay = ({ event }) => {
    const [selectedMarket, setSelectedMarket] = React.useState(event.markets[0] ?? null);
    const { addBet } = useBettingStore();
    const handleMarketChange = (_, newValue) => {
        setSelectedMarket(event.markets[newValue]);
    };
    const handleSelectionClick = (selection) => {
        if (selection.status !== 'active')
            return;
        addBet({
            id: `${event.id}-${selection.id}`,
            eventId: event.id,
            market: selectedMarket?.name ?? '',
            selection: selection.name,
            odds: selection.odds,
            stake: 0,
            potentialWinnings: 0,
            timestamp: new Date().toISOString(),
            status: 'pending',
        });
    };
    return (_jsxs(Box, { children: [_jsxs(Typography, { gutterBottom: true, variant: "h6", children: [event.homeTeam, " vs ", event.awayTeam] }), _jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: new Date(event.startTime).toLocaleString() }), _jsx(Divider, { sx: { my: 2 } }), _jsx(Tabs, { scrollButtons: "auto", sx: { mb: 2 }, value: event.markets.findIndex(m => m.id === selectedMarket?.id), variant: "scrollable", onChange: handleMarketChange, children: event.markets.map(market => (_jsx(Tab, { label: market.name }, market.id))) }), selectedMarket && (_jsx(Grid, { container: true, spacing: 2, children: selectedMarket.selections.map(selection => (_jsx(Grid, { item: true, md: 4, sm: 6, xs: 12, children: _jsx(Paper, { sx: {
                            p: 2,
                            cursor: selection.status === 'active' ? 'pointer' : 'not-allowed',
                            opacity: selection.status === 'active' ? 1 : 0.5,
                            '&:hover': {
                                backgroundColor: selection.status === 'active' ? 'action.hover' : 'background.paper',
                            },
                        }, onClick: () => handleSelectionClick(selection), children: _jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "body1", children: selection.name }), _jsx(Button, { disabled: selection.status !== 'active', size: "small", variant: "outlined", children: selection.odds })] }) }) }, selection.id))) }))] }));
};
export default React.memo(OddsDisplay);
