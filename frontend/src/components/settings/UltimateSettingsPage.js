import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Bell, Palette, Database, BarChart3, Download, Upload, RefreshCw, Save, AlertTriangle, Sun, Moon, Target, Zap, Sliders, } from "lucide-react";
import { useTheme } from "../../providers/SafeThemeProvider";
// Import hook directly to avoid module resolution issues
import useUltimateSettings from "../../hooks/useUltimateSettings";
// Use direct imports to avoid module resolution issues
const Card = ({ children, className = "", }) => (_jsx("div", { className: `rounded-2xl bg-card text-card-foreground transition-all duration-300 hover:shadow-2xl ${className}`, style: {
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(40px) saturate(200%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
    }, children: children }));
const CardHeader = ({ children, className = "", }) => (_jsx("div", { className: `flex flex-col space-y-2 p-8 ${className}`, children: children }));
const CardTitle = ({ children, className = "", }) => (_jsx("h3", { className: `text-2xl font-bold leading-none tracking-tight ${className}`, style: {
        color: "#ffffff",
        letterSpacing: "-0.02em",
        fontSize: "20px",
        fontWeight: "700",
    }, children: children }));
const CardContent = ({ children, className = "", }) => _jsx("div", { className: `p-8 pt-0 ${className}`, children: children });
const Badge = ({ children, className = "", variant = "default", }) => {
    const variantClasses = {
        default: "bg-primary text-primary-foreground",
        success: "bg-green-500 text-white",
        destructive: "bg-red-500 text-white",
        outline: "border border-input",
        secondary: "bg-secondary text-secondary-foreground",
    };
    return (_jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`, children: children }));
};
const Button = ({ children, className = "", variant = "default", size = "default", disabled = false, onClick, ...props }) => {
    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
    };
    const sizeClasses = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    return (_jsx("button", { className: `inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, disabled: disabled, onClick: onClick, ...props, children: children }));
};
// Create inline theme toggle to avoid import issues
const SimpleThemeToggle = () => {
    const { isDark, toggleDarkMode, variant: themeVariant } = useTheme();
    return (_jsxs("button", { onClick: toggleDarkMode, className: "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-muted", style: {
            background: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)"}`,
            color: isDark ? "#ffffff" : "#0f172a",
        }, children: [isDark ? _jsx(Sun, { className: "w-4 h-4" }) : _jsx(Moon, { className: "w-4 h-4" }), _jsx("span", { children: isDark ? "Light Mode" : "Dark Mode" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["(", themeVariant, ")"] })] }));
};
const settingsSections = [
    {
        id: "account",
        title: "Account & Profile",
        icon: _jsx(User, { className: "w-5 h-5" }),
        description: "Personal information, subscription, and account security",
        color: "blue",
    },
    {
        id: "betting",
        title: "Betting Preferences",
        icon: _jsx(Target, { className: "w-5 h-5" }),
        description: "Risk profiles, stake sizing, and betting automation",
        color: "green",
    },
    {
        id: "appearance",
        title: "Appearance & Display",
        icon: _jsx(Palette, { className: "w-5 h-5" }),
        description: "Theme, layout, currency, and visual preferences",
        color: "purple",
    },
    {
        id: "notifications",
        title: "Notifications & Alerts",
        icon: _jsx(Bell, { className: "w-5 h-5" }),
        description: "Customize alerts, emails, and push notifications",
        color: "orange",
    },
    {
        id: "privacy",
        title: "Privacy & Security",
        icon: _jsx(Shield, { className: "w-5 h-5" }),
        description: "Data sharing, 2FA, and privacy controls",
        color: "red",
    },
    {
        id: "analytics",
        title: "Analytics & Data",
        icon: _jsx(BarChart3, { className: "w-5 h-5" }),
        description: "Data sources, model preferences, and analytics settings",
        color: "indigo",
    },
    {
        id: "automation",
        title: "Automation & AI",
        icon: _jsx(Zap, { className: "w-5 h-5" }),
        description: "Auto-betting, ML recommendations, and smart features",
        color: "cyan",
    },
    {
        id: "system",
        title: "System & Performance",
        icon: _jsx(Database, { className: "w-5 h-5" }),
        description: "Cache, performance, API settings, and system health",
        color: "gray",
    },
];
export const UltimateSettingsPage = () => {
    const { theme, isDark, toggleDarkMode, variant: themeVariant } = useTheme();
    const { settings, updateSetting, updateSection, saveSettings, resetSection, exportSettings, importSettings, isLoading, hasUnsavedChanges, } = useUltimateSettings();
    const [activeSection, setActiveSection] = useState("account");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const handleImportSettings = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonString = e.target?.result;
                const result = importSettings(jsonString);
                if (!result.success) {
                    console.error("Failed to import settings:", result.error);
                }
            }
            catch (error) {
                console.error("Failed to read file:", error);
            }
        };
        reader.readAsText(file);
    };
    const getSectionColor = (color) => {
        const colors = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
            red: "from-red-500 to-red-600",
            indigo: "from-indigo-500 to-indigo-600",
            cyan: "from-cyan-500 to-cyan-600",
            gray: "from-gray-500 to-gray-600",
        };
        return colors[color] || colors.blue;
    };
    const renderToggleSwitch = (checked, onChange, disabled = false) => (_jsx("button", { onClick: onChange, disabled: disabled, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-cyber-primary" : "bg-gray-300 dark:bg-gray-600"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`, children: _jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}` }) }));
    const renderAccountSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5 text-blue-500" }), "Account & Profile"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Personal Information" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Full Name" }), _jsx("input", { type: "text", value: settings.account.name, onChange: (e) => updateSetting("account", "name", e.target.value), className: "w-full border rounded-xl bg-background transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50", style: {
                                                    padding: "14px 18px",
                                                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                    borderRadius: "12px",
                                                    color: "#ffffff",
                                                    fontSize: "15px",
                                                    fontWeight: "500",
                                                    backdropFilter: "blur(20px) saturate(180%)",
                                                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", value: settings.account.email, onChange: (e) => updateSetting("account", "email", e.target.value), className: "w-full border rounded-xl bg-background transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50", style: {
                                                    padding: "14px 18px",
                                                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                    borderRadius: "12px",
                                                    color: "#ffffff",
                                                    fontSize: "15px",
                                                    fontWeight: "500",
                                                    backdropFilter: "blur(20px) saturate(180%)",
                                                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Phone" }), _jsx("input", { type: "tel", value: settings.account.phone, onChange: (e) => updateSetting("account", "phone", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background" })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Subscription & Security" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Subscription Tier" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Premium Plan" })] }), _jsx(Badge, { className: "bg-green-500 text-white", children: "Active" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Two-Factor Authentication" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Enhanced security" })] }), renderToggleSwitch(settings.account.twoFactorEnabled, () => updateSetting("account", "twoFactorEnabled", !settings.account.twoFactorEnabled))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Timezone" }), _jsxs("select", { value: settings.account.timezone, onChange: (e) => updateSetting("account", "timezone", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "America/New_York", children: "Eastern Time" }), _jsx("option", { value: "America/Chicago", children: "Central Time" }), _jsx("option", { value: "America/Denver", children: "Mountain Time" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time" }), _jsx("option", { value: "Europe/London", children: "GMT" })] })] })] })] })] })] }));
    const renderBettingSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Target, { className: "w-5 h-5 text-green-500" }), "Betting Preferences"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Risk Management" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Risk Profile" }), _jsxs("select", { value: settings.betting.riskProfile, onChange: (e) => updateSetting("betting", "riskProfile", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "conservative", children: "Conservative" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "aggressive", children: "Aggressive" }), _jsx("option", { value: "custom", children: "Custom" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Default Stake ($)" }), _jsx("input", { type: "number", value: settings.betting.defaultStake, onChange: (e) => updateSetting("betting", "defaultStake", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Max Stake ($)" }), _jsx("input", { type: "number", value: settings.betting.maxStake, onChange: (e) => updateSetting("betting", "maxStake", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Kelly Multiplier" }), _jsx("input", { type: "range", min: "0.1", max: "1", step: "0.05", value: settings.betting.kellyMultiplier, onChange: (e) => updateSetting("betting", "kellyMultiplier", Number(e.target.value)), className: "w-full" }), _jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: ["Current: ", settings.betting.kellyMultiplier, "x"] })] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Automation & AI" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Follow ML Recommendations" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Auto-execute high-confidence bets" })] }), renderToggleSwitch(settings.betting.followMLRecommendations, () => updateSetting("betting", "followMLRecommendations", !settings.betting.followMLRecommendations))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Auto Hedging" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Automatically hedge profitable positions" })] }), renderToggleSwitch(settings.betting.autoHedging, () => updateSetting("betting", "autoHedging", !settings.betting.autoHedging))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Confidence Threshold" }), _jsx("input", { type: "range", min: "0.5", max: "0.95", step: "0.05", value: settings.betting.confidenceThreshold, onChange: (e) => updateSetting("betting", "confidenceThreshold", Number(e.target.value)), className: "w-full" }), _jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: ["Current:", " ", (settings.betting.confidenceThreshold * 100).toFixed(0), "%"] })] })] })] })] })] }));
    const renderAppearanceSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Palette, { className: "w-5 h-5 text-purple-500" }), "Appearance & Display"] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Theme & Visual Preferences" }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-3", children: "Theme" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SimpleThemeToggle, {}), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Current: ", themeVariant, " (", isDark ? "Dark" : "Light", ")"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Compact Mode" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Reduce spacing and padding" })] }), renderToggleSwitch(settings.appearance.compactMode, () => updateSetting("appearance", "compactMode", !settings.appearance.compactMode))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Show Animations" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Enable smooth transitions" })] }), renderToggleSwitch(settings.appearance.showAnimations, () => updateSetting("appearance", "showAnimations", !settings.appearance.showAnimations))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "High Contrast" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Improve accessibility" })] }), renderToggleSwitch(settings.appearance.highContrast, () => updateSetting("appearance", "highContrast", !settings.appearance.highContrast))] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Odds Format" }), _jsxs("select", { value: settings.appearance.oddsFormat, onChange: (e) => updateSetting("appearance", "oddsFormat", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "decimal", children: "Decimal (1.85)" }), _jsx("option", { value: "american", children: "American (+110)" }), _jsx("option", { value: "fractional", children: "Fractional (17/20)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Chart Style" }), _jsxs("select", { value: settings.appearance.chartStyle, onChange: (e) => updateSetting("appearance", "chartStyle", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "modern", children: "Modern" }), _jsx("option", { value: "classic", children: "Classic" }), _jsx("option", { value: "minimal", children: "Minimal" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Currency" }), _jsxs("select", { value: settings.account.currency, onChange: (e) => updateSetting("account", "currency", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "USD", children: "USD ($)" }), _jsx("option", { value: "EUR", children: "EUR (\u20AC)" }), _jsx("option", { value: "GBP", children: "GBP (\u00A3)" }), _jsx("option", { value: "CAD", children: "CAD (C$)" })] })] })] })] })] })] })] }));
    const renderNotificationsSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Bell, { className: "w-5 h-5 text-orange-500" }), "Notifications & Alerts"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Alert Preferences" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Bet Alerts" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Notifications when bets are settled" })] }), renderToggleSwitch(settings.notifications.betAlerts, () => updateSetting("notifications", "betAlerts", !settings.notifications.betAlerts))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Price Changes" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Alert when odds move significantly" })] }), renderToggleSwitch(settings.notifications.priceChanges, () => updateSetting("notifications", "priceChanges", !settings.notifications.priceChanges))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Daily Reports" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Daily performance summaries" })] }), renderToggleSwitch(settings.notifications.dailyReports, () => updateSetting("notifications", "dailyReports", !settings.notifications.dailyReports))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Sound Enabled" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Audio notifications" })] }), renderToggleSwitch(settings.notifications.soundEnabled, () => updateSetting("notifications", "soundEnabled", !settings.notifications.soundEnabled))] })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Delivery Methods" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Email Notifications" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Send alerts to email" })] }), renderToggleSwitch(settings.notifications.emailNotifications, () => updateSetting("notifications", "emailNotifications", !settings.notifications.emailNotifications))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Push Notifications" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Browser/mobile push alerts" })] }), renderToggleSwitch(settings.notifications.pushNotifications, () => updateSetting("notifications", "pushNotifications", !settings.notifications.pushNotifications))] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Moon, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: "Quiet Hours" }), renderToggleSwitch(settings.notifications.quietHours.enabled, () => updateSetting("notifications", "quietHours", {
                                                        ...settings.notifications.quietHours,
                                                        enabled: !settings.notifications.quietHours.enabled,
                                                    }))] }), settings.notifications.quietHours.enabled && (_jsxs("div", { className: "grid grid-cols-2 gap-2 mt-2", children: [_jsx("input", { type: "time", value: settings.notifications.quietHours.start, onChange: (e) => updateSetting("notifications", "quietHours", {
                                                            ...settings.notifications.quietHours,
                                                            start: e.target.value,
                                                        }), className: "px-2 py-1 text-sm border rounded bg-background" }), _jsx("input", { type: "time", value: settings.notifications.quietHours.end, onChange: (e) => updateSetting("notifications", "quietHours", {
                                                            ...settings.notifications.quietHours,
                                                            end: e.target.value,
                                                        }), className: "px-2 py-1 text-sm border rounded bg-background" })] }))] })] })] })] })] }));
    const renderPrivacySection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-red-500" }), "Privacy & Security"] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Privacy Controls" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Share Statistics" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Allow others to see your betting stats" })] }), renderToggleSwitch(settings.privacy.shareStats, () => updateSetting("privacy", "shareStats", !settings.privacy.shareStats))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Public Profile" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Make your profile visible to others" })] }), renderToggleSwitch(settings.privacy.publicProfile, () => updateSetting("privacy", "publicProfile", !settings.privacy.publicProfile))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Analytics Opt-in" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Help improve the platform with usage data" })] }), renderToggleSwitch(settings.privacy.analyticsOptIn, () => updateSetting("privacy", "analyticsOptIn", !settings.privacy.analyticsOptIn))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Session Timeout (minutes)" }), _jsx("input", { type: "number", min: "30", max: "480", value: settings.privacy.sessionTimeout, onChange: (e) => updateSetting("privacy", "sessionTimeout", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] })] })] })] }));
    const renderAnalyticsSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-5 h-5 text-indigo-500" }), "Analytics & Data"] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Data Sources & Performance" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Enabled Data Sources" }), _jsx("div", { className: "space-y-2", children: [
                                            "ESPN",
                                            "SportsRadar",
                                            "PrizePicks",
                                            "DraftKings",
                                            "FanDuel",
                                        ].map((source) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: source }), renderToggleSwitch(settings.analytics.enabledSources.includes(source.toLowerCase()), () => {
                                                    const current = settings.analytics.enabledSources;
                                                    const sourceLower = source.toLowerCase();
                                                    const newSources = current.includes(sourceLower)
                                                        ? current.filter((s) => s !== sourceLower)
                                                        : [...current, sourceLower];
                                                    updateSetting("analytics", "enabledSources", newSources);
                                                })] }, source))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Refresh Interval (sec)" }), _jsx("input", { type: "number", min: "60", max: "3600", value: settings.analytics.refreshInterval, onChange: (e) => updateSetting("analytics", "refreshInterval", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Cache Duration (sec)" }), _jsx("input", { type: "number", min: "300", max: "86400", value: settings.analytics.cacheDuration, onChange: (e) => updateSetting("analytics", "cacheDuration", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Cache Enabled" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Improve performance with local caching" })] }), renderToggleSwitch(settings.analytics.cacheEnabled, () => updateSetting("analytics", "cacheEnabled", !settings.analytics.cacheEnabled))] })] })] })] }));
    const renderSystemSection = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-gray-500" }), "System & Performance"] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Performance & System Health" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Performance Mode" }), _jsxs("select", { value: settings.system.performanceMode, onChange: (e) => updateSetting("system", "performanceMode", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "performance", children: "High Performance" }), _jsx("option", { value: "balanced", children: "Balanced" }), _jsx("option", { value: "power-saver", children: "Power Saver" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Auto Updates" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Automatically install updates" })] }), renderToggleSwitch(settings.system.autoUpdate, () => updateSetting("system", "autoUpdate", !settings.system.autoUpdate))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Debug Mode" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Enable detailed logging" })] }), renderToggleSwitch(settings.system.debugMode, () => updateSetting("system", "debugMode", !settings.system.debugMode))] }), showAdvanced && (_jsxs("div", { className: "space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-orange-600", children: "Advanced System Settings" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Log Level" }), _jsxs("select", { value: settings.system.logLevel, onChange: (e) => updateSetting("system", "logLevel", e.target.value), className: "w-full px-3 py-2 border rounded-lg bg-background", children: [_jsx("option", { value: "error", children: "Error Only" }), _jsx("option", { value: "warn", children: "Warnings" }), _jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "debug", children: "Debug" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Max Log Size (MB)" }), _jsx("input", { type: "number", min: "10", max: "500", value: settings.system.maxLogSize, onChange: (e) => updateSetting("system", "maxLogSize", Number(e.target.value)), className: "w-full px-3 py-2 border rounded-lg bg-background" })] })] }))] })] })] }));
    const renderSectionContent = () => {
        switch (activeSection) {
            case "account":
                return renderAccountSection();
            case "betting":
                return renderBettingSection();
            case "appearance":
                return renderAppearanceSection();
            case "notifications":
                return renderNotificationsSection();
            case "privacy":
                return renderPrivacySection();
            case "analytics":
                return renderAnalyticsSection();
            case "system":
                return renderSystemSection();
            default:
                return renderAccountSection();
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border", children: _jsx("div", { className: "container mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary", children: _jsx(Settings, { className: "w-6 h-6 text-black" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ultimate Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Customize your A1Betting experience" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowAdvanced(!showAdvanced), className: "flex items-center gap-2", children: [_jsx(Sliders, { className: "w-4 h-4" }), showAdvanced ? "Basic" : "Advanced"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: exportSettings, className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export"] }), _jsxs("label", { className: "relative cursor-pointer", children: [_jsx("input", { type: "file", accept: ".json", onChange: handleImportSettings, className: "sr-only" }), _jsxs(Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", type: "button", children: [_jsx(Upload, { className: "w-4 h-4" }), "Import"] })] }), _jsxs(Button, { onClick: saveSettings, disabled: !hasUnsavedChanges || isLoading, className: "flex items-center gap-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-black font-medium", children: [isLoading ? (_jsx(RefreshCw, { className: "w-4 h-4 animate-spin" })) : (_jsx(Save, { className: "w-4 h-4" })), "Save Changes"] })] })] }) }) }), _jsx("div", { className: "container mx-auto px-6 py-8", children: _jsxs("div", { className: "flex gap-8", children: [_jsx("div", { className: "w-80 flex-shrink-0", children: _jsx("div", { className: "sticky top-32", children: _jsx("nav", { className: "space-y-2", children: settingsSections.map((section) => (_jsx("button", { onClick: () => setActiveSection(section.id), className: `w-full text-left p-4 rounded-lg transition-all duration-200 ${activeSection === section.id
                                            ? `bg-gradient-to-r ${getSectionColor(section.color)} text-white shadow-lg`
                                            : "hover:bg-muted"}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [section.icon, _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: section.title }), _jsx("div", { className: `text-sm ${activeSection === section.id
                                                                ? "text-white/80"
                                                                : "text-muted-foreground"}`, children: section.description })] })] }) }, section.id))) }) }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: renderSectionContent() }, activeSection) })] }) }), hasUnsavedChanges && (_jsxs(motion.div, { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, className: "fixed bottom-6 right-6 bg-amber-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), "You have unsaved changes"] }))] }));
};
export default UltimateSettingsPage;
