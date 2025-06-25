import { AuthSlice } from './slices/authSlice';
import { PrizePicksSlice } from './slices/prizePicksSlice';
import { BetSlipSlice } from './slices/betSlipSlice';
import { NotificationSlice } from './slices/notificationSlice';
import { DynamicDataSlice } from './slices/dynamicDataSlice';
export type AppState = AuthSlice & PrizePicksSlice & BetSlipSlice & NotificationSlice & DynamicDataSlice;
export type AppStore = AppState;
export declare const useAppStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, unknown>>;
    };
}>;
export declare const selectIsAuthenticated: (state: AppStore) => boolean;
export declare const selectUser: (state: AppStore) => any;
export declare const selectBetSlipLegs: (state: AppStore) => ParlayLeg[];
export declare const selectToasts: (state: AppStore) => ToastNotification[];
export declare const selectUserBettingSummary: (state: AppStore) => {
    userName: any;
    totalEntries: number;
    currentBetSlipValue: number;
};
export declare const selectPropsForLeague: (league: string) => (state: AppStore) => PrizePicksProps[];
export declare function getInitialState(): AppStore;
