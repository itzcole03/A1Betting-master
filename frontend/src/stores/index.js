import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useAppStore } from '../store/useAppStore';
import { useBettingStore } from './bettingStore';
import { useMoneyMakerStore } from './moneyMakerStore';
import { useThemeStore } from './themeStore';
// Re-export all stores
export { useAppStore, useBettingStore, useMoneyMakerStore, useThemeStore };
// Create a unified store with persistence
export const useStore = create()(devtools(persist((set, get, api) => ({
    // Spread all store states
    ...useAppStore.getState(),
    ...useBettingStore.getState(),
    ...useMoneyMakerStore.getState(),
    ...useThemeStore.getState(),
}), {
    name: 'sports-betting-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({
        // Persist only necessary state
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        config: state.config,
        activeBets: state.activeBets,
        totalStake: state.totalStake,
        potentialProfit: state.potentialProfit,
    }),
})));
// Export selectors
export const selectors = {
    // Auth selectors
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    // Betting selectors
    selectBetSlipLegs: (state) => state.legs,
    selectActiveBets: (state) => state.activeBets,
    selectTotalStake: (state) => state.totalStake,
    selectPotentialProfit: (state) => state.potentialProfit,
    // Theme selectors
    selectTheme: (state) => state.theme,
    selectIsDarkMode: (state) => state.isDarkMode,
    // Money Maker selectors
    selectConfig: (state) => state.config,
    selectOpportunities: (state) => state.opportunities,
};
// Export actions
export const actions = {
    // Auth actions
    login: useAppStore.getState().login,
    logout: useAppStore.getState().logout,
    // Betting actions
    placeBet: useBettingStore.getState().placeBet,
    updateActiveBet: useBettingStore.getState().updateActiveBet,
    clearOpportunities: useBettingStore.getState().clearOpportunities,
    // Theme actions
    toggleTheme: useThemeStore.getState().toggleTheme,
    // Money Maker actions
    updateConfig: useMoneyMakerStore.getState().updateConfig,
    addPrediction: useMoneyMakerStore.getState().addPrediction,
    updatePrediction: useMoneyMakerStore.getState().updatePrediction,
    addPortfolio: useMoneyMakerStore.getState().addPortfolio,
    updatePortfolio: useMoneyMakerStore.getState().updatePortfolio,
    updateMetrics: useMoneyMakerStore.getState().updateMetrics,
    setLoading: useMoneyMakerStore.getState().setLoading,
    setError: useMoneyMakerStore.getState().setError,
    reset: useMoneyMakerStore.getState().reset,
    loadInitialData: useMoneyMakerStore.getState().loadInitialData,
    handlePlaceBet: useMoneyMakerStore.getState().handlePlaceBet,
};
// Export initial state for testing
export function getInitialState() {
    return {
        ...useAppStore.getState(),
        ...useBettingStore.getState(),
        ...useMoneyMakerStore.getState(),
        ...useThemeStore.getState(),
    };
}
export const selectBettingState = (state) => ({
    bets: state.bets,
    odds: state.odds,
    payouts: state.payouts,
});
export const selectMLState = (state) => ({
    predictions: state.predictions,
    modelMetrics: state.modelMetrics,
    driftAlerts: state.driftAlerts,
});
export const selectUIState = (state) => ({
    theme: state.theme,
    userPreferences: state.userPreferences,
    notifications: state.notifications,
});
export const selectWebSocketState = (state) => ({
    isConnected: state.isConnected,
    lastMessage: state.lastMessage,
    connectionStatus: state.connectionStatus,
});
