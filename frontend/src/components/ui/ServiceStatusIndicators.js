import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const SERVICE_KEYS = [
    'analytics', 'espn', 'odds', 'news', 'weather', 'injuries', 'realtime'
];
/**
 * Displays real-time connection/health status for all core backend services.
 * Reads from window.appStatus, which is updated by each service.
 */
export const ServiceStatusIndicators = () => {
    const [status, setStatus] = useState({});
    useEffect(() => {
        const updateStatus = () => setStatus(window.appStatus || {});
        updateStatus();
        const interval = setInterval(updateStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: SERVICE_KEYS.map(key => (_jsxs("div", { className: "p-4 border rounded-lg bg-white dark:bg-gray-900", children: [_jsx("div", { className: "font-semibold capitalize", children: key }), status[key] ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("span", { className: status[key].connected
                                        ? 'text-green-600'
                                        : 'text-red-600', children: status[key].connected ? 'Online' : 'Offline' }), _jsxs("span", { className: "ml-2 text-xs text-gray-500", children: ["Q: ", status[key].quality] })] }), _jsx("div", { className: "text-xs text-gray-400", children: new Date(status[key].timestamp).toLocaleTimeString() })] })) : (_jsx("span", { className: "text-gray-400", children: "No Data" }))] }, key))) }));
};
