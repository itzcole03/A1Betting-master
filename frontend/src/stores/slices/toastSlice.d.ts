import { StateCreator } from 'zustand';
import { Toast } from '@/types';
export interface ToastSlice {
    toasts: Toast[];
    addToast: (type: Toast['type'], message: string) => void;
    removeToast: (id: string) => void;
}
export declare const createToastSlice: StateCreator<ToastSlice>;
