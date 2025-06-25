import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CYBER_COLORS, CYBER_GRADIENTS, CyberText, CyberButton, } from "./CyberTheme";
import { MegaCard, MegaInput, MegaButton as MegaBtn, } from "./MegaUI";
import { Users, Activity, BarChart3, Settings, Shield, CheckCircle, XCircle, Search, UserX, UserCheck, } from "lucide-react";
// MEGA ADMIN PANEL - Cyber-themed administrative interface
const MegaAdminPanel = ({ className = "" }) => {
    const [activeTab, setActiveTab] = useState("users");
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([
        {
            id: "1",
            name: "Alex Chen",
            email: "alex@a1betting.com",
            role: "Quantum Pro",
            status: "active",
            lastLogin: "2024-01-15T10:30:00Z",
            balance: 127430.5,
            totalBets: 1247,
            winRate: 89.4,
        },
        {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@a1betting.com",
            role: "Premium",
            status: "active",
            lastLogin: "2024-01-15T09:15:00Z",
            balance: 45230.0,
            totalBets: 892,
            winRate: 84.2,
        },
        {
            id: "3",
            name: "Mike Wilson",
            email: "mike@a1betting.com",
            role: "Standard",
            status: "suspended",
            lastLogin: "2024-01-10T14:22:00Z",
            balance: 1230.0,
            totalBets: 156,
            winRate: 62.1,
        },
    ]);
    const [systemLogs, setSystemLogs] = useState([
        {
            id: "1",
            level: "info",
            message: "Neural network model v4.2 deployed successfully",
            timestamp: "2024-01-15T10:45:00Z",
            category: "deployment",
        },
        {
            id: "2",
            level: "warning",
            message: "High memory usage detected on prediction service",
            timestamp: "2024-01-15T10:30:00Z",
            category: "performance",
        },
        {
            id: "3",
            level: "error",
            message: "Failed to connect to external odds API",
            timestamp: "2024-01-15T10:15:00Z",
            category: "integration",
        },
    ]);
    const [systemMetrics, setSystemMetrics] = useState({
        totalUsers: 12847,
        activeUsers: 8932,
        activeSessions: 347,
        totalPredictions: 1892456,
        systemUptime: "99.97%",
        cpuUsage: 67.8,
        memoryUsage: 84.3,
        modelsRunning: 47,
    });
    const tabs = [
        { key: "users", label: "User Management", icon: Users },
        { key: "logs", label: "System Logs", icon: Activity },
        { key: "stats", label: "System Stats", icon: BarChart3 },
        { key: "settings", label: "Settings", icon: Settings },
    ];
    const handleUserStatusUpdate = (userId, newStatus) => {
        setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, status: newStatus } : user));
    };
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const getLogLevelColor = (level) => {
        switch (level) {
            case "error":
                return "#ff4757";
            case "warning":
                return "#ffa502";
            case "info":
                return CYBER_COLORS.primary;
            default:
                return CYBER_COLORS.text.muted;
        }
    };
    const renderUsersTab = () => (_jsxs("div", { style: { display: "grid", gap: "24px" }, children: [_jsxs("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                }, children: [_jsx(MegaCard, { variant: "glass", padding: "md", children: _jsxs("div", { style: { textAlign: "center" }, children: [_jsx(Users, { size: 24, color: CYBER_COLORS.primary, style: { marginBottom: "8px" } }), _jsx(CyberText, { variant: "title", style: {
                                        color: CYBER_COLORS.primary,
                                        fontSize: "20px",
                                        marginBottom: "4px",
                                    }, children: systemMetrics.totalUsers.toLocaleString() }), _jsx(CyberText, { variant: "caption", color: "muted", children: "Total Users" })] }) }), _jsx(MegaCard, { variant: "glass", padding: "md", children: _jsxs("div", { style: { textAlign: "center" }, children: [_jsx(Activity, { size: 24, color: CYBER_COLORS.secondary, style: { marginBottom: "8px" } }), _jsx(CyberText, { variant: "title", style: {
                                        color: CYBER_COLORS.secondary,
                                        fontSize: "20px",
                                        marginBottom: "4px",
                                    }, children: systemMetrics.activeUsers.toLocaleString() }), _jsx(CyberText, { variant: "caption", color: "muted", children: "Active Users" })] }) }), _jsx(MegaCard, { variant: "glass", padding: "md", children: _jsxs("div", { style: { textAlign: "center" }, children: [_jsx(Shield, { size: 24, color: CYBER_COLORS.accent, style: { marginBottom: "8px" } }), _jsx(CyberText, { variant: "title", style: {
                                        color: CYBER_COLORS.accent,
                                        fontSize: "20px",
                                        marginBottom: "4px",
                                    }, children: systemMetrics.activeSessions }), _jsx(CyberText, { variant: "caption", color: "muted", children: "Live Sessions" })] }) })] }), _jsx(MegaInput, { type: "search", placeholder: "Search users by name or email...", value: searchQuery, onChange: setSearchQuery, icon: _jsx(Search, { size: 16 }), fullWidth: true }), _jsx(MegaCard, { variant: "glass", padding: "none", children: _jsx("div", { style: { overflowX: "auto" }, children: _jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }, children: [_jsx("th", { style: { padding: "16px", textAlign: "left" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "USER" }) }), _jsx("th", { style: { padding: "16px", textAlign: "left" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "ROLE" }) }), _jsx("th", { style: { padding: "16px", textAlign: "right" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "BALANCE" }) }), _jsx("th", { style: { padding: "16px", textAlign: "right" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "WIN RATE" }) }), _jsx("th", { style: { padding: "16px", textAlign: "center" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "STATUS" }) }), _jsx("th", { style: { padding: "16px", textAlign: "right" }, children: _jsx(CyberText, { variant: "caption", color: "muted", style: { fontWeight: "600" }, children: "ACTIONS" }) })] }) }), _jsx("tbody", { children: filteredUsers.map((user) => (_jsxs("tr", { style: {
                                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                    }, children: [_jsx("td", { style: { padding: "16px" }, children: _jsxs("div", { children: [_jsx(CyberText, { variant: "body", style: { fontWeight: "600", marginBottom: "2px" }, children: user.name }), _jsx(CyberText, { variant: "caption", color: "muted", children: user.email })] }) }), _jsx("td", { style: { padding: "16px" }, children: _jsx("span", { style: {
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    backgroundColor: `${CYBER_COLORS.accent}20`,
                                                    color: CYBER_COLORS.accent,
                                                    border: `1px solid ${CYBER_COLORS.accent}40`,
                                                }, children: user.role }) }), _jsx("td", { style: { padding: "16px", textAlign: "right" }, children: _jsxs(CyberText, { variant: "body", style: { color: CYBER_COLORS.primary, fontWeight: "600" }, children: ["$", user.balance.toLocaleString()] }) }), _jsx("td", { style: { padding: "16px", textAlign: "right" }, children: _jsxs(CyberText, { variant: "body", style: {
                                                    color: CYBER_COLORS.secondary,
                                                    fontWeight: "600",
                                                }, children: [user.winRate.toFixed(1), "%"] }) }), _jsx("td", { style: { padding: "16px", textAlign: "center" }, children: _jsxs("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "4px",
                                                }, children: [user.status === "active" ? (_jsx(CheckCircle, { size: 16, color: CYBER_COLORS.primary })) : (_jsx(XCircle, { size: 16, color: "#ff4757" })), _jsx(CyberText, { variant: "caption", style: {
                                                            color: user.status === "active"
                                                                ? CYBER_COLORS.primary
                                                                : "#ff4757",
                                                        }, children: user.status })] }) }), _jsx("td", { style: { padding: "16px", textAlign: "right" }, children: _jsx(MegaBtn, { variant: user.status === "active" ? "danger" : "success", size: "sm", onClick: () => handleUserStatusUpdate(user.id, user.status === "active" ? "suspended" : "active"), icon: user.status === "active" ? (_jsx(UserX, { size: 14 })) : (_jsx(UserCheck, { size: 14 })), children: user.status === "active" ? "Suspend" : "Activate" }) })] }, user.id))) })] }) }) })] }));
    const renderLogsTab = () => (_jsxs(MegaCard, { variant: "glass", padding: "lg", children: [_jsx(CyberText, { variant: "title", style: { marginBottom: "16px" }, children: "System Logs" }), _jsx("div", { style: { display: "grid", gap: "12px" }, children: systemLogs.map((log) => (_jsxs("div", { style: {
                        padding: "16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx(CyberText, { variant: "body", style: { marginBottom: "4px" }, children: log.message }), _jsxs(CyberText, { variant: "caption", color: "muted", children: [new Date(log.timestamp).toLocaleString(), " \u2022 ", log.category] })] }), _jsx("span", { style: {
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: "600",
                                backgroundColor: `${getLogLevelColor(log.level)}20`,
                                color: getLogLevelColor(log.level),
                                border: `1px solid ${getLogLevelColor(log.level)}40`,
                                textTransform: "uppercase",
                            }, children: log.level })] }, log.id))) })] }));
    const renderStatsTab = () => (_jsx("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
        }, children: [
            {
                label: "System Uptime",
                value: systemMetrics.systemUptime,
                icon: Shield,
                color: CYBER_COLORS.primary,
            },
            {
                label: "CPU Usage",
                value: `${systemMetrics.cpuUsage}%`,
                icon: Activity,
                color: CYBER_COLORS.secondary,
            },
            {
                label: "Memory Usage",
                value: `${systemMetrics.memoryUsage}%`,
                icon: BarChart3,
                color: CYBER_COLORS.accent,
            },
            {
                label: "Models Running",
                value: systemMetrics.modelsRunning.toString(),
                icon: Settings,
                color: CYBER_COLORS.purple,
            },
        ].map((metric, index) => {
            const Icon = metric.icon;
            return (_jsx(MegaCard, { variant: "glass", padding: "lg", children: _jsxs("div", { style: { textAlign: "center" }, children: [_jsx(Icon, { size: 32, color: metric.color, style: { marginBottom: "16px" } }), _jsx(CyberText, { variant: "title", style: {
                                color: metric.color,
                                fontSize: "24px",
                                marginBottom: "8px",
                            }, children: metric.value }), _jsx(CyberText, { variant: "body", color: "muted", children: metric.label })] }) }, index));
        }) }));
    return (_jsxs("div", { className: `mega-admin-panel ${className}`, style: {
            minHeight: "100vh",
            background: CYBER_GRADIENTS.background,
            padding: "24px",
        }, children: [_jsxs(MegaCard, { variant: "panel", style: { marginBottom: "24px", padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "title", style: { fontSize: "28px", marginBottom: "4px" }, children: "Admin Control Center" }), _jsx(CyberText, { variant: "body", color: "muted", children: "System administration and user management" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx(Shield, { size: 16, color: CYBER_COLORS.primary }), _jsx(CyberText, { variant: "caption", color: "accent", children: "Administrator Access" })] })] }), _jsx("div", { style: { display: "flex", gap: "8px" }, children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsx(CyberButton, { variant: activeTab === tab.key ? "primary" : "secondary", active: activeTab === tab.key, onClick: () => setActiveTab(tab.key), icon: _jsx(Icon, { size: 16 }), style: { marginBottom: 0, width: "auto", padding: "8px 16px" }, children: tab.label }, tab.key));
                        }) })] }), _jsxs("div", { children: [activeTab === "users" && renderUsersTab(), activeTab === "logs" && renderLogsTab(), activeTab === "stats" && renderStatsTab(), activeTab === "settings" && (_jsxs(MegaCard, { variant: "glass", padding: "lg", style: { textAlign: "center" }, children: [_jsx(Settings, { size: 48, color: CYBER_COLORS.accent, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "System Settings" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Advanced configuration options" })] }))] })] }));
};
export default MegaAdminPanel;
