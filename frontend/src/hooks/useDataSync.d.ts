interface SyncOptions<T> {
    key: string;
    initialData: T;
    onSync?: (data: T) => Promise<T>;
    syncInterval?: number;
    retryAttempts?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
}
export declare function useDataSync<T>({ key, initialData, onSync, syncInterval, retryAttempts, retryDelay, onError }: SyncOptions<T>): {
    update: (updater: (prev: T) => T) => void;
    sync: (retryCount?: number) => Promise<void>;
    reset: () => void;
    data: T;
    isSyncing: boolean;
    lastSynced: Date | null;
    error: Error | null;
    pendingChanges: boolean;
};
export {};
