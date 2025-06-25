import { Bet, BetSlip, Odds, Sport, Event } from '@/types/betting';
interface BettingState {
    activeBets: Bet[];
    betSlip: BetSlip;
    selectedSport: Sport | null;
    selectedEvent: Event | null;
    odds: Record<string, Odds>;
    addBet: (bet: Bet) => void;
    removeBet: (betId: string) => void;
    updateOdds: (eventId: string, odds: Odds) => void;
    selectSport: (sport: Sport) => void;
    selectEvent: (event: Event) => void;
    clearBetSlip: () => void;
    updateBetAmount: (betId: string, amount: number) => void;
}
export declare const useBettingStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<BettingState>, "setState" | "devtools"> & {
    setState(partial: BettingState | Partial<BettingState> | ((state: BettingState) => BettingState | Partial<BettingState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: BettingState | ((state: BettingState) => BettingState), replace: true, action?: (string | {
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
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<BettingState, {
            activeBets: Bet[];
            betSlip: BetSlip;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: BettingState) => void) => () => void;
        onFinishHydration: (fn: (state: BettingState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<BettingState, {
            activeBets: Bet[];
            betSlip: BetSlip;
        }>>;
    };
}>;
export {};
