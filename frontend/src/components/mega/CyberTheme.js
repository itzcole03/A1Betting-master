import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// CYBER THEME SYSTEM - ENHANCED WITH LIGHT & DARK MODE
// ============================================================================
export const CYBER_COLORS = {
    primary: "#06ffa5", // Electric green
    secondary: "#00ff88", // Bright green
    accent: "#00d4ff", // Cyan blue
    purple: "#7c3aed", // Purple accent
    // Light mode colors
    light: {
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)",
        surface: "rgba(255, 255, 255, 0.8)",
        glass: "rgba(255, 255, 255, 0.8)",
        border: "rgba(15, 23, 42, 0.1)",
        text: {
            primary: "#0f172a",
            secondary: "#334155",
            muted: "#64748b",
        },
        shadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
        glow: "0 0 20px rgba(6, 255, 165, 0.3)",
    },
    // Dark mode colors
    dark: {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)",
        surface: "rgba(255, 255, 255, 0.05)",
        glass: "rgba(255, 255, 255, 0.05)",
        border: "rgba(255, 255, 255, 0.1)",
        text: {
            primary: "#ffffff",
            secondary: "#e2e8f0",
            muted: "#94a3b8",
        },
        shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(6, 255, 165, 0.6)",
    },
    // Legacy support - defaults to dark
    glass: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
    text: {
        primary: "#ffffff",
        secondary: "#e2e8f0",
        muted: "#94a3b8",
    },
};
export const CYBER_GRADIENTS = {
    primary: "linear-gradient(135deg, #06ffa5, #00ff88)",
    secondary: "linear-gradient(135deg, #00d4ff, #7c3aed)",
    accent: "linear-gradient(135deg, rgba(6, 255, 165, 0.8), rgba(0, 255, 136, 0.6))",
    // Light mode gradients
    light: {
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)",
        button: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
        card: "linear-gradient(45deg, rgba(6, 255, 165, 0.1), rgba(0, 212, 255, 0.1))",
    },
    // Dark mode gradients
    dark: {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)",
        button: "linear-gradient(135deg, rgba(6, 255, 165, 0.8), rgba(0, 255, 136, 0.6))",
        card: "linear-gradient(45deg, rgba(6, 255, 165, 0.1), rgba(0, 212, 255, 0.1))",
    },
    // Legacy support
    background: "linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #0f172a 100%)",
    button: "linear-gradient(135deg, rgba(6, 255, 165, 0.8), rgba(0, 255, 136, 0.6))",
    card: "linear-gradient(45deg, #00ff88, #00d4ff)",
};
export const CYBER_GLASS = {
    // Light mode glass effects
    light: {
        panel: {
            backdropFilter: "blur(40px) saturate(2)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(15, 23, 42, 0.1)",
            boxShadow: "0 8px 32px rgba(15, 23, 42, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5) inset",
        },
        card: {
            backdropFilter: "blur(20px) saturate(1.8)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(15, 23, 42, 0.1)",
            boxShadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
        },
        button: {
            active: {
                backdropFilter: "blur(10px)",
                backgroundImage: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
                border: "1px solid rgba(6, 255, 165, 0.5)",
                boxShadow: "0 4px 20px rgba(6, 255, 165, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
                color: "#000",
            },
            inactive: {
                backdropFilter: "blur(20px) saturate(1.8)",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(15, 23, 42, 0.1)",
                boxShadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
                color: "#0f172a",
            },
        },
    },
    // Dark mode glass effects
    dark: {
        panel: {
            backdropFilter: "blur(40px) saturate(2)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
        },
        card: {
            backdropFilter: "blur(20px) saturate(1.8)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        button: {
            active: {
                backdropFilter: "blur(10px)",
                backgroundImage: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
                border: "1px solid rgba(6, 255, 165, 0.5)",
                boxShadow: "0 4px 20px rgba(6, 255, 165, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
                color: "#000",
            },
            inactive: {
                backdropFilter: "blur(20px) saturate(1.8)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                color: "#ffffff",
            },
        },
    },
    // Legacy support - defaults to dark
    panel: {
        backdropFilter: "blur(40px) saturate(2)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
    },
    card: {
        backdropFilter: "blur(20px) saturate(1.8)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
    button: {
        active: {
            backdropFilter: "blur(10px)",
            backgroundImage: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
            border: "1px solid rgba(6, 255, 165, 0.5)",
            boxShadow: "0 4px 20px rgba(6, 255, 165, 0.4), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
            color: "#000",
        },
        inactive: {
            backdropFilter: "blur(20px) saturate(1.8)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
    },
};
export const CYBER_ANIMATIONS = {
    glow: {
        animation: "cyber-glow 2s ease-in-out infinite alternate",
        "@keyframes cyber-glow": {
            from: {
                boxShadow: "0 0 20px rgba(6, 255, 165, 0.6), 0 0 40px rgba(6, 255, 165, 0.4)",
            },
            to: {
                boxShadow: "0 0 30px rgba(6, 255, 165, 0.8), 0 0 60px rgba(6, 255, 165, 0.6)",
            },
        },
    },
    pulse: {
        animation: "cyber-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "@keyframes cyber-pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.7 },
        },
    },
    slide: {
        transition: "all 0.3s ease",
    },
    float: {
        animation: "float 4s ease-in-out infinite",
        "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-6px)" },
        },
    },
};
// Base cyber container with theme support
export const CyberContainer = ({ children, className = "", variant = "card", glowing = false, isDark = true, style = {}, }) => {
    const themeGlass = isDark ? CYBER_GLASS.dark : CYBER_GLASS.light;
    const baseStyle = themeGlass[variant] || themeGlass.card;
    const glowStyle = glowing ? CYBER_ANIMATIONS.glow : {};
    return (_jsx("div", { className: `cyber-container ${className}`, style: {
            borderRadius: "12px",
            padding: variant === "button" ? "12px 16px" : "24px",
            transition: "all 0.3s ease",
            ...baseStyle,
            ...glowStyle,
            ...style,
        }, children: children }));
};
// Cyber typography with theme support
export const CyberText = ({ children, variant = "body", color = "primary", className = "", isDark = true, }) => {
    const styles = {
        title: {
            fontSize: "18px",
            fontWeight: "700",
            lineHeight: "28px",
            marginBottom: "8px",
        },
        subtitle: { fontSize: "16px", fontWeight: "600", lineHeight: "24px" },
        body: { fontSize: "14px", fontWeight: "400", lineHeight: "20px" },
        caption: { fontSize: "12px", fontWeight: "400", lineHeight: "16px" },
    };
    const themeColors = isDark ? CYBER_COLORS.dark : CYBER_COLORS.light;
    const colors = {
        primary: themeColors.text.primary,
        secondary: themeColors.text.secondary,
        muted: themeColors.text.muted,
        accent: CYBER_COLORS.primary,
    };
    return (_jsx("div", { className: `cyber-text cyber-text-${variant} ${className}`, style: {
            color: colors[color],
            ...styles[variant],
        }, children: children }));
};
// Enhanced cyber button with theme support
export const CyberButton = ({ children, onClick, variant = "secondary", active = false, disabled = false, className = "", icon, isDark = true, }) => {
    const themeGlass = isDark ? CYBER_GLASS.dark : CYBER_GLASS.light;
    const getButtonStyle = () => {
        if (active || variant === "primary") {
            return themeGlass.button.active;
        }
        return themeGlass.button.inactive;
    };
    return (_jsxs("button", { onClick: onClick, disabled: disabled, className: `cyber-button cyber-button-${variant} ${className}`, style: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "400",
            marginBottom: "4px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.3s ease",
            ...getButtonStyle(),
        }, children: [icon && (_jsx("span", { style: {
                    marginRight: "12px",
                    width: "16px",
                    color: active || variant === "primary"
                        ? "#000"
                        : isDark
                            ? CYBER_COLORS.dark.text.muted
                            : CYBER_COLORS.light.text.muted,
                }, children: icon })), _jsx("span", { children: children })] }));
};
// Theme aware utility function
export const getCyberTheme = (isDark) => ({
    colors: isDark ? CYBER_COLORS.dark : CYBER_COLORS.light,
    gradients: isDark ? CYBER_GRADIENTS.dark : CYBER_GRADIENTS.light,
    glass: isDark ? CYBER_GLASS.dark : CYBER_GLASS.light,
});
export default {
    CYBER_COLORS,
    CYBER_GRADIENTS,
    CYBER_GLASS,
    CYBER_ANIMATIONS,
    CyberContainer,
    CyberText,
    CyberButton,
    getCyberTheme,
};
