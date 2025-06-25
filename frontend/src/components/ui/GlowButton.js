import { jsx as _jsx } from "react/jsx-runtime";
export const GlowButton = ({ children, className = '', ...props }) => (_jsx("button", { className: `ultimate-btn px-6 py-3 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 ${className}`, ...props, children: children }));
export default GlowButton;
