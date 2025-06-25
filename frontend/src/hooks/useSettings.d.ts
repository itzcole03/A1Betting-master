interface Settings {
    darkMode: boolean;
    useMocks: boolean;
    logLevel: 'debug' | 'info' | 'warning' | 'error';
}
export declare const useSettings: () => {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
};
export {};
