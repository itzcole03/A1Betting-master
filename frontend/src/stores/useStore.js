import { create } from 'zustand';
import { createToastSlice } from './slices/toastSlice';
export const useStore = create()((...args) => ({
    ...createToastSlice(...args),
    // Add other slices here as needed
}));
