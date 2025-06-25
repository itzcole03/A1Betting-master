import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, Activity, Zap, } from "lucide-react";
export const ModernCommandPalette = ({ isOpen, onClose, onNavigate, navigationItems = [], }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const commands = [
        // Convert navigation items to command items
        ...navigationItems.map((item) => ({
            id: item.id,
            label: `Go to ${item.label}`,
            description: `Navigate to ${item.label}`,
            icon: item.icon,
            shortcut: item.shortcut || [],
            action: () => onNavigate?.(item.id),
            category: "Navigation",
        })),
        // Additional actions
        {
            id: "refresh",
            label: "Refresh Data",
            description: "Reload latest information",
            icon: _jsx(Activity, { size: 16 }),
            shortcut: ["⌘", "R"],
            action: () => window.location.reload(),
            category: "Actions",
        },
        {
            id: "quick-bet",
            label: "Quick Bet",
            description: "Place a bet quickly",
            icon: _jsx(Zap, { size: 16 }),
            shortcut: ["⌘", "B"],
            action: () => console.log("Quick bet"),
            category: "Actions",
        },
    ];
    const filteredCommands = commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase()));
    const groupedCommands = filteredCommands.reduce((groups, cmd) => {
        if (!groups[cmd.category]) {
            groups[cmd.category] = [];
        }
        groups[cmd.category].push(cmd);
        return groups;
    }, {});
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen)
                return;
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action();
                        onClose();
                    }
                    break;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, onClose]);
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-start justify-center pt-20", onClick: onClose, children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, className: "w-full max-w-lg mx-4", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl" }), _jsxs("div", { className: "relative bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center px-4 py-4 border-b border-gray-700/50", children: [_jsx(Search, { size: 18, className: "text-gray-400 mr-3" }), _jsx("input", { ref: inputRef, type: "text", placeholder: "Search commands...", value: query, onChange: (e) => setQuery(e.target.value), className: "flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm" }), _jsxs("div", { className: "flex items-center space-x-1 text-xs text-gray-500", children: [_jsx("kbd", { className: "px-2 py-1 bg-gray-800 rounded text-xs", children: "ESC" }), _jsx("span", { children: "to close" })] })] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: Object.keys(groupedCommands).length === 0 ? (_jsxs("div", { className: "px-4 py-8 text-center text-gray-500", children: [_jsx(Search, { size: 24, className: "mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No commands found" })] })) : (Object.entries(groupedCommands).map(([category, categoryCommands]) => (_jsxs("div", { children: [_jsx("div", { className: "px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-800/50", children: category }), categoryCommands.map((cmd, index) => {
                                            const globalIndex = filteredCommands.indexOf(cmd);
                                            const isSelected = globalIndex === selectedIndex;
                                            return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.02 }, className: `
                            flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                            ${isSelected
                                                    ? "bg-blue-600/20 border-l-2 border-blue-400"
                                                    : "hover:bg-gray-800/50"}
                          `, onClick: () => {
                                                    cmd.action();
                                                    onClose();
                                                }, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `
                              p-2 rounded-lg transition-colors
                              ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-400"}
                            `, children: cmd.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-white", children: cmd.label }), cmd.description && (_jsx("div", { className: "text-xs text-gray-400", children: cmd.description }))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [cmd.shortcut && (_jsx("div", { className: "flex items-center space-x-1", children: cmd.shortcut.map((key, i) => (_jsx("kbd", { className: "px-2 py-1 bg-gray-800 rounded text-xs text-gray-400", children: key }, i))) })), isSelected && (_jsx(ArrowRight, { size: 14, className: "text-gray-400" }))] })] }, cmd.id));
                                        })] }, category)))) }), _jsx("div", { className: "px-4 py-3 bg-gray-800/50 border-t border-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("kbd", { className: "px-1 py-0.5 bg-gray-700 rounded", children: "\u2191\u2193" }), _jsx("span", { children: "navigate" })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("kbd", { className: "px-1 py-0.5 bg-gray-700 rounded", children: "\u23CE" }), _jsx("span", { children: "select" })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Command, { size: 12 }), _jsx("span", { children: "Command Palette" })] })] }) })] })] }) }) }));
};
export default ModernCommandPalette;
