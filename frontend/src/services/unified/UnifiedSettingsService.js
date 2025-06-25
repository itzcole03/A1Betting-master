import { BaseService } from './BaseService';
import { UnifiedErrorService } from './UnifiedErrorService';
export class UnifiedSettingsService extends BaseService {
    constructor(registry) {
        super('settings', registry);
        this.errorService = UnifiedErrorService.getInstance(registry);
        this.settings = this.loadSettings();
    }
    static getInstance(registry) {
        if (!UnifiedSettingsService.instance) {
            UnifiedSettingsService.instance = new UnifiedSettingsService(registry);
        }
        return UnifiedSettingsService.instance;
    }
    getSettings() {
        return { ...this.settings };
    }
    updateSettings(updates) {
        try {
            const previousSettings = { ...this.settings };
            this.settings = { ...this.settings, ...updates };
            this.saveSettings();
            this.serviceRegistry.emit('settings:updated', {
                previousSettings,
                currentSettings: this.settings,
                updates,
            });
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'updateSettings', updates },
            });
            throw error;
        }
    }
    resetSettings() {
        try {
            const previousSettings = { ...this.settings };
            this.settings = this.getDefaultSettings();
            this.saveSettings();
            this.serviceRegistry.emit('settings:reset', {
                previousSettings,
                currentSettings: this.settings,
            });
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'resetSettings' },
            });
            throw error;
        }
    }
    subscribe(callback) {
        const handler = (event) => {
            callback(event.currentSettings);
        };
        this.serviceRegistry.on('settings:updated', handler);
        return () => this.serviceRegistry.off('settings:updated', handler);
    }
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('app_settings');
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'loadSettings' },
            });
        }
        return this.getDefaultSettings();
    }
    saveSettings() {
        try {
            localStorage.setItem('app_settings', JSON.stringify(this.settings));
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'saveSettings' },
            });
        }
    }
    getDefaultSettings() {
        return {
            theme: 'system',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateFormat: 'MM/DD/YYYY',
            numberFormat: 'en-US',
            currency: 'USD',
            notifications: {
                enabled: true,
                sound: true,
                vibration: true,
            },
            display: {
                compactMode: false,
                showAnimations: true,
                fontSize: 16,
            },
            performance: {
                cacheEnabled: true,
                cacheDuration: 300,
                maxConcurrentRequests: 5,
            },
            security: {
                twoFactorEnabled: false,
                sessionTimeout: 3600,
                passwordExpiry: 90,
            },
        };
    }
    getSettingValue(key) {
        return this.getNestedValue(this.settings, key);
    }
    setSettingValue(key, value) {
        try {
            const previousValue = this.getNestedValue(this.settings, key);
            this.setNestedValue(this.settings, key, value);
            this.saveSettings();
            this.serviceRegistry.emit('settings:updated', {
                previousSettings: { ...this.settings, [key]: previousValue },
                currentSettings: this.settings,
                updates: { [key]: value },
            });
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'setSettingValue', key, value },
            });
            throw error;
        }
    }
    /**
     * Safely get a nested value from an object using a dot-separated path.
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => typeof current === 'object' && current !== null && key in current ? current[key] : undefined, obj);
    }
    /**
     * Safely set a nested value in an object using a dot-separated path.
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = obj;
        for (const key of keys) {
            if (!(key in target) || typeof target[key] !== 'object' || target[key] === null) {
                target[key] = {};
            }
            target = target[key];
        }
        target[lastKey] = value;
    }
    exportSettings() {
        try {
            return JSON.stringify(this.settings, null, 2);
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'SETTINGS_ERROR',
                source: 'UnifiedSettingsService',
                details: { method: 'exportSettings' },
            });
            throw error;
        }
    }
}
