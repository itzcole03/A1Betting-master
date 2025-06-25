import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCyberApp } from "../../contexts/CyberAppContext";
import StatusIndicator from "../ui/StatusIndicator";
const CyberHeader = () => {
    const { user, theme, setTheme } = useCyberApp();
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    };
    return (_jsx("header", { className: "glass-card border-b border-white/10 sticky top-0 z-50", style: {
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
        }, children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative float-element", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-electric-400 to-neon-blue rounded-xl blur-lg opacity-75" }), _jsx("div", { className: "relative w-10 h-10 bg-gradient-to-br from-electric-400 to-neon-blue rounded-xl flex items-center justify-center", children: _jsx("i", { className: "fas fa-brain text-black text-lg font-bold" }) })] }), _jsxs("div", { children: [_jsx("div", { className: "holographic text-xl font-black tracking-tight", children: "A1BETTING" }), _jsx("div", { className: "text-xs text-gray-400 uppercase tracking-widest", children: "Quantum Intelligence" })] })] }), _jsxs("div", { className: "hidden md:flex space-x-4", children: [_jsx(StatusIndicator, { status: "active", label: "All Systems Online" }), _jsx(StatusIndicator, { status: "active", label: "47 AI Models Active" })] })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "hidden lg:flex items-center space-x-6 text-sm", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-gray-400 uppercase", children: "Balance" }), _jsxs("div", { className: "font-bold text-green-400", children: ["$", user.balance.toLocaleString()] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-gray-400 uppercase", children: "AI Accuracy" }), _jsxs("div", { className: "font-bold text-electric-400", children: [user.accuracy, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-gray-400 uppercase", children: "Tier" }), _jsx("div", { className: "font-bold text-purple-400", children: user.tier })] })] }), _jsx("button", { onClick: toggleTheme, className: "p-3 glass-card rounded-xl hover:shadow-neon transition-all duration-300", children: _jsx("i", { className: `fas ${theme === "light" ? "fa-moon" : "fa-sun"} text-electric-400` }) }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-electric-400 rounded-full blur-sm opacity-50" }), _jsx("img", { src: "https://ui-avatars.com/api/?name=Alex+Chen&background=000&color=00ff88&bold=true", alt: "Profile", className: "relative w-9 h-9 rounded-full border-2 border-electric-400" })] }), _jsxs("div", { className: "hidden md:block", children: [_jsx("div", { className: "font-semibold text-white text-sm", children: user.name }), _jsx("div", { className: "text-xs text-gray-400", children: user.email })] })] })] })] }) }) }));
};
export default CyberHeader;
