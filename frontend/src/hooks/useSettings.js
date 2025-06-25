import { useState, useEffect } from 'react';
const defaultSettings = {
    darkMode: false,
    useMocks: false,
    logLevel: 'info',
};
export const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });
    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);
    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };
    return { settings, updateSettings };
};
