import { RiskProfile, RiskProfileType } from '@/types/betting';
interface RiskState {
    currentProfile: RiskProfile;
    bankroll: number;
    updateRiskProfile: (updates: Partial<RiskProfile>) => void;
    updateBankroll: (amount: number) => void;
    getMaxStake: () => number;
    getRiskAdjustedStake: (baseStake: number) => number;
    setProfileType: (type: RiskProfileType) => void;
}
export declare const useRiskProfileStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<RiskState>, "setState" | "devtools"> & {
    setState(partial: RiskState | Partial<RiskState> | ((state: RiskState) => RiskState | Partial<RiskState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: RiskState | ((state: RiskState) => RiskState), replace: true, action?: (string | {
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
