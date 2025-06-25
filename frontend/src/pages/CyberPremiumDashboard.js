import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MetricCard from "../components/ui/MetricCard";
const CyberPremiumDashboard = () => {
    return (_jsxs("div", { className: "space-y-8 animate-slide-in-up", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("h1", { className: "holographic text-4xl font-black mb-4 flex items-center justify-center", children: [_jsx("i", { className: "fas fa-crown mr-3" }), "Premium Quantum Dashboard"] }), _jsx("p", { className: "text-xl text-gray-400", children: "Advanced quantum-enhanced AI with 1024 qubits" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(MetricCard, { label: "Active Qubits", value: "1024", icon: "fa-atom", change: "+64", trend: "up" }), _jsx(MetricCard, { label: "Entanglement", value: "99.97%", icon: "fa-link", change: "+0.03%", trend: "up" }), _jsx(MetricCard, { label: "Coherence Time", value: "2.1ms", icon: "fa-clock", change: "+0.2ms", trend: "up" })] })] }));
};
export default CyberPremiumDashboard;
