export class UnifiedCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    }
    static getInstance() {
        if (!UnifiedCache.instance) {
            UnifiedCache.instance = new UnifiedCache();
        }
        return UnifiedCache.instance;
    }
    set(key, value, ttl = this.defaultTTL) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl,
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return false;
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    getSize() {
        return this.cache.size;
    }
    getKeys() {
        return Array.from(this.cache.keys());
    }
    setDefaultTTL(ttl) {
        this.defaultTTL = ttl;
    }
}
