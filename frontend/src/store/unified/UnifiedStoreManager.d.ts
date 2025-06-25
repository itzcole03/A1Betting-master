import { EventEmitter } from "eventemitter3";
interface PredictionData {
    id: string;
    confidence: number;
    predictedValue: number;
    factors: Array<{
        name: string;
        impact: number;
        weight: number;
    }>;
    timestamp: number;
    metadata?: {
        modelVersion?: string;
        features?: Record<string, number>;
        shapValues?: Record<string, number>;
        performanceMetrics?: Record<string, number>;
    };
}
interface BettingState {
    bets: Bet[];
    activeBets: Bet[];
    opportunities: BettingOpportunity[];
    bankroll: number;
    isLoading: boolean;
    error: string | null;
}
interface Bet {
    id: string;
    eventId: string;
    amount: number;
    odds: number;
    timestamp: number;
    status: "active" | "won" | "lost" | "cancelled";
    prediction?: PredictionData;
}
interface BettingOpportunity {
    id: string;
    eventId: string;
    market: string;
    odds: number;
    prediction: PredictionData;
    valueEdge: number;
    kellyFraction: number;
    recommendedStake: number;
    timestamp: number;
}
interface ThemeState {
    mode: "light" | "dark";
    primaryColor: string;
    accentColor: string;
}
interface UserState {
    user: any | null;
    preferences: {
        minConfidence: number;
        maxRiskPerBet: number;
        bankrollPercentage: number;
        autoRefresh: boolean;
        notifications: boolean;
    };
    settings: Record<string, any>;
}
interface FilterState {
    sport: string | null;
    confidence: [number, number];
    riskLevel: "low" | "medium" | "high" | null;
    timeRange: string;
    search: string;
}
interface UnifiedStore {
    predictions: Record<string, PredictionData>;
    latestPredictions: PredictionData[];
    betting: BettingState;
    user: UserState;
    theme: ThemeState;
    filters: FilterState;
    ui: {
        toasts: Array<{
            id: string;
            type: "success" | "error" | "warning" | "info";
            title: string;
            message: string;
            duration?: number;
        }>;
        loading: Record<string, boolean>;
        modals: Record<string, boolean>;
    };
    actions: {
        updatePrediction: (eventId: string, prediction: PredictionData) => void;
        getPrediction: (eventId: string) => PredictionData | undefined;
        clearPredictions: () => void;
        addBet: (bet: Omit<Bet, "id" | "timestamp">) => void;
        updateBetStatus: (betId: string, status: Bet["status"]) => void;
        addOpportunity: (opportunity: BettingOpportunity) => void;
        removeOpportunity: (opportunityId: string) => void;
        updateBankroll: (amount: number) => void;
        setBettingLoading: (loading: boolean) => void;
        setBettingError: (error: string | null) => void;
        setUser: (user: any) => void;
        updatePreferences: (preferences: Partial<UserState["preferences"]>) => void;
        updateSettings: (settings: Record<string, any>) => void;
        setTheme: (theme: Partial<ThemeState>) => void;
        toggleTheme: () => void;
        setFilters: (filters: Partial<FilterState>) => void;
        clearFilters: () => void;
        addToast: (toast: Omit<UnifiedStore["ui"]["toasts"][0], "id">) => void;
        removeToast: (id: string) => void;
        setLoading: (key: string, loading: boolean) => void;
        setModal: (key: string, open: boolean) => void;
    };
}
export declare const storeEventBus: EventEmitter<string | symbol, any>;
export declare const useUnifiedStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<UnifiedStore>, "setState" | "devtools"> & {
    setState(partial: UnifiedStore | Partial<UnifiedStore> | ((state: UnifiedStore) => UnifiedStore | Partial<UnifiedStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: UnifiedStore | ((state: UnifiedStore) => UnifiedStore), replace: true, action?: (string | {
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
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UnifiedStore, {
            user: UserState;
            theme: ThemeState;
            filters: FilterState;
            betting: {
                bankroll: number;
                bets: Bet[];
            };
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UnifiedStore) => void) => () => void;
        onFinishHydration: (fn: (state: UnifiedStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UnifiedStore, {
            user: UserState;
            theme: ThemeState;
            filters: FilterState;
            betting: {
                bankroll: number;
                bets: Bet[];
            };
        }>>;
    };
}>;
export declare const usePredictions: () => {
    predictions: Record<string, PredictionData>;
    latestPredictions: PredictionData[];
    updatePrediction: (eventId: string, prediction: PredictionData) => void;
    getPrediction: (eventId: string) => PredictionData | undefined;
    clearPredictions: () => void;
};
export declare const useBetting: () => {
    addBet: (bet: Omit<Bet, "id" | "timestamp">) => void;
    updateBetStatus: (betId: string, status: Bet["status"]) => void;
    addOpportunity: (opportunity: BettingOpportunity) => void;
    removeOpportunity: (opportunityId: string) => void;
    updateBankroll: (amount: number) => void;
    setBettingLoading: (loading: boolean) => void;
    setBettingError: (error: string | null) => void;
    bets: Bet[];
    activeBets: Bet[];
    opportunities: BettingOpportunity[];
    bankroll: number;
    isLoading: boolean;
    error: string | null;
};
export declare const useUser: () => {
    setUser: (user: any) => void;
    updatePreferences: (preferences: Partial<UserState["preferences"]>) => void;
    updateSettings: (settings: Record<string, any>) => void;
    user: any | null;
    preferences: {
        minConfidence: number;
        maxRiskPerBet: number;
        bankrollPercentage: number;
        autoRefresh: boolean;
        notifications: boolean;
    };
    settings: Record<string, any>;
};
export declare const useTheme: () => {
    setTheme: (theme: Partial<ThemeState>) => void;
    toggleTheme: () => void;
    mode: "light" | "dark";
    primaryColor: string;
    accentColor: string;
};
export declare const useFilters: () => {
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    sport: string | null;
    confidence: [number, number];
    riskLevel: "low" | "medium" | "high" | null;
    timeRange: string;
    search: string;
};
export declare const useUI: () => {
    addToast: (toast: Omit<UnifiedStore["ui"]["toasts"][0], "id">) => void;
    removeToast: (id: string) => void;
    setLoading: (key: string, loading: boolean) => void;
    setModal: (key: string, open: boolean) => void;
    toasts: Array<{
        id: string;
        type: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
        duration?: number;
    }>;
    loading: Record<string, boolean>;
    modals: Record<string, boolean>;
};
export type { PredictionData, BettingState, Bet, BettingOpportunity, ThemeState, UserState, FilterState, UnifiedStore, };
