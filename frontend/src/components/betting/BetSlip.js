import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Divider, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBettingStore } from '../../stores/bettingStore';
const BetSlip = ({ onPlaceBet }) => {
    const { betSlip, removeBet, updateBetAmount, clearBetSlip } = useBettingStore();
    const handleStakeChange = (betId, amount) => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount >= 0) {
            updateBetAmount(betId, numAmount);
        }
    };
    const handlePlaceBets = () => {
        betSlip.bets.forEach(bet => {
            onPlaceBet({
                eventId: bet.eventId,
                market: bet.market,
                selection: bet.selection,
                odds: bet.odds,
                stake: bet.stake,
                potentialWinnings: bet.potentialWinnings,
            });
        });
        clearBetSlip();
    };
    if (betSlip.bets.length === 0) {
        return (_jsxs(Box, { p: 2, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Bet Slip" }), _jsx(Typography, { align: "center", color: "text.secondary", children: "Add selections to your bet slip" })] }));
    }
    return (_jsxs(Box, { children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", p: 2, children: [_jsx(Typography, { variant: "h6", children: "Bet Slip" }), _jsx(Button, { color: "error", disabled: betSlip.bets.length === 0, size: "small", onClick: clearBetSlip, children: "Clear All" })] }), _jsx(Divider, {}), _jsx(List, { children: betSlip.bets.map(bet => (_jsxs(ListItem, { divider: true, children: [_jsx(ListItemText, { primary: bet.selection, secondary: _jsxs(Box, { children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: bet.market }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Odds: ", bet.odds] })] }) }), _jsx(ListItemSecondaryAction, { children: _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(TextField, { inputProps: { min: 0, step: 0.01 }, size: "small", sx: { width: '100px' }, type: "number", value: bet.stake, onChange: e => handleStakeChange(bet.id, e.target.value) }), _jsx(IconButton, { "aria-label": "delete", edge: "end", onClick: () => removeBet(bet.id), children: _jsx(DeleteIcon, {}) })] }) })] }, bet.id))) }), _jsx(Divider, {}), _jsxs(Box, { p: 2, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { children: "Total Stake:" }), _jsxs(Typography, { children: ["$", betSlip.totalStake.toFixed(2)] })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { children: "Potential Winnings:" }), _jsxs(Typography, { children: ["$", betSlip.potentialWinnings.toFixed(2)] })] }), _jsx(Button, { fullWidth: true, color: "primary", disabled: betSlip.bets.length === 0, variant: "contained", onClick: handlePlaceBets, children: "Place Bets" })] })] }));
};
export default React.memo(BetSlip);
