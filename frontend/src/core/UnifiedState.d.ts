/**
 * UnifiedState
 *
 * Manages critical, low-level, cross-cutting global application state that may not fit
 * directly into Zustand stores, or is more tightly coupled with the operational state
 * of the core engines.
 *
 * ⚠️ Use with caution. Most UI-related and data-cache state should reside in Zustand stores (`useAppStore`).
 * This store is intended for specific, non-reactive or engine-internal states if absolutely necessary.
 *
 * Examples of potential use (if not handled elsewhere):
 * - System-wide flags (e.g., 'MAINTENANCE_MODE', 'INITIAL_LOAD_COMPLETE')
 * - Core engine operational status (e.g., 'PredictionEngine_STATUS: ready | degraded')
 * - Singleton service readiness flags
 */
interface CriticalStateStore {
    [key: string]: any;
}
declare class UnifiedStateSingleton {
    private state;
    constructor();
    set<T>(key: string, value: T): void;
    get<T>(key: string, defaultValue?: T): T | undefined;
    remove(key: string): void;
    getAll(): Readonly<CriticalStateStore>;
    clearAll(): void;
}
export declare const unifiedState: UnifiedStateSingleton;
export {};
