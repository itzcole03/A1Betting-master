import { jsx as _jsx } from "react/jsx-runtime";
export const Progress = ({ value, color = "#3b82f6", className = "", ...props }) => {
    return (_jsx("div", { className: `w-full bg-gray-200 rounded-full h-2.5 ${className}`, ...props, children: _jsx("div", { className: "h-2.5 rounded-full transition-all duration-300", style: { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color } }) }));
};
