import { StateCreator } from "zustand";
import { ParlayLeg } from "../../../../shared/betting";
import { AppStore } from "../../stores/useAppStore";
export interface BetSlipSlice {
    legs: ParlayLeg[];
    stake: number;
    potentialPayout: number;
    isSubmitting: boolean;
    error: string | null;
    addLeg: (leg: ParlayLeg) => void;
    removeLeg: (propId: string, pick: "over" | "under") => void;
    updateStake: (stake: number) => void;
    calculatePotentialPayout: () => void;
    clearSlip: () => void;
    submitSlip: () => Promise<boolean>;
}
export declare const initialBetSlipState: Pick<BetSlipSlice, "legs" | "stake" | "potentialPayout" | "isSubmitting" | "error">;
export declare const createBetSlipSlice: StateCreator<AppStore, [
], [
], BetSlipSlice>;
