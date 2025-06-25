import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Bell, Search, Menu, X, Zap, Activity } from "lucide-react";
// Import our new modern components
import ModernStatusBar from "../ui/ModernStatusBar";
import ModernCommandPalette from "../ui/ModernCommandPalette";
import ModernNotificationCenter from "../ui/ModernNotificationCenter";
import ModernActivityFeed from "../ui/ModernActivityFeed";
export const EnhancedModernLayout = ({ children, sidebar, header, onNavigate, className = "", }) => {
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
    const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Command palette (Cmd/Ctrl + K)
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
            // Notifications (Cmd/Ctrl + N)
            if ((e.metaKey || e.ctrlKey) && e.key === "n") {
                e.preventDefault();
                setIsNotificationCenterOpen(true);
            }
            // Activity feed (Cmd/Ctrl + A)
            if ((e.metaKey || e.ctrlKey) && e.key === "a") {
                e.preventDefault();
                setIsActivityFeedOpen(true);
            }
            // Escape to close all overlays
            if (e.key === "Escape") {
                setIsCommandPaletteOpen(false);
                setIsNotificationCenterOpen(false);
                setIsActivityFeedOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (_jsxs("div", { className: `min-h-screen bg-gray-950 text-white relative overflow-hidden ${className}`, children: [_jsxs("div", { className: "fixed inset-0 opacity-30", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-cyan-900/20" }), _jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/10 via-transparent to-transparent" })] }), _jsx(ModernStatusBar, {}), _jsxs("div", { className: "relative flex h-screen pt-12", children: [_jsxs(motion.div, { initial: false, animate: {
                            width: sidebarCollapsed ? 80 : 280,
                            opacity: 1,
                        }, transition: { duration: 0.3, ease: "easeInOut" }, className: "relative z-30 flex-shrink-0 border-r border-gray-800/50 backdrop-blur-xl bg-gray-900/50", children: [_jsx("button", { onClick: () => setSidebarCollapsed(!sidebarCollapsed), className: "absolute -right-3 top-6 z-40 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-colors", children: _jsx(Menu, { size: 14, className: "text-gray-400" }) }), _jsx("div", { className: "h-full overflow-hidden", children: sidebar })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "flex-shrink-0 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/30", children: _jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsx("div", { className: "flex-1", children: header }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => setIsCommandPaletteOpen(true), className: "flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all group", title: "Search (\u2318K)", children: [_jsx(Search, { size: 14, className: "text-gray-400 group-hover:text-white" }), _jsx("span", { className: "text-xs text-gray-400 group-hover:text-white hidden md:block", children: "Search..." }), _jsx("kbd", { className: "px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-xs hidden md:block", children: "\u2318K" })] }), _jsxs("button", { onClick: () => setIsActivityFeedOpen(!isActivityFeedOpen), className: "p-2 hover:bg-gray-800/50 rounded-lg transition-colors relative", title: "Activity Feed (\u2318A)", children: [_jsx(Activity, { size: 18, className: "text-gray-400 hover:text-white" }), _jsx("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" })] }), _jsxs("button", { onClick: () => setIsNotificationCenterOpen(true), className: "p-2 hover:bg-gray-800/50 rounded-lg transition-colors relative", title: "Notifications (\u2318N)", children: [_jsx(Bell, { size: 18, className: "text-gray-400 hover:text-white" }), _jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center", children: "3" })] }), _jsx("button", { onClick: () => setIsCommandPaletteOpen(true), className: "p-2 hover:bg-gray-800/50 rounded-lg transition-colors", title: "Command Palette (\u2318K)", children: _jsx(Command, { size: 18, className: "text-gray-400 hover:text-white" }) })] })] }) }), _jsxs("div", { className: "flex-1 relative", children: [_jsx("div", { className: "absolute inset-0 overflow-auto", children: _jsx("div", { className: "p-6", children: children }) }), _jsx(AnimatePresence, { children: isActivityFeedOpen && (_jsx(motion.div, { initial: { opacity: 0, x: 400 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 400 }, className: "absolute right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-20", children: _jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-700/50", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Activity Feed" }), _jsx("button", { onClick: () => setIsActivityFeedOpen(false), className: "p-2 hover:bg-gray-800 rounded-lg transition-colors", children: _jsx(X, { size: 16, className: "text-gray-400" }) })] }), _jsx("div", { className: "flex-1 overflow-auto p-4", children: _jsx(ModernActivityFeed, {}) })] }) })) })] })] })] }), _jsx(ModernCommandPalette, { isOpen: isCommandPaletteOpen, onClose: () => setIsCommandPaletteOpen(false), onNavigate: (page) => {
                    onNavigate?.(page);
                    setIsCommandPaletteOpen(false);
                } }), _jsx(ModernNotificationCenter, { isOpen: isNotificationCenterOpen, onClose: () => setIsNotificationCenterOpen(false), onMarkAsRead: (id) => console.log("Mark as read:", id), onDelete: (id) => console.log("Delete:", id), onClearAll: () => console.log("Clear all") }), _jsx(motion.button, { initial: { scale: 0 }, animate: { scale: 1 }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => setIsCommandPaletteOpen(true), className: "fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl z-30 transition-all", title: "Quick Actions (\u2318K)", children: _jsx(Zap, { size: 20 }) }), _jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse", style: { animationDelay: "2s" } })] })] }));
};
export default EnhancedModernLayout;
