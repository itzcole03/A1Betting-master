import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const HolographicText = ({ children, className = "", animated = true, size = "xl", }) => {
    const sizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
    };
    const animatedClass = animated ? "animate-cyber-pulse" : "";
    return (_jsx("span", { className: cn("holographic font-black tracking-tight cyber-title", sizes[size], animatedClass, className), children: children }));
};
export default HolographicText;
