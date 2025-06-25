import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RefreshCw, Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
export const EliteSportsHeader = ({ connectedSources, dataQuality, state = { darkMode: false }, toggleDarkMode, refreshData, loading, }) => {
    const { addToast } = useAppStore();
    const getDataStatusColor = () => {
        if (connectedSources === 0)
            return "text-red-600";
        if (dataQuality > 0.7)
            return "text-green-600";
        return "text-yellow-600";
    };
    const getDataStatusText = () => {
        if (connectedSources === 0)
            return "No Real Data";
        if (dataQuality > 0.7)
            return "High Quality Real Data";
        return "Limited Real Data";
    };
    return (_jsx("header", { className: "bg-white dark:bg-gray-800 shadow-sm p-6 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent", children: "Elite Sports Intelligence Platform" }), _jsxs("div", { className: "flex items-center space-x-4 mt-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [connectedSources > 0 ? (_jsx(Wifi, { className: "w-4 h-4 text-green-600" })) : (_jsx(WifiOff, { className: "w-4 h-4 text-red-600" })), _jsx("span", { className: `font-semibold text-sm ${getDataStatusColor()}`, children: getDataStatusText() })] }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsxs("span", { className: "font-semibold text-blue-600 text-sm", children: [connectedSources, " Sources Connected"] }), _jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsxs("span", { className: "font-semibold text-purple-600 text-sm", children: [(dataQuality * 100).toFixed(1), "% Data Quality"] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: refreshData, disabled: loading, className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }), _jsx("span", { children: loading ? "Refreshing..." : "Refresh Real Data" })] }), _jsx("button", { onClick: toggleDarkMode, className: "p-3 rounded-2xl glass-morphism hover:bg-white/20 transition-all", children: state.darkMode ? (_jsx(Sun, { className: "w-5 h-5" })) : (_jsx(Moon, { className: "w-5 h-5" })) })] })] }) }));
};
