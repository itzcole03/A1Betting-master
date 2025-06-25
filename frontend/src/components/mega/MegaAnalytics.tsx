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
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  Cpu,
  Database,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Percent,
  Clock,
  Calendar,
} from "lucide-react";

// MEGA ANALYTICS COMPONENT - Consolidates all analytics and ML insights
const MegaAnalytics: React.FC<{
  timeRange?: "1h" | "24h" | "7d" | "30d";
  autoRefresh?: boolean;
  showAdvanced?: boolean;
  className?: string;
}> = ({
  timeRange = "24h",
  autoRefresh = true,
  showAdvanced = true,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalPredictions: 1847,
      accuracy: 97.3,
      profitability: 89.4,
      sharpeRatio: 2.14,
      maxDrawdown: 3.2,
      avgROI: 12.1,
      winStreak: 23,
      totalProfit: 47230,
    },
    models: {
      neuralNetworks: 47,
      ensembleModels: 12,
      quantumModels: 3,
      activeModels: 28,
      trainingModels: 4,
      avgAccuracy: 94.7,
      bestModel: { name: "Quantum-Enhanced Ensemble v4.2", accuracy: 98.1 },
      worstModel: { name: "Basic Linear Regression", accuracy: 78.4 },
    },
    performance: {
      last24h: { predictions: 234, accuracy: 96.8, profit: 1247 },
      last7d: { predictions: 1658, accuracy: 95.2, profit: 8934 },
      last30d: { predictions: 7234, accuracy: 94.1, profit: 47230 },
      trends: {
        accuracy: "+2.3%",
        volume: "+15.7%",
        profit: "+8.9%",
      },
    },
    realtime: {
      activePredictions: 23,
      modelsRunning: 28,
      dataStreams: 156,
      predictionLatency: 0.023,
      systemLoad: 67.8,
      memoryUsage: 84.3,
    },
  });

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        setAnalyticsData((prev) => ({
          ...prev,
          overview: {
            ...prev.overview,
            accuracy: 95 + Math.random() * 5,
            totalPredictions:
              prev.overview.totalPredictions + Math.floor(Math.random() * 5),
            totalProfit:
              prev.overview.totalProfit + (Math.random() - 0.3) * 100,
          },
          realtime: {
            ...prev.realtime,
            activePredictions: Math.floor(Math.random() * 20) + 15,
            systemLoad: Math.random() * 40 + 50,
            memoryUsage: Math.random() * 30 + 70,
          },
        }));
        setRefreshing(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "models", label: "ML Models", icon: Brain },
    { key: "performance", label: "Performance", icon: TrendingUp },
    { key: "realtime", label: "Real-time", icon: Activity },
    { key: "insights", label: "AI Insights", icon: Eye },
  ];

  const timeRanges = [
    { key: "1h", label: "1 Hour" },
    { key: "24h", label: "24 Hours" },
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
  ];

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number },
  ) => {
    if (value >= thresholds.good) return CYBER_COLORS.primary;
    if (value >= thresholds.warning) return CYBER_COLORS.accent;
    return "#ff4757";
  };

  const renderOverviewTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
      }}
    >
      {/* Key Metrics */}
      {[
        {
          title: "Model Accuracy",
          value: `${analyticsData.overview.accuracy.toFixed(1)}%`,
          trend: "+2.3%",
          icon: Target,
          color: CYBER_COLORS.primary,
        },
        {
          title: "Total Predictions",
          value: analyticsData.overview.totalPredictions.toLocaleString(),
          trend: "+47",
          icon: Brain,
          color: CYBER_COLORS.secondary,
        },
        {
          title: "Profit Factor",
          value: `${analyticsData.overview.profitability.toFixed(1)}%`,
          trend: "+5.7%",
          icon: TrendingUp,
          color: CYBER_COLORS.accent,
        },
        {
          title: "Sharpe Ratio",
          value: analyticsData.overview.sharpeRatio.toFixed(2),
          trend: "+0.12",
          icon: BarChart3,
          color: CYBER_COLORS.purple,
        },
      ].map((metric, index) => {
        const Icon = metric.icon;
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
                  {metric.title}
                </CyberText>
                <CyberText
                  variant="title"
                  style={{
                    fontSize: "24px",
                    color: metric.color,
                    marginBottom: "4px",
                  }}
                >
                  {metric.value}
                </CyberText>
                <CyberText
                  variant="caption"
                  style={{ color: CYBER_COLORS.primary }}
                >
                  {metric.trend} today
                </CyberText>
              </div>
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${metric.color}30`,
                }}
              >
                <Icon size={20} color={metric.color} />
              </div>
            </div>
          </CyberContainer>
        );
      })}

      {/* Performance Chart Placeholder */}
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
          <TrendingUp
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.primary }}
          />
          Performance Over Time
        </CyberText>
        <div
          style={{
            height: "200px",
            background: "rgba(6, 255, 165, 0.05)",
            border: `1px solid ${CYBER_COLORS.primary}20`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CyberText variant="body" color="muted">
            Advanced charting visualization will be implemented here
          </CyberText>
        </div>
      </CyberContainer>

      {/* Recent Insights */}
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
          <Brain
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.secondary }}
          />
          AI Insights & Recommendations
        </CyberText>
        {[
          {
            type: "success",
            message:
              "Quantum ensemble model achieved 98.1% accuracy on NBA predictions",
            time: "2 min ago",
          },
          {
            type: "warning",
            message:
              "MLB model accuracy dropped to 89.2%, retraining recommended",
            time: "15 min ago",
          },
          {
            type: "info",
            message: "New arbitrage opportunity detected in NFL futures market",
            time: "23 min ago",
          },
          {
            type: "success",
            message: "Portfolio optimization increased expected ROI by 12.4%",
            time: "1 hour ago",
          },
        ].map((insight, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "12px 0",
              borderBottom:
                index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
            }}
          >
            <div style={{ marginRight: "12px", marginTop: "2px" }}>
              {insight.type === "success" && (
                <CheckCircle size={16} color={CYBER_COLORS.primary} />
              )}
              {insight.type === "warning" && (
                <AlertCircle size={16} color={CYBER_COLORS.accent} />
              )}
              {insight.type === "info" && (
                <Eye size={16} color={CYBER_COLORS.secondary} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <CyberText variant="body">{insight.message}</CyberText>
              <CyberText variant="caption" color="muted">
                {insight.time}
              </CyberText>
            </div>
          </div>
        ))}
      </CyberContainer>
    </div>
  );

  const renderModelsTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {/* Model Status Overview */}
      <CyberContainer variant="card" style={{ padding: "20px" }}>
        <CyberText
          variant="title"
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Brain
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.primary }}
          />
          Model Fleet Status
        </CyberText>
        {[
          {
            label: "Neural Networks",
            value: analyticsData.models.neuralNetworks,
            max: 50,
            color: CYBER_COLORS.primary,
          },
          {
            label: "Ensemble Models",
            value: analyticsData.models.ensembleModels,
            max: 15,
            color: CYBER_COLORS.secondary,
          },
          {
            label: "Quantum Models",
            value: analyticsData.models.quantumModels,
            max: 5,
            color: CYBER_COLORS.accent,
          },
          {
            label: "Active Models",
            value: analyticsData.models.activeModels,
            max: 50,
            color: CYBER_COLORS.purple,
          },
        ].map((model, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <CyberText variant="body" color="secondary">
                {model.label}
              </CyberText>
              <CyberText
                variant="body"
                style={{ color: model.color, fontWeight: "600" }}
              >
                {model.value}/{model.max}
              </CyberText>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(model.value / model.max) * 100}%`,
                  height: "100%",
                  backgroundColor: model.color,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </CyberContainer>

      {/* Top Performing Models */}
      <CyberContainer variant="card" style={{ padding: "20px" }}>
        <CyberText
          variant="title"
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Target
            size={20}
            style={{ marginRight: "8px", color: CYBER_COLORS.secondary }}
          />
          Top Performers
        </CyberText>
        <div style={{ marginBottom: "16px" }}>
          <CyberText
            variant="body"
            style={{
              color: CYBER_COLORS.primary,
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            Best: {analyticsData.models.bestModel.name}
          </CyberText>
          <CyberText variant="caption" color="muted">
            Accuracy: {analyticsData.models.bestModel.accuracy}%
          </CyberText>
        </div>
        <div>
          <CyberText
            variant="body"
            style={{ color: "#ff4757", fontWeight: "600", marginBottom: "4px" }}
          >
            Needs Attention: {analyticsData.models.worstModel.name}
          </CyberText>
          <CyberText variant="caption" color="muted">
            Accuracy: {analyticsData.models.worstModel.accuracy}%
          </CyberText>
        </div>
      </CyberContainer>

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
            style={{ marginRight: "8px", color: CYBER_COLORS.accent }}
          />
          System Health
        </CyberText>
        {[
          {
            label: "CPU Usage",
            value: analyticsData.realtime.systemLoad,
            unit: "%",
            threshold: { good: 80, warning: 60 },
          },
          {
            label: "Memory Usage",
            value: analyticsData.realtime.memoryUsage,
            unit: "%",
            threshold: { good: 90, warning: 70 },
          },
          {
            label: "Active Streams",
            value: analyticsData.realtime.dataStreams,
            unit: "",
            threshold: { good: 100, warning: 50 },
          },
          {
            label: "Prediction Latency",
            value: analyticsData.realtime.predictionLatency * 1000,
            unit: "ms",
            threshold: { good: 50, warning: 100 },
          },
        ].map((metric, index) => {
          const color = getStatusColor(metric.value, metric.threshold);
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom:
                  index < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
              }}
            >
              <CyberText variant="body" color="secondary">
                {metric.label}
              </CyberText>
              <CyberText
                variant="body"
                style={{ color: color, fontWeight: "600" }}
              >
                {metric.value.toFixed(metric.unit === "ms" ? 0 : 1)}
                {metric.unit}
              </CyberText>
            </div>
          );
        })}
      </CyberContainer>
    </div>
  );

  return (
    <div
      className={`mega-analytics ${className}`}
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
              Advanced Analytics Hub
            </CyberText>
            <CyberText variant="body" color="muted">
              Real-time ML insights and predictive performance analytics
            </CyberText>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {refreshing && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Activity
                  size={16}
                  color={CYBER_COLORS.primary}
                  style={{ animation: "cyber-pulse 1s infinite" }}
                />
                <CyberText variant="caption" color="accent">
                  Refreshing...
                </CyberText>
              </div>
            )}
            <div style={{ display: "flex", gap: "4px" }}>
              {timeRanges.map((range) => (
                <CyberButton
                  key={range.key}
                  variant={
                    selectedTimeRange === range.key ? "primary" : "secondary"
                  }
                  active={selectedTimeRange === range.key}
                  onClick={() => setSelectedTimeRange(range.key as any)}
                  style={{
                    marginBottom: 0,
                    width: "auto",
                    padding: "6px 12px",
                    fontSize: "12px",
                  }}
                >
                  {range.label}
                </CyberButton>
              ))}
            </div>
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
        {activeTab === "models" && renderModelsTab()}
        {activeTab === "performance" && (
          <CyberContainer
            variant="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <TrendingUp
              size={48}
              color={CYBER_COLORS.accent}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              Performance Analytics
            </CyberText>
            <CyberText variant="body" color="muted">
              Deep performance metrics and trend analysis
            </CyberText>
          </CyberContainer>
        )}
        {activeTab === "realtime" && (
          <CyberContainer
            variant="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <Activity
              size={48}
              color={CYBER_COLORS.primary}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              Real-time Monitoring
            </CyberText>
            <CyberText variant="body" color="muted">
              Live system metrics and prediction streams
            </CyberText>
          </CyberContainer>
        )}
        {activeTab === "insights" && (
          <CyberContainer
            variant="card"
            style={{ padding: "40px", textAlign: "center" }}
          >
            <Eye
              size={48}
              color={CYBER_COLORS.secondary}
              style={{ marginBottom: "16px", margin: "0 auto" }}
            />
            <CyberText variant="title" style={{ marginBottom: "8px" }}>
              AI Insights Engine
            </CyberText>
            <CyberText variant="body" color="muted">
              Intelligent pattern recognition and market insights
            </CyberText>
          </CyberContainer>
        )}
      </div>
    </div>
  );
};

export default MegaAnalytics;
