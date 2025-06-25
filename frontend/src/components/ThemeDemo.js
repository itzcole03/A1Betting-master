import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from "../providers/UniversalThemeProvider";
const ThemeDemo = () => {
    const { theme, variant, isDark, toggleDarkMode } = useTheme();
    return (_jsx("div", { style: {
            padding: "24px",
            minHeight: "100vh",
            background: theme.colors.background,
            color: theme.colors.text.primary,
            fontFamily: "Inter, sans-serif",
        }, children: _jsxs("div", { style: { maxWidth: "800px", margin: "0 auto" }, children: [_jsxs("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "32px",
                    }, children: [_jsx("h1", { style: { margin: "0", color: theme.colors.text.primary }, children: "\uD83C\uDFA8 Cyber Theme System Demo" }), _jsxs("button", { onClick: toggleDarkMode, style: {
                                background: theme.gradients.primary,
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                color: "#000",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }, children: [isDark ? "☀️" : "🌙", " ", isDark ? "Light Mode" : "Dark Mode"] })] }), _jsxs("div", { style: {
                        display: "grid",
                        gap: "24px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    }, children: [_jsxs("div", { className: "glass-card", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Current Theme" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [_jsxs("div", { style: { color: theme.colors.text.secondary }, children: [_jsx("strong", { children: "Variant:" }), " ", variant] }), _jsxs("div", { style: { color: theme.colors.text.secondary }, children: [_jsx("strong", { children: "Mode:" }), " ", isDark ? "Dark" : "Light"] }), _jsxs("div", { style: { color: theme.colors.text.secondary }, children: [_jsx("strong", { children: "Primary Color:" }), _jsx("span", { style: {
                                                        display: "inline-block",
                                                        width: "20px",
                                                        height: "20px",
                                                        backgroundColor: theme.colors.primary,
                                                        marginLeft: "8px",
                                                        borderRadius: "4px",
                                                        verticalAlign: "middle",
                                                    } })] })] })] }), _jsxs("div", { className: "glass-card", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Color Palette" }), _jsx("div", { style: {
                                        display: "grid",
                                        gap: "12px",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                    }, children: Object.entries(theme.colors).map(([key, value]) => {
                                        if (typeof value === "string") {
                                            return (_jsxs("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }, children: [_jsx("div", { style: {
                                                            width: "16px",
                                                            height: "16px",
                                                            backgroundColor: value,
                                                            borderRadius: "4px",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                        } }), _jsx("span", { style: {
                                                            fontSize: "12px",
                                                            color: theme.colors.text.muted,
                                                        }, children: key })] }, key));
                                        }
                                        return null;
                                    }) })] }), _jsxs("div", { className: "glass-card", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Interactive Elements" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsx("button", { className: "cyber-btn", style: {
                                                background: theme.gradients.primary,
                                                border: "none",
                                                padding: "12px 24px",
                                                borderRadius: "8px",
                                                color: isDark ? "#000" : "#000",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }, children: "Primary Button" }), _jsx("button", { style: {
                                                background: theme.colors.surface,
                                                border: `1px solid ${theme.colors.border}`,
                                                padding: "12px 24px",
                                                borderRadius: "8px",
                                                color: theme.colors.text.primary,
                                                fontWeight: "500",
                                                cursor: "pointer",
                                            }, children: "Secondary Button" }), _jsx("input", { type: "text", placeholder: "Sample input...", style: {
                                                background: theme.colors.surface,
                                                border: `1px solid ${theme.colors.border}`,
                                                padding: "12px 16px",
                                                borderRadius: "8px",
                                                color: theme.colors.text.primary,
                                                fontSize: "14px",
                                            } })] })] }), _jsxs("div", { className: "glass-card", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Typography" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [_jsx("h1", { style: {
                                                margin: "0",
                                                color: theme.colors.text.primary,
                                                fontSize: "24px",
                                            }, children: "Heading 1" }), _jsx("h2", { style: {
                                                margin: "0",
                                                color: theme.colors.text.primary,
                                                fontSize: "20px",
                                            }, children: "Heading 2" }), _jsx("p", { style: { margin: "0", color: theme.colors.text.secondary }, children: "Body text with secondary color" }), _jsx("p", { style: {
                                                margin: "0",
                                                color: theme.colors.text.muted,
                                                fontSize: "14px",
                                            }, children: "Muted text for captions and hints" }), _jsx("div", { className: "holographic", style: { fontSize: "18px", fontWeight: "900" }, children: "Holographic Text Effect" })] })] }), _jsxs("div", { className: "glass-card", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Status Indicators" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx("div", { className: "status-dot status-active" }), _jsx("span", { style: { color: theme.colors.text.secondary }, children: "Active Status" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx("div", { className: "status-dot status-warning" }), _jsx("span", { style: { color: theme.colors.text.secondary }, children: "Warning Status" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx("div", { className: "status-dot status-error" }), _jsx("span", { style: { color: theme.colors.text.secondary }, children: "Error Status" })] })] })] }), _jsxs("div", { className: "glass-card animate-float", style: { padding: "24px", borderRadius: "12px" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", color: theme.colors.text.primary }, children: "Effects & Animations" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsx("div", { className: "shadow-neon", style: {
                                                padding: "12px",
                                                borderRadius: "8px",
                                                background: theme.colors.surface,
                                                textAlign: "center",
                                                color: theme.colors.text.primary,
                                            }, children: "Neon Shadow Effect" }), _jsx("div", { className: "animate-cyber-pulse", style: {
                                                padding: "12px",
                                                borderRadius: "8px",
                                                background: theme.gradients.primary,
                                                textAlign: "center",
                                                color: "#000",
                                                fontWeight: "600",
                                            }, children: "Cyber Pulse Animation" }), _jsx("div", { className: "cyber-loading", style: { height: "4px", borderRadius: "2px" } })] })] })] }), _jsx("div", { style: { marginTop: "32px", textAlign: "center" }, children: _jsx("p", { style: { color: theme.colors.text.muted, fontSize: "14px" }, children: "Toggle between cyber light and dark modes to see the theme in action! \uD83C\uDF1F" }) })] }) }));
};
export default ThemeDemo;
