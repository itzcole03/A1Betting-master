import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getActiveBets, getTotalWinnings, getWinRate } from '@services/bettingService';
import LoadingState from '@components/core/LoadingState';
import ErrorState from '@components/core/ErrorState';
const Dashboard = () => {
    const theme = useTheme();
    const { data: activeBets = 0, isLoading: isLoadingBets, error: betsError, refetch: refetchBets, } = useQuery({
        queryKey: ['activeBets'],
        queryFn: getActiveBets,
    });
    const { data: totalWinnings = 0, isLoading: isLoadingWinnings, error: winningsError, refetch: refetchWinnings, } = useQuery({
        queryKey: ['totalWinnings'],
        queryFn: getTotalWinnings,
    });
    const { data: winRate = 0, isLoading: isLoadingWinRate, error: winRateError, refetch: refetchWinRate, } = useQuery({
        queryKey: ['winRate'],
        queryFn: getWinRate,
    });
    if (isLoadingBets || isLoadingWinnings || isLoadingWinRate) {
        return _jsx(LoadingState, { message: "Loading dashboard data..." });
    }
    if (betsError || winningsError || winRateError) {
        return (_jsx(ErrorState, { message: "Failed to load dashboard data", onRetry: () => {
                refetchBets();
                refetchWinnings();
                refetchWinRate();
            } }));
    }
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h4", children: "Dashboard" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, lg: 4, md: 6, xs: 12, children: _jsxs(Paper, { sx: {
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: theme.shadows[4],
                                },
                            }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Active Bets" }), _jsx(Typography, { color: "primary", variant: "h3", children: activeBets })] }) }), _jsx(Grid, { item: true, lg: 4, md: 6, xs: 12, children: _jsxs(Paper, { sx: {
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: theme.shadows[4],
                                },
                            }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Total Winnings" }), _jsxs(Typography, { color: "success.main", variant: "h3", children: ["$", totalWinnings.toLocaleString()] })] }) }), _jsx(Grid, { item: true, lg: 4, md: 6, xs: 12, children: _jsxs(Paper, { sx: {
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: theme.shadows[4],
                                },
                            }, children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Win Rate" }), _jsxs(Typography, { color: "info.main", variant: "h3", children: [winRate, "%"] })] }) })] })] }));
};
export default Dashboard;
