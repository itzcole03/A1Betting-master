// src/core/UnifiedState.ts
class UnifiedStateSingleton {
    constructor() {
        this.state = {};
        // Initialize with any default critical states if necessary
        // this.state.INITIAL_LOAD_COMPLETE = false;
    }
    set(key, value) {
        //
        this.state[key] = value;
        // Note: This is NOT reactive. UI components will not automatically update.
        // If reactivity is needed, consider Zustand or an event bus.
    }
    get(key, defaultValue) {
        const value = this.state[key];
        return value !== undefined ? value : defaultValue;
    }
    remove(key) {
        //
        delete this.state[key];
    }
    getAll() {
        return Object.freeze({ ...this.state });
    }
    clearAll() {
        this.state = {};
    }
}
// Export a singleton instance
export const unifiedState = new UnifiedStateSingleton();
// // Example Usage:
// unifiedState.set('SYSTEM_MAINTENANCE_MODE', true);
// const isInMaintenance = unifiedState.get<boolean>('SYSTEM_MAINTENANCE_MODE', false);
// if (isInMaintenance) {
//   console.warn('Application is currently in maintenance mode.');
// }
