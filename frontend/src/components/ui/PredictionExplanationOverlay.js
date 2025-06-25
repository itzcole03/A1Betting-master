import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from './GlassCard';
const PredictionExplanationOverlay = ({ open, onClose, data }) => {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in", children: _jsx("div", { className: "relative w-full max-w-lg mx-auto animate-scale-in", children: _jsxs(GlassCard, { className: "p-8", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-primary-500 text-2xl font-bold focus:outline-none", onClick: onClose, "aria-label": "Close", children: "\u00D7" }), _jsx("h2", { className: "text-2xl font-bold mb-4 text-primary-600", children: "Why this prediction?" }), _jsxs("ul", { className: "space-y-3", children: [data.sentiment && (_jsxs("li", { children: [_jsx("span", { className: "font-semibold text-pink-400", children: "Sentiment:" }), " ", data.sentiment] })), data.news && (_jsxs("li", { children: [_jsx("span", { className: "font-semibold text-blue-400", children: "News Impact:" }), " ", data.news] })), data.playerProps && (_jsxs("li", { children: [_jsx("span", { className: "font-semibold text-yellow-400", children: "Player Props:" }), " ", data.playerProps] })), data.marketMovement && (_jsxs("li", { children: [_jsx("span", { className: "font-semibold text-green-400", children: "Market Movement:" }), " ", data.marketMovement] }))] })] }) }) }));
};
export default PredictionExplanationOverlay;
