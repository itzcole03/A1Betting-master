import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// Removed unused CyberTheme imports
import { useTheme } from "../../providers/SafeThemeProvider";
import { MegaButton } from "./MegaUI";
// Removed problematic import
import { Brain, Menu, X, Bell, User, LogOut, Search, Wifi, WifiOff, ChevronRight, Sun, Moon, UserCircle, } from "lucide-react";
// MEGA LAYOUT SYSTEM - Consolidates 23 layout components
// ============================================================================
// USER AVATAR DROPDOWN COMPONENT
// ============================================================================
const UserAvatarDropdown = ({ user, isDark, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownRef, setDropdownRef] = useState(null);
    const [buttonRef, setButtonRef] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        right: 0,
    });
    // Calculate dropdown position based on button position
    useEffect(() => {
        if (isOpen && buttonRef) {
            const rect = buttonRef.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen, buttonRef]);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef &&
                !dropdownRef.contains(event.target) &&
                buttonRef &&
                !buttonRef.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [dropdownRef, buttonRef, isOpen]);
    const handleAccountProfile = () => {
        // Navigate to profile page using app navigation
        if (onNavigate) {
            onNavigate("profile");
        }
        setIsOpen(false);
    };
    const handleSignOut = () => {
        // Handle sign out
        if (confirm("Are you sure you want to sign out?")) {
            // Clear any stored auth data
            localStorage.removeItem("authToken");
            sessionStorage.clear();
            // Redirect to login or home page
            window.location.href = "/login";
        }
        setIsOpen(false);
    };
    return (_jsxs("div", { style: { position: "relative" }, children: [_jsx("button", { ref: setButtonRef, onClick: () => setIsOpen(!isOpen), style: {
                    width: "32px",
                    height: "32px",
                    background: "linear-gradient(135deg, #06ffa5, #00ff88)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.2s ease",
                    transform: isOpen ? "scale(1.05)" : "scale(1)",
                }, children: user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, style: { width: "100%", height: "100%", borderRadius: "50%" } })) : (_jsx(User, { size: 16, color: isDark ? "#000" : "#fff" })) }), isOpen &&
                createPortal(_jsxs("div", { ref: setDropdownRef, style: {
                        position: "fixed",
                        top: `${dropdownPosition.top}px`,
                        right: `${dropdownPosition.right}px`,
                        minWidth: "220px",
                        background: "rgba(15, 23, 42, 0.98)",
                        backdropFilter: "blur(40px) saturate(2)",
                        border: "1px solid rgba(6, 255, 165, 0.4)",
                        borderRadius: "16px",
                        boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6), 0 10px 40px rgba(6, 255, 165, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        zIndex: 2147483647,
                        padding: "12px",
                        transform: "translateY(0)",
                        opacity: 1,
                    }, children: [_jsxs("div", { style: {
                                padding: "12px 16px",
                                borderBottom: "1px solid rgba(6, 255, 165, 0.2)",
                                marginBottom: "8px",
                            }, children: [_jsx("div", { style: {
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#ffffff",
                                        marginBottom: "2px",
                                    }, children: user.name }), _jsx("div", { style: {
                                        fontSize: "12px",
                                        color: "#94a3b8",
                                    }, children: "Pro User" })] }), _jsxs("button", { onClick: handleAccountProfile, style: {
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 16px",
                                background: "transparent",
                                border: "none",
                                borderRadius: "12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#ffffff",
                                transition: "all 0.2s ease",
                                textAlign: "left",
                                fontWeight: "500",
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.background = "rgba(6, 255, 165, 0.15)";
                                e.currentTarget.style.transform = "translateX(4px)";
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.transform = "translateX(0)";
                            }, children: [_jsx(UserCircle, { size: 16, style: { marginRight: "12px", color: "#06ffa5" } }), "Account & Profile"] }), _jsxs("button", { onClick: handleSignOut, style: {
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 16px",
                                background: "transparent",
                                border: "none",
                                borderRadius: "12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#ff6b6b",
                                transition: "all 0.2s ease",
                                textAlign: "left",
                                fontWeight: "500",
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.background = "rgba(255, 107, 107, 0.15)";
                                e.currentTarget.style.transform = "translateX(4px)";
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.transform = "translateX(0)";
                            }, children: [_jsx(LogOut, { size: 16, style: { marginRight: "12px", color: "#ff6b6b" } }), "Sign Out"] })] }), document.body)] }));
};
// ============================================================================
// MEGA SIDEBAR (Consolidates CyberSidebar, AdvancedSidebar, Sidebar variants)
// ============================================================================
export const MegaSidebar = ({ isOpen, onToggle, navigationItems, currentPage, onNavigate, user, systemStatus, variant = "default", className = "", }) => {
    const { theme } = useTheme();
    const [expandedSubmenus, setExpandedSubmenus] = useState(new Set());
    const toggleSubmenu = (itemId) => {
        const newExpanded = new Set(expandedSubmenus);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        }
        else {
            newExpanded.add(itemId);
        }
        setExpandedSubmenus(newExpanded);
    };
    const getStatusIcon = () => {
        if (!systemStatus?.isOnline)
            return { icon: WifiOff, color: "#ff4757", text: "Offline" };
        if (systemStatus.connectedSources < 5)
            return { icon: Wifi, color: "#00d4ff", text: "Limited" };
        return { icon: Wifi, color: "#06ffa5", text: "Connected" };
    };
    const status = getStatusIcon();
    const StatusIcon = status.icon;
    const sidebarWidth = isOpen ? "280px" : "64px";
    const isCompact = !isOpen || variant === "compact";
    return (_jsxs("div", { className: `mega-sidebar ${className}`, style: {
            width: sidebarWidth,
            height: "100vh",
            position: variant === "floating" ? "fixed" : "relative",
            left: variant === "floating" && !isOpen ? "-280px" : "0",
            zIndex: variant === "floating" ? 1000 : "auto",
            transition: "all 0.3s ease",
            backdropFilter: "blur(40px) saturate(2)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
            borderRight: variant !== "floating"
                ? `1px solid rgba(255, 255, 255, 0.1)`
                : "none",
            borderRadius: variant === "floating" ? "0 16px 16px 0" : "0",
            display: "flex",
            flexDirection: "column",
        }, children: [_jsxs("div", { style: { padding: isCompact ? "16px 12px" : "24px 20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isCompact ? "center" : "space-between",
                            marginBottom: isCompact ? "0" : "24px",
                        }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsx("button", { onClick: () => onNavigate("dashboard"), style: {
                                            width: "44px",
                                            height: "44px",
                                            background: "linear-gradient(135deg, rgba(6, 255, 165, 0.9), rgba(0, 255, 136, 0.8))",
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: isCompact ? "0" : "14px",
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            boxShadow: "0 4px 16px rgba(6, 255, 165, 0.2)",
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.transform =
                                                "scale(1.08) translateY(-1px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 8px 32px rgba(6, 255, 165, 0.4)";
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.transform = "scale(1) translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 16px rgba(6, 255, 165, 0.2)";
                                        }, title: "Return to Dashboard", children: _jsx(Brain, { size: 24, color: "#000" }) }), !isCompact && (_jsxs("div", { children: [_jsx("div", { style: {
                                                    fontSize: "16px",
                                                    fontWeight: "700",
                                                    color: "#ffffff",
                                                    lineHeight: "1.2",
                                                    letterSpacing: "-0.01em",
                                                }, children: "A1Betting" }), _jsx("div", { style: {
                                                    fontSize: "12px",
                                                    color: "#94a3b8",
                                                    lineHeight: "1.2",
                                                    fontWeight: "500",
                                                }, children: "Quantum Platform" })] }))] }), !isCompact && (_jsx("button", { onClick: onToggle, style: {
                                    background: "rgba(6, 255, 165, 0.08)",
                                    border: "1px solid rgba(6, 255, 165, 0.2)",
                                    color: "#06ffa5",
                                    fontWeight: "500",
                                    padding: "8px",
                                    fontSize: "12px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s ease",
                                    width: "36px",
                                    height: "36px",
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.background = "rgba(6, 255, 165, 0.15)";
                                    e.currentTarget.style.borderColor = "rgba(6, 255, 165, 0.4)";
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.background = "rgba(6, 255, 165, 0.08)";
                                    e.currentTarget.style.borderColor = "rgba(6, 255, 165, 0.2)";
                                }, children: _jsx(X, { size: 16 }) }))] }), user && !isCompact && (_jsxs("div", { style: {
                            padding: "16px",
                            marginBottom: "16px",
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        }, children: [_jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                }, children: [_jsx("div", { style: {
                                            width: "32px",
                                            height: "32px",
                                            background: "linear-gradient(135deg, rgba(6, 255, 165, 0.8), rgba(0, 255, 136, 0.6))",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "8px",
                                        }, children: _jsx(User, { size: 16, color: "#000" }) }), _jsxs("div", { children: [_jsx("div", { style: {
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#ffffff",
                                                    lineHeight: "1.2",
                                                }, children: user.name }), _jsx("div", { style: {
                                                    fontSize: "12px",
                                                    color: "#94a3b8",
                                                    lineHeight: "1.2",
                                                }, children: user.tier || "Pro User" })] })] }), user.balance && (_jsxs("div", { style: {
                                    fontSize: "12px",
                                    color: "#06ffa5",
                                    lineHeight: "1.2",
                                }, children: ["Balance: $", user.balance.toLocaleString()] }))] })), systemStatus && !isCompact && (_jsx("div", { style: {
                            padding: "12px",
                            marginBottom: "16px",
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        }, children: _jsxs("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsx(StatusIcon, { size: 16, color: status.color }), _jsx("div", { style: {
                                                fontSize: "12px",
                                                marginLeft: "8px",
                                                color: status.color,
                                                lineHeight: "1.2",
                                            }, children: status.text })] }), _jsxs("div", { style: {
                                        fontSize: "12px",
                                        color: "#94a3b8",
                                        lineHeight: "1.2",
                                    }, children: [systemStatus.dataQuality, "%"] })] }) })), isCompact && (_jsx("div", { style: { textAlign: "center", marginTop: "16px" }, children: _jsx("button", { onClick: onToggle, style: {
                                background: "rgba(6, 255, 165, 0.1)",
                                border: "1px solid rgba(6, 255, 165, 0.8)",
                                color: "#06ffa5",
                                fontWeight: "500",
                                padding: "6px 12px",
                                fontSize: "12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }, children: _jsx(Menu, { size: 16 }) }) }))] }), _jsx("nav", { style: { flex: 1, padding: "0 16px", overflowY: "auto" }, children: _jsx("div", { style: { marginBottom: "8px" }, children: navigationItems
                        .filter((item) => !["settings", "profile", "Settings", "Profile"].includes(item.id) &&
                        !item.label?.toLowerCase().includes("settings") &&
                        !item.label?.toLowerCase().includes("profile"))
                        .map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        const hasSubmenu = item.submenu && item.submenu.length > 0;
                        const isExpanded = expandedSubmenus.has(item.id);
                        return (_jsxs("div", { style: { marginBottom: "6px" }, children: [_jsxs("button", { onClick: () => {
                                        if (hasSubmenu && !isCompact) {
                                            toggleSubmenu(item.id);
                                        }
                                        else {
                                            onNavigate(item.id);
                                        }
                                    }, style: {
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        borderRadius: "14px",
                                        padding: isCompact ? "14px 12px" : "14px 18px",
                                        fontSize: "14px",
                                        fontWeight: isActive ? "600" : "500",
                                        cursor: "pointer",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        justifyContent: isCompact ? "center" : "flex-start",
                                        border: isActive
                                            ? "1px solid rgba(6, 255, 165, 0.3)"
                                            : "1px solid transparent",
                                        background: isActive
                                            ? "linear-gradient(135deg, rgba(6, 255, 165, 0.95), rgba(0, 255, 136, 0.9))"
                                            : "rgba(255, 255, 255, 0.03)",
                                        color: isActive ? "#000" : "#e2e8f0",
                                        backdropFilter: "blur(20px) saturate(1.8)",
                                        position: "relative",
                                        overflow: "hidden",
                                        boxShadow: isActive
                                            ? "0 8px 32px rgba(6, 255, 165, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)"
                                            : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                    }, onMouseEnter: (e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background =
                                                "rgba(255, 255, 255, 0.08)";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 16px rgba(0, 0, 0, 0.1)";
                                        }
                                    }, onMouseLeave: (e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background =
                                                "rgba(255, 255, 255, 0.03)";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "0 2px 8px rgba(0, 0, 0, 0.05)";
                                        }
                                    }, children: [_jsx("span", { style: {
                                                fontSize: "18px",
                                                color: isActive ? "#000" : "#ffffff",
                                                display: "flex",
                                                alignItems: "center",
                                                minWidth: "18px",
                                            }, children: item.icon }), !isCompact && (_jsxs("div", { style: {
                                                display: "flex",
                                                alignItems: "center",
                                                flex: 1,
                                                marginLeft: "14px",
                                            }, children: [_jsx("span", { style: {
                                                        flex: 1,
                                                        textAlign: "left",
                                                        letterSpacing: "-0.01em",
                                                    }, children: item.label }), item.badge && (_jsx("span", { style: {
                                                        background: isActive
                                                            ? "rgba(0, 0, 0, 0.15)"
                                                            : "#06ffa5",
                                                        color: isActive ? "#000" : "#000",
                                                        borderRadius: "12px",
                                                        padding: "4px 8px",
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        marginLeft: "8px",
                                                    }, children: item.badge })), hasSubmenu && (_jsx(ChevronRight, { size: 16, style: {
                                                        marginLeft: "8px",
                                                        transform: isExpanded
                                                            ? "rotate(90deg)"
                                                            : "rotate(0deg)",
                                                        transition: "transform 0.3s ease",
                                                        color: isActive ? "#000" : "#94a3b8",
                                                    } }))] }))] }), hasSubmenu && isExpanded && !isCompact && (_jsx("div", { style: { marginLeft: "16px", marginTop: "4px" }, children: item.submenu.map((subItem) => {
                                        const SubIcon = subItem.icon;
                                        return (_jsx(MegaButton, { variant: "secondary", onClick: () => onNavigate(subItem.id), icon: SubIcon ? (_jsx("span", { style: { fontSize: "14px" }, children: SubIcon })) : undefined, style: {
                                                marginBottom: "2px",
                                                fontSize: "12px",
                                                padding: "8px 12px",
                                            }, children: subItem.label }, subItem.id));
                                    }) }))] }, item.id));
                    }) }) }), _jsx("div", { children: _jsxs("div", { children: [_jsx("div", { style: {
                                fontWeight: "400",
                                marginBottom: "6px",
                                pointerEvents: "auto",
                            } }), _jsx("div", { style: {
                                fontWeight: "400",
                                marginBottom: "6px",
                                pointerEvents: "auto",
                            } })] }) }), !isCompact && (_jsxs("div", { style: { padding: "8px 16px 20px 16px" }, children: [_jsx("div", { style: {
                            height: "1px",
                            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                            marginBottom: "16px",
                        } }), _jsxs("button", { onClick: () => onNavigate("profile"), style: {
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            borderRadius: "14px",
                            padding: "14px 18px",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: "1px solid transparent",
                            background: "rgba(255, 255, 255, 0.03)",
                            color: "#e2e8f0",
                            backdropFilter: "blur(20px) saturate(1.8)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                        }, children: [_jsx("span", { style: {
                                    fontSize: "18px",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: "18px",
                                }, children: "\uFFFD\uFFFD" }), _jsx("span", { style: {
                                    marginLeft: "14px",
                                    letterSpacing: "-0.01em",
                                }, children: "Profile" })] }), _jsxs("button", { onClick: () => onNavigate("settings"), style: {
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            borderRadius: "14px",
                            padding: "14px 18px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: "1px solid rgba(6, 255, 165, 0.3)",
                            background: "linear-gradient(135deg, rgba(6, 255, 165, 0.95), rgba(0, 255, 136, 0.9))",
                            color: "#000",
                            backdropFilter: "blur(20px) saturate(1.8)",
                            boxShadow: "0 8px 32px rgba(6, 255, 165, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)",
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                                "0 12px 48px rgba(6, 255, 165, 0.35), 0 4px 16px rgba(0, 0, 0, 0.15)";
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                                "0 8px 32px rgba(6, 255, 165, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)";
                        }, children: [_jsx("span", { style: {
                                    fontSize: "18px",
                                    color: "#000",
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: "18px",
                                }, children: "\u2699\uFE0F" }), _jsx("span", { style: {
                                    marginLeft: "14px",
                                    letterSpacing: "-0.01em",
                                }, children: "Settings" })] })] }))] }));
};
// ============================================================================
// MEGA HEADER (Consolidates CyberHeader, EliteSportsHeader, Navbar variants)
// ============================================================================
export const MegaHeader = ({ title, subtitle, leftActions, rightActions, showSearch = false, onSearch, notifications = 0, onNotificationsClick, user, onNavigate, className = "", }) => {
    const [searchQuery, setSearchQuery] = useState("");
    // Use try-catch to handle any theme access errors
    let theme, isDark, toggleDarkMode;
    try {
        const themeContext = useTheme();
        theme = themeContext.theme;
        isDark = themeContext.isDark;
        toggleDarkMode = themeContext.toggleDarkMode;
    }
    catch (error) {
        console.warn("Theme context error in MegaHeader, using fallback:", error);
        theme = null;
        isDark = false;
        toggleDarkMode = () => console.warn("Theme toggle not available");
    }
    // Comprehensive fallback theme
    const defaultTheme = {
        colors: {
            surface: "rgba(255, 255, 255, 0.8)",
            border: "rgba(15, 23, 42, 0.1)",
            text: {
                primary: "#0f172a",
                secondary: "#334155",
                muted: "#64748b",
            },
            primary: "#06ffa5",
        },
        effects: {
            shadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
        },
        gradients: {
            primary: "linear-gradient(135deg, #06ffa5, #00ff88)",
        },
    };
    // Ensure we always have a complete theme object
    const safeTheme = theme?.colors ? theme : defaultTheme;
    return (_jsxs("header", { className: `mega-header ${className}`, style: {
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "72px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0px 20px rgba(6, 255, 165, 0.2)",
            position: "relative",
            zIndex: 1000,
        }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", flex: 1 }, children: [leftActions, (title || subtitle) && (_jsxs("div", { style: { marginLeft: leftActions ? "20px" : "0" }, children: [title && (_jsx("div", { style: {
                                    fontSize: "24px",
                                    marginBottom: "4px",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                    lineHeight: "1.2",
                                    letterSpacing: "-0.02em",
                                }, children: title })), subtitle && (_jsx("div", { style: {
                                    fontSize: "14px",
                                    color: "#94a3b8",
                                    lineHeight: "1.3",
                                    fontWeight: "500",
                                    letterSpacing: "-0.01em",
                                }, children: subtitle }))] }))] }), showSearch && (_jsx("div", { style: { flex: 1, maxWidth: "480px", margin: "0 32px" }, children: _jsxs("div", { style: { position: "relative" }, children: [_jsx(Search, { size: 18, style: {
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#94a3b8",
                                zIndex: 1,
                            } }), _jsx("input", { type: "text", placeholder: "Search anything...", value: searchQuery, onChange: (e) => {
                                setSearchQuery(e.target.value);
                                onSearch?.(e.target.value);
                            }, style: {
                                width: "100%",
                                padding: "14px 20px 14px 48px",
                                borderRadius: "16px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                backdropFilter: "blur(20px) saturate(180%)",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "500",
                                outline: "none",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                            }, onFocus: (e) => {
                                e.target.style.borderColor = "rgba(6, 255, 165, 0.3)";
                                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                                e.target.style.boxShadow =
                                    "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(6, 255, 165, 0.2)";
                            }, onBlur: (e) => {
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                                e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                            } })] }) })), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [_jsx("button", { onClick: toggleDarkMode, style: {
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "#ffffff",
                            fontWeight: "500",
                            padding: "12px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            backdropFilter: "blur(20px) saturate(180%)",
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }, title: `Switch to ${isDark ? "Light" : "Dark"} Mode`, children: isDark ? _jsx(Sun, { size: 18 }) : _jsx(Moon, { size: 18 }) }), onNotificationsClick && (_jsxs("div", { style: { position: "relative" }, children: [_jsx("button", { onClick: onNotificationsClick, style: {
                                    background: "rgba(6, 255, 165, 0.08)",
                                    border: "1px solid rgba(6, 255, 165, 0.2)",
                                    color: "#06ffa5",
                                    fontWeight: "500",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "44px",
                                    height: "44px",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    backdropFilter: "blur(20px) saturate(180%)",
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.background = "rgba(6, 255, 165, 0.15)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 24px rgba(6, 255, 165, 0.2)";
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.background = "rgba(6, 255, 165, 0.08)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }, children: _jsx(Bell, { size: 18 }) }), notifications > 0 && (_jsx("span", { style: {
                                    position: "absolute",
                                    top: "2px",
                                    right: "2px",
                                    background: "linear-gradient(135deg, #06ffa5, #00ff88)",
                                    color: "#000",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid rgba(15, 23, 42, 0.95)",
                                    boxShadow: "0 2px 8px rgba(6, 255, 165, 0.4)",
                                }, children: notifications > 9 ? "9+" : notifications }))] })), user && (_jsx(UserAvatarDropdown, { user: user, isDark: isDark, onNavigate: onNavigate })), rightActions, _jsx("div", { style: {
                            fontSize: "12px",
                            color: safeTheme.colors?.text?.muted || "#64748b",
                            lineHeight: "1.2",
                        }, children: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }) })] })] }));
};
// ============================================================================
// MEGA APP SHELL (Complete layout wrapper)
// ============================================================================
export const MegaAppShell = ({ children, sidebar, header, footer, sidebarOpen = true, className = "", }) => {
    // Use try-catch to handle any theme access errors
    let safeTheme;
    try {
        const { theme } = useTheme();
        safeTheme = theme;
    }
    catch (error) {
        console.warn("Theme context error, using fallback:", error);
        safeTheme = null;
    }
    // Comprehensive fallback theme with all required properties
    const defaultTheme = {
        colors: {
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)",
            text: {
                primary: "#0f172a",
                secondary: "#334155",
                muted: "#64748b",
            },
            primary: "#06ffa5",
            secondary: "#00ff88",
            surface: "rgba(255, 255, 255, 0.8)",
            border: "rgba(15, 23, 42, 0.1)",
        },
        gradients: {
            primary: "linear-gradient(135deg, #06ffa5, #00ff88)",
        },
        effects: {
            shadow: "0 8px 32px rgba(15, 23, 42, 0.1)",
        },
    };
    // Ensure we always have a complete theme object
    const finalTheme = safeTheme?.colors ? safeTheme : defaultTheme;
    return (_jsxs("div", { className: `mega-app-shell ${className}`, style: {
            display: "flex",
            minHeight: "100vh",
            background: finalTheme.colors?.background || defaultTheme.colors.background,
            color: finalTheme.colors?.text?.primary || defaultTheme.colors.text.primary,
        }, children: [sidebar, _jsxs("div", { style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }, children: [header, _jsx("main", { style: {
                            flex: 1,
                            overflow: "auto",
                            position: "relative",
                            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)",
                            padding: "24px 32px 32px 32px",
                        }, children: _jsx("div", { style: {
                                maxWidth: "1400px",
                                margin: "0 auto",
                                width: "100%",
                            }, children: children }) }), footer] })] }));
};
export default {
    MegaSidebar,
    MegaHeader,
    MegaAppShell,
};
