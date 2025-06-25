import { EngineeredFeatures, FeatureCacheConfig } from '@/types';
export declare class FeatureCache {
    private readonly config;
    private readonly logger;
    private readonly cache;
    private cleanupInterval;
    constructor(config: FeatureCacheConfig);
    private initializeCache;
    private startCleanupInterval;
    get(version: string): Promise<EngineeredFeatures | null>;
    set(version: string, features: EngineeredFeatures): Promise<void>;
    delete(version: string): Promise<void>;
    clear(): Promise<void>;
    private cleanup;
    private isExpired;
    getStats(): {
        size: number;
        maxSize: number;
        hitCount: number;
        missCount: number;
    };
    isEnabled(): boolean;
    setEnabled(enabled: boolean): void;
    getMaxSize(): number;
    setMaxSize(maxSize: number): void;
    getTTL(): number;
    setTTL(ttl: number): void;
}
