import { ToastSlice } from './slices/toastSlice';
interface StoreState extends ToastSlice {
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
export {};
