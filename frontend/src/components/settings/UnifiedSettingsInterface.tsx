import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Database, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export const UnifiedSettingsInterface: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      betAlerts: true,
      priceChanges: true,
      dailyReports: false,
      promotions: true,
    },
    privacy: {
      shareStats: false,
      publicProfile: false,
      dataCollection: true,
    },
    trading: {
      riskLevel: "medium",
      maxBetAmount: 500,
      autoHedging: false,
      followMLRecommendations: true,
    },
    display: {
      theme: "dark",
      currency: "USD",
      timezone: "America/New_York",
      decimalOdds: true,
    },
  });

  const handleToggle = (section: keyof typeof settings, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleSelect = (
    section: keyof typeof settings,
    key: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ⚙️ Settings & Preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your betting experience and account preferences
        </p>
      </motion.div>

      {/* Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Bet Alerts</div>
              <div className="text-sm text-gray-500">
                Get notified when your bets are settled
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.betAlerts}
                onChange={() => handleToggle("notifications", "betAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Price Changes</div>
              <div className="text-sm text-gray-500">
                Alert when odds move significantly
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.priceChanges}
                onChange={() => handleToggle("notifications", "priceChanges")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Daily Reports</div>
              <div className="text-sm text-gray-500">
                Receive daily performance summaries
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.dailyReports}
                onChange={() => handleToggle("notifications", "dailyReports")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Share Statistics</div>
              <div className="text-sm text-gray-500">
                Allow others to see your betting stats
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareStats}
                onChange={() => handleToggle("privacy", "shareStats")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Public Profile</div>
              <div className="text-sm text-gray-500">
                Make your profile visible to other users
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.publicProfile}
                onChange={() => handleToggle("privacy", "publicProfile")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">
                Two-Factor Authentication
              </span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Your account is protected with 2FA. You can manage this in your
              account security settings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trading Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500" />
            Trading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Risk Level</div>
              <div className="text-sm text-gray-500">
                Default risk tolerance for recommendations
              </div>
            </div>
            <select
              value={settings.trading.riskLevel}
              onChange={(e) =>
                handleSelect("trading", "riskLevel", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Max Bet Amount</div>
              <div className="text-sm text-gray-500">
                Maximum amount for a single bet
              </div>
            </div>
            <input
              type="number"
              value={settings.trading.maxBetAmount}
              onChange={(e) =>
                handleSelect("trading", "maxBetAmount", Number(e.target.value))
              }
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Follow ML Recommendations</div>
              <div className="text-sm text-gray-500">
                Auto-execute high-confidence ML predictions
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.trading.followMLRecommendations}
                onChange={() =>
                  handleToggle("trading", "followMLRecommendations")
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-gray-500">
                Choose your preferred color scheme
              </div>
            </div>
            <select
              value={settings.display.theme}
              onChange={(e) => handleSelect("display", "theme", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Currency</div>
              <div className="text-sm text-gray-500">
                Default currency for display
              </div>
            </div>
            <select
              value={settings.display.currency}
              onChange={(e) =>
                handleSelect("display", "currency", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Decimal Odds</div>
              <div className="text-sm text-gray-500">
                Display odds in decimal format
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.display.decimalOdds}
                onChange={() => handleToggle("display", "decimalOdds")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Import/Export Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const data = JSON.stringify(settings, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "betting-settings.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Export Settings
            </button>
            <div className="flex-1 relative">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsImporting(true);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedSettings = JSON.parse(
                          event.target?.result as string,
                        );
                        setSettings(importedSettings);
                        setTimeout(() => {
                          setIsImporting(false);
                          alert("Settings imported successfully!");
                        }, 500);
                      } catch (error) {
                        setIsImporting(false);
                        alert(
                          "Error importing settings. Please check the file format.",
                        );
                      }
                    };
                    reader.readAsText(file);
                  }
                  // Reset the input value to allow selecting the same file again
                  e.target.value = "";
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                style={{
                  zIndex: 10,
                }}
              />
              <div
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-center pointer-events-none"
                style={{
                  position: "relative",
                  zIndex: 1,
                  opacity: isImporting ? 0.7 : 1,
                }}
              >
                {isImporting ? "Importing..." : "Import Settings"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div
        className="flex justify-center pt-6"
        style={{ position: "relative", zIndex: 1 }}
      >
        <button
          onClick={() => {
            // Save settings logic here
            alert("Settings saved successfully!");
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          style={{ position: "relative", zIndex: 2 }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
