type ThemeMode = 'light' | 'dark' | 'system';
export declare function useTheme(): {
    mode: ThemeMode;
    theme: "light" | "dark";
    setThemeMode: (newMode: ThemeMode) => void;
};
export {};
