// useNotificationCenter: React hook for managing notifications
// TODO: Add tests
import { useState, useCallback } from 'react';
export function useNotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const addNotification = useCallback((type, message) => {
        setNotifications((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).substr(2, 9),
                type,
                message,
                timestamp: Date.now(),
            },
        ]);
    }, []);
    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);
    return { notifications, addNotification, removeNotification };
}
