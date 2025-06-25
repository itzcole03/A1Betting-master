import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePayoutStore } from '../stores/payoutStore';
import { useRiskProfileStore } from '../stores/riskProfileStore';
import { Box, Typography, Paper, Button } from '@mui/material';
import styled from '@emotion/styled';
import { fadeIn, scale, flash, durations, timingFunctions } from '../utils/animations';
const PreviewContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    animation: `${fadeIn} ${durations.normal} ${timingFunctions.easeInOut}`,
}));
const ValueDisplay = styled(Box)(({ theme, changed }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    backgroundColor: changed ? theme.palette.primary.light : 'transparent',
    transition: `background-color ${durations.normal} ${timingFunctions.easeInOut}`,
    animation: changed ? `${flash} ${durations.normal} ${timingFunctions.easeInOut}` : 'none',
}));
const Value = styled(Typography)(({ theme, changed }) => ({
    fontWeight: changed ? 'bold' : 'normal',
    transition: `all ${durations.normal} ${timingFunctions.easeInOut}`,
    animation: changed ? `${scale} ${durations.normal} ${timingFunctions.easeInOut}` : 'none',
}));
const PlaceBetButton = styled(Button)(({ theme, changed }) => ({
    marginTop: theme.spacing(2),
    transition: `all ${durations.normal} ${timingFunctions.easeInOut}`,
    animation: changed ? `${scale} ${durations.normal} ${timingFunctions.easeInOut}` : 'none',
}));
export const PayoutPreview = ({ eventId }) => {
    const payoutPreview = usePayoutStore(state => state.getPayoutPreview(eventId));
    const { currentProfile, bankroll } = useRiskProfileStore();
    const [changedValues, setChangedValues] = useState(new Set());
    const [previousValues, setPreviousValues] = useState({});
    // WebSocket for real-time payout/odds updates
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'}?channel=payout-preview&eventId=${eventId}`;
    useWebSocket(wsUrl, {
        onMessage: (msg) => {
            if (msg.event === 'odds_update' && msg.data?.eventId === eventId) {
                // Optionally handle odds update
            }
            if (msg.event === 'payout_update' && msg.data?.eventId === eventId) {
                usePayoutStore.getState().updatePayoutPreview(eventId, msg.data);
            }
        },
    });
    useEffect(() => {
        if (payoutPreview) {
            const newChangedValues = new Set();
            const newPreviousValues = { ...previousValues };
            if (previousValues.potential_payout !== payoutPreview.potential_payout) {
                newChangedValues.add('potential_payout');
                newPreviousValues.potential_payout = payoutPreview.potential_payout;
            }
            if (previousValues.kelly_stake !== payoutPreview.kelly_stake) {
                newChangedValues.add('kelly_stake');
                newPreviousValues.kelly_stake = payoutPreview.kelly_stake;
            }
            if (previousValues.risk_adjusted_stake !== payoutPreview.risk_adjusted_stake) {
                newChangedValues.add('risk_adjusted_stake');
                newPreviousValues.risk_adjusted_stake = payoutPreview.risk_adjusted_stake;
            }
            if (previousValues.expected_value !== payoutPreview.expected_value) {
                newChangedValues.add('expected_value');
                newPreviousValues.expected_value = payoutPreview.expected_value;
            }
            setChangedValues(newChangedValues);
            setPreviousValues(newPreviousValues);
            const timeout = setTimeout(() => setChangedValues(new Set()), parseInt(durations.normal) * 1000 || 300);
            return () => clearTimeout(timeout);
        }
    }, [payoutPreview]);
    if (!payoutPreview) {
        return (_jsx(PreviewContainer, { children: _jsx(Typography, { color: "textSecondary", variant: "body2", children: "Loading payout preview..." }) }));
    }
    const handlePlaceBet = () => {
        // TODO: Implement bet placement logic
        console.log('Placing bet with stake:', payoutPreview.risk_adjusted_stake);
    };
    return (_jsxs(PreviewContainer, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Payout Preview" }), _jsxs(ValueDisplay, { changed: changedValues.has('potential_payout'), children: [_jsx(Typography, { variant: "body2", children: "Potential Payout" }), _jsxs(Value, { changed: changedValues.has('potential_payout'), color: "primary", variant: "body1", children: ["$", payoutPreview.potential_payout.toFixed(2)] })] }), _jsxs(ValueDisplay, { changed: changedValues.has('kelly_stake'), children: [_jsx(Typography, { variant: "body2", children: "Kelly Criterion Stake" }), _jsxs(Value, { changed: changedValues.has('kelly_stake'), variant: "body1", children: ["$", payoutPreview.kelly_stake.toFixed(2)] })] }), _jsxs(ValueDisplay, { changed: changedValues.has('risk_adjusted_stake'), children: [_jsx(Typography, { variant: "body2", children: "Risk-Adjusted Stake" }), _jsxs(Value, { changed: changedValues.has('risk_adjusted_stake'), color: "secondary", variant: "body1", children: ["$", payoutPreview.risk_adjusted_stake.toFixed(2)] })] }), _jsxs(ValueDisplay, { changed: changedValues.has('expected_value'), children: [_jsx(Typography, { variant: "body2", children: "Expected Value" }), _jsxs(Value, { changed: changedValues.has('expected_value'), color: payoutPreview.expected_value > 0 ? 'success.main' : 'error.main', variant: "body1", children: ["$", payoutPreview.expected_value.toFixed(2)] })] }), _jsxs(PlaceBetButton, { fullWidth: true, changed: changedValues.has('risk_adjusted_stake'), color: "primary", disabled: payoutPreview.expected_value <= 0, variant: "contained", onClick: handlePlaceBet, children: ["Place Bet ($", payoutPreview.risk_adjusted_stake.toFixed(2), ")"] }), _jsx(Box, { mt: 1, children: _jsxs(Typography, { color: "textSecondary", variant: "caption", children: ["Risk Profile: ", currentProfile.profile_type, _jsx("br", {}), "Bankroll: $", bankroll.toFixed(2)] }) })] }));
};
