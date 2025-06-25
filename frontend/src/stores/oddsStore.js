import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
export const useOddsStore = create()(devtools((set, get) => ({
    oddsByEvent: {},
    setOdds: (eventId, odds) => set(state => ({
        oddsByEvent: {
            ...state.oddsByEvent,
            [eventId]: odds,
        },
    })),
    updateOdds: (eventId, market) => set(state => {
        const currentOdds = state.oddsByEvent[eventId];
        if (!currentOdds)
            return state;
        const updatedMarkets = currentOdds.markets.map(m => m.market_type === market.market_type ? market : m);
        return {
            oddsByEvent: {
                ...state.oddsByEvent,
                [eventId]: {
                    ...currentOdds,
                    markets: updatedMarkets,
                    timestamp: new Date().toISOString(),
                },
            },
        };
    }),
    getOddsForEvent: (eventId) => {
        const state = get();
        return state.oddsByEvent[eventId] || null;
    },
    clearOdds: (eventId) => set(state => {
        const { [eventId]: _, ...remainingOdds } = state.oddsByEvent;
        return { oddsByEvent: remainingOdds };
    }),
}), { name: 'odds-store' }));
