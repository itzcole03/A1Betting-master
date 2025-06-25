import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CYBER_COLORS, CYBER_GLASS, CyberText, } from "./CyberTheme";
import { X, Check, AlertTriangle, Info, } from "lucide-react";
// MEGA UI SYSTEM - Consolidates all base UI components (35+ components)
// ============================================================================
// BUTTON COMPONENTS (Consolidates 6 button variants)
// ============================================================================
export const MegaButton = ({ children, onClick, variant = "secondary", size = "md", disabled = false, loading = false, icon, iconPosition = "left", fullWidth = false, className = "", }) => {
    const getVariantStyle = () => {
        const variants = {
            primary: {
                background: "linear-gradient(135deg, rgba(6, 255, 165, 0.95), rgba(0, 255, 136, 0.9))",
                border: "1px solid rgba(6, 255, 165, 0.3)",
                color: "#000",
                fontWeight: "700",
                boxShadow: "0 8px 32px rgba(6, 255, 165, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
            },
            secondary: {
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontWeight: "600",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
            },
            ghost: {
                background: "rgba(6, 255, 165, 0.08)",
                border: "1px solid rgba(6, 255, 165, 0.2)",
                color: "#06ffa5",
                fontWeight: "600",
                backdropFilter: "blur(20px) saturate(180%)",
            },
            danger: {
                background: "linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 71, 87, 0.8))",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                color: "#fff",
                fontWeight: "600",
                boxShadow: "0 8px 32px rgba(255, 107, 107, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
            },
            success: {
                background: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
                border: "1px solid rgba(6, 255, 165, 0.3)",
                color: "#000",
                fontWeight: "700",
                boxShadow: "0 8px 32px rgba(6, 255, 165, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
            },
        };
        return variants[variant];
    };
    const getSizeStyle = () => {
        const sizes = {
            sm: { padding: "6px 12px", fontSize: "12px" },
            md: { padding: "12px 16px", fontSize: "14px" },
            lg: { padding: "16px 24px", fontSize: "16px" },
        };
        return sizes[size];
    };
    return (_jsxs("button", { onClick: onClick, disabled: disabled || loading, className: `mega-button ${className}`, style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            borderRadius: "12px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: fullWidth ? "100%" : "auto",
            position: "relative",
            overflow: "hidden",
            letterSpacing: "-0.01em",
            ...getVariantStyle(),
            ...getSizeStyle(),
        }, onMouseEnter: (e) => {
            if (!disabled && !loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                if (variant === "primary") {
                    e.currentTarget.style.boxShadow =
                        "0 12px 48px rgba(6, 255, 165, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)";
                }
                else if (variant === "secondary") {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }
                else if (variant === "ghost") {
                    e.currentTarget.style.background = "rgba(6, 255, 165, 0.15)";
                }
            }
        }, onMouseLeave: (e) => {
            if (!disabled && !loading) {
                e.currentTarget.style.transform = "translateY(0)";
                const originalStyle = getVariantStyle();
                e.currentTarget.style.boxShadow = originalStyle.boxShadow || "none";
                e.currentTarget.style.background = originalStyle.background;
            }
        }, children: [loading && (_jsx("div", { style: {
                    width: "14px",
                    height: "14px",
                    border: "2px solid transparent",
                    borderTop: "2px solid currentColor",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                } })), icon && iconPosition === "left" && _jsx("span", { children: icon }), children && _jsx("span", { children: children }), icon && iconPosition === "right" && _jsx("span", { children: icon })] }));
};
// ============================================================================
// CARD COMPONENTS (Consolidates 4 card variants)
// ============================================================================
export const MegaCard = ({ children, title, subtitle, headerActions, footer, variant = "glass", padding = "md", className = "", onClick, }) => {
    const getVariantStyle = () => {
        const variants = {
            default: {
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
            },
            glass: {
                ...CYBER_GLASS.card,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
                backdropFilter: "blur(40px) saturate(200%)",
            },
            glowing: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: `1px solid rgba(6, 255, 165, 0.3)`,
                boxShadow: `0 0 32px rgba(6, 255, 165, 0.2), 0 8px 32px rgba(0, 0, 0, 0.2)`,
                backdropFilter: "blur(40px) saturate(200%)",
            },
            bordered: {
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: `1px solid rgba(6, 255, 165, 0.4)`,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
            },
        };
        return variants[variant];
    };
    const getPaddingStyle = () => {
        const paddings = {
            none: "0",
            sm: "12px",
            md: "20px",
            lg: "32px",
        };
        return paddings[padding];
    };
    return (_jsxs("div", { className: `mega-card ${className}`, onClick: onClick, style: {
            borderRadius: "16px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: onClick ? "pointer" : "default",
            position: "relative",
            overflow: "hidden",
            ...getVariantStyle(),
        }, onMouseEnter: (e) => {
            if (onClick) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                    variant === "glowing"
                        ? "0 0 40px rgba(6, 255, 165, 0.3), 0 12px 48px rgba(0, 0, 0, 0.25)"
                        : "0 12px 48px rgba(0, 0, 0, 0.2), 0 2px 0 rgba(255, 255, 255, 0.08) inset";
            }
        }, onMouseLeave: (e) => {
            if (onClick) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = getVariantStyle().boxShadow;
            }
        }, children: [(title || subtitle || headerActions) && (_jsx("div", { style: {
                    padding: getPaddingStyle(),
                    paddingBottom: children ? "16px" : getPaddingStyle(),
                    borderBottom: children
                        ? "1px solid rgba(255, 255, 255, 0.05)"
                        : "none",
                }, children: _jsxs("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }, children: [_jsxs("div", { children: [title && (_jsx(CyberText, { variant: "title", style: { marginBottom: subtitle ? "4px" : "0" }, children: title })), subtitle && (_jsx(CyberText, { variant: "body", color: "muted", children: subtitle }))] }), headerActions && _jsx("div", { children: headerActions })] }) })), children && (_jsx("div", { style: {
                    padding: title || subtitle || headerActions
                        ? `0 ${getPaddingStyle()} ${getPaddingStyle()}`
                        : getPaddingStyle(),
                }, children: children })), footer && (_jsx("div", { style: {
                    padding: getPaddingStyle(),
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }, children: footer }))] }));
};
// ============================================================================
// MODAL COMPONENTS (Consolidates 3 modal variants)
// ============================================================================
export const MegaModal = ({ isOpen, onClose, title, children, footer, size = "md", closeOnOverlay = true, showCloseButton = true, }) => {
    const getSizeStyle = () => {
        const sizes = {
            sm: { width: "400px", maxWidth: "90vw" },
            md: { width: "600px", maxWidth: "90vw" },
            lg: { width: "800px", maxWidth: "90vw" },
            xl: { width: "1200px", maxWidth: "95vw" },
        };
        return sizes[size];
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { style: {
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
        }, children: [_jsx("div", { style: {
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    backdropFilter: "blur(4px)",
                }, onClick: closeOnOverlay ? onClose : undefined }), _jsxs("div", { style: {
                    position: "relative",
                    ...CYBER_GLASS.panel,
                    borderRadius: "16px",
                    ...getSizeStyle(),
                    maxHeight: "90vh",
                    overflow: "auto",
                }, children: [(title || showCloseButton) && (_jsxs("div", { style: {
                            padding: "20px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }, children: [title && (_jsx(CyberText, { variant: "title", style: { fontSize: "20px" }, children: title })), showCloseButton && (_jsx(MegaButton, { variant: "ghost", size: "sm", onClick: onClose, icon: _jsx(X, { size: 16 }) }))] })), _jsx("div", { style: { padding: "20px" }, children: children }), footer && (_jsx("div", { style: {
                            padding: "16px 20px 20px",
                            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        }, children: footer }))] })] }));
};
// ============================================================================
// INPUT COMPONENTS (Consolidates 5 input variants)
// ============================================================================
export const MegaInput = ({ type = "text", placeholder, value, onChange, label, error, icon, iconPosition = "left", disabled = false, fullWidth = false, className = "", }) => {
    return (_jsxs("div", { className: `mega-input-wrapper ${className}`, style: { width: fullWidth ? "100%" : "auto" }, children: [label && (_jsx(CyberText, { variant: "body", style: { marginBottom: "8px", fontWeight: "500" }, children: label })), _jsxs("div", { style: { position: "relative" }, children: [icon && iconPosition === "left" && (_jsx("div", { style: {
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: CYBER_COLORS.text.muted,
                            pointerEvents: "none",
                        }, children: icon })), _jsx("input", { type: type, placeholder: placeholder, value: value, onChange: (e) => onChange?.(e.target.value), disabled: disabled, style: {
                            width: "100%",
                            padding: icon
                                ? iconPosition === "left"
                                    ? "14px 18px 14px 44px"
                                    : "14px 44px 14px 18px"
                                : "14px 18px",
                            borderRadius: "12px",
                            border: error
                                ? "1px solid #ff6b6b"
                                : "1px solid rgba(255, 255, 255, 0.08)",
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "500",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            outline: "none",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                        }, onFocus: (e) => {
                            e.target.style.border = `1px solid rgba(6, 255, 165, 0.4)`;
                            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                            e.target.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(6, 255, 165, 0.2)`;
                            e.target.style.transform = "translateY(-1px)";
                        }, onBlur: (e) => {
                            e.target.style.border = error
                                ? "1px solid #ff6b6b"
                                : "1px solid rgba(255, 255, 255, 0.08)";
                            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                            e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.05)";
                            e.target.style.transform = "translateY(0)";
                        } }), icon && iconPosition === "right" && (_jsx("div", { style: {
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: CYBER_COLORS.text.muted,
                            pointerEvents: "none",
                        }, children: icon }))] }), error && (_jsx(CyberText, { variant: "caption", style: { color: "#ff4757", marginTop: "4px" }, children: error }))] }));
};
// ============================================================================
// ALERT COMPONENTS (Consolidates 4 alert variants)
// ============================================================================
export const MegaAlert = ({ type, title, children, dismissible = false, onDismiss, className = "", }) => {
    const getAlertStyle = () => {
        const styles = {
            info: {
                backgroundColor: `${CYBER_COLORS.accent}10`,
                border: `1px solid ${CYBER_COLORS.accent}30`,
                color: CYBER_COLORS.accent,
            },
            success: {
                backgroundColor: `${CYBER_COLORS.primary}10`,
                border: `1px solid ${CYBER_COLORS.primary}30`,
                color: CYBER_COLORS.primary,
            },
            warning: {
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                border: "1px solid rgba(255, 193, 7, 0.3)",
                color: "#ffc107",
            },
            error: {
                backgroundColor: "rgba(255, 71, 87, 0.1)",
                border: "1px solid rgba(255, 71, 87, 0.3)",
                color: "#ff4757",
            },
        };
        return styles[type];
    };
    const getIcon = () => {
        const icons = {
            info: _jsx(Info, { size: 16 }),
            success: _jsx(Check, { size: 16 }),
            warning: _jsx(AlertTriangle, { size: 16 }),
            error: _jsx(X, { size: 16 }),
        };
        return icons[type];
    };
    return (_jsxs("div", { className: `mega-alert ${className}`, style: {
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            ...getAlertStyle(),
        }, children: [_jsx("div", { style: { flexShrink: 0, marginTop: "2px" }, children: getIcon() }), _jsxs("div", { style: { flex: 1 }, children: [title && (_jsx(CyberText, { variant: "body", style: { fontWeight: "600", marginBottom: "4px" }, children: title })), _jsx("div", { children: children })] }), dismissible && (_jsx("button", { onClick: onDismiss, style: {
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: _jsx(X, { size: 14 }) }))] }));
};
// ============================================================================
// LOADING COMPONENTS (Consolidates 3 loading variants)
// ============================================================================
export const MegaSkeleton = ({ width = "100%", height = "20px", variant = "rect", animation = "pulse", className = "", }) => {
    const baseStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };
    const variantStyle = {
        text: { borderRadius: "4px", height: "1em" },
        rect: { borderRadius: "8px" },
        circle: { borderRadius: "50%" },
    };
    const animationStyle = {
        pulse: {
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        wave: {
            background: "linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)",
            backgroundSize: "200% 100%",
            animation: "wave 2s ease-in-out infinite",
        },
    };
    return (_jsx("div", { className: `mega-skeleton ${className}`, style: {
            ...baseStyle,
            ...variantStyle[variant],
            ...animationStyle[animation],
        } }));
};
// Default export object for convenience
export default {
    MegaButton,
    MegaCard,
    MegaModal,
    MegaInput,
    MegaAlert,
    MegaSkeleton,
};
