import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, VStack, Text, useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
export const BetForm = ({ eventId, marketType, selection, odds, metadata, }) => {
    const [stake, setStake] = useState(0);
    const { user } = useAuth();
    const toast = useToast();
    const placeBetMutation = useMutation({
        mutationFn: async (betData) => {
            const response = await axios.post('/api/betting/place', betData);
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: 'Bet placed successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        },
        onError: error => {
            toast({
                title: 'Error placing bet',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'Please log in to place bets',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        placeBetMutation.mutate({
            eventId,
            marketType,
            selection,
            odds,
            stake,
            metadata,
        });
    };
    const potentialWinnings = stake * odds;
    return (_jsx(Box, { as: "form", borderRadius: "lg", borderWidth: 1, p: 4, onSubmit: handleSubmit, children: _jsxs(VStack, { align: "stretch", spacing: 4, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "Place Your Bet" }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Event" }), _jsxs(Text, { children: [metadata.homeTeam, " vs ", metadata.awayTeam] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Market" }), _jsx(Text, { children: marketType })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Selection" }), _jsx(Text, { children: selection })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Odds" }), _jsx(Text, { children: odds })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Stake" }), _jsxs(NumberInput, { min: 0.01, step: 0.01, value: stake, onChange: (_, value) => setStake(value), children: [_jsx(NumberInputField, {}), _jsxs(NumberInputStepper, { children: [_jsx(NumberIncrementStepper, {}), _jsx(NumberDecrementStepper, {})] })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Potential Winnings" }), _jsxs(Text, { children: ["$", potentialWinnings.toFixed(2)] })] }), _jsx(Button, { colorScheme: "blue", isDisabled: !stake || stake < 0.01, isLoading: placeBetMutation.isPending, type: "submit", children: "Place Bet" })] }) }));
};
