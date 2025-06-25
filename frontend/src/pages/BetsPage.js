import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import Tooltip from '../components/ui/Tooltip';
import EnhancedPropCard from '../components/ui/EnhancedPropCard';
import { UnifiedBettingInterface } from '../components/betting/UnifiedBettingInterface';
import { LiveOddsTicker } from '../components/betting/LiveOddsTicker';
import { RiskProfileSelector } from '../components/betting/RiskProfileSelector';
import { StakeSizingControl } from '../components/betting/StakeSizingControl';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ToastProvider } from '../components/common/ToastProvider';
import BetsTable from '../components/betting/BetsTable.tsx';
import BetHistoryChart from '../components/betting/BetHistoryChart.tsx';
// Alpha1 Advanced Widgets
import ConfidenceBands from '../components/ui/ConfidenceBands.tsx';
import RiskHeatMap from '../components/ui/RiskHeatMap.tsx';
import SourceHealthBar from '../components/ui/SourceHealthBar.tsx';
import WhatIfSimulator from '../components/advanced/WhatIfSimulator.tsx';
// TODO: Add tests for new widgets
const BetsPage = () => {
    // Example state hooks for risk profile, stake, and event selection
    const [riskProfile, setRiskProfile] = React.useState('moderate');
    const [stake, setStake] = React.useState(100);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [events, setEvents] = React.useState([]); // Replace with real events from API/service
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Placeholder: fetch events (replace with real fetch/service logic)
    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setEvents([]); // Replace with real event list
            setLoading(false);
        }, 500);
    }, []);
    return (_jsx(ToastProvider, { children: _jsx(ErrorBoundary, { children: _jsxs("div", { className: "p-6 space-y-8 min-h-screen bg-gradient-to-br from-green-900/80 to-green-700/80 dark:from-gray-900 dark:to-gray-800 transition-colors", children: [_jsxs(GlassCard, { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-green-900 dark:text-green-100 mb-4", children: "Betting Interface" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(RiskProfileSelector, { currentProfile: riskProfile, onProfileChange: setRiskProfile }), _jsx(StakeSizingControl, { onStakeChange: setStake, defaultStake: stake }), _jsx(LiveOddsTicker, { events: events, onEventSelect: setSelectedEvent, loading: loading, error: error ? { message: error } : null })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(UnifiedBettingInterface, { initialBankroll: 1000, onBetPlaced: () => { }, darkMode: true }), _jsxs(GlassCard, { className: "p-4", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Your Bet Slip" }), _jsx(EnhancedPropCard, { playerName: "LeBron James", team: "LAL", position: "F", statType: "Points", line: 27.5, overOdds: 1.8, underOdds: 1.9, pickType: "normal", trendValue: 156, gameInfo: { opponent: 'BOS', day: 'Fri', time: '7:30pm' }, playerImageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png", onSelect: () => { }, onViewDetails: () => { } }), _jsx(GlowButton, { className: "w-full mt-4", children: "Place Bet" })] }), _jsx(BetsTable, {}), _jsx(BetHistoryChart, {})] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(GlassCard, { children: [_jsx(ConfidenceBands, { lower: 42, upper: 68, mean: 55 }), _jsx(Tooltip, { content: "Model confidence interval (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs(GlassCard, { children: [_jsx(RiskHeatMap, { riskScores: [0.2, 0.6, 0.7] }), _jsx(Tooltip, { content: "Risk heat map (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs(GlassCard, { children: [_jsx(SourceHealthBar, { sources: [
                                            { name: 'Sportradar', healthy: true },
                                            { name: 'Weather', healthy: true },
                                            { name: 'Injury', healthy: false },
                                        ] }), _jsx(Tooltip, { content: "Source health status (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] }), _jsxs(GlassCard, { children: [_jsx(WhatIfSimulator, {}), _jsx(Tooltip, { content: "What-if scenario simulator (hover for details)", children: _jsx("span", { className: "text-xs text-gray-400 ml-2", children: "?" }) })] })] })] }) }) }));
};
export default BetsPage;
