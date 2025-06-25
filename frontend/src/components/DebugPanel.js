import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConfigFlags } from '../hooks/useConfigFlags';
import { useEventBus } from '../hooks/useEventBus';
export const DebugPanel = () => {
    const flags = useConfigFlags();
    const recentEvents = useEventBus().recentEvents;
    return (_jsxs("div", { className: "debug-panel p-4 bg-gray-800 text-white text-sm fixed bottom-0 right-0 w-96 max-h-96 overflow-auto z-50", children: [_jsx("h2", { className: "font-bold mb-2", children: "Debug Panel" }), _jsxs("div", { children: [_jsx("h3", { className: "underline mb-1", children: "Config Flags" }), _jsx("pre", { children: JSON.stringify(flags, null, 2) })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "underline mb-1", children: "Recent EventBus Emissions" }), _jsx("pre", { children: JSON.stringify(recentEvents, null, 2) })] })] }));
};
