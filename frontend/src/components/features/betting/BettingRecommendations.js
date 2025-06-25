import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Chip, IconButton, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon, AttachMoney as MoneyIcon, } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { sportsAnalytics } from '@/services/sportsAnalytics';
import { riskManagement } from '@/services/riskManagement';
const RecommendationsCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));
export const BettingRecommendations = ({ sport }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);
    const [betDialogOpen, setBetDialogOpen] = useState(false);
    const [betAmount, setBetAmount] = useState('');
    const [betType, setBetType] = useState('straight');
    useEffect(() => {
        const loadRecommendations = async () => {
            const sportRecommendations = await sportsAnalytics.getRecommendations(sport);
            setRecommendations(sportRecommendations);
        };
        loadRecommendations();
        const unsubscribe = sportsAnalytics.subscribe('recommendations', (data) => {
            setRecommendations(prev => [data, ...prev].slice(0, 10));
        });
        return () => {
            unsubscribe();
        };
    }, [sport]);
    const handleBetClick = (recommendation) => {
        setSelectedRecommendation(recommendation);
        setBetDialogOpen(true);
    };
    const handlePlaceBet = () => {
        if (selectedRecommendation && betAmount) {
            const amount = parseFloat(betAmount);
            riskManagement.placeBet({
                recommendationId: selectedRecommendation.id,
                amount,
                type: betType,
                odds: selectedRecommendation.odds,
            });
            setBetDialogOpen(false);
            setBetAmount('');
        }
    };
    const toggleFavorite = (recommendationId) => {
        setRecommendations(prev => prev.map(rec => rec.id === recommendationId
            ? { ...rec, favorite: !rec.favorite }
            : rec));
    };
    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'error';
            default:
                return 'default';
        }
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 80)
            return 'success';
        if (confidence >= 60)
            return 'warning';
        return 'error';
    };
    return (_jsxs(_Fragment, { children: [_jsx(RecommendationsCard, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Betting Recommendations" }), _jsx(Grid, { container: true, spacing: 2, children: recommendations.map((recommendation) => (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: {
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        position: 'relative',
                                    }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "flex-start", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", children: recommendation.event }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: recommendation.betType })] }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(Chip, { size: "small", label: `${recommendation.odds}x`, color: "primary" }), _jsx(Chip, { size: "small", label: `${recommendation.confidence}% confidence`, color: getConfidenceColor(recommendation.confidence) }), _jsx(Chip, { size: "small", label: recommendation.risk.toUpperCase(), color: getRiskColor(recommendation.risk) }), _jsx(IconButton, { size: "small", onClick: () => toggleFavorite(recommendation.id), children: recommendation.favorite ? (_jsx(StarIcon, { color: "warning" })) : (_jsx(StarBorderIcon, {})) })] })] }), _jsxs(Box, { mt: 1, children: [_jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Edge: ", recommendation.edge.toFixed(2), "%"] }), _jsx(LinearProgress, { variant: "determinate", value: recommendation.confidence, sx: {
                                                        height: 4,
                                                        mt: 1,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: getConfidenceColor(recommendation.confidence),
                                                        },
                                                    } })] }), _jsx(Box, { mt: 2, children: _jsx(Typography, { variant: "body2", children: recommendation.analysis }) }), _jsx(Box, { mt: 2, display: "flex", justifyContent: "flex-end", children: _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(MoneyIcon, {}), onClick: () => handleBetClick(recommendation), children: "Place Bet" }) })] }) }, recommendation.id))) })] }) }), _jsxs(Dialog, { open: betDialogOpen, onClose: () => setBetDialogOpen(false), children: [_jsx(DialogTitle, { children: "Place Bet" }), _jsx(DialogContent, { children: selectedRecommendation && (_jsxs(Box, { sx: { pt: 2 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: selectedRecommendation.event }), _jsxs(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: [selectedRecommendation.betType, " @ ", selectedRecommendation.odds, "x"] }), _jsxs(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [_jsx(InputLabel, { children: "Bet Type" }), _jsxs(Select, { value: betType, label: "Bet Type", onChange: (e) => setBetType(e.target.value), children: [_jsx(MenuItem, { value: "straight", children: "Straight Bet" }), _jsx(MenuItem, { value: "parlay", children: "Parlay" }), _jsx(MenuItem, { value: "teaser", children: "Teaser" })] })] }), _jsx(TextField, { fullWidth: true, label: "Bet Amount", type: "number", value: betAmount, onChange: (e) => setBetAmount(e.target.value), sx: { mt: 2 }, InputProps: {
                                        startAdornment: _jsx(MoneyIcon, { color: "action" }),
                                    } }), _jsx(Box, { mt: 2, children: _jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Potential Payout: $", selectedRecommendation.odds * (parseFloat(betAmount) || 0)] }) })] })) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setBetDialogOpen(false), children: "Cancel" }), _jsx(Button, { variant: "contained", color: "primary", onClick: handlePlaceBet, disabled: !betAmount || parseFloat(betAmount) <= 0, children: "Confirm Bet" })] })] })] }));
};
