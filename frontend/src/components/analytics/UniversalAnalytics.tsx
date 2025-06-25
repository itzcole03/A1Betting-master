import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Target,
  Activity,
  Zap,
  Eye,
  Settings,
  Download,
  Filter,
  Calendar,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  Network,
  PieChart,
  LineChart,
  Gauge,
} from "lucide-react";

// Import consolidated systems
import { MegaCard, MegaButton, MegaInput, MegaAlert } from "../mega/MegaUI";
import { CyberText, CyberContainer } from "../mega/CyberTheme";
import {
  usePredictions,
  useEngineMetrics,
  useBettingOpportunities,
  useToast,
} from "../../hooks/UniversalHooks";
import { UniversalServiceFactory } from "../../services/UniversalServiceLayer";
import {
  formatters,
  analytics as analyticsUtils,
} from "../../utils/UniversalUtils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: "up" | "down" | "stable";
  category: "performance" | "prediction" | "betting" | "ml" | "system";
  format: "currency" | "percentage" | "number" | "decimal";
  priority: "low" | "medium" | "high" | "critical";
}

export interface ModelAnalysis {
  id: string;
  name: string;
  type: "ensemble" | "neural" | "gradient_boost" | "random_forest" | "linear";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  roc: number;
  calibration: number;
  latency: number;
  memory: number;
  predictions: number;
  errors: number;
  status: "active" | "training" | "inactive" | "error";
  lastUpdated: Date;
  performance: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  features: {
    name: string;
    importance: number;
    correlation: number;
    stability: number;
  }[];
  shap: {
    global: { [key: string]: number };
    local: { [key: string]: number[] };
  };
}

export interface BettingAnalysis {
  totalProfit: number;
  totalLoss: number;
  totalStaked: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  profitFactor: number;
  sharpeRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  clv: number;
  expectedValue: number;
  kelly: number;
  diversification: number;
  riskAdjustedReturn: number;
  betsAnalyzed: number;
  opportunities: number;
  arbitrageFound: number;
  valueFound: number;
  marketEfficiency: number;
  edgeRetention: number;
  confidenceCalibration: number;
}

export interface SystemAnalytics {
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  dataPoints: number;
  modelsActive: number;
  predictionsPerSecond: number;
  cachingEfficiency: number;
  dataQuality: number;
  apiCalls: number;
  webhooksFired: number;
  alertsTriggered: number;
}

