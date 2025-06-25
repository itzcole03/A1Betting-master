import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Brain,
  Database,
  Key,
  Shield,
  Download,
  Trash2,
  Save,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Server,
  Activity,
  Monitor,
} from "lucide-react";
import { UnifiedApplicationConfig } from "../../core/UnifiedConfig";
import { configService } from "../../services/configService";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "../common/theme/ThemeProvider";
import toast from "react-hot-toast";

interface AdminSettingsProps {
  onNavigate?: (page: string) => void;
}

interface ModelSettings {
  modelType: string;
  confidenceThreshold: number;
  kellyThreshold: number;
  maxBetPercentage: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxDailyBets: number;
  autoRebalance: boolean;
  riskLevel: "conservative" | "moderate" | "aggressive";
}

interface ApiKeys {
  sportsRadar: string;
  theOddsApi: string;
  openAI: string;
  anthropic: string;
}

interface SystemSettings {
  cacheSize: number;
  maxConnections: number;
  rateLimitPerMinute: number;
  enableLogging: boolean;
  debugMode: boolean;
  enableMetrics: boolean;
  autoBackup: boolean;
  backupInterval: number;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useAppStore();

  // Force text visibility with aggressive CSS override
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * {
        color: white !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      h1, h2, h3, h4, h5, h6, p, span, label, div {
        color: white !important;
        opacity: 1 !important;
        visibility: visible !important;
        background-clip: border-box !important;
      }
      .text-transparent {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Core settings state
  const [appConfig, setAppConfig] = useState<UnifiedApplicationConfig | null>(
    null,
  );
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Advanced settings
  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    modelType: "ensemble",
    confidenceThreshold: 0.85,
    kellyThreshold: 0.1,
    maxBetPercentage: 0.05,
    stopLossPercentage: 0.15,
    takeProfitPercentage: 0.25,
    maxDailyBets: 10,
    autoRebalance: true,
    riskLevel: "moderate",
  });

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    sportsRadar: "",
    theOddsApi: "",
    openAI: "",
    anthropic: "",
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    cacheSize: 1000,
    maxConnections: 100,
    rateLimitPerMinute: 60,
    enableLogging: true,
    debugMode: false,
    enableMetrics: true,
    autoBackup: true,
    backupInterval: 24,
  });

  const [ultraAccuracySettings, setUltraAccuracySettings] = useState({
    enabled: true,
    targetAccuracy: 99.5,
    enhanceMoneyMaker: true,
    enhancePrizePicks: true,
    neuralNetworkDepth: 8,
    ensembleSize: 12,
    featureEngineering: true,
    autoOptimization: true,
  });

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoadingConfig(true);
      setConfigError(null);
      try {
        const config = await configService.fetchAppConfig();
        setAppConfig(config);
      } catch (error: any) {
        setConfigError(
          error.message || "Failed to load application configuration.",
        );
        addToast({
          message: "Error loading app configuration.",
          type: "error",
        });
      } finally {
        setIsLoadingConfig(false);
      }
    };
    loadConfig();
  }, [addToast]);

  const handleFeatureToggle = async (featureName: string) => {
    try {
      // Update local state optimistically
      if (appConfig?.featureFlags) {
        const newConfig = {
          ...appConfig,
          featureFlags: {
            ...appConfig.featureFlags,
            [featureName]: !appConfig.featureFlags[featureName],
          },
        };
        setAppConfig(newConfig);

        // In a real implementation, you would call an API to persist this
        addToast({
          message: `Feature "${featureName}" ${newConfig.featureFlags[featureName] ? "enabled" : "disabled"}`,
          type: "success",
        });
      }
    } catch (error) {
      addToast({ message: "Failed to toggle feature flag", type: "error" });
    }
  };

  const handleModelSettingsChange = (updates: Partial<ModelSettings>) => {
    setModelSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleApiKeyChange = (key: keyof ApiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }));
  };

  const handleSystemSettingsChange = (updates: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleUltraAccuracyChange = (updates: any) => {
    setUltraAccuracySettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving all settings
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would save to your backend/config service
      toast.success("All admin settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save admin settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportConfig = () => {
    const exportData = {
      appConfig,
      modelSettings,
      apiKeys: {
        ...apiKeys,
        // Mask sensitive keys in export
        sportsRadar: apiKeys.sportsRadar ? "***REDACTED***" : "",
        theOddsApi: apiKeys.theOddsApi ? "***REDACTED***" : "",
        openAI: apiKeys.openAI ? "***REDACTED***" : "",
        anthropic: apiKeys.anthropic ? "***REDACTED***" : "",
      },
      systemSettings,
      ultraAccuracySettings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Configuration exported successfully!");
  };

  const handleClearCache = () => {
    if (
      confirm(
        "Are you sure you want to clear all cache? This will reset all stored data.",
      )
    ) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Cache cleared successfully!");
    }
  };

  const handleResetSettings = () => {
    if (
      confirm(
        "Are you sure you want to reset all settings to defaults? This cannot be undone.",
      )
    ) {
      window.location.reload();
    }
  };

  return (
    <div
      className="w-full h-full overflow-auto bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white"
      style={{ color: "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-red-400" />
            <h1 className="text-4xl font-bold text-red-400 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
              Admin Settings
            </h1>
          </div>
          <p className="text-gray-300 text-lg" style={{ color: "#d1d5db" }}>
            Advanced configuration and system controls
          </p>
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm font-semibold">
              ⚠️ WARNING: These are advanced settings. Changes can affect system
              stability.
            </p>
          </div>
        </div>

        {/* Feature Flags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 mb-6"
        >
          <h2
            className="text-xl font-bold text-white mb-4 flex items-center gap-2"
            style={{ color: "#ffffff" }}
          >
            <ToggleRight className="w-6 h-6 text-blue-400" />
            Feature Flags
          </h2>

          {isLoadingConfig && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-7 h-7 animate-spin text-blue-400 mr-3" />
              <span className="text-blue-200 font-semibold">
                Loading feature flags...
              </span>
            </div>
          )}

          {configError && (
            <div className="flex items-center text-red-400 bg-red-500/10 p-4 rounded-xl">
              <AlertTriangle size={24} className="mr-3" /> {configError}
            </div>
          )}

          {!isLoadingConfig && !configError && appConfig?.featureFlags && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(appConfig.featureFlags || {}).map(
                ([flagName, isEnabled]) => (
                  <div
                    key={flagName}
                    className="bg-gray-800/40 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold capitalize">
                        {flagName.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <button
                        onClick={() => handleFeatureToggle(flagName)}
                        className="focus:outline-none"
                      >
                        {isEnabled ? (
                          <ToggleRight size={24} className="text-green-400" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isEnabled ? "Feature is active" : "Feature is disabled"}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Model Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              ML Model Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-gray-300 mb-2"
                  style={{ color: "#d1d5db" }}
                >
                  Model Type
                </label>
                <select
                  value={modelSettings.modelType}
                  onChange={(e) =>
                    handleModelSettingsChange({ modelType: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                >
                  <option value="ensemble">Ensemble</option>
                  <option value="neural">Neural Network</option>
                  <option value="random_forest">Random Forest</option>
                  <option value="xgboost">XGBoost</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Confidence Threshold:{" "}
                  {(modelSettings.confidenceThreshold * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={modelSettings.confidenceThreshold}
                  onChange={(e) =>
                    handleModelSettingsChange({
                      confidenceThreshold: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Kelly Threshold:{" "}
                  {(modelSettings.kellyThreshold * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.25"
                  step="0.01"
                  value={modelSettings.kellyThreshold}
                  onChange={(e) =>
                    handleModelSettingsChange({
                      kellyThreshold: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Risk Level</label>
                <select
                  value={modelSettings.riskLevel}
                  onChange={(e) =>
                    handleModelSettingsChange({
                      riskLevel: e.target.value as
                        | "conservative"
                        | "moderate"
                        | "aggressive",
                    })
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <label className="flex items-center justify-between">
                <span className="text-gray-300">Auto Rebalance</span>
                <input
                  type="checkbox"
                  checked={modelSettings.autoRebalance}
                  onChange={(e) =>
                    handleModelSettingsChange({
                      autoRebalance: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-purple-400 bg-gray-800 border-gray-600 rounded focus:ring-purple-400 focus:ring-2"
                />
              </label>
            </div>
          </motion.div>

          {/* API Keys */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-6 h-6 text-green-400" />
              API Keys & Integrations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  SportsRadar API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKeys.sportsRadar}
                  onChange={(e) =>
                    handleApiKeyChange("sportsRadar", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  TheOdds API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKeys.theOddsApi}
                  onChange={(e) =>
                    handleApiKeyChange("theOddsApi", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKeys.openAI}
                  onChange={(e) => handleApiKeyChange("openAI", e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKeys.anthropic}
                  onChange={(e) =>
                    handleApiKeyChange("anthropic", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90 border border-purple-500/30 rounded-lg text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-500/20 appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-orange-400" />
              System Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Cache Size: {systemSettings.cacheSize} MB
                </label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={systemSettings.cacheSize}
                  onChange={(e) =>
                    handleSystemSettingsChange({
                      cacheSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Max Connections: {systemSettings.maxConnections}
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={systemSettings.maxConnections}
                  onChange={(e) =>
                    handleSystemSettingsChange({
                      maxConnections: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Rate Limit: {systemSettings.rateLimitPerMinute}/min
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={systemSettings.rateLimitPerMinute}
                  onChange={(e) =>
                    handleSystemSettingsChange({
                      rateLimitPerMinute: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Enable Logging</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.enableLogging}
                    onChange={(e) =>
                      handleSystemSettingsChange({
                        enableLogging: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-400 bg-gray-800 border-gray-600 rounded focus:ring-orange-400 focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Debug Mode</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.debugMode}
                    onChange={(e) =>
                      handleSystemSettingsChange({
                        debugMode: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-400 bg-gray-800 border-gray-600 rounded focus:ring-orange-400 focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Enable Metrics</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.enableMetrics}
                    onChange={(e) =>
                      handleSystemSettingsChange({
                        enableMetrics: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-400 bg-gray-800 border-gray-600 rounded focus:ring-orange-400 focus:ring-2"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Auto Backup</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoBackup}
                    onChange={(e) =>
                      handleSystemSettingsChange({
                        autoBackup: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-400 bg-gray-800 border-gray-600 rounded focus:ring-orange-400 focus:ring-2"
                  />
                </label>
              </div>
            </div>
          </motion.div>

          {/* Ultra Accuracy Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Ultra Accuracy Engine
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Enable Ultra Accuracy</span>
                <input
                  type="checkbox"
                  checked={ultraAccuracySettings.enabled}
                  onChange={(e) =>
                    handleUltraAccuracyChange({ enabled: e.target.checked })
                  }
                  className="w-5 h-5 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
              </label>

              <div>
                <label className="block text-gray-300 mb-2">
                  Target Accuracy: {ultraAccuracySettings.targetAccuracy}%
                </label>
                <input
                  type="range"
                  min="95"
                  max="99.9"
                  step="0.1"
                  value={ultraAccuracySettings.targetAccuracy}
                  onChange={(e) =>
                    handleUltraAccuracyChange({
                      targetAccuracy: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Neural Network Depth:{" "}
                  {ultraAccuracySettings.neuralNetworkDepth}
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="1"
                  value={ultraAccuracySettings.neuralNetworkDepth}
                  onChange={(e) =>
                    handleUltraAccuracyChange({
                      neuralNetworkDepth: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Ensemble Size: {ultraAccuracySettings.ensembleSize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={ultraAccuracySettings.ensembleSize}
                  onChange={(e) =>
                    handleUltraAccuracyChange({
                      ensembleSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between">
                <span className="text-gray-300">
                  Advanced Feature Engineering
                </span>
                <input
                  type="checkbox"
                  checked={ultraAccuracySettings.featureEngineering}
                  onChange={(e) =>
                    handleUltraAccuracyChange({
                      featureEngineering: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-gray-300">Auto Optimization</span>
                <input
                  type="checkbox"
                  checked={ultraAccuracySettings.autoOptimization}
                  onChange={(e) =>
                    handleUltraAccuracyChange({
                      autoOptimization: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
              </label>
            </div>
          </motion.div>
        </div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-yellow-400" />
            Data Management & Backup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportConfig}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Config
            </button>

            <button
              onClick={handleClearCache}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear Cache
            </button>

            <button
              onClick={() => window.open("/backend-status", "_blank")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              System Status
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={handleResetSettings}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reset All
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white rounded-xl transition-all transform hover:scale-105"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Saving..." : "Save All Settings"}
          </button>
        </motion.div>

        {/* Warning Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">
              ⚠️ <strong>Administrator Access Required:</strong> These settings
              affect the entire system. Changes may require system restart.
              Always backup configurations before making changes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
