import { useAppStore, AppState, AppStore } from '../store/useAppStore';
import { useBettingStore, BettingStore } from './bettingStore';
import { useMoneyMakerStore } from './moneyMakerStore';
import type { MoneyMakerStoreState, MoneyMakerStoreActions } from '@/types/money-maker';
import { useThemeStore, ThemeState } from './themeStore';
import { BettingSlice } from './slices/bettingSlice';
import { MLSlice } from './slices/mlSlice';
import { UISlice } from './slices/uiSlice';
import { WebSocketSlice } from './slices/websocketSlice';
export { useAppStore, useBettingStore, useMoneyMakerStore, useThemeStore };
export type { AppState, AppStore, BettingStore, MoneyMakerStoreState, MoneyMakerStoreActions, ThemeState, };
export type RootState = AppState & BettingStore & MoneyMakerStoreState & MoneyMakerStoreActions & ThemeState;
export declare const useStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<any>, "setState" | "devtools"> & {
    setState(partial: any, replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: any, replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<any, {
            user: any;
            token: any;
            isAuthenticated: any;
            theme: any;
            config: any;
            activeBets: any;
            totalStake: any;
            potentialProfit: any;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: any) => void) => () => void;
        onFinishHydration: (fn: (state: any) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<any, {
            user: any;
            token: any;
            isAuthenticated: any;
            theme: any;
            config: any;
            activeBets: any;
            totalStake: any;
            potentialProfit: any;
        }>>;
    };
}>;
export declare const selectors: {
    selectIsAuthenticated: (state: RootState) => any;
    selectUser: (state: RootState) => any;
    selectBetSlipLegs: (state: RootState) => any;
    selectActiveBets: (state: RootState) => any;
    selectTotalStake: (state: RootState) => any;
    selectPotentialProfit: (state: RootState) => any;
    selectTheme: (state: RootState) => any;
    selectIsDarkMode: (state: RootState) => any;
    selectConfig: (state: RootState) => any;
    selectOpportunities: (state: RootState) => any;
};
export declare const actions: {
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    placeBet: any;
    updateActiveBet: any;
    clearOpportunities: any;
    toggleTheme: () => void;
    updateConfig: any;
    addPrediction: any;
    updatePrediction: any;
    addPortfolio: any;
    updatePortfolio: any;
    updateMetrics: any;
    setLoading: any;
    setError: any;
    reset: any;
    loadInitialData: any;
    handlePlaceBet: any;
};
export declare function getInitialState(): RootState;
export type StoreState = BettingSlice & MLSlice & UISlice & WebSocketSlice;
export declare const selectBettingState: (state: StoreState) => {
    bets: any;
    odds: any;
    payouts: any;
};
export declare const selectMLState: (state: StoreState) => {
    predictions: any;
    modelMetrics: any;
    driftAlerts: any;
};
export declare const selectUIState: (state: StoreState) => {
    theme: any;
    userPreferences: any;
    notifications: any;
};
export declare const selectWebSocketState: (state: StoreState) => {
    isConnected: any;
    lastMessage: any;
    connectionStatus: any;
};
