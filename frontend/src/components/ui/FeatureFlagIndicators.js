import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { isFeatureEnabled } from '../../services/configService.js';
const features = [
    'INJURIES', 'NEWS', 'WEATHER', 'REALTIME', 'ESPN', 'ODDS', 'ANALYTICS'
];
/**
 * Displays the enabled/disabled state of all major feature flags.
 * Uses isFeatureEnabled to dynamically query each flag.
 */
export const FeatureFlagIndicators = () => {
    const [flags, setFlags] = React.useState({});
    React.useEffect(() => {
        const fetchFlags = async () => {
            const results = {};
            for (const feature of features) {
                results[feature] = await isFeatureEnabled(feature);
            }
            setFlags(results);
        };
        fetchFlags();
    }, []);
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: features.map(key => (_jsxs("div", { className: "p-4 border rounded-lg bg-white dark:bg-gray-900", children: [_jsx("div", { className: "font-semibold", children: key }), _jsx("span", { className: flags[key] ? 'text-green-600' : 'text-red-600', children: flags[key] ? 'Enabled' : 'Disabled' })] }, key))) }));
};
