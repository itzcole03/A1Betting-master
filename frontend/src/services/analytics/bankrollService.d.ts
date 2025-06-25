import type { Transaction, BankrollSettings, BankrollStats } from '../../types/bankroll';
declare class BankrollService {
    private static _instance;
    private transactions;
    private settings;
    private stats;
    private constructor();
    static getInstance(): BankrollService;
    addTransaction(tx: Transaction): void;
    getTransactions(): Transaction[];
    getSettings(): BankrollSettings;
    updateSettings(newSettings: Partial<BankrollSettings>): void;
    getStats(): BankrollStats;
    private recalculateStats;
    reset(): void;
}
export declare const bankrollService: BankrollService;
export {};
