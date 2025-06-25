import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../providers/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { SunIcon, MoonIcon, ChartBarIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggle: toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const handleLogout = () => {
        setShowProfileMenu(false);
        logout();
    };
    return (_jsx("nav", { className: "fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-8", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2", children: [_jsx("img", { src: "/favicon.svg", alt: "BetPro AI Logo", className: "h-8 w-8" }), _jsx("span", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "BetPro AI" })] }), _jsx("div", { className: "hidden sm:flex items-center space-x-4", children: _jsxs(Link, { to: "/dashboard", className: "flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(ChartBarIcon, { className: "w-5 h-5 mr-2" }), "Dashboard"] }) })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800", "aria-label": "Toggle theme", children: isDark ? (_jsx(SunIcon, { className: "w-5 h-5" })) : (_jsx(MoonIcon, { className: "w-5 h-5" })) }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowProfileMenu(!showProfileMenu), className: "flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(UserCircleIcon, { className: "w-6 h-6" }), _jsx("span", { className: "text-sm font-medium", children: user?.username })] }), _jsx(AnimatePresence, { children: showProfileMenu && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5", children: [_jsxs(Link, { to: "/settings", className: "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700", onClick: () => setShowProfileMenu(false), children: [_jsx(Cog6ToothIcon, { className: "w-5 h-5 mr-2" }), "Settings"] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700", children: [_jsx(ArrowLeftOnRectangleIcon, { className: "w-5 h-5 mr-2" }), "Sign out"] })] })) })] })] })] }) }) }));
};
export default Navbar;
