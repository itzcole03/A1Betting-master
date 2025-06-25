import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../providers/SafeThemeProvider";
import { useBettingSettings } from "./useBettingSettings";
import { useSettings } from "./useSettings";

export interface UltimateSettingsState {
  // Account & Profile
  account: {
    name: string;
    email: string;
    phone: string;
    timezone: string;
    language: string;
    currency: string;
    subscriptionTier: string;
    twoFactorEnabled: boolean;
  };

  // Betting Preferences
  betting: {
    riskProfile: "conservative" | "medium" | "aggressive" | "custom";
    defaultStake: number;
    maxStake: number;
    minStake: number;
    kellyMultiplier: number;
    autoHedging: boolean;
    followMLRecommendations: boolean;
    confidenceThreshold: number;
    maxDailyLoss: number;
    maxExposure: number;
    excludedSports: string[];
    favoriteBookmakers: string[];
  };

  // Appearance & Display
  appearance: {
    theme: string;
    colorScheme: "light" | "dark" | "auto";
    compactMode: boolean;
    showAnimations: boolean;
    oddsFormat: "decimal" | "american" | "fractional";
    chartStyle: "modern" | "classic" | "minimal";
    dashboardLayout: string;
    sidebarCollapsed: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };

  // Notifications & Alerts
  notifications: {
    betAlerts: boolean;
    priceChanges: boolean;
    dailyReports: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    promotions: boolean;
    systemUpdates: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };

  // Privacy & Security
  privacy: {
    shareStats: boolean;
    publicProfile: boolean;
    dataCollection: boolean;
    analyticsOptIn: boolean;
    marketingOptIn: boolean;
    thirdPartySharing: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    ipWhitelist: string[];
  };

  // Analytics & Data
  analytics: {
    enabledSources: string[];
    refreshInterval: number;
    cacheEnabled: boolean;
    cacheDuration: number;
    dataRetention: number;
    exportFormat: "json" | "csv" | "xml";
    autoBackup: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
  };

  // Automation & AI
  automation: {
    autoExecute: boolean;
    autoExecuteThreshold: number;
    maxAutoStake: number;
    enableAI: boolean;
    aiModel: string;
    smartAlerts: boolean;
    adaptiveBetting: boolean;
    riskManagement: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
  };

  // System & Performance
  system: {
    performanceMode: "performance" | "balanced" | "power-saver";
    memoryUsage: "low" | "normal" | "high";
    networkOptimization: boolean;
    offlineMode: boolean;
    debugMode: boolean;
    logLevel: "error" | "warn" | "info" | "debug";
    maxLogSize: number;
    autoUpdate: boolean;
    preloadData: boolean;
  };
}

const DEFAULT_SETTINGS: UltimateSettingsState = {
  account: {
    name: "Pro Bettor",
    email: "pro@a1betting.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en",
    currency: "USD",
    subscriptionTier: "Premium",
    twoFactorEnabled: true,
  },

  betting: {
    riskProfile: "medium",
    defaultStake: 50,
    maxStake: 500,
    minStake: 5,
    kellyMultiplier: 0.25,
    autoHedging: false,
    followMLRecommendations: true,
    confidenceThreshold: 0.75,
    maxDailyLoss: 1000,
    maxExposure: 2500,
    excludedSports: [],
    favoriteBookmakers: ["DraftKings", "FanDuel", "BetMGM"],
  },

  appearance: {
    theme: "cyber-light",
    colorScheme: "light",
    compactMode: false,
    showAnimations: true,
    oddsFormat: "decimal",
    chartStyle: "modern",
    dashboardLayout: "default",
    sidebarCollapsed: false,
    highContrast: false,
    reduceMotion: false,
  },

  notifications: {
    betAlerts: true,
    priceChanges: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
    promotions: true,
    systemUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
  },

  privacy: {
    shareStats: false,
    publicProfile: false,
    dataCollection: true,
    analyticsOptIn: true,
    marketingOptIn: false,
    thirdPartySharing: false,
    sessionTimeout: 120,
    loginAlerts: true,
    ipWhitelist: [],
  },

  analytics: {
    enabledSources: ["espn", "sportradar", "prizepicks"],
    refreshInterval: 300,
    cacheEnabled: true,
    cacheDuration: 3600,
    dataRetention: 365,
    exportFormat: "json",
    autoBackup: true,
    backupFrequency: "weekly",
  },

  automation: {
    autoExecute: false,
    autoExecuteThreshold: 0.9,
    maxAutoStake: 100,
    enableAI: true,
    aiModel: "ensemble",
    smartAlerts: true,
    adaptiveBetting: true,
    riskManagement: true,
    stopLoss: true,
    takeProfit: true,
  },

  system: {
    performanceMode: "balanced",
    memoryUsage: "normal",
    networkOptimization: true,
    offlineMode: false,
    debugMode: false,
    logLevel: "info",
    maxLogSize: 100,
    autoUpdate: true,
    preloadData: true,
  },
};

