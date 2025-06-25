interface PayoutData {
    potential_payout: number;
    kelly_stake: number;
    risk_adjusted_stake: number;
    expected_value: number;
}
interface BetSelection {
    eventId: string;
    odds: number;
    probability: number;
    stake?: number;
}
interface PayoutState {
    payoutPreviews: Record<string, PayoutData>;
    updatePayoutPreview: (eventId: string, data: PayoutData) => void;
    getPayoutPreview: (eventId: string) => PayoutData | undefined;
    calculateKellyStake: (odds: number, probability: number, bankroll: number) => number;
    computeAndUpdatePayoutPreview: (selection: BetSelection, bankroll: number, riskProfile: any) => void;
}
export declare const usePayoutStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PayoutState>, "setState" | "devtools"> & {
    setState(partial: PayoutState | Partial<PayoutState> | ((state: PayoutState) => PayoutState | Partial<PayoutState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: PayoutState | ((state: PayoutState) => PayoutState), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}>;
export {};