export interface UniversalAnalyticsState {
  timeRange: "1h" | "24h" | "7d" | "30d" | "90d";
  refreshInterval: number;
  isAutoRefresh: boolean;
  selectedCategory:
    | "all"
    | "performance"
    | "prediction"
    | "betting"
    | "ml"
    | "system";
  viewMode: "overview" | "detailed" | "comparison" | "trends";
  isFullscreen: boolean;
  filters: {
    sport: string;
    model: string;
    market: string;
    confidence: number;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UniversalAnalytics: React.FC = () => {
  // State
  const [state, setState] = useState<UniversalAnalyticsState>({
    timeRange: "24h",
    refreshInterval: 30000,
    isAutoRefresh: true,
    selectedCategory: "all",
    viewMode: "overview",
    isFullscreen: false,
    filters: {
      sport: "all",
      model: "all",
      market: "all",
      confidence: 0,
    },
  });

  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [modelAnalysis, setModelAnalysis] = useState<ModelAnalysis[]>([]);
  const [bettingAnalysis, setBettingAnalysis] =
    useState<BettingAnalysis | null>(null);
  const [systemAnalytics, setSystemAnalytics] =
    useState<SystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Hooks
  const { predictions, isLoading: predictionsLoading } = usePredictions({
    limit: 100,
    realtime: true,
  });
  const { metrics: engineMetrics } = useEngineMetrics();
  const { opportunities } = useBettingOpportunities();
  const { addToast } = useToast();

  // Services
  const analyticsService = UniversalServiceFactory.getAnalyticsService();

  // ============================================================================
  // DATA GENERATION & FETCHING
  // ============================================================================

  const generateMetrics = useCallback((): AnalyticsMetric[] => {
    const baseMetrics: AnalyticsMetric[] = [
      // Performance Metrics
      {
        id: "total_profit",
        name: "Total Profit",
        value: engineMetrics?.totalProfit || 47230,
        previousValue: 44100,
        change: 3130,
        changePercentage: 7.1,
        trend: "up",
        category: "performance",
        format: "currency",
        priority: "critical",
      },
      {
        id: "roi",
        name: "ROI",
        value: 89.3,
        previousValue: 86.7,
        change: 2.6,
        changePercentage: 3.0,
        trend: "up",
        category: "performance",
        format: "percentage",
        priority: "high",
      },
      {
        id: "win_rate",
        name: "Win Rate",
        value: engineMetrics?.winRate || 85.6,
        previousValue: 84.2,
        change: 1.4,
        changePercentage: 1.7,
        trend: "up",
        category: "performance",
        format: "percentage",
        priority: "high",
      },
      {
        id: "accuracy",
        name: "Prediction Accuracy",
        value: engineMetrics?.accuracy || 89.3,
        previousValue: 87.8,
        change: 1.5,
        changePercentage: 1.7,
        trend: "up",
        category: "prediction",
        format: "percentage",
        priority: "critical",
      },

      // ML Metrics
      {
        id: "model_performance",
        name: "Model Performance",
        value: 94.2,
        previousValue: 92.8,
        change: 1.4,
        changePercentage: 1.5,
        trend: "up",
        category: "ml",
        format: "percentage",
        priority: "high",
      },
      {
        id: "predictions_generated",
        name: "Predictions Generated",
        value: engineMetrics?.totalPredictions || 1247,
        previousValue: 1189,
        change: 58,
        changePercentage: 4.9,
        trend: "up",
        category: "prediction",
        format: "number",
        priority: "medium",
      },
      {
        id: "opportunities_found",
        name: "Opportunities Found",
        value: opportunities.length,
        previousValue: 23,
        change: opportunities.length - 23,
        changePercentage: ((opportunities.length - 23) / 23) * 100,
        trend:
          opportunities.length > 23
            ? "up"
            : opportunities.length < 23
              ? "down"
              : "stable",
        category: "betting",
        format: "number",
        priority: "medium",
      },

      // System Metrics
      {
        id: "data_quality",
        name: "Data Quality",
        value: engineMetrics?.dataQuality || 94.2,
        previousValue: 93.1,
        change: 1.1,
        changePercentage: 1.2,
        trend: "up",
        category: "system",
        format: "percentage",
        priority: "high",
      },
      {
        id: "system_uptime",
        name: "System Uptime",
        value: 99.8,
        previousValue: 99.7,
        change: 0.1,
        changePercentage: 0.1,
        trend: "up",
        category: "system",
        format: "percentage",
        priority: "critical",
      },
      {
        id: "response_time",
        name: "Avg Response Time",
        value: 145,
        previousValue: 167,
        change: -22,
        changePercentage: -13.2,
        trend: "up", // Lower is better for response time
        category: "system",
        format: "number",
        priority: "medium",
      },
    ];

    return baseMetrics;
  }, [engineMetrics, opportunities]);

  const generateModelAnalysis = useCallback((): ModelAnalysis[] => {
    const models = [
      "Ensemble Neural Network",
      "Gradient Boosting Classifier",
      "Random Forest Ensemble",
      "Deep Learning LSTM",
      "Support Vector Machine",
      "XGBoost Regressor",
    ];

    return models.map((name, index) => ({
      id: `model_${index}`,
      name,
      type: [
        "ensemble",
        "gradient_boost",
        "random_forest",
        "neural",
        "linear",
        "gradient_boost",
      ][index] as any,
      accuracy: 85 + Math.random() * 10,
      precision: 82 + Math.random() * 12,
      recall: 80 + Math.random() * 15,
      f1Score: 83 + Math.random() * 10,
      roc: 0.85 + Math.random() * 0.12,
      calibration: 0.88 + Math.random() * 0.08,
      latency: 50 + Math.random() * 100,
      memory: 200 + Math.random() * 300,
      predictions: Math.floor(1000 + Math.random() * 5000),
      errors: Math.floor(Math.random() * 50),
      status: ["active", "active", "training", "active", "active", "inactive"][
        index
      ] as any,
      lastUpdated: new Date(Date.now() - Math.random() * 86400000),
      performance: {
        daily: Array.from({ length: 24 }, () => 80 + Math.random() * 15),
        weekly: Array.from({ length: 7 }, () => 85 + Math.random() * 10),
        monthly: Array.from({ length: 30 }, () => 87 + Math.random() * 8),
      },
      features: [
        {
          name: "Form Rating",
          importance: 0.25,
          correlation: 0.73,
          stability: 0.91,
        },
        {
          name: "Head-to-Head",
          importance: 0.18,
          correlation: 0.65,
          stability: 0.87,
        },
        {
          name: "Injuries",
          importance: 0.15,
          correlation: 0.58,
          stability: 0.82,
        },
        {
          name: "Weather",
          importance: 0.12,
          correlation: 0.42,
          stability: 0.95,
        },
        {
          name: "Home Advantage",
          importance: 0.1,
          correlation: 0.38,
          stability: 0.89,
        },
        {
          name: "Momentum",
          importance: 0.2,
          correlation: 0.69,
          stability: 0.84,
        },
      ],
      shap: {
        global: {
          "Form Rating": 0.25,
          Momentum: 0.2,
          "Head-to-Head": 0.18,
          Injuries: 0.15,
          Weather: 0.12,
          "Home Advantage": 0.1,
        },
        local: {
          "Form Rating": Array.from(
            { length: 10 },
            () => Math.random() * 0.5 - 0.25,
          ),
          Momentum: Array.from({ length: 10 }, () => Math.random() * 0.4 - 0.2),
          "Head-to-Head": Array.from(
            { length: 10 },
            () => Math.random() * 0.35 - 0.175,
          ),
        },
      },
    }));
  }, []);

  const generateBettingAnalysis = useCallback((): BettingAnalysis => {
    return {
      totalProfit: 47230,
      totalLoss: -18450,
      totalStaked: 125000,
      roi: 89.3,
      winRate: 85.6,
      avgOdds: 1.89,
      profitFactor: 2.56,
      sharpeRatio: 1.78,
      calmarRatio: 2.34,
      maxDrawdown: -5.8,
      clv: 3.2,
      expectedValue: 8.7,
      kelly: 12.4,
      diversification: 87.3,
      riskAdjustedReturn: 78.9,
      betsAnalyzed: 1247,
      opportunities: 2834,
      arbitrageFound: 127,
      valueFound: 892,
      marketEfficiency: 74.2,
      edgeRetention: 91.5,
      confidenceCalibration: 89.7,
    };
  }, []);

  const generateSystemAnalytics = useCallback((): SystemAnalytics => {
    return {
      uptime: 99.8,
      responseTime: 145,
      throughput: 1247,
      errorRate: 0.2,
      memoryUsage: 68.4,
      cpuUsage: 42.7,
      diskUsage: 34.8,
      networkLatency: 23,
      activeConnections: 156,
      dataPoints: 2847293,
      modelsActive: 6,
      predictionsPerSecond: 12.7,
      cachingEfficiency: 94.2,
      dataQuality: 96.8,
      apiCalls: 15647,
      webhooksFired: 892,
      alertsTriggered: 7,
    };
  }, []);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Generate all analytics data
      const newMetrics = generateMetrics();
      const newModelAnalysis = generateModelAnalysis();
      const newBettingAnalysis = generateBettingAnalysis();
      const newSystemAnalytics = generateSystemAnalytics();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMetrics(newMetrics);
      setModelAnalysis(newModelAnalysis);
      setBettingAnalysis(newBettingAnalysis);
      setSystemAnalytics(newSystemAnalytics);
      setLastUpdated(new Date());

      addToast("Analytics data updated successfully", "success");
    } catch (error) {
      console.error("Failed to load analytics:", error);
      addToast("Failed to load analytics data", "error");
    } finally {
      setIsLoading(false);
    }
  }, [
    generateMetrics,
    generateModelAnalysis,
    generateBettingAnalysis,
    generateSystemAnalytics,
    addToast,
  ]);

  // Auto-refresh
  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  useEffect(() => {
    if (state.isAutoRefresh) {
      const interval = setInterval(loadAnalyticsData, state.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [state.isAutoRefresh, state.refreshInterval, loadAnalyticsData]);

  // ============================================================================
  // FILTERING & PROCESSING
  // ============================================================================

  const filteredMetrics = useMemo(() => {
    let filtered = metrics;

    if (state.selectedCategory !== "all") {
      filtered = filtered.filter(
        (metric) => metric.category === state.selectedCategory,
      );
    }

    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [metrics, state.selectedCategory]);

  const filteredModels = useMemo(() => {
    let filtered = modelAnalysis;

    if (state.filters.model !== "all") {
      filtered = filtered.filter((model) =>
        model.name.toLowerCase().includes(state.filters.model.toLowerCase()),
      );
    }

    return filtered.sort((a, b) => b.accuracy - a.accuracy);
  }, [modelAnalysis, state.filters.model]);

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderMetricCard = (metric: AnalyticsMetric) => {
    const formatValue = (value: number) => {
      switch (metric.format) {
        case "currency":
          return formatters.currency(value);
        case "percentage":
          return formatters.percentage(value);
        case "decimal":
          return value.toFixed(2);
        default:
          return value.toLocaleString();
      }
    };

    const getTrendColor = () => {
      if (metric.id === "response_time") {
        // For response time, lower is better
        return metric.trend === "up"
          ? "#06ffa5"
          : metric.trend === "down"
            ? "#ff4757"
            : "#00d4ff";
      }
      return metric.trend === "up"
        ? "#06ffa5"
        : metric.trend === "down"
          ? "#ff4757"
          : "#00d4ff";
    };

    const getTrendIcon = () => {
      return metric.trend === "up" ? (
        <TrendingUp size={16} />
      ) : metric.trend === "down" ? (
        <TrendingUp size={16} style={{ transform: "rotate(180deg)" }} />
      ) : (
        <Activity size={16} />
      );
    };

    return (
      <MegaCard
        key={metric.id}
        variant="glowing"
        padding="md"
        className="hover:scale-105 transition-transform"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CyberText variant="caption" color="secondary">
              {metric.name}
            </CyberText>
            <div
              className={`px-2 py-1 rounded text-xs font-semibold ${
                metric.priority === "critical"
                  ? "bg-red-500 bg-opacity-20 text-red-400"
                  : metric.priority === "high"
                    ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                    : metric.priority === "medium"
                      ? "bg-blue-500 bg-opacity-20 text-blue-400"
                      : "bg-gray-500 bg-opacity-20 text-gray-400"
              }`}
            >
              {metric.priority.toUpperCase()}
            </div>
          </div>

          <div>
            <CyberText
              variant="title"
              style={{ fontSize: "24px", color: getTrendColor() }}
            >
              {formatValue(metric.value)}
            </CyberText>
          </div>

          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              style={{ color: getTrendColor() }}
            >
              {getTrendIcon()}
              <CyberText variant="caption" style={{ color: getTrendColor() }}>
                {metric.change > 0 ? "+" : ""}
                {formatValue(metric.change)}
              </CyberText>
            </div>
            <CyberText variant="caption" color="muted">
              {metric.changePercentage > 0 ? "+" : ""}
              {metric.changePercentage.toFixed(1)}%
            </CyberText>
          </div>
        </div>
      </MegaCard>
    );
  };

  const renderModelCard = (model: ModelAnalysis) => (
    <MegaCard
      key={model.id}
      title={model.name}
      variant="glass"
      padding="md"
      className="hover:scale-105 transition-transform"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`px-2 py-1 rounded text-xs font-semibold ${
              model.status === "active"
                ? "bg-green-500 bg-opacity-20 text-green-400"
                : model.status === "training"
                  ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                  : model.status === "inactive"
                    ? "bg-gray-500 bg-opacity-20 text-gray-400"
                    : "bg-red-500 bg-opacity-20 text-red-400"
            }`}
          >
            {model.status.toUpperCase()}
          </div>
          <CyberText variant="caption" color="muted">
            {model.predictions.toLocaleString()} predictions
          </CyberText>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <CyberText variant="title" style={{ color: "#06ffa5" }}>
              {model.accuracy.toFixed(1)}%
            </CyberText>
            <CyberText variant="caption" color="muted">
              Accuracy
            </CyberText>
          </div>
          <div className="text-center">
            <CyberText variant="title" style={{ color: "#00d4ff" }}>
              {model.precision.toFixed(1)}%
            </CyberText>
            <CyberText variant="caption" color="muted">
              Precision
            </CyberText>
          </div>
          <div className="text-center">
            <CyberText variant="title" style={{ color: "#06ffa5" }}>
              {model.f1Score.toFixed(1)}%
            </CyberText>
            <CyberText variant="caption" color="muted">
              F1 Score
            </CyberText>
          </div>
        </div>

        <div className="space-y-2">
          <CyberText variant="caption" color="secondary">
            Top Features
          </CyberText>
          {model.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <CyberText variant="caption" color="muted">
                {feature.name}
              </CyberText>
              <div className="flex items-center gap-2">
                <div className="w-12 bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
                <CyberText variant="caption" color="muted">
                  {(feature.importance * 100).toFixed(0)}%
                </CyberText>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: metricsData.indexOf(metric) * 0.1,
              }}
            >
              <MegaCard
                variant="glass"
                className="group cursor-pointer"
                padding="lg"
                onClick={() => setSelectedMetric(metric.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                          metric.trend === "up"
                            ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400"
                            : "bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-400"
                        }`}
                        style={{
                          boxShadow:
                            metric.trend === "up"
                              ? "0 8px 32px rgba(34, 197, 94, 0.2)"
                              : "0 8px 32px rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        {getMetricIcon(metric.id)}
                      </div>
                      <div>
                        <CyberText
                          variant="caption"
                          color="muted"
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          {metric.label}
                        </CyberText>
                      </div>
                    </div>

                    <CyberText
                      variant="title"
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        lineHeight: "1.2",
                        marginBottom: "8px",
                        background:
                          metric.trend === "up"
                            ? "linear-gradient(135deg, #10b981, #059669)"
                            : "linear-gradient(135deg, #ef4444, #dc2626)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {metric.value}
                    </CyberText>

                    <div className="flex items-center">
                      <TrendingUp
                        size={14}
                        className={`mr-2 transition-transform duration-300 ${
                          metric.trend === "up"
                            ? "text-green-400"
                            : "text-red-400 rotate-180"
                        }`}
                      />
                      <CyberText
                        variant="caption"
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: metric.trend === "up" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {metric.change}
                      </CyberText>
                    </div>
                  </div>
                </div>
              </MegaCard>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: "#06ffa5" }} />
            <CyberText variant="caption" color="secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </CyberText>
          </div>

          <MegaButton
            variant="ghost"
            size="sm"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                isFullscreen: !prev.isFullscreen,
              }))
            }
            icon={
              state.isFullscreen ? (
                <Minimize2 size={16} />
              ) : (
                <Maximize2 size={16} />
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <CyberText variant="caption" className="mb-2">
            Time Range
          </CyberText>
          <select
            value={state.timeRange}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                timeRange: e.target.value as any,
              }))
            }
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div>
          <CyberText variant="caption" className="mb-2">
            Category
          </CyberText>
          <select
            value={state.selectedCategory}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                selectedCategory: e.target.value as any,
              }))
            }
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="all">All Categories</option>
            <option value="performance">Performance</option>
            <option value="prediction">Prediction</option>
            <option value="betting">Betting</option>
            <option value="ml">Machine Learning</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <CyberText variant="caption" className="mb-2">
            View Mode
          </CyberText>
          <select
            value={state.viewMode}
            onChange={(e) =>
              setState((prev) => ({ ...prev, viewMode: e.target.value as any }))
            }
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="comparison">Comparison</option>
            <option value="trends">Trends</option>
          </select>
        </div>

        <div>
          <CyberText variant="caption" className="mb-2">
            Refresh Rate
          </CyberText>
          <select
            value={state.refreshInterval}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                refreshInterval: Number(e.target.value),
              }))
            }
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value={15000}>15 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
        </div>
      </div>
    </MegaCard>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div
      className={`space-y-6 ${state.isFullscreen ? "fixed inset-0 z-50 bg-gray-900 p-6 overflow-auto" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <CyberText variant="title" style={{ fontSize: "32px" }}>
            Universal Analytics
          </CyberText>
          <CyberText variant="body" color="secondary">
            Comprehensive Performance, ML & System Analytics
          </CyberText>
        </div>

        <div className="flex items-center gap-2">
          <Brain size={20} style={{ color: "#06ffa5" }} />
          <CyberText variant="body" style={{ color: "#06ffa5" }}>
            Real-Time Intelligence
          </CyberText>
        </div>
      </div>

      {/* Control Panel */}
      {renderControlPanel()}

      {/* Loading State */}
      {isLoading && (
        <MegaCard variant="glass" padding="lg">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <CyberText variant="body" color="secondary" className="ml-4">
              Loading analytics data...
            </CyberText>
          </div>
        </MegaCard>
      )}

      {/* Key Metrics */}
      <MegaCard title="Key Performance Metrics" variant="glass" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredMetrics.map(renderMetricCard)}
        </div>
      </MegaCard>

      {/* Model Analysis */}
      {state.selectedCategory === "all" || state.selectedCategory === "ml" ? (
        <MegaCard title="Machine Learning Models" variant="glass" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map(renderModelCard)}
          </div>
        </MegaCard>
      ) : null}

      {/* Betting Analysis */}
      {(state.selectedCategory === "all" ||
        state.selectedCategory === "betting") &&
        bettingAnalysis && (
          <MegaCard
            title="Betting Performance Analysis"
            variant="glass"
            padding="lg"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {formatters.currency(bettingAnalysis.totalProfit)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Total Profit
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {formatters.percentage(bettingAnalysis.roi)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  ROI
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {formatters.percentage(bettingAnalysis.winRate)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Win Rate
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {bettingAnalysis.profitFactor.toFixed(2)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Profit Factor
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {bettingAnalysis.sharpeRatio.toFixed(2)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Sharpe Ratio
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {formatters.percentage(bettingAnalysis.clv, 1)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  CLV
                </CyberText>
              </div>
            </div>
          </MegaCard>
        )}

      {/* System Analytics */}
      {(state.selectedCategory === "all" ||
        state.selectedCategory === "system") &&
        systemAnalytics && (
          <MegaCard title="System Performance" variant="glass" padding="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {formatters.percentage(systemAnalytics.uptime)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Uptime
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {systemAnalytics.responseTime}ms
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Response Time
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {formatters.percentage(systemAnalytics.dataQuality)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Data Quality
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {systemAnalytics.modelsActive}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Active Models
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#06ffa5" }}
                >
                  {systemAnalytics.predictionsPerSecond.toFixed(1)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Predictions/sec
                </CyberText>
              </div>
              <div className="text-center">
                <CyberText
                  variant="title"
                  style={{ fontSize: "24px", color: "#00d4ff" }}
                >
                  {formatters.percentage(systemAnalytics.cachingEfficiency)}
                </CyberText>
                <CyberText variant="caption" color="secondary">
                  Cache Efficiency
                </CyberText>
              </div>
            </div>
          </MegaCard>
        )}
    </div>
  );
};

export default UniversalAnalytics;
