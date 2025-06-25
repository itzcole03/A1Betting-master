import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Sun, Moon, ToggleLeft, ToggleRight, Loader2, AlertTriangle } from 'lucide-react';
import { configService } from '../../services/configService';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '../../providers/ThemeProvider';
const Settings = () => {
    const { theme, setTheme } = useTheme();
    const { addToast } = useAppStore();
    const [appConfig, setAppConfig] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const [configError, setConfigError] = useState(null);
    useEffect(() => {
        const loadConfig = async () => {
            setIsLoadingConfig(true);
            setConfigError(null);
            try {
                const config = await configService.fetchAppConfig();
                setAppConfig(config);
            }
            catch (error) {
                setConfigError(error.message || 'Failed to load application configuration.');
                addToast({ message: 'Error loading app configuration.', type: 'error' });
            }
            finally {
                setIsLoadingConfig(false);
            }
        };
        loadConfig();
    }, [addToast]);
    const handleFeatureToggle = (featureName) => {
        // In a real app, this would likely call a service to update user preferences or admin settings.
        // For now, this is a visual toggle only, actual feature flag state comes from config.
        addToast({ message: `Feature "${featureName}" toggle clicked. (This is a visual demo - persistence not implemented here)`, type: 'info' });
        // To make it truly dynamic IF the backend supports on-the-fly updates & UnifiedConfig could be refreshed:
        // 1. Call a service: await userService.updateFeatureFlag(featureName, !appConfig?.featureFlags[featureName]);
        // 2. Refresh config: const newConfig = await configService.fetchAppConfig(true); // force refresh
        // 3. setAppConfig(newConfig);
    };
    return (_jsxs("div", { className: "space-y-12 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent drop-shadow-lg mb-6", children: "\u2699\uFE0F Appearance Settings" }), _jsx("div", { className: "p-8 glass modern-card rounded-2xl shadow-2xl bg-gradient-to-br from-primary-700/80 to-primary-500/60", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-lg text-primary-100 font-semibold", children: "Theme" }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { onClick: () => setTheme('light'), className: `p-3 rounded-xl text-xl font-bold ${theme === 'light' ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary-200'}`, "aria-label": "Light theme", children: _jsx(Sun, { size: 24 }) }), _jsx("button", { onClick: () => setTheme('dark'), className: `p-3 rounded-xl text-xl font-bold ${theme === 'dark' ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary-200'}`, "aria-label": "Dark theme", children: _jsx(Moon, { size: 24 }) }), _jsx("button", { onClick: () => setTheme('system'), className: `p-3 rounded-xl text-xl font-bold ${theme === 'system' ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary-200'}`, "aria-label": "System theme", children: "System" })] })] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent drop-shadow-lg mb-6", children: "\uD83E\uDDEA Feature Flags" }), _jsxs("div", { className: "p-8 glass modern-card rounded-2xl shadow-2xl bg-gradient-to-br from-primary-700/80 to-primary-500/60", children: [isLoadingConfig && (_jsxs("div", { className: "flex items-center justify-center py-6", children: [_jsx(Loader2, { className: "w-7 h-7 animate-spin text-primary mr-3" }), _jsx("span", { className: "text-primary-100 font-semibold", children: "Loading feature flags..." })] })), configError && (_jsxs("div", { className: "flex items-center text-red-400 bg-red-500/10 p-4 rounded-xl", children: [_jsx(AlertTriangle, { size: 24, className: "mr-3" }), " ", configError] })), !isLoadingConfig && !configError && appConfig?.featureFlags && Object.keys(appConfig.featureFlags || {}).length > 0 ? (_jsx("ul", { className: "space-y-4", children: Object.entries(appConfig.featureFlags || {}).map(([flagName, isEnabled]) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-lg text-primary-100 font-semibold capitalize", children: flagName.replace(/([A-Z])/g, ' $1').trim() }), _jsx("button", { onClick: () => handleFeatureToggle(flagName), "aria-label": `Toggle ${flagName}`, className: "focus:outline-none", children: isEnabled ? (_jsx(ToggleRight, { size: 36, className: "text-green-400 drop-shadow-lg" })) : (_jsx(ToggleLeft, { size: 36, className: "text-gray-400" })) })] }, flagName))) })) : (!isLoadingConfig && !configError && _jsx("p", { className: "text-primary-200", children: "No feature flags configured or available." }))] })] })] }));
};
export default Settings;
