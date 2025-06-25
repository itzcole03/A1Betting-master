import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { PrizePicksService } from '../../services/prizePicksService';
const StateContext = createContext(undefined);
export const StateProvider = ({ children }) => {
    const [props, setProps] = useState([]);
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        const service = PrizePicksService.getInstance();
        const load = () => {
            const realProps = service
                .getFilteredProps('high-confidence')
                .map((p) => ({
                id: p.player_name + p.stat_type + p.game_time,
                player: p.player_name,
                team: p.team_abbreviation,
                stat: p.stat_type,
                line: p.line_value,
                type: p.winningProp.type,
                percentage: p.winningProp.percentage * 100,
                fireCount: parseInt(p.pick_count) || 0,
                sentiment: undefined, // TODO: integrate real sentiment if available
                // espnLink: p.espnNews || '', // Uncomment if/when available
            }));
            setProps(realProps);
        };
        load();
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);
    const addEntry = (entry) => setEntries(prev => [entry, ...prev]);
    const findOptimalLineup = (entryAmount) => null; // TODO: implement with real logic
    return (_jsx(StateContext.Provider, { value: { props, entries, addEntry, findOptimalLineup }, children: children }));
};
export const useAppState = () => {
    const ctx = useContext(StateContext);
    if (!ctx)
        throw new Error('useAppState must be used within StateProvider');
    return ctx;
};
