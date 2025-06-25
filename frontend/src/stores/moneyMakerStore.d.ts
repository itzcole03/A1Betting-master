export declare const useMoneyMakerStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<any>, "setState" | "devtools"> & {
    setState(partial: any, replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: any, replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<any, {
            config: any;
            metrics: any;
            filters: any;
            sort: any;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: any) => void) => () => void;
        onFinishHydration: (fn: (state: any) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<any, {
            config: any;
            metrics: any;
            filters: any;
            sort: any;
        }>>;
    };
}>;
