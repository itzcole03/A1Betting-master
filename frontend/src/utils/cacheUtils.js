export class Cache {
    constructor(config) {
        this.cache = new Map();
        this.config = config;
    }
    set(key, value) {
        // Clean up if we're at max size
        if (this.config.maxSize && this.cache.size >= this.config.maxSize) {
            this.cleanup();
        }
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        // Check if entry has expired
        if (Date.now() - entry.timestamp > this.config.ttl) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.data;
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return false;
        // Check if entry has expired
        if (Date.now() - entry.timestamp > this.config.ttl) {
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
    cleanup() {
        const now = Date.now();
        // Remove expired entries
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.config.ttl) {
                this.cache.delete(key);
            }
        }
        // If still over max size, remove oldest entries
        if (this.config.maxSize && this.cache.size >= this.config.maxSize) {
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            const entriesToRemove = entries.slice(0, entries.length - this.config.maxSize);
            for (const [key] of entriesToRemove) {
                this.cache.delete(key);
            }
        }
    }
    size() {
        return this.cache.size;
    }
}
// Create a decorator for caching async method results
export function cached(ttl, maxSize) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const cache = new Cache({ ttl, maxSize });
        descriptor.value = async function (...args) {
            const key = `${propertyKey}:${JSON.stringify(args)}`;
            const cachedResult = cache.get(key);
            if (cachedResult !== undefined) {
                return cachedResult;
            }
            const result = await originalMethod.apply(this, args);
            cache.set(key, result);
            return result;
        };
        return descriptor;
    };
}
