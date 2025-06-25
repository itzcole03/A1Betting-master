import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, TrendingUp, AlertTriangle, CheckCircle, Info, DollarSign, Activity, Clock, Star, Trash2, } from "lucide-react";
const defaultNotifications = [
    {
        id: "1",
        type: "betting",
        title: "High Value Opportunity Detected",
        message: "Lakers vs Warriors - Over 235.5 points has 89% confidence",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        priority: "high",
        metadata: {
            odds: 1.85,
            game: "Lakers vs Warriors",
        },
        action: {
            label: "View Bet",
            onClick: () => console.log("View bet"),
        },
    },
    {
        id: "2",
        type: "success",
        title: "Bet Won!",
        message: "Your bet on Celtics -5.5 won! +$247.50 added to balance.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: "medium",
        metadata: {
            amount: 247.5,
        },
        action: {
            label: "View Details",
            onClick: () => console.log("View details"),
        },
    },
    {
        id: "3",
        type: "info",
        title: "Model Update",
        message: "NBA prediction model updated with new player injury data",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: "low",
    },
    {
        id: "4",
        type: "warning",
        title: "Bankroll Alert",
        message: "You've used 75% of your daily betting limit",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        priority: "medium",
    },
];
const getNotificationIcon = (type) => {
    switch (type) {
        case "success":
            return _jsx(CheckCircle, { size: 16, className: "text-green-400" });
        case "warning":
            return _jsx(AlertTriangle, { size: 16, className: "text-yellow-400" });
        case "error":
            return _jsx(X, { size: 16, className: "text-red-400" });
        case "betting":
            return _jsx(TrendingUp, { size: 16, className: "text-blue-400" });
        default:
            return _jsx(Info, { size: 16, className: "text-gray-400" });
    }
};
const getNotificationColor = (type) => {
    switch (type) {
        case "success":
            return "border-l-green-400 bg-green-500/5";
        case "warning":
            return "border-l-yellow-400 bg-yellow-500/5";
        case "error":
            return "border-l-red-400 bg-red-500/5";
        case "betting":
            return "border-l-blue-400 bg-blue-500/5";
        default:
            return "border-l-gray-400 bg-gray-500/5";
    }
};
const getPriorityIndicator = (priority) => {
    switch (priority) {
        case "high":
            return _jsx("div", { className: "w-2 h-2 bg-red-400 rounded-full animate-pulse" });
        case "medium":
            return _jsx("div", { className: "w-2 h-2 bg-yellow-400 rounded-full" });
        default:
            return _jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full" });
    }
};
const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1)
        return "Just now";
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    return `${days}d ago`;
};
export const ModernNotificationCenter = ({ isOpen, onClose, notifications = defaultNotifications, onMarkAsRead, onDelete, onClearAll, }) => {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const sortedNotifications = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50", onClick: onClose, children: _jsxs(motion.div, { initial: { opacity: 0, x: 400 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 400 }, className: "absolute right-0 top-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-700/50", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Bell, { size: 20, className: "text-gray-400" }), _jsx("h2", { className: "text-lg font-semibold text-white", children: "Notifications" }), unreadCount > 0 && (_jsx("span", { className: "px-2 py-1 bg-blue-600 text-white text-xs rounded-full", children: unreadCount }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [notifications.length > 0 && (_jsx("button", { onClick: onClearAll, className: "p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors", title: "Clear all", children: _jsx(Trash2, { size: 16 }) })), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors", children: _jsx(X, { size: 16 }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-gray-500", children: [_jsx(Bell, { size: 32, className: "mb-4 opacity-50" }), _jsx("p", { className: "text-lg font-medium", children: "No notifications" }), _jsx("p", { className: "text-sm", children: "You're all caught up!" })] })) : (_jsx("div", { className: "space-y-1 p-4", children: sortedNotifications.map((notification, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: `
                      group relative p-4 rounded-xl border-l-4 cursor-pointer transition-all
                      ${getNotificationColor(notification.type)}
                      ${notification.read ? "opacity-70" : ""}
                      ${selectedNotification === notification.id ? "bg-gray-800/50" : "hover:bg-gray-800/30"}
                    `, onClick: () => {
                                    setSelectedNotification(notification.id);
                                    if (!notification.read && onMarkAsRead) {
                                        onMarkAsRead(notification.id);
                                    }
                                }, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 pt-1", children: getNotificationIcon(notification.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h4", { className: "text-sm font-medium text-white truncate", children: notification.title }), !notification.read && (_jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" }))] }), _jsxs("div", { className: "flex items-center space-x-2 ml-2", children: [getPriorityIndicator(notification.priority), _jsx("button", { onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        onDelete?.(notification.id);
                                                                    }, className: "opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all", children: _jsx(X, { size: 12 }) })] })] }), _jsx("p", { className: "mt-1 text-sm text-gray-300 line-clamp-2", children: notification.message }), notification.metadata && (_jsxs("div", { className: "mt-2 flex items-center space-x-4 text-xs", children: [notification.metadata.amount && (_jsxs("div", { className: "flex items-center space-x-1 text-green-400", children: [_jsx(DollarSign, { size: 12 }), _jsxs("span", { children: ["+$", notification.metadata.amount] })] })), notification.metadata.odds && (_jsxs("div", { className: "flex items-center space-x-1 text-blue-400", children: [_jsx(Star, { size: 12 }), _jsx("span", { children: notification.metadata.odds })] })), notification.metadata.game && (_jsxs("div", { className: "flex items-center space-x-1 text-gray-400", children: [_jsx(Activity, { size: 12 }), _jsx("span", { children: notification.metadata.game })] }))] })), _jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-1 text-xs text-gray-500", children: [_jsx(Clock, { size: 12 }), _jsx("span", { children: formatTimestamp(notification.timestamp) })] }), notification.action && (_jsx("button", { onClick: (e) => {
                                                                e.stopPropagation();
                                                                notification.action.onClick();
                                                            }, className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors", children: notification.action.label }))] })] })] }) }, notification.id))) })) }), _jsx("div", { className: "p-4 border-t border-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("span", { children: [notifications.length, " total notifications"] }), unreadCount > 0 && (_jsx("button", { onClick: () => {
                                        notifications.forEach((n) => {
                                            if (!n.read && onMarkAsRead) {
                                                onMarkAsRead(n.id);
                                            }
                                        });
                                    }, className: "text-blue-400 hover:text-blue-300 transition-colors", children: "Mark all as read" }))] }) })] }) }) }));
};
export default ModernNotificationCenter;
