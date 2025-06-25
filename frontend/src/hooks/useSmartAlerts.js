import { useDataSync } from './useDataSync';
import { useRealtimeData } from './useRealtimeData';
import { useState, useCallback } from 'react';
export function useSmartAlerts({ enabledTypes = ['INJURY', 'LINEUP', 'WEATHER', 'LINE_MOVEMENT', 'ARBITRAGE'], minSeverity = 'low', wsEndpoint, onNewAlert }) {
    const [alerts, setAlerts] = useState([]);
    const { data: realtimeData, isConnected } = useRealtimeData({
        url: wsEndpoint,
        onMessage: (message) => {
            if (message.type === 'ALERT' && isAlertRelevant(message.data)) {
                handleNewAlert(message.data);
            }
        }
    });
    const { data: syncedAlerts } = useDataSync({
        key: 'smart-alerts',
        initialData: alerts,
        syncInterval: 60000
    });
    const isAlertRelevant = useCallback((alert) => {
        const severityLevels = { low: 0, medium: 1, high: 2 };
        return (enabledTypes.includes(alert.type) &&
            severityLevels[alert.severity] >= severityLevels[minSeverity]);
    }, [enabledTypes, minSeverity]);
    const handleNewAlert = useCallback((alert) => {
        setAlerts(prev => [alert, ...prev].slice(0, 100)); // Keep last 100 alerts
        onNewAlert?.(alert);
    }, [onNewAlert]);
    const markAsRead = useCallback((alertId) => {
        setAlerts(prev => prev.map(alert => alert.id === alertId ? { ...alert, read: true } : alert));
    }, []);
    const markAllAsRead = useCallback(() => {
        setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    }, []);
    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);
    const unreadCount = alerts.filter(alert => !alert.read).length;
    return {
        alerts,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAlerts,
        isConnected
    };
}
