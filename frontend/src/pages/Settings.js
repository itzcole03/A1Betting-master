import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            sound: false,
        },
        display: {
            darkMode: true,
            compactView: false,
        },
        betting: {
            defaultStake: 10,
            maxStake: 100,
            currency: 'USD',
        },
        privacy: {
            sharePredictions: false,
            showStats: true,
        },
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const handleNotificationChange = (setting) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [setting]: !prev.notifications[setting],
            },
        }));
    };
    const handleDisplayChange = (setting) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                [setting]: !prev.display[setting],
            },
        }));
    };
    const handleBettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            betting: {
                ...prev.betting,
                [setting]: value,
            },
        }));
    };
    const handlePrivacyChange = (setting) => {
        setSettings(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [setting]: !prev.privacy[setting],
            },
        }));
    };
    const handleSave = () => {
        setSnackbar({
            open: true,
            message: 'Settings saved successfully',
            severity: 'success',
        });
    };
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    return (_jsx("div", { className: "p-6 min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6", children: "Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [_jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Notifications" }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.email, onChange: () => handleNotificationChange('email') }), "Email Notifications"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.push, onChange: () => handleNotificationChange('push') }), "Push Notifications"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.notifications.sound, onChange: () => handleNotificationChange('sound') }), "Sound Notifications"] })] })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Display" }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.display.darkMode, onChange: () => handleDisplayChange('darkMode') }), "Dark Mode"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.display.compactView, onChange: () => handleDisplayChange('compactView') }), "Compact View"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [_jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Betting Preferences" }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Default Stake" }), _jsx("input", { className: "modern-input w-full", type: "number", value: settings.betting.defaultStake, onChange: e => handleBettingChange('defaultStake', Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Maximum Stake" }), _jsx("input", { className: "modern-input w-full", type: "number", value: settings.betting.maxStake, onChange: e => handleBettingChange('maxStake', Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium mb-1", children: "Currency" }), _jsxs("select", { className: "modern-input w-full", value: settings.betting.currency, onChange: e => handleBettingChange('currency', e.target.value), children: [_jsx("option", { value: "USD", children: "USD" }), _jsx("option", { value: "EUR", children: "EUR" }), _jsx("option", { value: "GBP", children: "GBP" })] })] })] })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Privacy" }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.privacy.sharePredictions, onChange: () => handlePrivacyChange('sharePredictions') }), "Share Predictions"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: settings.privacy.showStats, onChange: () => handlePrivacyChange('showStats') }), "Show Statistics"] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(GlowButton, { onClick: handleSave, children: "Save Settings" }) }), snackbar.open && (_jsx("div", { className: `mt-4 p-3 rounded-lg ${snackbar.severity === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`, children: snackbar.message }))] }) }));
};
export default Settings;
