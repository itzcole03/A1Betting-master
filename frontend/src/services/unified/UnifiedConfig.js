export class UnifiedConfig {
    constructor() {
        this.config = {};
    }
    static getInstance() {
        if (!UnifiedConfig.instance) {
            UnifiedConfig.instance = new UnifiedConfig();
        }
        return UnifiedConfig.instance;
    }
    /**
     * Returns the API base URL from Vite env or config, with fallback.
     */
    getApiUrl() {
        return (this.config['api.baseUrl'] ||
            (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
            'http://localhost:8000');
    }
    get(key, defaultValue) {
        const value = this.config[key];
        if (value !== undefined)
            return value;
        if (defaultValue !== undefined)
            return defaultValue;
        throw new Error(`Configuration key "${key}" not found`);
    }
    set(key, value) {
        this.config[key] = value;
    }
    has(key) {
        return key in this.config;
    }
    delete(key) {
        delete this.config[key];
    }
    clear() {
        this.config = {};
    }
    getAll() {
        return { ...this.config };
    }
}
