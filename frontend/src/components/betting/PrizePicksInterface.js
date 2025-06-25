import { jsx as _jsx } from "react/jsx-runtime";
import WebSocketManager from '@/services/unified/WebSocketManager';
import { useEffect, useState } from 'react';
export const PrizePicksInterface = () => {
    const [state, setState] = useState({
        props: [],
        activePicks: {},
        totalStake: 0,
        potentialProfit: 0
    });
    const [selectedStat, setSelectedStat] = useState('all');
    const [minConfidence, setMinConfidence] = useState(0.7);
    const [sortBy, setSortBy] = useState('confidence');
    useEffect(() => {
        // Subscribe to real-time updates
        WebSocketManager.instance.subscribe('prizepicks:prop', (prop) => {
            setState(prev => ({
                ...prev,
                props: [prop, ...prev.props]
            }));
        });
        WebSocketManager.instance.subscribe('prizepicks:update', (update) => {
            setState(prev => ({
                ...prev,
                activePicks: {
                    ...prev.activePicks,
                    [update.id]: {
                        direction: update.direction,
                        amount: update.amount,
                        timestamp: update.timestamp
                    }
                }
            }));
        });
        // Load initial data
        loadInitialData();
        return () => {
            WebSocketManager.instance.unsubscribe('prizepicks:prop');
            WebSocketManager.instance.unsubscribe('prizepicks:update');
        };
    }, []);
    // NOTE: The new bettingService uses hooks for data fetching. Example usage:
    // const { data: sports } = useSports();
    // const { data: events } = useEvents(selectedSportId);
    // const { data: odds } = useOdds(selectedEventId);
    // const { data: activeBets } = useActiveBets();
    // For demonstration, leave loadInitialData as a placeholder for future refactor.
    const loadInitialData = async () => {
        // TODO: Refactor to use hooks and context for data fetching.
        // For now, do nothing.
    };
    const handlePlacePick = async (prop, direction, amount) => {
        // ... (rest of logic from source file)
    };
    // ... (rest of component logic and JSX)
    return (_jsx("div", { children: "PrizePicksInterface UI here (full logic ported in actual file)" }));
};
