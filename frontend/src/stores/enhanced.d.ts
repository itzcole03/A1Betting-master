export interface UserStateData {
    id: string;
    name: string;
    email: string;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}
export interface UserState {
    data: UserStateData;
    validation: {
        isValid: boolean;
        errors: string[];
    };
    metrics: {
        updateCount: number;
        errorCount: number;
        lastUpdate: string | null;
    };
}
export interface UserStore extends UserState {
    setState: (updater: (state: UserState) => UserState) => void;
}
export declare const useUserStore: import("zustand").UseBoundStore<Omit<Omit<Omit<import("zustand").StoreApi<UserStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UserStore, {
            data: UserStateData;
            version: string;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UserStore) => void) => () => void;
        onFinishHydration: (fn: (state: UserStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UserStore, {
            data: UserStateData;
            version: string;
        }>>;
    };
}, "setState" | "devtools"> & {
    setState(partial: UserStore | Partial<UserStore> | ((state: UserStore) => UserStore | Partial<UserStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: UserStore | ((state: UserStore) => UserStore), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "setState"> & {
    setState(nextStateOrUpdater: UserStore | Partial<UserStore> | ((state: import("immer").WritableDraft<UserStore>) => void), shouldReplace?: false, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(nextStateOrUpdater: UserStore | ((state: import("immer").WritableDraft<UserStore>) => void), shouldReplace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}>;
