import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Card, CardContent, Typography, Grid, Button, Chip, Box, LinearProgress, Tooltip, } from '@mui/material';
import { bankrollService } from '@/services/bankroll';
import { notificationService } from '@/services/notification';
export const BettingOpportunity = ({ opportunity, onPlaceBet, }) => {
    const { event, market, selection, odds, probability, edge, confidence, volume, sentiment, stats, arbitrage, } = opportunity;
    const handlePlaceBet = () => {
        const maxBetAmount = bankrollService.getMaxBetAmount();
        const recommendedStake = Math.min(maxBetAmount, bankrollService.getBalance() * (edge / 100));
        onPlaceBet({
            ...opportunity,
            stake: recommendedStake,
        });
        notificationService.notify('success', 'Bet Placed', `Placed bet of $${recommendedStake.toFixed(2)} on ${selection}`, opportunity);
    };
    const getConfidenceColor = (value) => {
        if (value >= 0.8)
            return 'success';
        if (value >= 0.6)
            return 'primary';
        if (value >= 0.4)
            return 'warning';
        return 'error';
    };
    const getEdgeColor = (value) => {
        if (value >= 10)
            return 'success';
        if (value >= 5)
            return 'primary';
        if (value >= 2)
            return 'warning';
        return 'error';
    };
    return (_jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [event.homeTeam, " vs ", event.awayTeam] }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: new Date(event.startTime).toLocaleString() }), _jsx(Chip, { label: event.sport, size: "small", sx: { mt: 1 } })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle1", children: market }), _jsx(Typography, { variant: "h5", color: "primary", children: selection })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Odds" }), _jsx(Typography, { variant: "h6", children: odds.toFixed(2) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Probability" }), _jsxs(Typography, { variant: "h6", children: [(probability * 100).toFixed(1), "%"] })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { mb: 1, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Edge" }), _jsx(Tooltip, { title: `${edge.toFixed(2)}% advantage over bookmaker odds`, children: _jsx(Chip, { label: `${edge.toFixed(2)}%`, color: getEdgeColor(edge), size: "small" }) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Confidence" }), _jsx(Tooltip, { title: `${(confidence * 100).toFixed(1)}% confidence in this prediction`, children: _jsx(Chip, { label: `${(confidence * 100).toFixed(1)}%`, color: getConfidenceColor(confidence), size: "small" }) })] })] }), sentiment && (_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: "Sentiment Analysis" }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(LinearProgress, { variant: "determinate", value: sentiment.score * 100, sx: { flexGrow: 1 } }), _jsx(Typography, { variant: "body2", children: sentiment.score.toFixed(2) })] }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Volume: ", sentiment.volume] })] })), stats && (_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: "Statistical Analysis" }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: event.homeTeam }), _jsx(Typography, { variant: "body2", children: Object.entries(stats.homeTeam)
                                                    .map(([key, value]) => `${key}: ${value}`)
                                                    .join(', ') })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "caption", children: event.awayTeam }), _jsx(Typography, { variant: "body2", children: Object.entries(stats.awayTeam)
                                                    .map(([key, value]) => `${key}: ${value}`)
                                                    .join(', ') })] })] })] })), arbitrage && (_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: "Arbitrage Opportunity" }), _jsxs(Typography, { variant: "body2", children: ["ROI: ", arbitrage.roi.toFixed(2), "%"] }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Bookmakers: ", arbitrage.bookmakers.join(', ')] })] })), _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { variant: "contained", color: "primary", fullWidth: true, onClick: handlePlaceBet, disabled: !bankrollService.getBalance(), children: "Place Bet" }) })] }) }) }));
};
