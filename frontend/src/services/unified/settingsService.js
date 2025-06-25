import { toast } from "react-toastify";
class UnifiedSettingsService {
    constructor() {
        this.STORAGE_KEY = "esa_settings";
        this.preferences = this.loadPreferences();
        this.settings = this.loadSettings();
    }
    static getInstance() {
        if (!UnifiedSettingsService.instance) {
            UnifiedSettingsService.instance = new UnifiedSettingsService();
        }
        return UnifiedSettingsService.instance;
    }
    loadPreferences() {
        try {
            const stored = localStorage.getItem(`${this.STORAGE_KEY}_preferences`);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
            console.error("Error loading preferences:", error);
        }
        return this.getDefaultPreferences();
    }
    loadSettings() {
        return {
            apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
            websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8000",
            environment: import.meta.env.VITE_ENV ||
                "development",
            debug: import.meta.env.VITE_DEBUG === "true",
            maintenance: false,
            version: import.meta.env.VITE_APP_VERSION || "1.0.0",
        };
    }
    getDefaultPreferences() {
        return {
            theme: "system",
            notifications: {
                enabled: true,
                sound: true,
                desktop: true,
                email: false,
                bettingAlerts: true,
                predictionUpdates: true,
                oddsChanges: true,
            },
            display: {
                oddsFormat: "decimal",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateFormat: "YYYY-MM-DD",
                currency: "USD",
                showLiveOdds: true,
                showPredictionConfidence: true,
                showRiskIndicators: true,
            },
            betting: {
                defaultStake: 10,
                maxStake: 1000,
                autoConfirm: false,
                showArbitrage: true,
                showValueBets: true,
                riskProfile: "moderate",
            },
            analytics: {
                refreshInterval: 30000,
                metricsWindow: "week",
                showAdvancedMetrics: false,
                exportFormat: "csv",
            },
        };
    }
    getPreferences() {
        return { ...this.preferences };
    }
    getSettings() {
        return { ...this.settings };
    }
    updatePreferences(updates) {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
        this.notifySettingsChange("preferences");
    }
    updateSettings(updates) {
        this.settings = { ...this.settings, ...updates };
        this.notifySettingsChange("settings");
    }
    savePreferences() {
        try {
            localStorage.setItem(`${this.STORAGE_KEY}_preferences`, JSON.stringify(this.preferences));
        }
        catch (error) {
            console.error("Error saving preferences:", error);
            toast.error("Failed to save preferences");
        }
    }
    notifySettingsChange(type) {
        // Dispatch a custom event that components can listen to
        const event = new CustomEvent("settingsChanged", {
            detail: {
                type,
                data: type === "preferences" ? this.preferences : this.settings,
            },
        });
        window.dispatchEvent(event);
    }
    resetPreferences() {
        this.preferences = this.getDefaultPreferences();
        this.savePreferences();
        this.notifySettingsChange("preferences");
        toast.success("Preferences reset to default values");
    }
    exportPreferences() {
        return JSON.stringify(this.preferences, null, 2);
    }
    importPreferences(json) {
        try {
            const imported = JSON.parse(json);
            this.preferences = { ...this.getDefaultPreferences(), ...imported };
            this.savePreferences();
            this.notifySettingsChange("preferences");
            toast.success("Preferences imported successfully");
            return true;
        }
        catch (error) {
            console.error("Error importing preferences:", error);
            toast.error("Failed to import preferences");
            return false;
        }
    }
    isMaintenanceMode() {
        return this.settings.maintenance;
    }
    getVersion() {
        return this.settings.version;
    }
    isDebugMode() {
        return this.settings.debug;
    }
}
UnifiedSettingsService.instance = null;
export default UnifiedSettingsService;
