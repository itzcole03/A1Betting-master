import { Theme } from '@mui/material/styles';
declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            maxWidth: number;
            headerHeight: number;
            sidebarWidth: number;
            borderRadius: number;
            transition: string;
        };
    }
    interface ThemeOptions {
        custom?: {
            maxWidth: number;
            headerHeight: number;
            sidebarWidth: number;
            borderRadius: number;
            transition: string;
        };
    }
}
export declare const createTheme: (mode?: "light" | "dark") => Theme;
export declare const useTheme: () => Theme;
