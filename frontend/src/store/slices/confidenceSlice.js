// confidenceSlice.ts
// Zustand slice for confidence band and win probability state
import { create } from 'zustand';
export const useConfidenceStore = create((set) => ({
    prediction: null,
    setPrediction: (prediction) => set({ prediction, confidenceBand: prediction.confidenceBand, winProbability: prediction.winProbability }),
    confidenceBand: null,
    setConfidenceBand: (confidenceBand) => set({ confidenceBand }),
    winProbability: null,
    setWinProbability: (winProbability) => set({ winProbability }),
    clear: () => set({ prediction: null, confidenceBand: null, winProbability: null }),
}));
