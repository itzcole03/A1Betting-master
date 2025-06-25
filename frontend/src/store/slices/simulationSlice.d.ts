import type { BetSimulationInput, BetSimulationResult } from '../../types/simulation';
interface SimulationState {
    input: BetSimulationInput | null;
    setInput: (input: BetSimulationInput) => void;
    result: BetSimulationResult | null;
    setResult: (result: BetSimulationResult) => void;
    clear: () => void;
}
export declare const useSimulationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SimulationState>>;
export {};
