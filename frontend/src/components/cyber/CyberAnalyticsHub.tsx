import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Activity,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Cpu,
  Network,
} from "lucide-react";

// Import existing analytics component
import AdvancedAnalyticsHub from "../analytics/AdvancedAnalyticsHub";

// Cyber UI Components
import GlassCard from "../ui/GlassCard";
import CyberButton from "../ui/CyberButton";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";

// Store integration
import {
  usePredictions,
  useBetting,
} from "../../store/unified/UnifiedStoreManager";

interface AnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "good" | "warning" | "critical";
  description: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

interface ModelAnalysis {
  modelName: string;
  accuracy: number;
  confidence: number;
  predictions: number;
  profitability: number;
  status: "active" | "training" | "inactive";
  lastUpdate: Date;
}

interface CyberAnalyticsState {
  isAnalyzing: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  metrics: AnalyticsMetric[];
  modelAnalytics: ModelAnalysis[];
  timeRange: "1h" | "24h" | "7d" | "30d";
  selectedTab: "overview" | "models" | "performance" | "risk" | "insights";
  lastUpdate: Date | null;
}

const CyberAnalyticsHub: React.FC = () => {
  // State management
  const [state, setState] = useState<CyberAnalyticsState>({
    isAnalyzing: false,
    autoRefresh: true,
    refreshInterval: 10000, // 10 seconds
    metrics: [],
    modelAnalytics: [],
    timeRange: "24h",
    selectedTab: "overview",
    lastUpdate: null,
  });

  // Store integration
  const { latestPredictions } = usePredictions();
  const { bets, opportunities } = useBetting();

  // Generate enhanced metrics
  const generateCyberMetrics = useCallback((): AnalyticsMetric[] => {
    const currentTime = Date.now();
    const timeRangeMs = {
      "1h": 3600000,
      "24h": 86400000,
      "7d": 604800000,
      "30d": 2592000000,
    }[state.timeRange];

    const recentPredictions = latestPredictions.filter(
      (p) => currentTime - p.timestamp < timeRangeMs,
    );
    const recentBets = bets.filter(
      (b) => currentTime - b.timestamp < timeRangeMs,
    );

    return [
      {
        name: "Quantum Accuracy",
        value: 97.3,
        unit: "%",
        change: 2.1,
        status: "good",
        description: "AI model prediction accuracy with quantum enhancement",
        trend: "up",
        icon: "fa-brain",
      },
      {
        name: "Prediction Volume",
        value: recentPredictions.length,
        unit: "",
        change: 15.3,
        status: "good",
        description: "Total predictions generated in timeframe",
        trend: "up",
        icon: "fa-chart-line",
      },
      {
        name: "Confidence Score",
        value:
          recentPredictions.length > 0
            ? (recentPredictions.reduce((sum, p) => sum + p.confidence, 0) /
                recentPredictions.length) *
              100
            : 0,
        unit: "%",
        change: 1.8,
        status: "good",
        description: "Average prediction confidence across all models",
        trend: "up",
        icon: "fa-target",
      },
      {
        name: "ROI Performance",
        value: 247.3,
        unit: "%",
        change: 12.4,
        status: "good",
        description: "Return on investment over selected period",
        trend: "up",
        icon: "fa-dollar-sign",
      },
      {
        name: "Processing Speed",
        value: 0.7,
        unit: "ms",
        change: -0.3,
        status: "good",
        description: "Average prediction processing time",
        trend: "up",
        icon: "fa-bolt",
      },
      {
        name: "Risk Assessment",
        value: 2.1,
        unit: "/10",
        change: -0.5,
        status: "good",
        description: "Overall portfolio risk score",
        trend: "up",
        icon: "fa-shield-alt",
      },
    ];
  }, [latestPredictions, bets, state.timeRange]);

  // Generate model analytics
  const generateModelAnalytics = useCallback((): ModelAnalysis[] => {
    return [
      {
        modelName: "XGBoost Ensemble V3",
        accuracy: 94.7,
        confidence: 87.3,
        predictions: 1247,
        profitability: 156.8,
        status: "active",
        lastUpdate: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        modelName: "Neural Network Pro",
        accuracy: 92.1,
        confidence: 89.6,
        predictions: 987,
        profitability: 134.2,
        status: "active",
        lastUpdate: new Date(Date.now() - 180000), // 3 minutes ago
      },
      {
        modelName: "Quantum Predictor",
        accuracy: 97.8,
        confidence: 95.2,
        predictions: 456,
        profitability: 198.7,
        status: "training",
        lastUpdate: new Date(Date.now() - 600000), // 10 minutes ago
      },
      {
        modelName: "Ensemble Alpha",
        accuracy: 89.4,
        confidence: 82.1,
        predictions: 2134,
        profitability: 112.5,
        status: "active",
        lastUpdate: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        modelName: "Deep Learning V2",
        accuracy: 91.8,
        confidence: 88.9,
        predictions: 1567,
        profitability: 145.3,
        status: "active",
        lastUpdate: new Date(Date.now() - 90000), // 1.5 minutes ago
      },
    ];
  }, []);

  // Perform cyber analysis
  const performCyberAnalysis = useCallback(async () => {
    setState((prev) => ({ ...prev, isAnalyzing: true }));

    try {
      // Simulate analysis process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const metrics = generateCyberMetrics();
      const modelAnalytics = generateModelAnalytics();

      setState((prev) => ({
        ...prev,
        metrics,
        modelAnalytics,
        lastUpdate: new Date(),
        isAnalyzing: false,
      }));
    } catch (error) {
      console.error("Cyber analysis failed:", error);
      setState((prev) => ({ ...prev, isAnalyzing: false }));
    }
  }, [generateCyberMetrics, generateModelAnalytics]);

  // Auto refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.autoRefresh) {
      intervalId = setInterval(performCyberAnalysis, state.refreshInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.autoRefresh, state.refreshInterval, performCyberAnalysis]);

  // Initial analysis
  useEffect(() => {
    performCyberAnalysis();
  }, [performCyberAnalysis]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "training":
        return "text-yellow-400";
      case "inactive":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "border-green-500/30 bg-green-500/10";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "critical":
        return "border-red-500/30 bg-red-500/10";
      default:
        return "border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Cyber Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-6 text-electric-400 float-element">
          <BarChart3 className="w-16 h-16 mx-auto" />
        </div>
        <h1 className="holographic text-4xl font-black mb-4">
          QUANTUM ANALYTICS
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Advanced AI-powered analytics with real-time performance monitoring
        </p>
      </div>

      {/* Control Panel */}
      <GlassCard title="Analytics Control Center" glowing={state.isAnalyzing}>
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {(["1h", "24h", "7d", "30d"] as const).map((range) => (
              <CyberButton
                key={range}
                label={range}
                onClick={() =>
                  setState((prev) => ({ ...prev, timeRange: range }))
                }
                variant={state.timeRange === range ? "primary" : "ghost"}
                size="sm"
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 items-center">
            <CyberButton
              label={state.isAnalyzing ? "ANALYZING..." : "QUANTUM ANALYSIS"}
              onClick={performCyberAnalysis}
              variant="primary"
              icon="fa-chart-line"
              disabled={state.isAnalyzing}
            />

            <CyberButton
              label={state.autoRefresh ? "AUTO ON" : "AUTO OFF"}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  autoRefresh: !prev.autoRefresh,
                }))
              }
              variant={state.autoRefresh ? "secondary" : "ghost"}
              size="md"
              icon="fa-refresh"
            />

            <StatusIndicator
              status={state.isAnalyzing ? "warning" : "active"}
              label={
                state.lastUpdate
                  ? `Updated: ${state.lastUpdate.toLocaleTimeString()}`
                  : "Ready"
              }
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {(
            [
              { key: "overview", label: "Overview", icon: "fa-eye" },
              { key: "models", label: "AI Models", icon: "fa-brain" },
              {
                key: "performance",
                label: "Performance",
                icon: "fa-chart-line",
              },
              { key: "risk", label: "Risk Analysis", icon: "fa-shield-alt" },
              { key: "insights", label: "AI Insights", icon: "fa-lightbulb" },
            ] as const
          ).map((tab) => (
            <CyberButton
              key={tab.key}
              label={tab.label}
              onClick={() =>
                setState((prev) => ({ ...prev, selectedTab: tab.key }))
              }
              variant={state.selectedTab === tab.key ? "primary" : "ghost"}
              size="sm"
              icon={tab.icon}
            />
          ))}
        </div>
      </GlassCard>

      {/* Overview Tab */}
      {state.selectedTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard
                label={metric.name}
                value={`${metric.value.toFixed(1)}${metric.unit}`}
                icon={metric.icon}
                change={`${metric.change > 0 ? "+" : ""}${metric.change.toFixed(1)}${metric.unit}`}
                trend={metric.trend}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Models Tab */}
      {state.selectedTab === "models" && (
        <GlassCard title="AI Model Performance" glowing={true}>
          <div className="space-y-4">
            {state.modelAnalytics.map((model, index) => (
              <motion.div
                key={model.modelName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {model.modelName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          model.status === "active"
                            ? "bg-green-400"
                            : model.status === "training"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${getStatusColor(model.status)}`}
                      >
                        {model.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-electric-400">
                      {model.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-green-400">
                      {model.confidence.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-blue-400">
                      {model.predictions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Predictions</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-purple-400">
                      {model.profitability.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Profitability</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">
                      {model.lastUpdate.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-gray-400">Last Update</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Performance Tab */}
      {state.selectedTab === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard title="Performance Overview">
            <div className="space-y-4">
              {state.metrics.slice(0, 3).map((metric, index) => (
                <div
                  key={metric.name}
                  className={`p-4 rounded-lg border ${getMetricStatusColor(metric.status)}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">
                        {metric.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {metric.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-electric-400">
                        {metric.value.toFixed(1)}
                        {metric.unit}
                      </div>
                      <div
                        className={`text-sm ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}
                      >
                        {metric.change > 0 ? "+" : ""}
                        {metric.change.toFixed(1)}
                        {metric.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Real-Time Chart">
            <div className="h-64 bg-gradient-to-br from-electric-400/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-electric-400 mx-auto mb-4" />
                <div className="text-electric-400 font-bold">
                  Real-Time Performance Chart
                </div>
                <div className="text-sm text-gray-400">
                  Interactive visualization placeholder
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Legacy Integration */}
      <GlassCard title="Advanced Analytics Integration">
        <div className="p-4 glass-card rounded-lg">
          <AdvancedAnalyticsHub />
        </div>
      </GlassCard>
    </div>
  );
};

export default CyberAnalyticsHub;
