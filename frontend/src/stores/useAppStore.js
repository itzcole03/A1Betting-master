import { createAuthSlice, initialAuthState } from '../store/slices/authSlice';
import { createBetSlipSlice, initialBetSlipState, } from '../store/slices/betSlipSlice';
import { createDynamicDataSlice, initialDynamicDataState, } from '../store/slices/dynamicDataSlice';
import { createNotificationSlice, initialNotificationState, } from '../store/slices/notificationSlice';
import { createPrizePicksSlice, initialPrizePicksState, } from '../store/slices/prizePicksSlice';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useAppStore = create()(persist((set, get, api) => ({
    ...initialAuthState,
    ...initialPrizePicksState,
    ...initialBetSlipState,
    ...initialNotificationState,
    ...initialDynamicDataState,
    ...createAuthSlice(set, get, api),
    ...createPrizePicksSlice(set, get, api),
    ...createBetSlipSlice(set, get, api),
    ...createNotificationSlice(set, get, api),
    ...createDynamicDataSlice(set, get, api),
}), {
    name: 'ai-sports-betting-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        webSocketClientId: state.webSocketClientId,
        themeSettings: state.themeSettings,
        legs: state.legs,
        stake: state.stake,
    }),
}));
// --- Selectors ---
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectUser = (state) => state.user;
export const selectBetSlipLegs = (state) => state.legs;
export const selectToasts = (state) => state.toasts;
export const selectUserBettingSummary = (state) => {
    return {
        userName: state.user?.username,
        totalEntries: state.entries.length,
        currentBetSlipValue: state.potentialPayout,
    };
};
export const selectPropsForLeague = (league) => (state) => state.props.filter(p => (p.league || '').toLowerCase() === league.toLowerCase());
export function getInitialState() {
    return {
        ...initialAuthState,
        ...initialPrizePicksState,
        ...initialBetSlipState,
        ...initialNotificationState,
        ...initialDynamicDataState,
    };
}
