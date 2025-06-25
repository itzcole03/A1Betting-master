import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AdminPanel component for the UltimateSportsBettingApp.
 *
 * Provides an administrative interface for managing users, viewing system logs, and monitoring system statistics.
 * Accessible only to authorized admin users. Utilizes React Query for data fetching and Framer Motion for animations.
 */
import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatters.js';
import { adminService } from '../../services/adminService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { motion } from 'framer-motion';
// Temporary fallback for formatNumber if not exported from formatters.js
const formatNumber = (value) => (typeof value === 'number' ? value.toLocaleString() : '');
/**
 * AdminPanel component provides an administrative interface for managing users, viewing system logs, and monitoring system statistics.
 *
 * Props: None
 *
 * State:
 * - activeTab: Controls which admin tab is active ('users', 'logs', or 'stats').
 * - searchQuery: Filters the user list by name or email.
 *
 * Behavior:
 * - Fetches users, logs, and system metrics using React Query.
 * - Allows admin to update user status (active/suspended).
 * - Displays system logs and key system metrics.
 */
const AdminPanel = () => {
    useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    // Fetch users
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => adminService.getUsers(),
    });
    // Fetch logs
    const { data: logs, isLoading: logsLoading } = useQuery({
        queryKey: ['admin-logs'],
        queryFn: () => adminService.getLogs(),
    });
    // Fetch system metrics
    const { data: metrics, isLoading: metricsLoading } = useQuery({
        queryKey: ['admin-metrics'],
        queryFn: () => adminService.getMetrics(),
    });
    /**
     * Updates the status of a user (active or suspended).
     *
     * @param userId - The unique identifier of the user to update.
     * @param status - The new status to set for the user ('active' or 'suspended').
     * @sideEffect Shows a toast notification on success or failure, and invalidates the users query cache.
     */
    const handleUserStatusUpdate = async (userId, status) => {
        try {
            await adminService.updateUserStatus(userId, status);
            toast.success('User status updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
        catch {
            toast.error('Failed to update user status');
        }
    };
    const filteredUsers = useMemo(() => users?.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())), [users, searchQuery]);
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent", children: "Admin Panel" }), _jsx("div", { className: "flex space-x-4", children: _jsx("input", { type: "text", placeholder: "Search users...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "form-input" }) })] }), _jsx("div", { className: "border-b border-gray-200 dark:border-gray-700", children: _jsx("nav", { className: "flex space-x-8", children: ['users', 'logs', 'stats'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }) }), _jsxs("div", { className: "mt-6", children: [activeTab === 'users' && (_jsx("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "User" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Role" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Last Login" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: usersLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center", children: "Loading..." }) })) : (filteredUsers?.map((user) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user.name }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: user.email })] }) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'}`, children: user.status }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: user.role }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children: formatDate(user.lastLogin) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsx("button", { onClick: () => handleUserStatusUpdate(user.id, user.status === 'active' ? 'suspended' : 'active'), className: "text-primary-600 hover:text-primary-900 dark:hover:text-primary-400", children: user.status === 'active' ? 'Suspend' : 'Activate' }) })] }, user.id)))) })] }) })), activeTab === 'logs' && (_jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden", children: [_jsx("div", { className: "px-6 py-4", children: _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "System Logs" }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700", children: logsLoading ? (_jsx("div", { className: "px-6 py-4 text-center", children: "Loading..." })) : (_jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: logs?.map((log) => (_jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: log.message }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: formatDate(log.timestamp) })] }), _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.level === 'error'
                                                        ? 'bg-red-100 text-red-800'
                                                        : log.level === 'warning'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'}`, children: log.level })] }) }, log.id))) })) })] })), activeTab === 'stats' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(motion.div, { whileHover: { scale: 1.02 }, className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Total Users" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-primary-600", children: metricsLoading ? '...' : formatNumber(metrics?.totalUsers) })] }), _jsxs(motion.div, { whileHover: { scale: 1.02 }, className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Active Sessions" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-primary-600", children: metricsLoading ? '...' : formatNumber(metrics?.activeSessions) })] }), _jsxs(motion.div, { whileHover: { scale: 1.02 }, className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Total Predictions" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-primary-600", children: metricsLoading ? '...' : formatNumber(metrics?.totalPredictions) })] }), _jsxs(motion.div, { whileHover: { scale: 1.02 }, className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "System Uptime" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-primary-600", children: metricsLoading ? '...' : metrics?.uptime })] })] }))] })] }));
};
export default AdminPanel;
