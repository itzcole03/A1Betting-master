import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { UnifiedConfig } from '../unified/UnifiedConfig.js';
import { EventBus } from '../unified/EventBus.js';
const FEATURES = [
    { key: 'enablePvPModel', label: 'PvP Matchup Model' },
    { key: 'enablePlayerFormModel', label: 'Player Form Model' },
    { key: 'enableVenueEffectModel', label: 'Venue Effect Model' },
    { key: 'enableRefereeImpactModel', label: 'Referee Impact Model' },
    { key: 'enableLineupSynergyModel', label: 'Lineup Synergy Model' },
    { key: 'enableNews', label: 'News Service' },
    { key: 'enableWeather', label: 'Weather Service' },
    { key: 'enableInjuries', label: 'Injury Feed' },
    { key: 'enableAnalytics', label: 'Analytics Engine' },
    { key: 'enableSocialSentiment', label: 'Social Sentiment' }
];
export const FeatureStatusPanel = () => {
    const [statuses, setStatuses] = useState({});
    useEffect(() => {
        const config = UnifiedConfig.getInstance();
        const initialStatuses = {};
        FEATURES.forEach(({ key }) => {
            const flag = config.get(key);
            initialStatuses[key] = Boolean(flag && flag.enabled);
        });
        setStatuses(initialStatuses);
        const handler = () => {
            const updated = {};
            FEATURES.forEach(({ key }) => {
                const flag = config.get(key);
                updated[key] = Boolean(flag && flag.enabled);
            });
            setStatuses(updated);
        };
        const eventBus = EventBus.getInstance();
        eventBus.on('config:update', handler);
        return () => {
            eventBus.off('config:update', handler);
        };
    }, []);
    return (_jsxs("div", { className: "bg-white shadow rounded-lg p-6 w-full max-w-md mx-auto", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Feature Status" }), _jsx("ul", { className: "divide-y divide-gray-200", children: FEATURES.map(({ key, label }) => (_jsxs("li", { className: "flex items-center justify-between py-2", children: [_jsx("span", { className: "font-medium text-gray-700", children: label }), _jsx("span", { className: statuses[key]
                                ? 'px-2 py-1 text-xs rounded bg-green-100 text-green-800'
                                : 'px-2 py-1 text-xs rounded bg-red-100 text-red-800', children: statuses[key] ? 'Enabled' : 'Disabled' })] }, key))) })] }));
};
export default FeatureStatusPanel;
