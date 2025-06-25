// simulationSlice.ts
// Zustand slice for bet simulation input/result state
import { create } from 'zustand';
export const useSimulationStore = create((set) => ({
    input: null,
    setInput: (input) => set({ input }),
    result: null,
    setResult: (result) => set({ result }),
    clear: () => set({ input: null, result: null }),
}));
