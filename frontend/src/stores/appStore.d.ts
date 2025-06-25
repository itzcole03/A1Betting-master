interface AppState {
    user: string | null;
    setUser: (user: string | null) => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};
