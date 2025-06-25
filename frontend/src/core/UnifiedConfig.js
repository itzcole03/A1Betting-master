import { EventBus } from './EventBus.js';
import { ErrorHandler } from './ErrorHandler.js'; // Added .js extension
export class UnifiedConfig {
    get errorHandler() {
        if (!this._errorHandler) {
            this._errorHandler = ErrorHandler.getInstance();
        }
        return this._errorHandler;
    }
    constructor() {
        this.eventBus = EventBus.getInstance();
        // this.errorHandler = ErrorHandler.getInstance(); // Use lazy getter
        this.config = new Map();
        this.defaultConfig = {
            websocket: {
                url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
                reconnectAttempts: 5,
                reconnectDelay: 1000,
                pingInterval: 30000,
            },
            api: {
                baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
                timeout: 30000,
                retryAttempts: 3,
            },
            prediction: {
                confidenceThreshold: 0.7,
                updateInterval: 5000,
                maxPredictions: 100,
            },
            risk: {
                defaultProfile: 'moderate',
                maxExposure: 0.2,
                stopLoss: 0.1,
            },
            features: {
                enablePvPModel: { enabled: true },
                enablePlayerFormModel: { enabled: true },
                enableVenueEffectModel: { enabled: true },
                enableRefereeImpactModel: { enabled: true },
                enableLineupSynergyModel: { enabled: true },
                enableNews: { enabled: true },
                enableWeather: { enabled: true },
                enableInjuries: { enabled: true },
                enableAnalytics: { enabled: true },
                enableSocialSentiment: { enabled: true },
            }
        };
        this.initialize();
    }
    static getInstance() {
        if (!UnifiedConfig.instance) {
            UnifiedConfig.instance = new UnifiedConfig();
        }
        return UnifiedConfig.instance;
    }
    initialize() {
        try {
            // Load config from localStorage if available
            const savedConfig = localStorage.getItem('app_config');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    Object.entries(parsed).forEach(([key, value]) => {
                        this.config.set(key, value);
                    });
                }
            }
            // Set defaults for missing values
            if (this.defaultConfig && typeof this.defaultConfig === 'object' && !Array.isArray(this.defaultConfig)) {
                Object.entries(this.defaultConfig).forEach(([key, value]) => {
                    if (!this.config.has(key)) {
                        this.config.set(key, value);
                    }
                });
            }
            this.eventBus.emit('config:initialized', null);
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'high');
        }
    }
    get(key) {
        try {
            const value = this.config.get(key);
            if (value === undefined) {
                throw new Error(`Configuration key "${key}" not found`);
            }
            return value;
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'medium');
            if (this.defaultConfig &&
                typeof this.defaultConfig === 'object' &&
                !Array.isArray(this.defaultConfig) &&
                Object.prototype.hasOwnProperty.call(this.defaultConfig, key)) {
                return this.defaultConfig[key];
            }
            return undefined;
        }
    }
    set(key, value) {
        try {
            this.config.set(key, value);
            this.saveToStorage();
            this.eventBus.emit('config:updated', { key, value });
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'medium');
        }
    }
    update(key, updates) {
        try {
            const current = this.config.get(key);
            if (!current) {
                throw new Error(`Configuration key "${key}" not found`);
            }
            let updated;
            if (current && typeof current === 'object' && !Array.isArray(current) && updates && typeof updates === 'object' && !Array.isArray(updates)) {
                updated = { ...current, ...updates };
            }
            else {
                updated = updates;
            }
            this.config.set(key, updated);
            this.saveToStorage();
            this.eventBus.emit('config:updated', { key, value: updated });
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'medium');
        }
    }
    reset(key) {
        try {
            if (key) {
                const defaultValue = this.defaultConfig[key];
                if (defaultValue) {
                    this.config.set(key, defaultValue);
                }
            }
            else {
                this.config.clear();
                if (this.defaultConfig && typeof this.defaultConfig === 'object' && !Array.isArray(this.defaultConfig)) {
                    Object.entries(this.defaultConfig).forEach(([key, value]) => {
                        this.config.set(key, value);
                    });
                }
            }
            this.saveToStorage();
            this.eventBus.emit('config:reset', { key });
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'medium');
        }
    }
    saveToStorage() {
        try {
            const configObject = Object.fromEntries(this.config);
            localStorage.setItem('app_config', JSON.stringify(configObject));
        }
        catch (error) {
            this.errorHandler.handleError(error, 'UnifiedConfig', 'medium');
        }
    }
}
// Returns the singleton instance, throws if not initialized (rare)
export function getInitializedUnifiedConfig() {
    return UnifiedConfig.getInstance();
}
