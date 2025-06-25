import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const GlassCard = ({ title, children, className = "", glowing = false, style = {}, }) => {
    const cardStyle = {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: glowing
            ? "0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.4)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)",
        ...style,
    };
    return (_jsxs("div", { className: `glass-card rounded-2xl p-6 transition-all duration-300 ${className}`, style: cardStyle, children: [title && (_jsx("h3", { className: "text-lg font-semibold mb-4 text-electric-400", children: title })), _jsx("div", { children: children })] }));
};
export default GlassCard;
