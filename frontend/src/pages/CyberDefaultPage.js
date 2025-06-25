import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from "../components/ui/GlassCard";
import CyberButton from "../components/ui/CyberButton";
const CyberDefaultPage = ({ title, description, icon, }) => {
    return (_jsxs("div", { className: "space-y-8 animate-slide-in-up", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-6xl mb-6 text-electric-400 float-element", children: _jsx("i", { className: icon }) }), _jsx("h1", { className: "holographic text-4xl font-black mb-4", children: title }), _jsx("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto", children: description })] }), _jsxs(GlassCard, { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-500 mb-6", children: "Advanced feature interface coming soon..." }), _jsx(CyberButton, { label: "Configure", variant: "ghost" })] })] }));
};
export default CyberDefaultPage;
