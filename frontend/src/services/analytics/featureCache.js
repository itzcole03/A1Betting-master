import { FeatureLogger } from './featureLogging';
export class FeatureCache {
    constructor(config) {
        this.config = config;
        this.logger = new FeatureLogger();
        this.cache = new Map();
        this.cleanupInterval = null;
        this.initializeCache();
    }
    initializeCache() {
        if (this.config.enabled) {
            this.startCleanupInterval();
            this.logger.info('Initialized feature cache');
        }
    }
    startCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
    }
    async get(version) {
        try {
            if (!this.config.enabled) {
                return null;
            }
            const entry = this.cache.get(version);
            if (!entry) {
                return null;
            }
            // Check if entry is expired
            if (this.isExpired(entry)) {
                this.cache.delete(version);
                return null;
            }
            this.logger.debug(`Cache hit for version ${version}`);
            return entry.features;
        }
        catch (error) {
            this.logger.error('Failed to get features from cache', error);
            return null;
        }
    }
    async set(version, features) {
        try {
            if (!this.config.enabled) {
                return;
            }
            const entry = {
                features,
                timestamp: Date.now(),
                version,
            };
            this.cache.set(version, entry);
            this.logger.debug(`Cached features for version ${version}`);
            // Check if cache size exceeds limit
            if (this.cache.size > this.config.maxSize) {
                this.cleanup();
            }
        }
        catch (error) {
            this.logger.error('Failed to cache features', error);
        }
    }
    async delete(version) {
        try {
            this.cache.delete(version);
            this.logger.debug(`Removed version ${version} from cache`);
        }
        catch (error) {
            this.logger.error('Failed to delete features from cache', error);
        }
    }
    async clear() {
        try {
            this.cache.clear();
            this.logger.info('Cleared feature cache');
        }
        catch (error) {
            this.logger.error('Failed to clear feature cache', error);
        }
    }
    cleanup() {
        try {
            const now = Date.now();
            let deletedCount = 0;
            // Delete expired entries
            for (const [version, entry] of this.cache.entries()) {
                if (this.isExpired(entry)) {
                    this.cache.delete(version);
                    deletedCount++;
                }
            }
            // If still over size limit, delete oldest entries
            if (this.cache.size > this.config.maxSize) {
                const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
                const entriesToDelete = entries.slice(0, this.cache.size - this.config.maxSize);
                for (const [version] of entriesToDelete) {
                    this.cache.delete(version);
                    deletedCount++;
                }
            }
            if (deletedCount > 0) {
                this.logger.info(`Cleaned up ${deletedCount} entries from cache`);
            }
        }
        catch (error) {
            this.logger.error('Failed to cleanup cache', error);
        }
    }
    isExpired(entry) {
        const age = Date.now() - entry.timestamp;
        return age > this.config.ttl;
    }
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.config.maxSize,
            hitCount: 0, // TODO: Implement hit/miss counting
            missCount: 0,
        };
    }
    isEnabled() {
        return this.config.enabled;
    }
    setEnabled(enabled) {
        this.config.enabled = enabled;
        if (enabled) {
            this.startCleanupInterval();
        }
        else if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
    getMaxSize() {
        return this.config.maxSize;
    }
    setMaxSize(maxSize) {
        this.config.maxSize = maxSize;
        if (this.cache.size > maxSize) {
            this.cleanup();
        }
    }
    getTTL() {
        return this.config.ttl;
    }
    setTTL(ttl) {
        this.config.ttl = ttl;
        this.cleanup(); // Clean up expired entries with new TTL
    }
}
