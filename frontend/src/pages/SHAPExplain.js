import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from '../components/ui/GlassCard';
const SHAPExplain = () => {
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "max-w-5xl w-full p-10", children: [_jsx("h1", { className: "text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6", children: "SHAP Value Analysis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(GlassCard, { children: _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Feature Importance" }) }), _jsx(GlassCard, { children: _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Prediction Breakdown" }) }), _jsx(GlassCard, { children: _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Feature Interactions" }) })] })] }) }));
};
export default SHAPExplain;
