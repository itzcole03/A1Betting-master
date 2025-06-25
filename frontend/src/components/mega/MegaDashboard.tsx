import React, { useState, useEffect } from "react";
import {
  CYBER_COLORS,
  CYBER_GRADIENTS,
  CYBER_GLASS,
  CyberContainer,
  CyberText,
  CyberButton,
} from "./CyberTheme";
import {
  Brain,
  Target,
  BarChart3,
  Zap,
  TrendingUp,
  DollarSign,
  Shield,
  Settings,
  Activity,
  Cpu,
  Database,
  Wifi,
} from "lucide-react";

// MEGA DASHBOARD - Consolidates all dashboard components with cyber theme
const MegaDashboard: React.FC<{
  currentSection?: string;
  connectedSources?: number;
  dataQuality?: number;
  userStats?: any;
  liveMetrics?: any;
  className?: string;
}> = ({
  currentSection = "dashboard",
  connectedSources = 12,
  dataQuality = 87,
  userStats = {},
  liveMetrics = {},
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [metrics, setMetrics] = useState({
    winRate: 89.4,
    totalProfit: 47230,
    accuracy: 97.3,
    activeBets: 23,
    totalPredictions: 1847,
    success: 87.6,
  });

  // Auto-refresh metrics every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        winRate: 85 + Math.random() * 10,
        totalProfit: prev.totalProfit + (Math.random() - 0.5) * 100,
        accuracy: 95 + Math.random() * 5,
        activeBets: Math.floor(Math.random() * 50) + 10,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const dashboardCards = [
    {
      title: "Win Rate",
      value: `${metrics.winRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: "+2.3%",
      color: CYBER_COLORS.primary,
    },
    {
      title: "Total Profit",
      value: `$${metrics.totalProfit.toLocaleString()}`,
      icon: DollarSign,
      trend: "+$1,247",
      color: CYBER_COLORS.secondary,
    },
    {
      title: "Accuracy",
      value: `${metrics.accuracy.toFixed(1)}%`,
      icon: Target,
      trend: "+0.5%",
      color: CYBER_COLORS.accent,
    },
    {
      title: "Active Bets",
      value: metrics.activeBets.toString(),
      icon: Activity,
      trend: "+3",
      color: CYBER_COLORS.purple,
    },
  ];

  const systemStats = [
    { label: "Neural Networks", value: "47", color: CYBER_COLORS.primary },
    {
      label: "Data Sources",
      value: connectedSources.toString(),
      color: CYBER_COLORS.secondary,
    },
    { label: "Predictions Today", value: "1,234", color: CYBER_COLORS.accent },
    { label: "Models Running", value: "12", color: CYBER_COLORS.purple },
  ];

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "realtime", label: "Real-time", icon: Zap },
    { key: "analytics", label: "Analytics", icon: Brain },
    { key: "system", label: "System", icon: Cpu },
  ];

  const renderOverviewTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
      }}
    >
      {/* Metric Cards */}
      {dashboardCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <CyberContainer
            key={index}
            variant="card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <CyberText variant="caption" color="muted">
                  {card.title}
                </CyberText>
                <CyberText
                  variant="title"
                  style={{
                    fontSize: "24px",
                    color: card.color,
                    marginBottom: "4px",
                  }}
                >
                  {card.value}
                </CyberText>
                <CyberText
                  variant="caption"
                  style={{ color: CYBER_COLORS.primary }}
                >
                  {card.trend} this week
                </CyberText>
              </div>
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${card.color}30`,
                }}
              >
                <Icon size={20} color={card.color} />
              </div>
            </div>
          </CyberContainer>
        );
      })}

      {/* Live Activity Feed */}
      <CyberContainer
        variant="card"
        style={{ gridColumn: "span 2", padding: "20px" }}
      >
        <CyberText
          variant="title"
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Activity
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.primary }}
          />
          Live Activity Feed
        </CyberText>
        <div style={{ space: "12px" }}>
          {[
            {
              time: "2:34 PM",
              event: "New arbitrage opportunity detected",
              value: "+$247",
              color: CYBER_COLORS.primary,
            },
            {
              time: "2:31 PM",
              event: "ML model accuracy updated",
              value: "97.3%",
              color: CYBER_COLORS.secondary,
            },
            {
              time: "2:28 PM",
              event: "Bet placed: Lakers vs Warriors",
              value: "$150",
              color: CYBER_COLORS.accent,
            },
            {
              time: "2:25 PM",
              event: "Neural network retrained",
              value: "Complete",
              color: CYBER_COLORS.purple,
            },
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom:
                  index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
              }}
            >
              <div>
                <CyberText variant="body">{activity.event}</CyberText>
                <CyberText variant="caption" color="muted">
                  {activity.time}
                </CyberText>
              </div>
              <CyberText
                variant="body"
                style={{ color: activity.color, fontWeight: "600" }}
              >
                {activity.value}
              </CyberText>
            </div>
          ))}
        </div>
      </CyberContainer>
    </div>
  );

  const renderSystemTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {/* System Health */}
      <CyberContainer variant="card" style={{ padding: "20px" }}>
        <CyberText
          variant="title"
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Cpu
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.primary }}
          />
          System Health
        </CyberText>
        {systemStats.map((stat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom:
                index < systemStats.length - 1
                  ? "1px solid rgba(255, 255, 255, 0.05)"
                  : "none",
            }}
          >
            <CyberText variant="body" color="secondary">
              {stat.label}
            </CyberText>
            <CyberText
              variant="body"
              style={{ color: stat.color, fontWeight: "600" }}
            >
              {stat.value}
            </CyberText>
          </div>
        ))}
      </CyberContainer>

      {/* Data Quality */}
      <CyberContainer variant="card" style={{ padding: "20px" }}>
        <CyberText
          variant="title"
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Database
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.secondary }}
          />
          Data Quality: {dataQuality}%
        </CyberText>
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: `${dataQuality}%`,
              height: "100%",
              backgroundImage: CYBER_GRADIENTS.button,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <CyberText variant="caption" color="muted">
          {connectedSources} active data sources connected
        </CyberText>
      </CyberContainer>
    </div>
  );

  return (
    <div
      className={`mega-dashboard ${className}`}
      style={{
        minHeight: "100vh",
        background: CYBER_GRADIENTS.background,
        padding: "24px",
        color: CYBER_COLORS.text.primary,
      }}
    >
      {/* Header */}
      <CyberContainer
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
              A1Betting Dashboard
            </CyberText>
            <CyberText variant="body" color="muted">
              Quantum-powered sports betting intelligence platform
            </CyberText>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Wifi size={16} color={CYBER_COLORS.primary} />
              <CyberText variant="caption" color="accent">
                Live
              </CyberText>
            </div>
            <CyberButton
              variant={autoRefresh ? "primary" : "secondary"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto-refresh: {autoRefresh ? "ON" : "OFF"}
            </CyberButton>
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
      </CyberContainer>

      {/* Content */}
      <div style={{ minHeight: "500px" }}>
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "system" && renderSystemTab()}
        {activeTab === "realtime" && (
          <CyberContainer
            variant="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <Zap
              size={48}
              color={CYBER_COLORS.primary}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              Real-time Feed Coming Soon
            </CyberText>
            <CyberText variant="body" color="muted">
              Live predictions and betting opportunities will be displayed here
            </CyberText>
          </CyberContainer>
        )}
        {activeTab === "analytics" && (
          <CyberContainer
            variant="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <Brain
              size={48}
              color={CYBER_COLORS.secondary}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              Advanced Analytics
            </CyberText>
            <CyberText variant="body" color="muted">
              Deep ML insights and performance analytics
            </CyberText>
          </CyberContainer>
        )}
      </div>
    </div>
  );
};

export default MegaDashboard;
