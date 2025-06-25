import { BaseService } from './BaseService';
import { UnifiedServiceRegistry } from './UnifiedServiceRegistry';
export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    currency: string;
    notifications: {
        enabled: boolean;
        sound: boolean;
        vibration: boolean;
    };
    display: {
        compactMode: boolean;
        showAnimations: boolean;
        fontSize: number;
    };
    performance: {
        cacheEnabled: boolean;
        cacheDuration: number;
        maxConcurrentRequests: number;
    };
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
        passwordExpiry: number;
    };
}
export declare class UnifiedSettingsService extends BaseService {
    private static instance;
    private readonly errorService;
    private settings;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedSettingsService;
    getSettings(): AppSettings;
    updateSettings(updates: Partial<AppSettings>): void;
    resetSettings(): void;
    subscribe(callback: (settings: AppSettings) => void): () => void;
    private loadSettings;
    private saveSettings;
    private getDefaultSettings;
    getSettingValue<T>(key: string): T | undefined;
    setSettingValue<T>(key: string, value: T): void;
    /**
     * Safely get a nested value from an object using a dot-separated path.
     */
    private getNestedValue;
    /**
     * Safely set a nested value in an object using a dot-separated path.
     */
    private setNestedValue;
    exportSettings(): string;
}
