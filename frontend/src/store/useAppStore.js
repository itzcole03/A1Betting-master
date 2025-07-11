// Import slice types and creators
import { createAuthSlice, initialAuthState } from './slices/authSlice';
import { createPrizePicksSlice, initialPrizePicksState, } from './slices/prizePicksSlice';
import { createBetSlipSlice, initialBetSlipState } from './slices/betSlipSlice';
import { createNotificationSlice, initialNotificationState, } from './slices/notificationSlice';
import { createDynamicDataSlice, initialDynamicDataState, } from './slices/dynamicDataSlice';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useAppStore = create()(persist((set, get, api) => ({
    ...initialAuthState, // Spread initial states from each slice
    ...initialPrizePicksState,
    ...initialBetSlipState,
    ...initialNotificationState,
    ...initialDynamicDataState,
    // Spread action creators from each slice
    // The `StateCreator` type for each slice expects the full `AppStore` type for `set` and `get`
    ...createAuthSlice(set, get, api),
    ...createPrizePicksSlice(set, get, api),
    ...createBetSlipSlice(set, get, api),
    ...createNotificationSlice(set, get, api),
    ...createDynamicDataSlice(set, get, api),
}), {
    name: 'ai-sports-betting-storage', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    partialize: state => ({
        // Persist only specific parts of the state if needed, e.g., auth-related fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        webSocketClientId: state.webSocketClientId,
        themeSettings: state.themeSettings, // Example if theme was part of this store
        legs: state.legs, // Persist bet slip legs
        stake: state.stake, // Persist bet slip stake
    }),
}));
// --- Selectors (can be co-located with slices or kept here) ---
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectUser = (state) => state.user;
export const selectBetSlipLegs = (state) => state.legs;
export const selectToasts = (state) => state.toasts;
// Example of a selector that depends on multiple slices (if needed)
export const selectUserBettingSummary = (state) => {
    return {
        userName: state.user?.username,
        totalEntries: state.entries.length,
        currentBetSlipValue: state.potentialPayout,
    };
};
// It's crucial to update components that use useAppStore to correctly select from the new structure if needed,
// or use slice-specific hooks if you decide to export them separately (e.g., useAuthStore, useBetSlipStore).
// For now, the combined store `useAppStore` still provides access to all state and actions as before,
// but the internal organization is cleaner.
// Adjust import in authSlice.ts and other slices from `../useAppStore` to `..` if they only need types from the root store definition.
// The StateCreator in each slice needs the full AppStore type for `get` and `set` to work across slices.
export const selectPropsForLeague = (league) => (state) => state.props.filter(p => (p.league || '').toLowerCase() === league.toLowerCase());
// Export a function to get the initial state for testing
export function getInitialState() {
    return {
        ...initialAuthState,
        ...initialPrizePicksState,
        ...initialBetSlipState,
        ...initialNotificationState,
        ...initialDynamicDataState,
        // Add any default values for actions if needed (usually not required for Zustand)
    };
}
