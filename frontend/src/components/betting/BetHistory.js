import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, useColorModeValue, Spinner, Center, } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
export const BetHistory = ({ status }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { data, isLoading, error } = useQuery({
        queryKey: ['bets', status],
        queryFn: async () => {
            const response = await axios.get('/api/betting/my-bets', {
                params: { status },
            });
            return response.data;
        },
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'won':
                return 'green';
            case 'lost':
                return 'red';
            case 'cancelled':
                return 'gray';
            default:
                return 'yellow';
        }
    };
    if (isLoading) {
        return (_jsx(Center, { p: 8, children: _jsx(Spinner, { size: "xl" }) }));
    }
    if (error) {
        return (_jsx(Box, { p: 4, children: _jsx(Text, { color: "red.500", children: "Error loading betting history" }) }));
    }
    return (_jsx(Box, { bg: bgColor, borderColor: borderColor, borderRadius: "lg", borderWidth: 1, overflow: "hidden", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Event" }), _jsx(Th, { children: "Market" }), _jsx(Th, { children: "Selection" }), _jsx(Th, { isNumeric: true, children: "Odds" }), _jsx(Th, { isNumeric: true, children: "Stake" }), _jsx(Th, { isNumeric: true, children: "Potential Winnings" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Placed At" })] }) }), _jsx(Tbody, { children: data?.bets.map(bet => (_jsxs(Tr, { children: [_jsxs(Td, { children: [_jsxs(Text, { fontWeight: "medium", children: [bet.metadata.homeTeam, " vs ", bet.metadata.awayTeam] }), _jsx(Text, { color: "gray.500", fontSize: "sm", children: bet.metadata.league })] }), _jsx(Td, { children: bet.marketType }), _jsx(Td, { children: bet.selection }), _jsx(Td, { isNumeric: true, children: bet.odds }), _jsxs(Td, { isNumeric: true, children: ["$", bet.stake.toFixed(2)] }), _jsxs(Td, { isNumeric: true, children: ["$", bet.potentialWinnings.toFixed(2)] }), _jsx(Td, { children: _jsx(Badge, { colorScheme: getStatusColor(bet.status), children: bet.status }) }), _jsx(Td, { children: format(new Date(bet.placedAt), 'MMM d, yyyy HH:mm') })] }, bet._id))) })] }) }));
};