export const useUltimateSettings = () => {
  const { theme, isDark, toggleDarkMode, variant: themeVariant } = useTheme();
  const { settings: bettingSettings, updateSettings: updateBettingSettings } =
    useBettingSettings();
  const { settings: appSettings, updateSettings: updateAppSettings } =
    useSettings();

  const [settings, setSettings] = useState<UltimateSettingsState>(() => {
    try {
      const saved = localStorage.getItem("ultimateSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all properties exist
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Ensure nested objects are merged properly
          account: { ...DEFAULT_SETTINGS.account, ...parsed.account },
          betting: { ...DEFAULT_SETTINGS.betting, ...parsed.betting },
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...parsed.notifications,
            quietHours: {
              ...DEFAULT_SETTINGS.notifications.quietHours,
              ...parsed.notifications?.quietHours,
            },
          },
          privacy: { ...DEFAULT_SETTINGS.privacy, ...parsed.privacy },
          analytics: { ...DEFAULT_SETTINGS.analytics, ...parsed.analytics },
          automation: { ...DEFAULT_SETTINGS.automation, ...parsed.automation },
          system: { ...DEFAULT_SETTINGS.system, ...parsed.system },
        };
      }
    } catch (error) {
      console.warn("Failed to load settings from localStorage:", error);
    }
    return DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync appearance settings with theme provider
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: themeVariant,
        colorScheme: isDark ? "dark" : "light",
      },
    }));
  }, [themeVariant, isDark]);

  const updateSetting = useCallback(
    (section: keyof UltimateSettingsState, key: string, value: any) => {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const updateSection = useCallback(
    (section: keyof UltimateSettingsState, updates: Partial<any>) => {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...updates,
        },
      }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem("ultimateSettings", JSON.stringify(settings));

      // Sync with existing hooks/services
      if (updateBettingSettings) {
        await updateBettingSettings(settings.betting);
      }

      if (updateAppSettings) {
        await updateAppSettings({
          darkMode: isDark,
          ...settings.appearance,
        });
      }

      // Apply theme changes
      if (settings.appearance.colorScheme !== (isDark ? "dark" : "light")) {
        toggleDarkMode();
      }

      setHasUnsavedChanges(false);
      return { success: true };
    } catch (error) {
      console.error("Failed to save settings:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [
    settings,
    updateBettingSettings,
    updateAppSettings,
    isDark,
    toggleDarkMode,
  ]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(true);
  }, []);

  const resetSection = useCallback((section: keyof UltimateSettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [section]: DEFAULT_SETTINGS[section],
    }));
    setHasUnsavedChanges(true);
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `a1betting-settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  const importSettings = useCallback(
    (jsonString: string) => {
      try {
        const imported = JSON.parse(jsonString);
        // Validate the structure
        if (typeof imported === "object" && imported !== null) {
          // Merge with current settings to avoid missing properties
          const mergedSettings = {
            ...settings,
            ...imported,
            // Ensure nested objects are properly merged
            account: { ...settings.account, ...imported.account },
            betting: { ...settings.betting, ...imported.betting },
            appearance: { ...settings.appearance, ...imported.appearance },
            notifications: {
              ...settings.notifications,
              ...imported.notifications,
              quietHours: {
                ...settings.notifications.quietHours,
                ...imported.notifications?.quietHours,
              },
            },
            privacy: { ...settings.privacy, ...imported.privacy },
            analytics: { ...settings.analytics, ...imported.analytics },
            automation: { ...settings.automation, ...imported.automation },
            system: { ...settings.system, ...imported.system },
          };

          setSettings(mergedSettings);
          setHasUnsavedChanges(true);
          return { success: true };
        } else {
          throw new Error("Invalid settings format");
        }
      } catch (error) {
        console.error("Failed to import settings:", error);
        return { success: false, error: error.message };
      }
    },
    [settings],
  );

  return {
    settings,
    updateSetting,
    updateSection,
    saveSettings,
    resetSettings,
    resetSection,
    exportSettings,
    importSettings,
    isLoading,
    hasUnsavedChanges,

    // Convenience getters for common settings
    get isDarkMode() {
      return settings.appearance.colorScheme === "dark";
    },

    get currentTheme() {
      return settings.appearance.theme;
    },

    get riskProfile() {
      return settings.betting.riskProfile;
    },

    get notificationsEnabled() {
      return (
        settings.notifications.emailNotifications ||
        settings.notifications.pushNotifications
      );
    },
  };
};

export default useUltimateSettings;
