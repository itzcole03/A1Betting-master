import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import EnhancedPropCard from '../components/ui/EnhancedPropCard';
import { notificationService } from '@/services/notification';
import { sportsAnalytics } from '@/services/sportsAnalytics';
// Sample data for demonstration
const samplePlayers = [
    {
        player: {
            name: 'LeBron James',
            team: 'LAL',
            position: 'F',
            imageUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
        },
        props: [
            {
                id: 'points_1',
                name: 'Points',
                value: 25.5,
                overMultiplier: 1.8,
                underMultiplier: 1.9,
                confidence: 85,
                fireCount: 156,
                winRate: 72,
            },
            {
                id: 'rebounds_1',
                name: 'Rebounds',
                value: 7.5,
                overMultiplier: 1.85,
                underMultiplier: 1.85,
                modifier: 'goblin',
                modifierMultiplier: 2.5,
                confidence: 65,
                fireCount: 89,
                winRate: 68,
            },
            {
                id: 'assists_1',
                name: 'Assists',
                value: 8.5,
                overMultiplier: 1.9,
                underMultiplier: 1.8,
                modifier: 'devil',
                modifierMultiplier: 3.0,
                confidence: 45,
                fireCount: 42,
                winRate: 55,
            },
        ],
    },
    {
        player: {
            name: 'Stephen Curry',
            team: 'GSW',
            position: 'G',
            imageUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
        },
        props: [
            {
                id: 'points_2',
                name: 'Points',
                value: 28.5,
                overMultiplier: 1.85,
                underMultiplier: 1.85,
                confidence: 90,
                fireCount: 234,
                winRate: 78,
            },
            {
                id: 'threes_2',
                name: '3-Pointers Made',
                value: 4.5,
                overMultiplier: 1.9,
                underMultiplier: 1.8,
                modifier: 'goblin',
                modifierMultiplier: 2.5,
                confidence: 75,
                fireCount: 167,
                winRate: 82,
            },
            {
                id: 'assists_2',
                name: 'Assists',
                value: 6.5,
                overMultiplier: 1.85,
                underMultiplier: 1.85,
                confidence: 60,
                fireCount: 78,
                winRate: 65,
            },
        ],
    },
    {
        player: {
            name: 'Nikola Jokic',
            team: 'DEN',
            position: 'C',
            imageUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
        },
        props: [
            {
                id: 'points_3',
                name: 'Points',
                value: 26.5,
                overMultiplier: 1.85,
                underMultiplier: 1.85,
                confidence: 80,
                fireCount: 145,
                winRate: 75,
            },
            {
                id: 'rebounds_3',
                name: 'Rebounds',
                value: 12.5,
                overMultiplier: 1.9,
                underMultiplier: 1.8,
                modifier: 'devil',
                modifierMultiplier: 3.0,
                confidence: 70,
                fireCount: 112,
                winRate: 80,
            },
            {
                id: 'assists_3',
                name: 'Assists',
                value: 9.5,
                overMultiplier: 1.85,
                underMultiplier: 1.85,
                confidence: 55,
                fireCount: 67,
                winRate: 62,
            },
        ],
    },
];
// Sample trending props
const sampleTrendingProps = [
    {
        id: 'trend_1',
        playerName: 'Stephen Curry',
        team: 'GSW',
        propType: '3-Pointers Made',
        value: 4.5,
        direction: 'over',
        modifier: 'goblin',
        confidence: 90,
        fireCount: 234,
        communityStats: {
            likes: 156,
            comments: 42,
            shares: 23,
        },
        topComment: {
            user: 'PropMaster',
            avatar: 'https://i.pravatar.cc/150?img=1',
            text: 'Curry has hit this in 8 of his last 10 games. Easy money!',
            likes: 45,
        },
    },
    // Add more trending props...
];
export const PropsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSport, setSelectedSport] = useState('NBA');
    const [selectedProp, setSelectedProp] = useState(null);
    const [propPrediction, setPropPrediction] = useState(null);
    const [minConfidence, setMinConfidence] = useState(60);
    const [minFireCount, setMinFireCount] = useState(50);
    useEffect(() => {
        if (selectedProp) {
            loadPropPrediction(selectedProp);
        }
    }, [selectedProp, selectedSport]);
    const loadPropPrediction = async (propId) => {
        setIsLoading(true);
        try {
            const prediction = await sportsAnalytics.analyzeProp(selectedSport, propId);
            setPropPrediction(prediction);
        }
        catch (error) {
            notificationService.notify('error', 'Error loading prediction', 'Please try again later');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePropSelect = (playerName, propId, selection, modifier) => {
        setSelectedProp(propId);
        notificationService.notify('success', 'Prop Selected', `${playerName} - ${selection.toUpperCase()} ${propId}${modifier ? ` (${modifier})` : ''}`);
    };
    const handleTrendingPropSelect = (propId) => {
        setSelectedProp(propId);
    };
    const handleBetSelect = (amount, type, modifier) => {
        notificationService.notify('success', 'Bet Placed', `$${amount} on ${type.toUpperCase()}${modifier ? ` (${modifier})` : ''}`);
    };
    return (_jsx("div", { className: "p-6 space-y-8 min-h-screen bg-gradient-to-br from-blue-900/80 to-blue-700/80 dark:from-gray-900 dark:to-gray-800 transition-colors", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4", children: "Player Props" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: samplePlayers.map((player, idx) => player.props.map((prop, pidx) => (_jsx(EnhancedPropCard, { playerName: player.player.name, team: player.player.team, position: player.player.position, statType: prop.name, line: prop.value, overOdds: prop.overMultiplier, underOdds: prop.underMultiplier, pickType: prop.modifier || 'normal', trendValue: prop.fireCount, gameInfo: { opponent: 'TBD', day: 'Fri', time: '7:30pm' }, playerImageUrl: player.player.imageUrl, onSelect: () => { }, onViewDetails: () => { } }, prop.id)))) })] }) }));
};
export default PropsPage;
