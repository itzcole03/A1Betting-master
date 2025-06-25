import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Home, Settings, DollarSign, Menu, Moon, Sun, BarChart2, PieChart, TrendingUp, Zap, Layers, History, LineChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../providers/ThemeProvider'; // Assuming ThemeProvider is in src/providers
const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Player Props', path: '/player-props', icon: PieChart },
    { name: 'AI Predictions', path: '/ai-predictions', icon: BarChart2 },
    { name: 'Win Probabilities', path: '/win-probabilities', icon: TrendingUp },
    { name: 'Arbitrage', path: '/arbitrage', icon: Zap },
    { name: 'Smart Lineups', path: '/smart-lineups', icon: Layers },
    { name: 'Betting History', path: '/betting-history', icon: History },
    { name: 'ML Analytics', path: '/ml-analytics', icon: LineChart },
    { name: 'Bankroll', path: '/bankroll', icon: DollarSign },
    { name: 'Settings', path: '/settings', icon: Settings },
];
const Sidebar = () => {
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const SidebarContent = () => (_jsxs("div", { className: "flex flex-col h-full p-4 space-y-6 glass bg-gradient-to-br from-[#23235b]/80 to-[#1a1a2e]/90 text-text shadow-2xl border-r border-white/10", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-8", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg", children: "AI" }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-extrabold text-white tracking-tight", children: "Sports Analytics" }), _jsx("div", { className: "text-xs text-primary-200 font-medium opacity-80", children: "AI-Powered Platform" })] })] }), _jsx("nav", { className: "flex-grow", children: _jsx("ul", { className: "space-y-1", children: navItems.map((item) => (_jsx("li", { children: _jsxs(NavLink, { to: item.path, onClick: closeMobileMenu, className: ({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-base hover:bg-primary-600/20 hover:text-primary-400 modern-card shadow-sm ${isActive ? 'bg-primary-600/30 text-primary-200' : 'text-white/90'}`, children: [_jsx(item.icon, { className: "w-5 h-5 opacity-80" }), _jsx("span", { children: item.name })] }) }, item.name))) }) }), _jsxs("div", { className: "mt-auto space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 font-semibold text-xs shadow-inner", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulse" }), _jsx("span", { children: "Live Connected" })] }), _jsxs("button", { onClick: toggleTheme, className: "w-full flex items-center justify-center p-3 rounded-lg bg-primary-700/20 hover:bg-primary-700/40 transition-colors space-x-2 text-primary-200 font-semibold shadow-md", children: [theme === 'dark' ? _jsx(Sun, { className: "w-5 h-5" }) : _jsx(Moon, { className: "w-5 h-5" }), _jsxs("span", { children: [theme === 'dark' ? 'Light' : 'Dark', " Mode"] })] }), _jsx("div", { className: "flex items-center justify-center text-xs text-primary-300/80 mt-2", children: "ML Analytics" })] })] }));
    return (_jsxs(_Fragment, { children: [_jsx("aside", { className: "hidden md:block w-64 h-screen sticky top-0", children: _jsx(SidebarContent, {}) }), _jsx("div", { className: "md:hidden fixed top-4 left-4 z-50", children: _jsx("button", { onClick: toggleMobileMenu, className: "p-2 rounded-md bg-surface/80 text-text glass", children: _jsx(Menu, { className: "w-6 h-6" }) }) }), _jsx(AnimatePresence, { children: isMobileMenuOpen && (_jsxs(motion.div, { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: "md:hidden fixed inset-0 z-40 flex", children: [_jsx("div", { className: "w-64 h-full", children: _jsx(SidebarContent, {}) }), _jsx("div", { onClick: closeMobileMenu, className: "flex-1 bg-black/50 backdrop-blur-sm" })] })) })] }));
};
export default Sidebar;
