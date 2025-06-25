import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button, Card, Badge, Icon } from './UnifiedUI.js';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry.js';
export const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const notificationService = serviceRegistry.getService('notification');
    const stateService = serviceRegistry.getService('state');
    const webSocketService = serviceRegistry.getService('websocket');
    useEffect(() => {
        const updateNotifications = () => {
            const state = stateService.getState();
            setNotifications(state.notifications);
            setUnreadCount(notificationService.getUnreadCount());
        };
        // Initial update
        updateNotifications();
        // Setup WebSocket connection
        webSocketService.connect();
        // Subscribe to real-time updates
        const unsubscribe = webSocketService.subscribe('notifications', (_data) => {
            updateNotifications();
        });
        return () => {
            unsubscribe();
            webSocketService.disconnect();
        };
    }, [notificationService, stateService, webSocketService]);
    const handleMarkAsRead = (id) => {
        notificationService.markAsRead(id);
    };
    const handleClearAll = () => {
        notificationService.clearAll();
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'x-circle';
            case 'warning':
                return 'alert-triangle';
            default:
                return 'info';
        }
    };
    const getNotificationVariant = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'danger';
            case 'warning':
                return 'warning';
            default:
                return 'primary';
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs(Button, { className: "relative", size: "small", variant: "ghost", onClick: () => setIsOpen(!isOpen), children: [_jsx(Icon, { className: "w-5 h-5", name: "bell" }), unreadCount > 0 && (_jsx(Badge, { className: "absolute -top-1 -right-1", variant: "danger", children: unreadCount }))] }), isOpen && (_jsx(Card, { className: "absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50", variant: "bordered", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Notifications" }), _jsx("div", { className: "space-x-2", children: _jsx(Button, { size: "small", variant: "ghost", onClick: handleClearAll, children: "Clear all" }) })] }), notifications.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No notifications" })) : (_jsx("div", { className: "space-y-2", children: notifications.map(notification => (_jsx("div", { className: `p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Icon, { className: `w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`, name: getNotificationIcon(notification.type) }), _jsxs("div", { className: "flex-1", children: [notification.title && (_jsx("h4", { className: "font-medium mb-1", children: notification.title })), _jsx("p", { className: "text-sm", children: notification.message }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(notification.timestamp).toLocaleString() })] }), !notification.read && (_jsx(Button, { size: "small", variant: "ghost", onClick: () => handleMarkAsRead(notification.id), children: "Mark as read" }))] }) }, notification.id))) }))] }) }))] }));
};
