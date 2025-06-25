import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import CyberHeader from "./CyberHeader";
import CyberSidebar from "./CyberSidebar";
const CyberLayout = () => {
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);
    return (_jsxs("div", { className: "flex min-h-screen cyber-bg", children: [_jsx(CyberSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(CyberHeader, {}), _jsx("main", { className: "flex-1 p-8", style: {
                            background: "transparent",
                            minHeight: "calc(100vh - 120px)",
                        }, children: _jsx(Outlet, {}) }), _jsx("footer", { className: "glass-card border-t border-white/10 py-6", children: _jsxs("div", { className: "text-center text-sm text-gray-400", children: [_jsx("div", { className: "holographic font-semibold mb-1", children: "A1BETTING QUANTUM INTELLIGENCE" }), "\u00A9 2024 Advanced Sports Intelligence Platform \u2022 47 Neural Networks \u2022 1024 Qubits"] }) })] })] }));
};
export default CyberLayout;
