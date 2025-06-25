import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Chip, Tooltip, } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, AccountBalance as BankrollIcon, EmojiEvents as TrophyIcon, Warning as WarningIcon, } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { riskManagement } from '@/services/riskManagement';
const MetricsCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));
const ProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    marginTop: theme.spacing(1),
}));
export const BankrollMetrics = () => {
    const bankroll = riskManagement.getBankroll();
    const bets = riskManagement.getBets();
    const calculateWinRate = () => {
        if (bankroll.totalBets === 0)
            return 0;
        return (bankroll.winningBets / bankroll.totalBets) * 100;
    };
    const getRoiColor = (roi) => {
        if (roi >= 10)
            return 'success.main';
        if (roi >= 0)
            return 'primary.main';
        return 'error.main';
    };
    const getStreakColor = (streak) => {
        if (streak >= 5)
            return 'success.main';
        if (streak >= 3)
            return 'primary.main';
        return 'warning.main';
    };
    return (_jsx(MetricsCard, { children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(BankrollIcon, { color: "primary" }), _jsx(Typography, { variant: "h6", children: "Bankroll Metrics" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Current Bankroll" }), _jsxs(Typography, { variant: "h4", color: "primary", children: ["$", bankroll.current.toFixed(2)] }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, mt: 1, children: [_jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Initial: $", bankroll.initial.toFixed(2)] }), _jsxs(Typography, { variant: "body2", color: bankroll.current >= bankroll.initial ? 'success.main' : 'error.main', children: [bankroll.current >= bankroll.initial ? (_jsx(TrendingUpIcon, { fontSize: "small" })) : (_jsx(TrendingDownIcon, { fontSize: "small" })), ((bankroll.current - bankroll.initial) / bankroll.initial * 100).toFixed(1), "%"] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Return on Investment" }), _jsxs(Typography, { variant: "h4", color: getRoiColor(bankroll.roi), children: [bankroll.roi.toFixed(1), "%"] }), _jsx(Box, { display: "flex", alignItems: "center", gap: 1, mt: 1, children: _jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Total Profit: $", bankroll.totalProfit.toFixed(2)] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Win Rate" }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsxs(Typography, { variant: "h4", children: [calculateWinRate().toFixed(1), "%"] }), _jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["(", bankroll.winningBets, "/", bankroll.totalBets, ")"] })] }), _jsx(ProgressBar, { variant: "determinate", value: calculateWinRate(), sx: {
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: calculateWinRate() >= 50 ? 'success.main' : 'error.main',
                                        },
                                    } })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Current Streak" }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(Typography, { variant: "h4", color: getStreakColor(bankroll.currentStreak), children: bankroll.currentStreak }), _jsx(Chip, { size: "small", label: bankroll.currentStreakType.toUpperCase(), color: bankroll.currentStreakType === 'win' ? 'success' : 'error' })] }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 2, mt: 1, children: [_jsx(Tooltip, { title: "Longest Win Streak", children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, children: [_jsx(TrophyIcon, { fontSize: "small", color: "success" }), _jsx(Typography, { variant: "body2", children: bankroll.winStreak })] }) }), _jsx(Tooltip, { title: "Longest Loss Streak", children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 0.5, children: [_jsx(WarningIcon, { fontSize: "small", color: "error" }), _jsx(Typography, { variant: "body2", children: bankroll.lossStreak })] }) })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: {
                                p: 2,
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                            }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Betting Statistics" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, sm: 3, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Average Bet" }), _jsxs(Typography, { variant: "h6", children: ["$", bankroll.averageBetSize.toFixed(2)] })] }), _jsxs(Grid, { item: true, xs: 6, sm: 3, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Largest Bet" }), _jsxs(Typography, { variant: "h6", children: ["$", bankroll.largestBet.toFixed(2)] })] }), _jsxs(Grid, { item: true, xs: 6, sm: 3, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Largest Win" }), _jsxs(Typography, { variant: "h6", color: "success.main", children: ["$", bankroll.largestWin.toFixed(2)] })] }), _jsxs(Grid, { item: true, xs: 6, sm: 3, children: [_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Largest Loss" }), _jsxs(Typography, { variant: "h6", color: "error.main", children: ["$", Math.abs(bankroll.largestLoss).toFixed(2)] })] })] })] }) })] }) }) }));
};
