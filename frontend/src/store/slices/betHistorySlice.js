// betHistorySlice.ts
// Zustand slice for user/model bet history state
import { create } from 'zustand';
export const useBetHistoryStore = create((set) => ({
    userHistory: null,
    setUserHistory: (history) => set({ userHistory: history }),
    addUserEntry: (entry) => set((state) => state.userHistory ? { userHistory: { ...state.userHistory, entries: [...state.userHistory.entries, entry] } } : {}),
    modelHistory: [],
    setModelHistory: (history) => set({ modelHistory: history }),
    addModelHistory: (history) => set((state) => ({ modelHistory: [...state.modelHistory, history] })),
    clear: () => set({ userHistory: null, modelHistory: [] }),
}));
