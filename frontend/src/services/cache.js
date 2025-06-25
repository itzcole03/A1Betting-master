import { logger } from './logger';
class CacheServiceImpl {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    }
    static getInstance() {
        if (!CacheServiceImpl.instance) {
            CacheServiceImpl.instance = new CacheServiceImpl();
        }
        return CacheServiceImpl.instance;
    }
    async get(key) {
        try {
            const item = this.cache.get(key);
            if (!item) {
                return null;
            }
            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }
            return item.value;
        }
        catch (error) {
            logger.error('Cache get error', { error, key });
            return null;
        }
    }
    async set(key, value, ttl = this.defaultTTL) {
        try {
            const expiry = Date.now() + ttl;
            this.cache.set(key, { value, expiry });
        }
        catch (error) {
            logger.error('Cache set error', { error, key });
        }
    }
    async delete(key) {
        try {
            this.cache.delete(key);
        }
        catch (error) {
            logger.error('Cache delete error', { error, key });
        }
    }
    async clear() {
        try {
            this.cache.clear();
        }
        catch (error) {
            logger.error('Cache clear error', { error });
        }
    }
    // Helper method to clean expired items
    cleanExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }
}
export const cache = CacheServiceImpl.getInstance();
export default cache;
