import React, { useState, useEffect } from "react";
import {
  CYBER_COLORS,
  CYBER_GRADIENTS,
  CyberContainer,
  CyberText,
  CyberButton,
} from "./CyberTheme";
import {
  MegaCard,
  MegaInput,
  MegaAlert,
  MegaButton as MegaBtn,
} from "./MegaUI";
import {
  Users,
  Activity,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
} from "lucide-react";

// MEGA ADMIN PANEL - Cyber-themed administrative interface
const MegaAdminPanel: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
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

  const handleUserStatusUpdate = (
    userId: string,
    newStatus: "active" | "suspended",
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getLogLevelColor = (level: string) => {
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

  const renderUsersTab = () => (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* User Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <MegaCard variant="glass" padding="md">
          <div style={{ textAlign: "center" }}>
            <Users
              size={24}
              color={CYBER_COLORS.primary}
              style={{ marginBottom: "8px" }}
            />
            <CyberText
              variant="title"
              style={{
                color: CYBER_COLORS.primary,
                fontSize: "20px",
                marginBottom: "4px",
              }}
            >
              {systemMetrics.totalUsers.toLocaleString()}
            </CyberText>
            <CyberText variant="caption" color="muted">
              Total Users
            </CyberText>
          </div>
        </MegaCard>

        <MegaCard variant="glass" padding="md">
          <div style={{ textAlign: "center" }}>
            <Activity
              size={24}
              color={CYBER_COLORS.secondary}
              style={{ marginBottom: "8px" }}
            />
            <CyberText
              variant="title"
              style={{
                color: CYBER_COLORS.secondary,
                fontSize: "20px",
                marginBottom: "4px",
              }}
            >
              {systemMetrics.activeUsers.toLocaleString()}
            </CyberText>
            <CyberText variant="caption" color="muted">
              Active Users
            </CyberText>
          </div>
        </MegaCard>

        <MegaCard variant="glass" padding="md">
          <div style={{ textAlign: "center" }}>
            <Shield
              size={24}
              color={CYBER_COLORS.accent}
              style={{ marginBottom: "8px" }}
            />
            <CyberText
              variant="title"
              style={{
                color: CYBER_COLORS.accent,
                fontSize: "20px",
                marginBottom: "4px",
              }}
            >
              {systemMetrics.activeSessions}
            </CyberText>
            <CyberText variant="caption" color="muted">
              Live Sessions
            </CyberText>
          </div>
        </MegaCard>
      </div>

      {/* Search */}
      <MegaInput
        type="search"
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={setSearchQuery}
        icon={<Search size={16} />}
        fullWidth
      />

      {/* Users Table */}
      <MegaCard variant="glass" padding="none">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <th style={{ padding: "16px", textAlign: "left" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    USER
                  </CyberText>
                </th>
                <th style={{ padding: "16px", textAlign: "left" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    ROLE
                  </CyberText>
                </th>
                <th style={{ padding: "16px", textAlign: "right" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    BALANCE
                  </CyberText>
                </th>
                <th style={{ padding: "16px", textAlign: "right" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    WIN RATE
                  </CyberText>
                </th>
                <th style={{ padding: "16px", textAlign: "center" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    STATUS
                  </CyberText>
                </th>
                <th style={{ padding: "16px", textAlign: "right" }}>
                  <CyberText
                    variant="caption"
                    color="muted"
                    style={{ fontWeight: "600" }}
                  >
                    ACTIONS
                  </CyberText>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    <div>
                      <CyberText
                        variant="body"
                        style={{ fontWeight: "600", marginBottom: "2px" }}
                      >
                        {user.name}
                      </CyberText>
                      <CyberText variant="caption" color="muted">
                        {user.email}
                      </CyberText>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: `${CYBER_COLORS.accent}20`,
                        color: CYBER_COLORS.accent,
                        border: `1px solid ${CYBER_COLORS.accent}40`,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <CyberText
                      variant="body"
                      style={{ color: CYBER_COLORS.primary, fontWeight: "600" }}
                    >
                      ${user.balance.toLocaleString()}
                    </CyberText>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <CyberText
                      variant="body"
                      style={{
                        color: CYBER_COLORS.secondary,
                        fontWeight: "600",
                      }}
                    >
                      {user.winRate.toFixed(1)}%
                    </CyberText>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      {user.status === "active" ? (
                        <CheckCircle size={16} color={CYBER_COLORS.primary} />
                      ) : (
                        <XCircle size={16} color="#ff4757" />
                      )}
                      <CyberText
                        variant="caption"
                        style={{
                          color:
                            user.status === "active"
                              ? CYBER_COLORS.primary
                              : "#ff4757",
                        }}
                      >
                        {user.status}
                      </CyberText>
                    </div>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <MegaBtn
                      variant={user.status === "active" ? "danger" : "success"}
                      size="sm"
                      onClick={() =>
                        handleUserStatusUpdate(
                          user.id,
                          user.status === "active" ? "suspended" : "active",
                        )
                      }
                      icon={
                        user.status === "active" ? (
                          <UserX size={14} />
                        ) : (
                          <UserCheck size={14} />
                        )
                      }
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </MegaBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MegaCard>
    </div>
  );

  const renderLogsTab = () => (
    <MegaCard variant="glass" padding="lg">
      <CyberText variant="title" style={{ marginBottom: "16px" }}>
        System Logs
      </CyberText>
      <div style={{ display: "grid", gap: "12px" }}>
        {systemLogs.map((log) => (
          <div
            key={log.id}
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <CyberText variant="body" style={{ marginBottom: "4px" }}>
                {log.message}
              </CyberText>
              <CyberText variant="caption" color="muted">
                {new Date(log.timestamp).toLocaleString()} • {log.category}
              </CyberText>
            </div>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "600",
                backgroundColor: `${getLogLevelColor(log.level)}20`,
                color: getLogLevelColor(log.level),
                border: `1px solid ${getLogLevelColor(log.level)}40`,
                textTransform: "uppercase",
              }}
            >
              {log.level}
            </span>
          </div>
        ))}
      </div>
    </MegaCard>
  );

  const renderStatsTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px",
      }}
    >
      {[
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
        return (
          <MegaCard key={index} variant="glass" padding="lg">
            <div style={{ textAlign: "center" }}>
              <Icon
                size={32}
                color={metric.color}
                style={{ marginBottom: "16px" }}
              />
              <CyberText
                variant="title"
                style={{
                  color: metric.color,
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                {metric.value}
              </CyberText>
              <CyberText variant="body" color="muted">
                {metric.label}
              </CyberText>
            </div>
          </MegaCard>
        );
      })}
    </div>
  );

  return (
    <div
      className={`mega-admin-panel ${className}`}
      style={{
        minHeight: "100vh",
        background: CYBER_GRADIENTS.background,
        padding: "24px",
      }}
    >
      {/* Header */}
      <MegaCard
        variant="panel"
        style={{ marginBottom: "24px", padding: "20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <CyberText
              variant="title"
              style={{ fontSize: "28px", marginBottom: "4px" }}
            >
              Admin Control Center
            </CyberText>
            <CyberText variant="body" color="muted">
              System administration and user management
            </CyberText>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={16} color={CYBER_COLORS.primary} />
            <CyberText variant="caption" color="accent">
              Administrator Access
            </CyberText>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <CyberButton
                key={tab.key}
                variant={activeTab === tab.key ? "primary" : "secondary"}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                icon={<Icon size={16} />}
                style={{ marginBottom: 0, width: "auto", padding: "8px 16px" }}
              >
                {tab.label}
              </CyberButton>
            );
          })}
        </div>
      </MegaCard>

      {/* Content */}
      <div>
        {activeTab === "users" && renderUsersTab()}
        {activeTab === "logs" && renderLogsTab()}
        {activeTab === "stats" && renderStatsTab()}
        {activeTab === "settings" && (
          <MegaCard
            variant="glass"
            padding="lg"
            style={{ textAlign: "center" }}
          >
            <Settings
              size={48}
              color={CYBER_COLORS.accent}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              System Settings
            </CyberText>
            <CyberText variant="body" color="muted">
              Advanced configuration options
            </CyberText>
          </MegaCard>
        )}
      </div>
    </div>
  );
};

export default MegaAdminPanel;
