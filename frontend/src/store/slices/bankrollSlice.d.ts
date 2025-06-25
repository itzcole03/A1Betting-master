import type { Transaction, BankrollSettings, BankrollStats } from '../../types/bankroll';
interface BankrollState {
    transactions: Transaction[];
    addTransaction: (tx: Transaction) => void;
    settings: BankrollSettings;
    updateSettings: (s: Partial<BankrollSettings>) => void;
    stats: BankrollStats;
    refreshStats: () => void;
    reset: () => void;
}
export declare const useBankrollStore: import("zustand").UseBoundStore<import("zustand").StoreApi<BankrollState>>;
export {};
