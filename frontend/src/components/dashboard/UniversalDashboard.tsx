import React, { useState, useCallback, Suspense, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Brain,
  Settings,
  User,
} from "lucide-react";

// Import unified components
import { MegaCard, MegaButton, MegaAlert } from "../mega/MegaUI";
import { CyberText, CyberContainer } from "../mega/CyberTheme";
import { predictionService } from "../../services/predictionService";
import useStore from "../../store/useStore";

// Lazy load heavy components
const PerformanceAnalyticsDashboard = React.lazy(
  () => import("../analytics/PerformanceAnalyticsDashboard"),
);
const UnifiedMoneyMaker = React.lazy(
  () => import("../money-maker/UnifiedMoneyMaker"),
);
const UnifiedStrategyEngineDisplay = React.lazy(
  () => import("../strategy/UnifiedStrategyEngineDisplay"),
);

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DashboardTab {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  requiresAuth?: boolean;
  isPremium?: boolean;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

interface UniversalDashboardProps {
  variant?: "standard" | "cyber" | "premium";
  user?: {
    name: string;
    tier: string;
    balance: number;
    totalProfit: number;
    accuracy: number;
    winRate: number;
  };
  defaultTab?: string;
}

// ============================================================================
// COMPONENTS
// ============================================================================

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  change,
  trend,
  loading,
}) => {
  const trendColor =
    trend === "up" ? "#06ffa5" : trend === "down" ? "#ff4757" : "#00d4ff";

  if (loading) {
    return (
      <MegaCard variant="glass" padding="md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-8 bg-gray-600 rounded mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </MegaCard>
    );
  }

  return (
    <MegaCard
      variant="glowing"
      padding="md"
      onClick={() => {}}
      className="transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div style={{ color: "#06ffa5" }}>{icon}</div>
        {change && (
          <span
            style={{ color: trendColor, fontSize: "12px", fontWeight: "600" }}
          >
            {change}
          </span>
        )}
      </div>
      <CyberText variant="caption" color="secondary" className="mb-1">
        {label}
      </CyberText>
      <CyberText
        variant="title"
        style={{ fontSize: "24px", fontWeight: "700" }}
      >
        {value}
      </CyberText>
    </MegaCard>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <MetricCard key={i} label="" value="" icon={<div />} loading />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MegaCard variant="glass" padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-600 rounded w-1/3"></div>
          <div className="h-32 bg-gray-600 rounded"></div>
        </div>
      </MegaCard>
      <MegaCard variant="glass" padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-600 rounded w-1/2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </MegaCard>
    </div>
  </div>
);

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export const UniversalDashboard: React.FC<UniversalDashboardProps> = ({
  variant = "standard",
  user = {
    name: "User",
    tier: "Pro",
    balance: 0,
    totalProfit: 0,
    accuracy: 0,
    winRate: 0,
  },
  defaultTab = "overview",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useStore();

  // Mock data to prevent fetch errors
  const mockPredictions = Array.from({ length: 5 }, (_, i) => ({
    id: `pred-${i + 1}`,
    game: `Game ${i + 1}`,
    prediction: Math.random() * 100,
    confidence: 75 + Math.random() * 20,
    timestamp: new Date().toISOString(),
    status: ["pending", "won", "lost"][Math.floor(Math.random() * 3)],
  }));

  const mockMetrics = {
    accuracy: 89.3,
    totalPredictions: 156,
    winRate: 85.6,
    avgConfidence: 88.5,
  };

  // Data fetching with React Query (using mock data)
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["dashboard-predictions"],
    queryFn: async () => mockPredictions,
    staleTime: 300000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => mockMetrics,
    staleTime: 300000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch
  });

  // Dashboard tabs configuration
  const dashboardTabs: DashboardTab[] = useMemo(
    () => [
      {
        key: "overview",
        label: "Overview",
        icon: <BarChart3 size={20} />,
        component: () => (
          <OverviewTab
            user={user}
            predictions={predictions}
            metrics={metrics}
          />
        ),
      },
      {
        key: "analytics",
        label: "Analytics",
        icon: <Brain size={20} />,
        component: PerformanceAnalyticsDashboard,
        isPremium: true,
      },
      {
        key: "moneymaker",
        label: "Money Maker",
        icon: <TrendingUp size={20} />,
        component: UnifiedMoneyMaker,
        isPremium: true,
      },
      {
        key: "strategy",
        label: "Strategy Engine",
        icon: <Target size={20} />,
        component: UnifiedStrategyEngineDisplay,
      },
      {
        key: "profile",
        label: "Profile",
        icon: <User size={20} />,
        component: () => <div>Profile Component</div>,
      },
    ],
    [user, predictions, metrics],
  );

  const currentTab = dashboardTabs.find((tab) => tab.key === activeTab);

  // Loading state
  if (predictionsLoading && metricsLoading) {
    return (
      <div className="min-h-screen p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-0 h-full w-72 z-40 lg:relative lg:w-64"
          >
            <CyberContainer
              variant="panel"
              className="h-full"
              style={{ borderRadius: "0 16px 16px 0" }}
            >
              <div className="p-6">
                <CyberText variant="title" className="mb-6">
                  A1Betting Dashboard
                </CyberText>

                <nav className="space-y-2">
                  {dashboardTabs.map((tab) => (
                    <MegaButton
                      key={tab.key}
                      variant={activeTab === tab.key ? "primary" : "secondary"}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSidebarOpen(false);
                      }}
                      icon={tab.icon}
                      fullWidth
                      className="justify-start"
                    >
                      <span className="ml-3">{tab.label}</span>
                      {tab.isPremium && (
                        <span className="ml-auto text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded">
                          PRO
                        </span>
                      )}
                    </MegaButton>
                  ))}
                </nav>
              </div>
            </CyberContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen || window.innerWidth >= 1024 ? "lg:ml-64" : ""}`}
      >
        <div className="p-6 lg:p-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(6, 255, 165, 0.2), rgba(0, 255, 136, 0.1))",
                      boxShadow: "0 8px 32px rgba(6, 255, 165, 0.2)",
                    }}
                  >
                    <Brain size={28} style={{ color: "#06ffa5" }} />
                  </div>
                  <div>
                    <CyberText
                      variant="title"
                      style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        lineHeight: "1.1",
                        marginBottom: "4px",
                        background: "linear-gradient(135deg, #ffffff, #94a3b8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {currentTab?.label || "Dashboard"}
                    </CyberText>
                  </div>
                </div>
                <CyberText
                  variant="body"
                  style={{
                    fontSize: "18px",
                    color: "#94a3b8",
                    fontWeight: "500",
                    lineHeight: "1.5",
                  }}
                >
                  Welcome back, {user.name}. Your AI-powered betting
                  intelligence is ready. 🚀
                </CyberText>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="px-4 py-2 rounded-xl"
                  style={{
                    background: "rgba(6, 255, 165, 0.1)",
                    border: "1px solid rgba(6, 255, 165, 0.3)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <CyberText
                    variant="caption"
                    style={{ color: "#06ffa5", fontWeight: "600" }}
                  >
                    ⚡ System Online
                  </CyberText>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<DashboardSkeleton />}>
                {currentTab?.component && <currentTab.component />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// ============================================================================
// OVERVIEW TAB COMPONENT
// ============================================================================

interface OverviewTabProps {
  user: any;
  predictions: any;
  metrics: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  predictions,
  metrics,
}) => {
  const metricCards = [
    {
      label: "Total Profit",
      value: `$${user.totalProfit.toLocaleString()}`,
      icon: <DollarSign size={24} />,
      change: "+$3.2K",
      trend: "up" as const,
    },
    {
      label: "Accuracy",
      value: `${user.accuracy}%`,
      icon: <Target size={24} />,
      change: "+2.3%",
      trend: "up" as const,
    },
    {
      label: "Win Rate",
      value: `${user.winRate}%`,
      icon: <TrendingUp size={24} />,
      change: "+1.2%",
      trend: "up" as const,
    },
    {
      label: "Active Bets",
      value: predictions?.length || 0,
      icon: <Activity size={24} />,
      change: "+5",
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Recent Activity & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MegaCard title="Recent Predictions" variant="glass" padding="lg">
          <div className="space-y-4">
            {predictions?.slice(0, 5).map((prediction: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800 bg-opacity-50"
              >
                <div>
                  <CyberText variant="body" className="font-medium">
                    {prediction.game || `Game ${index + 1}`}
                  </CyberText>
                  <CyberText variant="caption" color="muted">
                    Confidence: {prediction.confidence}%
                  </CyberText>
                </div>
                <div className="text-right">
                  <CyberText variant="body" style={{ color: "#06ffa5" }}>
                    ${prediction.potentialWin || "0"}
                  </CyberText>
                </div>
              </div>
            )) || (
              <CyberText variant="body" color="muted">
                No recent predictions available
              </CyberText>
            )}
          </div>
        </MegaCard>

        <MegaCard title="Quick Actions" variant="glass" padding="lg">
          <div className="space-y-4">
            <MegaButton variant="primary" fullWidth icon={<Brain size={16} />}>
              Run Analysis
            </MegaButton>
            <MegaButton
              variant="secondary"
              fullWidth
              icon={<TrendingUp size={16} />}
            >
              View Opportunities
            </MegaButton>
            <MegaButton
              variant="secondary"
              fullWidth
              icon={<Settings size={16} />}
            >
              Configure Strategy
            </MegaButton>
          </div>
        </MegaCard>
      </div>

      {/* Performance Summary */}
      {metrics && (
        <MegaCard title="Performance Summary" variant="glass" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CyberText
                variant="title"
                style={{ fontSize: "32px", color: "#06ffa5" }}
              >
                {metrics.totalPredictions || 0}
              </CyberText>
              <CyberText variant="body" color="secondary">
                Total Predictions
              </CyberText>
            </div>
            <div className="text-center">
              <CyberText
                variant="title"
                style={{ fontSize: "32px", color: "#00d4ff" }}
              >
                {metrics.accuracy || user.accuracy}%
              </CyberText>
              <CyberText variant="body" color="secondary">
                Average Accuracy
              </CyberText>
            </div>
            <div className="text-center">
              <CyberText
                variant="title"
                style={{ fontSize: "32px", color: "#06ffa5" }}
              >
                ${(metrics.totalProfit || user.totalProfit).toLocaleString()}
              </CyberText>
              <CyberText variant="body" color="secondary">
                Total Profit
              </CyberText>
            </div>
          </div>
        </MegaCard>
      )}
    </div>
  );
};

export default UniversalDashboard;
