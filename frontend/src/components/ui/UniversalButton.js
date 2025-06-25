import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";
// ============================================================================
// STYLE CONFIGURATIONS
// ============================================================================
const getVariantStyles = (variant, theme) => {
    const styles = {
        standard: {
            primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-lg hover:shadow-xl",
            secondary: "bg-gray-600 hover:bg-gray-700 text-white border border-gray-600",
            ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent",
            outline: "bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400",
            danger: "bg-red-600 hover:bg-red-700 text-white border border-red-600",
            success: "bg-green-600 hover:bg-green-700 text-white border border-green-600",
            warning: "bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500",
            cyber: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border border-cyan-500",
            betting: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border border-green-500",
            glow: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border border-purple-500",
        },
        cyber: {
            primary: "bg-gradient-to-r from-[#06ffa5] to-[#00ff88] hover:from-[#05e094] hover:to-[#00e077] text-black border border-[#06ffa5] shadow-[0_0_20px_rgba(6,255,165,0.4)] hover:shadow-[0_0_30px_rgba(6,255,165,0.6)]",
            secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm",
            ghost: "bg-transparent hover:bg-[#06ffa5]/10 text-[#06ffa5] border border-transparent",
            outline: "bg-transparent hover:bg-[#06ffa5]/10 text-[#06ffa5] border border-[#06ffa5]/50",
            danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border border-red-500",
            success: "bg-gradient-to-r from-[#06ffa5] to-[#00d4ff] hover:from-[#05e094] hover:to-[#00bfef] text-black border border-[#06ffa5]",
            warning: "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black border border-yellow-400",
            cyber: "bg-gradient-to-r from-[#06ffa5] to-[#00d4ff] hover:from-[#05e094] hover:to-[#00bfef] text-black border border-[#06ffa5] shadow-[0_0_20px_rgba(6,255,165,0.4)]",
            betting: "bg-gradient-to-r from-[#06ffa5] to-[#00ff88] hover:from-[#05e094] hover:to-[#00e077] text-black border border-[#06ffa5] shadow-[0_0_15px_rgba(6,255,165,0.3)]",
            glow: "bg-gradient-to-r from-[#7c3aed] to-[#06ffa5] hover:from-[#6d28d9] hover:to-[#05e094] text-white border border-[#7c3aed] shadow-[0_0_25px_rgba(124,58,237,0.5)]",
        },
        premium: {
            primary: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border border-amber-500 shadow-xl",
            secondary: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white border border-gray-700",
            ghost: "bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-transparent",
            outline: "bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-500",
            danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border border-red-600",
            success: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border border-emerald-500",
            warning: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border border-orange-500",
            cyber: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border border-indigo-500",
            betting: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border border-green-600",
            glow: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border border-purple-600",
        },
        minimal: {
            primary: "bg-gray-900 hover:bg-gray-800 text-white border border-gray-900",
            secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-200",
            ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent",
            outline: "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300",
            danger: "bg-red-500 hover:bg-red-600 text-white border border-red-500",
            success: "bg-green-500 hover:bg-green-600 text-white border border-green-500",
            warning: "bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500",
            cyber: "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500",
            betting: "bg-green-500 hover:bg-green-600 text-white border border-green-500",
            glow: "bg-purple-500 hover:bg-purple-600 text-white border border-purple-500",
        },
    };
    return styles[theme][variant] || styles.standard[variant];
};
const getSizeStyles = (size) => {
    const sizes = {
        xs: "px-2 py-1 text-xs h-6",
        sm: "px-3 py-1.5 text-sm h-8",
        md: "px-4 py-2 text-sm h-10",
        lg: "px-6 py-3 text-base h-12",
        xl: "px-8 py-4 text-lg h-14",
    };
    return sizes[size];
};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const UniversalButton = forwardRef(({ children, variant = "primary", size = "md", theme = "standard", fullWidth = false, loading = false, disabled = false, active = false, leftIcon, rightIcon, animate = true, pulse = false, glow = false, betType, odds, stake, potentialReturn, isPlacing, isConfirmed, ariaLabel, tooltip, className, onClick, ...props }, ref) => {
    // Handle betting-specific states
    const effectiveLoading = loading || isPlacing;
    const effectiveVariant = isConfirmed ? "success" : variant;
    // Construct classes
    const baseClasses = twMerge(
    // Base styles
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background relative overflow-hidden", 
    // Size styles
    getSizeStyles(size), 
    // Variant styles
    getVariantStyles(effectiveVariant, theme), 
    // State styles
    fullWidth && "w-full", (disabled || effectiveLoading) && "opacity-50 cursor-not-allowed", active && "ring-2 ring-offset-2", 
    // Animation styles
    animate && "transform hover:scale-105 active:scale-95", pulse && "animate-pulse", glow && "animate-pulse", 
    // Custom classes
    className);
    // Handle click with loading protection
    const handleClick = (e) => {
        if (effectiveLoading || disabled) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };
    // Render betting details
    const renderBettingDetails = () => {
        if (!betType && !odds && !stake)
            return null;
        return (_jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-black/20 px-2 py-1 text-xs", children: [odds && (_jsxs("span", { children: ["Odds: ", odds > 0 ? "+" : "", odds] })), stake && _jsxs("span", { className: "ml-2", children: ["Stake: $", stake] }), potentialReturn && (_jsxs("span", { className: "ml-2", children: ["Win: $", potentialReturn] }))] }));
    };
    // Animation variants
    const motionVariants = animate
        ? {
            hover: {
                scale: 1.02,
                y: -1,
                transition: { duration: 0.2 },
            },
            tap: {
                scale: 0.98,
                transition: { duration: 0.1 },
            },
        }
        : {};
    return (_jsxs(motion.button, { ref: ref, className: baseClasses, onClick: handleClick, disabled: disabled || effectiveLoading, "aria-label": ariaLabel, title: tooltip, variants: motionVariants, whileHover: "hover", whileTap: "tap", ...props, children: [effectiveLoading && _jsx(Loader2, { className: "w-4 h-4 animate-spin" }), leftIcon && !effectiveLoading && (_jsx("span", { className: "flex-shrink-0", children: leftIcon })), _jsx("span", { className: "flex-1", children: isConfirmed
                    ? "Confirmed!"
                    : effectiveLoading
                        ? "Loading..."
                        : children }), rightIcon && !effectiveLoading && (_jsx("span", { className: "flex-shrink-0", children: rightIcon })), renderBettingDetails(), glow && (_jsx("div", { className: "absolute inset-0 -z-10 blur-xl opacity-30 bg-gradient-to-r from-current to-current" }))] }));
});
UniversalButton.displayName = "UniversalButton";
// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================
export const CyberButton = (props) => (_jsx(UniversalButton, { theme: "cyber", ...props }));
export const BettingButton = (props) => (_jsx(UniversalButton, { variant: "betting", theme: "cyber", ...props }));
export const GlowButton = (props) => (_jsx(UniversalButton, { variant: "glow", glow: true, animate: true, ...props }));
export const PremiumButton = (props) => (_jsx(UniversalButton, { theme: "premium", ...props }));
// ============================================================================
// EXPORTS
// ============================================================================
export default UniversalButton;
