import { useState, useEffect } from 'react';
export function useTheme() {
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [mode, setMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme-mode');
            if (saved === 'light' || saved === 'dark' || saved === 'system')
                return saved;
            return 'system';
        }
        return 'system';
    });
    const [resolvedTheme, setResolvedTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            if (mode === 'system')
                return getSystemTheme();
            return mode;
        }
        return 'light';
    });
    useEffect(() => {
        if (mode === 'system') {
            const updateSystemTheme = () => setResolvedTheme(getSystemTheme());
            updateSystemTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSystemTheme);
            return () => {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateSystemTheme);
            };
        }
        else {
            setResolvedTheme(mode);
        }
    }, [mode]);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        localStorage.setItem('theme-mode', mode);
    }, [resolvedTheme, mode]);
    const setThemeMode = (newMode) => setMode(newMode);
    return {
        mode, // 'light' | 'dark' | 'system'
        theme: resolvedTheme, // 'light' | 'dark'
        setThemeMode,
    };
}
