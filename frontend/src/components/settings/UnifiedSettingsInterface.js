import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Palette, Database, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
export const UnifiedSettingsInterface = () => {
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
    const handleToggle = (section, key) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: !prev[section][key],
            },
        }));
    };
    const handleSelect = (section, key, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\u2699\uFE0F Settings & Preferences" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Customize your betting experience and account preferences" })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bell, { className: "w-5 h-5 text-blue-500" }), "Notifications"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Bet Alerts" }), _jsx("div", { className: "text-sm text-gray-500", children: "Get notified when your bets are settled" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.betAlerts, onChange: () => handleToggle("notifications", "betAlerts"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Price Changes" }), _jsx("div", { className: "text-sm text-gray-500", children: "Alert when odds move significantly" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.priceChanges, onChange: () => handleToggle("notifications", "priceChanges"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Daily Reports" }), _jsx("div", { className: "text-sm text-gray-500", children: "Receive daily performance summaries" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.dailyReports, onChange: () => handleToggle("notifications", "dailyReports"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-green-500" }), "Privacy & Security"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Share Statistics" }), _jsx("div", { className: "text-sm text-gray-500", children: "Allow others to see your betting stats" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.privacy.shareStats, onChange: () => handleToggle("privacy", "shareStats"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Public Profile" }), _jsx("div", { className: "text-sm text-gray-500", children: "Make your profile visible to other users" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.privacy.publicProfile, onChange: () => handleToggle("privacy", "publicProfile"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Key, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium text-blue-800 dark:text-blue-200", children: "Two-Factor Authentication" }), _jsx(Badge, { variant: "success", children: "Enabled" })] }), _jsx("p", { className: "text-sm text-blue-600 dark:text-blue-400", children: "Your account is protected with 2FA. You can manage this in your account security settings." })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-purple-500" }), "Trading Preferences"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Risk Level" }), _jsx("div", { className: "text-sm text-gray-500", children: "Default risk tolerance for recommendations" })] }), _jsxs("select", { value: settings.trading.riskLevel, onChange: (e) => handleSelect("trading", "riskLevel", e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800", children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Max Bet Amount" }), _jsx("div", { className: "text-sm text-gray-500", children: "Maximum amount for a single bet" })] }), _jsx("input", { type: "number", value: settings.trading.maxBetAmount, onChange: (e) => handleSelect("trading", "maxBetAmount", Number(e.target.value)), className: "w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Follow ML Recommendations" }), _jsx("div", { className: "text-sm text-gray-500", children: "Auto-execute high-confidence ML predictions" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.trading.followMLRecommendations, onChange: () => handleToggle("trading", "followMLRecommendations"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Palette, { className: "w-5 h-5 text-orange-500" }), "Display Preferences"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Theme" }), _jsx("div", { className: "text-sm text-gray-500", children: "Choose your preferred color scheme" })] }), _jsxs("select", { value: settings.display.theme, onChange: (e) => handleSelect("display", "theme", e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800", children: [_jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "auto", children: "Auto" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Currency" }), _jsx("div", { className: "text-sm text-gray-500", children: "Default currency for display" })] }), _jsxs("select", { value: settings.display.currency, onChange: (e) => handleSelect("display", "currency", e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800", children: [_jsx("option", { value: "USD", children: "USD ($)" }), _jsx("option", { value: "EUR", children: "EUR (\u20AC)" }), _jsx("option", { value: "GBP", children: "GBP (\u00A3)" }), _jsx("option", { value: "CAD", children: "CAD (C$)" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Decimal Odds" }), _jsx("div", { className: "text-sm text-gray-500", children: "Display odds in decimal format" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.display.decimalOdds, onChange: () => handleToggle("display", "decimalOdds"), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-indigo-500" }), "Data Management"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("button", { onClick: () => {
                                        const data = JSON.stringify(settings, null, 2);
                                        const blob = new Blob([data], { type: "application/json" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = "betting-settings.json";
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }, className: "flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg", children: "Export Settings" }), _jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: "file", accept: ".json", onChange: (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setIsImporting(true);
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        try {
                                                            const importedSettings = JSON.parse(event.target?.result);
                                                            setSettings(importedSettings);
                                                            setTimeout(() => {
                                                                setIsImporting(false);
                                                                alert("Settings imported successfully!");
                                                            }, 500);
                                                        }
                                                        catch (error) {
                                                            setIsImporting(false);
                                                            alert("Error importing settings. Please check the file format.");
                                                        }
                                                    };
                                                    reader.readAsText(file);
                                                }
                                                // Reset the input value to allow selecting the same file again
                                                e.target.value = "";
                                            }, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10", style: {
                                                zIndex: 10,
                                            } }), _jsx("div", { className: "w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-center pointer-events-none", style: {
                                                position: "relative",
                                                zIndex: 1,
                                                opacity: isImporting ? 0.7 : 1,
                                            }, children: isImporting ? "Importing..." : "Import Settings" })] })] }) })] }), _jsx("div", { className: "flex justify-center pt-6", style: { position: "relative", zIndex: 1 }, children: _jsx("button", { onClick: () => {
                        // Save settings logic here
                        alert("Settings saved successfully!");
                    }, className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg", style: { position: "relative", zIndex: 2 }, children: "Save Settings" }) })] }));
};
