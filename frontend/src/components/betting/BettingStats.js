import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useColorModeValue, } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
export const BettingStats = () => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { data, isLoading, error } = useQuery({
        queryKey: ['bettingStats'],
        queryFn: async () => {
            const response = await axios.get('/api/betting/stats/summary');
            return response.data;
        },
    });
    if (isLoading || error || !data) {
        return null;
    }
    const stats = {
        total: data.reduce((acc, curr) => acc + curr.count, 0),
        won: data.find(stat => stat._id === 'won')?.count || 0,
        lost: data.find(stat => stat._id === 'lost')?.count || 0,
        pending: data.find(stat => stat._id === 'pending')?.count || 0,
        totalStake: data.reduce((acc, curr) => acc + curr.totalStake, 0),
        totalWinnings: data.reduce((acc, curr) => acc + curr.totalWinnings, 0),
    };
    const winRate = stats.total > 0 ? (stats.won / (stats.won + stats.lost)) * 100 : 0;
    const profit = stats.totalWinnings - stats.totalStake;
    const roi = stats.totalStake > 0 ? (profit / stats.totalStake) * 100 : 0;
    return (_jsxs(SimpleGrid, { columns: { base: 1, md: 2, lg: 4 }, spacing: 4, children: [_jsx(Box, { bg: bgColor, borderColor: borderColor, borderRadius: "lg", borderWidth: 1, p: 4, children: _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Total Bets" }), _jsx(StatNumber, { children: stats.total }), _jsxs(StatHelpText, { children: [stats.pending, " pending"] })] }) }), _jsx(Box, { bg: bgColor, borderColor: borderColor, borderRadius: "lg", borderWidth: 1, p: 4, children: _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Win Rate" }), _jsxs(StatNumber, { children: [winRate.toFixed(1), "%"] }), _jsxs(StatHelpText, { children: [stats.won, " wins / ", stats.lost, " losses"] })] }) }), _jsx(Box, { bg: bgColor, borderColor: borderColor, borderRadius: "lg", borderWidth: 1, p: 4, children: _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Total Stake" }), _jsxs(StatNumber, { children: ["$", stats.totalStake.toFixed(2)] }), _jsxs(StatHelpText, { children: ["Average $", (stats.totalStake / stats.total).toFixed(2), " per bet"] })] }) }), _jsx(Box, { bg: bgColor, borderColor: borderColor, borderRadius: "lg", borderWidth: 1, p: 4, children: _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Profit/Loss" }), _jsxs(StatNumber, { children: ["$", profit.toFixed(2), _jsx(StatArrow, { type: profit >= 0 ? 'increase' : 'decrease' })] }), _jsxs(StatHelpText, { children: ["ROI: ", roi.toFixed(1), "%"] })] }) })] }));
};
