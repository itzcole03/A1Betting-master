import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { Button, Badge, Modal, Toast } from '../ui/UnifiedUI';
const NAVIGATION_ITEMS = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: '📊',
    },
    {
        path: '/predictions',
        label: 'Predictions',
        icon: '🎯',
    },
    {
        path: '/betting',
        label: 'Betting',
        icon: '💰',
        requiresAuth: true,
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: '📈',
        requiresAuth: true,
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: '⚙️',
    },
    {
        path: '/admin',
        label: 'Admin',
        icon: '👑',
        adminOnly: true,
    },
];
export const UnifiedNavigation = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const settingsService = serviceRegistry.getService('settings');
    const stateService = serviceRegistry.getService('state');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    // State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [notifications, setNotifications] = useState(0);
    const [user, setUser] = useState(null);
    const location = useLocation();
    // Load user data and notifications
    useEffect(() => {
        loadUserData();
        setupNotificationListener();
    }, []);
    const loadUserData = async () => {
        try {
            const currentUser = await stateService.getState('user');
            setUser(currentUser);
        }
        catch (error) {
            handleError('Failed to load user data', error);
        }
    };
    const setupNotificationListener = () => {
        notificationService.subscribe(notification => {
            setNotifications(prev => prev + 1);
        });
    };
    const handleError = (message, error) => {
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'NAVIGATION_ERROR',
            source: 'UnifiedNavigation',
            details: { message },
        });
    };
    const handleLogout = async () => {
        try {
            await stateService.clearState();
            window.location.href = '/login';
        }
        catch (error) {
            handleError('Failed to logout', error);
        }
    };
    const isActive = (path) => {
        return location.pathname === path;
    };
    const canAccess = (item) => {
        if (item.adminOnly && (!user || !user.isAdmin)) {
            return false;
        }
        if (item.requiresAuth && !user) {
            return false;
        }
        return true;
    };
    return (_jsxs("nav", { className: `fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`, children: [_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "p-4 border-b dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [!isCollapsed && (_jsx("h1", { className: "text-xl font-bold text-gray-800 dark:text-white", children: "Betting App" })), _jsx(Button, { className: "p-2", variant: "ghost", onClick: () => setIsCollapsed(!isCollapsed), children: isCollapsed ? '→' : '←' })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto py-4", children: NAVIGATION_ITEMS.map(item => canAccess(item) && (_jsxs(Link, { className: `flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isActive(item.path) ? 'bg-gray-100 dark:bg-gray-700' : ''}`, to: item.path, children: [_jsx("span", { className: "text-xl mr-3", children: item.icon }), !isCollapsed && (_jsxs(_Fragment, { children: [_jsx("span", { className: "flex-1", children: item.label }), item.badge && _jsx(Badge, { variant: "primary", children: item.badge })] }))] }, item.path))) }), _jsxs("div", { className: "p-4 border-t dark:border-gray-700", children: [!isCollapsed && user && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center", children: user.avatar || user.name?.[0] || '👤' }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-white", children: user.name }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: user.email })] })] }) })), _jsxs(Button, { className: "w-full justify-start", variant: "ghost", onClick: () => setShowLogoutModal(true), children: [_jsx("span", { className: "text-xl mr-3", children: "\uD83D\uDEAA" }), !isCollapsed && 'Logout'] })] })] }), _jsx(Modal, { isOpen: showLogoutModal, title: "Confirm Logout", onClose: () => setShowLogoutModal(false), children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-600 mb-6", children: "Are you sure you want to logout? Any unsaved changes will be lost." }), _jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowLogoutModal(false), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleLogout, children: "Logout" })] })] }) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
