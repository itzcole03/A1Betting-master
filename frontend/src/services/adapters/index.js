import { prizePicksAdapter } from './prizepicks';
// Unified adapter manager
class AdapterManager {
    constructor() {
        this.adapters = new Map();
        this.initializeAdapters();
    }
    static getInstance() {
        if (!AdapterManager.instance) {
            AdapterManager.instance = new AdapterManager();
        }
        return AdapterManager.instance;
    }
    initializeAdapters() {
        this.adapters.set('prizepicks', prizePicksAdapter);
    }
    getAdapter(name) {
        return this.adapters.get(name);
    }
    registerAdapter(name, adapter) {
        this.adapters.set(name, adapter);
    }
    isAdapterEnabled(name) {
        return this.adapters.has(name);
    }
}
export const adapterManager = AdapterManager.getInstance();
export default adapterManager;
