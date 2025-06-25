import React from 'react';
interface ThemeContextType {
    isDark: boolean;
    toggle: () => void;
}
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
