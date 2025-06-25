import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { UnifiedInput } from './base/UnifiedInput';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaBell, FaDatabase, FaKey, FaGlobe, FaDownload, FaTrash, } from 'react-icons/fa';
const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isCompactView, setIsCompactView] = useState(false);
    const [apiKeys, setApiKeys] = useState({
        sportsRadar: 'zi7atwynSXOAyizHo1L3fR5Yv8mfBX12LccJbCHb',
        theOddsApi: '8684be37505fc5ce63b0337d472af0ee',
    });
    const [notifications, setNotifications] = useState([
        {
            id: 'live_updates',
            label: 'Live Updates',
            description: 'Receive notifications for odds changes and game updates',
            enabled: true,
        },
        {
            id: 'arbitrage',
            label: 'Arbitrage Alerts',
            description: 'Get notified when profitable arbitrage opportunities arise',
            enabled: true,
        },
        {
            id: 'high_confidence',
            label: 'High Confidence Picks',
            description: 'Notifications for picks with >90% confidence',
            enabled: true,
        },
    ]);
    useEffect(() => {
        // Check system theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        // Apply theme
        document.documentElement.classList.toggle('dark', prefersDark);
    }, []);
    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };
    const handleNotificationToggle = (id) => {
        setNotifications(prev => prev.map(notification => notification.id === id ? { ...notification, enabled: !notification.enabled } : notification));
    };
    const handleApiKeyChange = (key, value) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };
    const handleExportData = () => {
        const data = {
            settings: {
                isDarkMode,
                isCompactView,
                notifications,
                apiKeys,
            },
            // Add other data to export
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'betpro-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Display Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [isDarkMode ? (_jsx(FaMoon, { className: "w-5 h-5 text-primary-500" })) : (_jsx(FaSun, { className: "w-5 h-5 text-primary-500" })), _jsx("span", { children: "Dark Mode" })] }), _jsx("button", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700", onClick: handleThemeToggle, children: _jsx("span", { className: `${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaGlobe, { className: "w-5 h-5 text-primary-500" }), _jsx("span", { children: "Compact View" })] }), _jsx("button", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700", onClick: () => setIsCompactView(!isCompactView), children: _jsx("span", { className: `${isCompactView ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition` }) })] })] })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.2 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaBell, { className: "w-5 h-5 mr-2 text-primary-500" }), "Notification Settings"] }), _jsx("div", { className: "space-y-4", children: notifications.map(notification => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: notification.label }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: notification.description })] }), _jsx("button", { className: "relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700", onClick: () => handleNotificationToggle(notification.id), children: _jsx("span", { className: `${notification.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition` }) })] }, notification.id))) })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.4 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaKey, { className: "w-5 h-5 mr-2 text-primary-500" }), "API Keys"] }), _jsxs("div", { className: "space-y-4", children: [_jsx(UnifiedInput, { label: "SportRadar API Key", placeholder: "Enter API key", type: "text", value: apiKeys.sportsRadar, onChange: e => handleApiKeyChange('sportsRadar', e.target.value) }), _jsx(UnifiedInput, { label: "TheOdds API Key", placeholder: "Enter API key", type: "text", value: apiKeys.theOddsApi, onChange: e => handleApiKeyChange('theOddsApi', e.target.value) })] })] }), _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: "glass-morphism p-6 rounded-xl", initial: { opacity: 0, y: 20 }, transition: { delay: 0.6 }, children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(FaDatabase, { className: "w-5 h-5 mr-2 text-primary-500" }), "Data Management"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("button", { className: "flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition", onClick: handleExportData, children: [_jsx(FaDownload, { className: "w-4 h-4" }), _jsx("span", { children: "Export Settings" })] }), _jsxs("button", { className: "flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition", onClick: handleClearData, children: [_jsx(FaTrash, { className: "w-4 h-4" }), _jsx("span", { children: "Clear All Data" })] })] })] })] }));
};
export default React.memo(Settings);
