interface UserPreferences {
    theme: "light" | "dark" | "system";
    notifications: {
        enabled: boolean;
        sound: boolean;
        desktop: boolean;
        email: boolean;
        bettingAlerts: boolean;
        predictionUpdates: boolean;
        oddsChanges: boolean;
    };
    display: {
        oddsFormat: "decimal" | "fractional" | "american";
        timezone: string;
        dateFormat: string;
        currency: string;
        showLiveOdds: boolean;
        showPredictionConfidence: boolean;
        showRiskIndicators: boolean;
    };
    betting: {
        defaultStake: number;
        maxStake: number;
        autoConfirm: boolean;
        showArbitrage: boolean;
        showValueBets: boolean;
        riskProfile: "conservative" | "moderate" | "aggressive";
    };
    analytics: {
        refreshInterval: number;
        metricsWindow: "day" | "week" | "month" | "year";
        showAdvancedMetrics: boolean;
        exportFormat: "csv" | "json" | "excel";
    };
}
interface AppSettings {
    apiUrl: string;
    websocketUrl: string;
    environment: "development" | "staging" | "production";
    debug: boolean;
    maintenance: boolean;
    version: string;
}
declare class UnifiedSettingsService {
    private static instance;
    private preferences;
    private settings;
    private readonly STORAGE_KEY;
    protected constructor();
    static getInstance(): UnifiedSettingsService;
    private loadPreferences;
    private loadSettings;
    private getDefaultPreferences;
    getPreferences(): UserPreferences;
    getSettings(): AppSettings;
    updatePreferences(updates: Partial<UserPreferences>): void;
    updateSettings(updates: Partial<AppSettings>): void;
    private savePreferences;
    private notifySettingsChange;
    resetPreferences(): void;
    exportPreferences(): string;
    importPreferences(json: string): boolean;
    isMaintenanceMode(): boolean;
    getVersion(): string;
    isDebugMode(): boolean;
}
export default UnifiedSettingsService;
