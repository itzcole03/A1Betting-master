import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import EnhancedPropCard from '../components/ui/EnhancedPropCard';
import GlowButton from '../components/ui/GlowButton';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Slider, } from '@mui/material';
import { predictionService } from '@/services/prediction';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { usePredictionStore } from '@/store/predictionStore';
const convertToLineup = (output) => ({
    id: output.id,
    timestamp: output.timestamp,
    strategy: output.strategy,
    legs: output.legs.map(leg => ({
        propType: leg.propType,
        line: leg.line.toString(),
        odds: leg.odds,
    })),
    performance: {
        expectedValue: output.performance.expectedValue,
        winProbability: output.performance.winProbability,
        riskScore: output.performance.riskScore,
    },
});
const LineupBuilderPage = () => {
    const { currentLineup, setCurrentLineup, savedLineups, addSavedLineup, isLoading, setIsLoading, error, setError, } = usePredictionStore();
    const [strategy, setStrategy] = useState({
        id: 'default',
        name: 'Default Strategy',
        type: 'balanced',
        targetConfidence: 75,
        maxLegs: 5,
        minLegs: 2,
        maxSameTeam: 2,
        riskProfile: {
            maxVariance: 0.5,
            maxCorrelation: 0.3,
            minExpectedValue: 0.1,
        },
    });
    const handleStrategyTypeChange = (event) => {
        const type = event.target.value;
        setStrategy(prev => ({
            ...prev,
            type,
            targetConfidence: type === 'goblin' ? 84 : type === 'demon' ? 65 : 75,
            riskProfile: {
                ...prev.riskProfile,
                maxVariance: type === 'goblin' ? 0.3 : type === 'demon' ? 0.7 : 0.5,
                minExpectedValue: type === 'goblin' ? 0.15 : type === 'demon' ? 0.05 : 0.1,
            },
        }));
    };
    const handleConfidenceChange = (_, value) => {
        setStrategy(prev => ({
            ...prev,
            targetConfidence: value,
        }));
    };
    const handleLegsChange = (event) => {
        const [min, max] = event.target.value.split('-').map(Number);
        setStrategy(prev => ({
            ...prev,
            minLegs: min,
            maxLegs: max,
        }));
    };
    const handleSameTeamChange = (event) => {
        setStrategy(prev => ({
            ...prev,
            maxSameTeam: Number(event.target.value),
        }));
    };
    const generateLineup = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await predictionService.generateLineup(strategy);
            setCurrentLineup(convertToLineup(result));
        }
        catch (error) {
            console.error('Failed to generate lineup:', error);
            setError('Failed to generate lineup. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSaveLineup = () => {
        if (currentLineup) {
            addSavedLineup(currentLineup);
        }
    };
    const handlePlaceLineup = () => {
        // Implement lineup placement logic
        console.log('Placing lineup:', currentLineup);
    };
    return (_jsxs("div", { className: "p-6 space-y-8", children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-6", children: "Lineup Builder" }), error && (_jsx(GlassCard, { className: "mb-3", children: _jsx("div", { className: "text-red-600 font-semibold", children: error }) })), _jsxs(GlassCard, { className: "mb-6", children: [_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Strategy Type" }), _jsxs(Select, { label: "Strategy Type", value: strategy.type, onChange: handleStrategyTypeChange, children: [_jsx(MenuItem, { value: "goblin", children: "Goblin (Conservative)" }), _jsx(MenuItem, { value: "demon", children: "Demon (Aggressive)" }), _jsx(MenuItem, { value: "balanced", children: "Balanced" })] })] }) }), _jsxs(Grid, { item: true, md: 6, xs: 12, children: [_jsx(Typography, { gutterBottom: true, children: "Target Confidence" }), _jsx(Slider, { max: 95, min: 50, value: strategy.targetConfidence, valueLabelDisplay: "auto", valueLabelFormat: value => `${value}%`, onChange: handleConfidenceChange })] }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Number of Legs" }), _jsxs(Select, { label: "Number of Legs", value: `${strategy.minLegs}-${strategy.maxLegs}`, onChange: handleLegsChange, children: [_jsx(MenuItem, { value: "2-3", children: "2-3 Legs" }), _jsx(MenuItem, { value: "3-4", children: "3-4 Legs" }), _jsx(MenuItem, { value: "4-5", children: "4-5 Legs" })] })] }) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Max Same Team" }), _jsxs(Select, { label: "Max Same Team", value: strategy.maxSameTeam.toString(), onChange: handleSameTeamChange, children: [_jsx(MenuItem, { value: "1", children: "1 Player" }), _jsx(MenuItem, { value: "2", children: "2 Players" }), _jsx(MenuItem, { value: "3", children: "3 Players" })] })] }) })] }), _jsx(Button, { fullWidth: true, color: "primary", disabled: isLoading, sx: { mt: 3 }, variant: "contained", onClick: generateLineup, children: "Generate Lineup" })] }), isLoading ? (_jsx("div", { className: "flex justify-center p-6", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" }) })) : currentLineup ? (_jsxs(GlassCard, { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Generated Lineup" }), _jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${currentLineup.performance.winProbability >= 80
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'}`, children: [formatPercentage(currentLineup.performance.winProbability), " Win Probability"] })] }), _jsxs("div", { className: "mb-2 text-gray-500", children: ["Expected Value: ", formatCurrency(currentLineup.performance.expectedValue)] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4", children: currentLineup.legs.map((leg, index) => (_jsx(EnhancedPropCard, { playerName: leg.playerName || '', team: leg.team || '', position: leg.position || '', statType: leg.propType, line: leg.line, overOdds: leg.odds, underOdds: leg.odds, pickType: leg.pickType, trendValue: leg.trendValue, gameInfo: leg.gameInfo, playerImageUrl: leg.playerImageUrl, onSelect: () => { }, onViewDetails: () => { } }, index))) }), _jsxs("div", { className: "mt-6 flex gap-4", children: [_jsx(GlowButton, { onClick: handlePlaceLineup, className: "flex-1", children: "Place Lineup" }), _jsx(GlowButton, { onClick: handleSaveLineup, className: "flex-1 bg-white text-primary-600 border border-primary-500", children: "Save Lineup" })] })] })) : null, savedLineups.length > 0 && (_jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Saved Lineups" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: savedLineups.map((lineup) => (_jsxs(GlassCard, { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "font-semibold", children: lineup.strategy.name }), _jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${lineup.performance.winProbability >= 80
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'}`, children: [formatPercentage(lineup.performance.winProbability), " Win Probability"] })] }), _jsxs("div", { className: "mb-2 text-gray-500", children: ["Expected Value: ", formatCurrency(lineup.performance.expectedValue)] }), _jsx("div", { className: "grid grid-cols-1 gap-2 mt-2", children: lineup.legs.map((leg, index) => (_jsx(EnhancedPropCard, { playerName: leg.playerName || '', team: leg.team || '', position: leg.position || '', statType: leg.propType, line: leg.line, overOdds: leg.odds, underOdds: leg.odds, pickType: leg.pickType, trendValue: leg.trendValue, gameInfo: leg.gameInfo, playerImageUrl: leg.playerImageUrl, onSelect: () => { }, onViewDetails: () => { } }, index))) }), _jsx(GlowButton, { onClick: () => setCurrentLineup(lineup), className: "w-full mt-4", children: "Load Lineup" })] }, lineup.id))) })] }))] }));
};
export default LineupBuilderPage;
