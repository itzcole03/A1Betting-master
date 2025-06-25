import type { UserBetHistoryEntry, UserPerformanceHistory, ModelPerformanceHistory } from '../../types/history';
interface BetHistoryState {
    userHistory: UserPerformanceHistory | null;
    setUserHistory: (history: UserPerformanceHistory) => void;
    addUserEntry: (entry: UserBetHistoryEntry) => void;
    modelHistory: ModelPerformanceHistory[];
    setModelHistory: (history: ModelPerformanceHistory[]) => void;
    addModelHistory: (history: ModelPerformanceHistory) => void;
    clear: () => void;
}
export declare const useBetHistoryStore: import("zustand").UseBoundStore<import("zustand").StoreApi<BetHistoryState>>;
export {};
