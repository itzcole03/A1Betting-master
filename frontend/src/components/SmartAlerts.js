import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSmartAlerts } from '../hooks/useSmartAlerts';
const severityColors = {
    low: 'bg-blue-100 border-blue-500 text-blue-800',
    medium: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    high: 'bg-red-100 border-red-500 text-red-800',
};
const typeIcons = {
    INJURY: '🏥',
    LINEUP: '👥',
    WEATHER: '🌤️',
    LINE_MOVEMENT: '📈',
    ARBITRAGE: '💰',
};
export const SmartAlerts = ({ wsEndpoint, onAlertClick }) => {
    const { alerts, unreadCount, markAsRead, markAllAsRead, clearAlerts, isConnected } = useSmartAlerts({
        wsEndpoint,
        onNewAlert: alert => {
            // Show browser notification for high severity alerts
            if (alert.severity === 'high' && Notification.permission === 'granted') {
                new Notification(`${typeIcons[alert.type]} ${alert.title}`, {
                    body: alert.message,
                    icon: '/favicon.ico',
                });
            }
        },
    });
    const handleAlertClick = (alert) => {
        markAsRead(alert.id);
        onAlertClick?.(alert);
    };
    return (_jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Smart Alerts" }), unreadCount > 0 && (_jsx("span", { className: "px-2 py-1 text-sm bg-red-500 text-white rounded-full", children: unreadCount }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-sm text-gray-600 hover:text-gray-800", onClick: () => markAllAsRead(), children: "Mark All Read" }), _jsx("button", { className: "text-sm text-red-600 hover:text-red-800", onClick: () => clearAlerts(), children: "Clear All" })] })] }), _jsx("div", { className: `px-4 py-2 ${isConnected ? 'bg-green-50' : 'bg-red-50'}`, children: _jsxs("span", { className: "text-sm flex items-center", children: [_jsx("span", { className: `w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}` }), isConnected ? 'Connected' : 'Disconnected'] }) }), _jsx("div", { className: "divide-y divide-gray-200 max-h-96 overflow-y-auto", children: alerts.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: "No alerts to display" })) : (alerts.map(alert => (_jsx("div", { className: `p-4 cursor-pointer transition-colors hover:bg-gray-50 ${!alert.read ? 'bg-opacity-50' : ''} ${severityColors[alert.severity]}`, onClick: () => handleAlertClick(alert), children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("span", { className: "text-2xl", children: typeIcons[alert.type] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "font-medium text-gray-900", children: alert.title }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(alert.timestamp).toLocaleTimeString() })] }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: alert.message }), alert.metadata && (_jsxs("div", { className: "mt-2 text-sm text-gray-500", children: [alert.metadata.impactScore && (_jsxs("span", { className: "mr-3", children: ["Impact: ", alert.metadata.impactScore.toFixed(2)] })), alert.metadata.lineMovement && (_jsxs("span", { children: ["Movement: ", alert.metadata.lineMovement.from, " \u2192", ' ', alert.metadata.lineMovement.to, " (", alert.metadata.lineMovement.book, ")"] }))] }))] })] }) }, alert.id)))) })] }));
};
