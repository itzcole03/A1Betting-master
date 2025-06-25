import { Entry, PerformanceMetrics, BettingOpportunity, Alert, BetRecord } from '../types/core';
import { ProcessedPrizePicksProp } from '../types/prizePicks';
interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}
interface AppState {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    props: ProcessedPrizePicksProp[];
    selectedProps: string[];
    entries: Entry[];
    metrics: PerformanceMetrics | null;
    opportunities: BettingOpportunity[];
    alerts: Alert[];
    darkMode: boolean;
    sidebarOpen: boolean;
    activeModal: string | null;
    setProps: (props: ProcessedPrizePicksProp[]) => void;
    togglePropSelection: (propId: string) => void;
    addEntry: (entry: Entry) => void;
    updateEntry: (entryId: string, updates: Partial<Entry>) => void;
    setMetrics: (metrics: PerformanceMetrics) => void;
    addOpportunity: (opportunity: BettingOpportunity) => void;
    removeOpportunity: (opportunityId: string) => void;
    addAlert: (alert: Alert) => void;
    removeAlert: (alertId: string) => void;
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    setActiveModal: (modalId: string | null) => void;
    bets: BetRecord[];
    addBet: (bet: BetRecord) => void;
    updateBet: (betId: string, updates: Partial<BetRecord>) => void;
    removeBet: (betId: string) => void;
}
declare const useStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<AppState>, "setState" | "devtools"> & {
    setState(partial: AppState | Partial<AppState> | ((state: AppState) => AppState | Partial<AppState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: AppState | ((state: AppState) => AppState), replace: true, action?: (string | {
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
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, {
            user: User | null;
            props: ProcessedPrizePicksProp[];
            selectedProps: string[];
            entries: Entry[];
            metrics: PerformanceMetrics | null;
            opportunities: BettingOpportunity[];
            alerts: Alert[];
            darkMode: boolean;
            sidebarOpen: boolean;
            activeModal: string | null;
            bets: BetRecord[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, {
            user: User | null;
            props: ProcessedPrizePicksProp[];
            selectedProps: string[];
            entries: Entry[];
            metrics: PerformanceMetrics | null;
            opportunities: BettingOpportunity[];
            alerts: Alert[];
            darkMode: boolean;
            sidebarOpen: boolean;
            activeModal: string | null;
            bets: BetRecord[];
        }>>;
    };
}>;
export default useStore;
