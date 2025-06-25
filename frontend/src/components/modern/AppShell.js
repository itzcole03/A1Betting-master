import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './Header';
import React from 'react';
import Sidebar from './Sidebar';
import useStore from '../../store/useStore';
import { Outlet, useLocation } from 'react-router-dom';
const AppShell = () => {
    const location = useLocation();
    const darkMode = useStore(state => state.darkMode);
    const sidebarOpen = useStore(state => state.sidebarOpen);
    const toggleSidebar = useStore(state => state.toggleSidebar);
    return (_jsx("div", { className: `min-h-screen ${darkMode ? 'dark' : ''}`, children: _jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Sidebar, { currentPath: location.pathname, isOpen: sidebarOpen, onClose: () => toggleSidebar() }), _jsxs("div", { className: `flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`, children: [_jsx(Header, { isSidebarOpen: sidebarOpen, onToggleSidebar: () => toggleSidebar() }), _jsx("main", { className: "flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900", children: _jsx("div", { className: "container mx-auto px-4 py-6", children: _jsx(Outlet, {}) }) }), _jsx("footer", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " BetPro AI. All rights reserved."] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("a", { className: "text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", href: "/terms", children: "Terms" }), _jsx("a", { className: "text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", href: "/privacy", children: "Privacy" }), _jsx("a", { className: "text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", href: "/support", children: "Support" })] })] }) })] })] }) }));
};
export default React.memo(AppShell);
