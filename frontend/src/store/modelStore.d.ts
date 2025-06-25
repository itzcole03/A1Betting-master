export interface Model {
    id: string;
    name: string;
    description?: string;
    version?: string;
}
interface ModelState {
    activeModel: string;
    modelOptions: Model[];
    setActiveModel: (modelId: string) => void;
    addModel: (model: Model) => void;
    removeModel: (modelId: string) => void;
}
export declare const useModelStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ModelState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ModelState, {
            activeModel: string;
            modelOptions: Model[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ModelState) => void) => () => void;
        onFinishHydration: (fn: (state: ModelState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ModelState, {
            activeModel: string;
            modelOptions: Model[];
        }>>;
    };
}>;
export {};
