import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create()(persist((set) => ({
    theme: 'system',
    setTheme: (theme) => set({ theme }),
}), {
    name: 'theme-storage', // name of the item in the storage (must be unique)
    // getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
}));
