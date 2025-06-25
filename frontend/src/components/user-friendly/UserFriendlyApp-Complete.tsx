import { useState, useEffect, useMemo } from "react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Brain,
  DollarSign,
  Home,
  Menu,
  MessageCircle,
  Search,
  Settings as SettingsIcon,
  Trophy,
  TrendingUp,
  X,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/integrationService";
import OfflineIndicator from "../ui/OfflineIndicator";
import ApiErrorBoundary from "../ApiErrorBoundary";
import { ultraAccuracyIntegrationService } from "../../services/UltraAccuracyIntegrationService";
import {
  initializeSettings,
  getUserDisplayName,
  getUserEmail,
} from "../../utils/userSettings";
import toast from "react-hot-toast";

// Import ULTIMATE BRAIN SYSTEM 🧠⚡
import {
  ultimateBrainCentralNervousSystem,
  type UltimateAccuracyResult,
  type SportsPredictionRequest,
} from "../../core/UltimateBrainCentralNervousSystem";

// Import user-friendly components with enhanced AI
import MoneyMakerPro from "./MoneyMakerPro";
import PrizePicksPro from "./PrizePicksPro";
import PropOllama from "./PropOllama";
import UserFriendlyDashboard from "./UserFriendlyDashboard";
import SimpleSettings from "./SimpleSettings";

// Modal components
import SearchModal from "../modals/SearchModal";
import NotificationsModal from "../modals/NotificationsModal";

// Enhanced Intelligence Hub Component
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Brain,
  Target,
  Settings,
  Activity,
  Zap,
  TrendingUp,
  Shield,
  Database,
  Cpu,
  Network,
  AlertCircle,
  CheckCircle,
  Eye,
  Gauge,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/integrationService";

// Import existing components to integrate
import { AdvancedIntelligenceHub } from "../intelligence/AdvancedIntelligenceHub";
import { UltraAccuracyDashboard } from "../overview/UltraAccuracyOverview";
import { AdminSettings } from "../admin/AdminSettings";

const EnhancedIntelligenceHub: React.FC<{
  onNavigate?: (page: string) => void;
}> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState("overview");

  // Real-time system monitoring
  const { data: healthData } = useQuery({
    queryKey: ["intelligence-health"],
    queryFn: () => api.getHealthStatus(),
    refetchInterval: 5000,
  });

  const { data: accuracyData } = useQuery({
    queryKey: ["intelligence-accuracy"],
    queryFn: () => api.getAccuracyMetrics(),
    refetchInterval: 10000,
  });

  // Intelligence Hub sections
  const sections = [
    {
      id: "overview",
      label: "System Overview",
      icon: <Eye className="w-5 h-5" />,
      description: "Real-time system status and performance",
    },
    {
      id: "accuracy",
      label: "Ultra Accuracy",
      icon: <Target className="w-5 h-5" />,
      description: "Advanced accuracy monitoring and optimization",
    },
    {
      id: "intelligence",
      label: "AI Intelligence",
      icon: <Brain className="w-5 h-5" />,
      description: "AI models, predictions, and neural networks",
    },
    {
      id: "admin",
      label: "Admin Control",
      icon: <Settings className="w-5 h-5" />,
      description: "System administration and configuration",
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <SystemOverview healthData={healthData} accuracyData={accuracyData} />
        );
      case "accuracy":
        return <UltraAccuracyDashboard onNavigate={onNavigate} />;
      case "intelligence":
        return <AdvancedIntelligenceHub onNavigate={onNavigate} />;
      case "admin":
        return <AdminSettings onNavigate={onNavigate} />;
      default:
        return (
          <SystemOverview healthData={healthData} accuracyData={accuracyData} />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
          Intelligence Hub
        </h1>
        <p className="text-gray-400 text-lg">
          Central command for all AI systems and monitoring
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl mb-2 text-green-400">
            <Activity className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-xl font-bold text-white">
            {healthData?.status === "healthy" ? "ONLINE" : "OFFLINE"}
          </div>
          <div className="text-sm text-gray-400">System Status</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl mb-2 text-blue-400">
            <Target className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-xl font-bold text-white">
            {accuracyData
              ? `${(accuracyData.overall_accuracy * 100).toFixed(1)}%`
              : "0%"}
          </div>
          <div className="text-sm text-gray-400">AI Accuracy</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl mb-2 text-purple-400">
            <Brain className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-xl font-bold text-white">
            {Object.keys(healthData?.services || {}).length}
          </div>
          <div className="text-sm text-gray-400">Active Models</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-2xl mb-2 text-orange-400">
            <Zap className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-xl font-bold text-white">
            {healthData?.uptime
              ? `${Math.floor(healthData.uptime / 3600)}h`
              : "0h"}
          </div>
          <div className="text-sm text-gray-400">Uptime</div>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-lg text-left transition-all ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                  : "hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {section.icon}
                <span className="font-semibold">{section.label}</span>
              </div>
              <p className="text-sm text-gray-400">{section.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// System Overview Component
const SystemOverview: React.FC<{ healthData: any; accuracyData: any }> = ({
  healthData,
  accuracyData,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">System Overview</h2>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">System Health</h3>
          {healthData?.services &&
            Object.entries(healthData.services).map(
              ([service, status]: [string, any]) => (
                <div
                  key={service}
                  className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg"
                >
                  <span className="text-gray-300 capitalize">
                    {service.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    {status === "operational" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span
                      className={
                        status === "operational"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {status}
                    </span>
                  </div>
                </div>
              ),
            )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">AI Performance</h3>
          <div className="space-y-3">
            {accuracyData?.performance_by_sport &&
              Object.entries(accuracyData.performance_by_sport).map(
                ([sport, data]: [string, any]) => (
                  <div key={sport} className="p-3 bg-gray-800/40 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 capitalize">{sport}</span>
                      <span className="text-cyan-400 font-bold">
                        {(data.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.accuracy * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.games} games analyzed
                    </div>
                  </div>
                ),
              )}
          </div>
        </div>
      </div>

      {/* Autonomous Intelligence Status */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Autonomous Intelligence Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-sm font-semibold">Background Processing</div>
            <div className="text-xs text-gray-400">All user tools enhanced</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-blue-400 mb-2">🔄</div>
            <div className="text-sm font-semibold">Real-time Analysis</div>
            <div className="text-xs text-gray-400">Continuous learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-purple-400 mb-2">🎯</div>
            <div className="text-sm font-semibold">Smart Predictions</div>
            <div className="text-xs text-gray-400">Optimized for profit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define interfaces
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ onNavigate?: (page: string) => void }>;
  badge?: string;
}

const UserFriendlyApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isUltimateBrainInitialized, setIsUltimateBrainInitialized] =
    useState(false);

  const queryClient = useQueryClient();

  // Navigation handler
  const handleNavigate = (page: string) => {
    setActiveTab(page);
    setSidebarOpen(false);
  };

  // Initialize user and Ultimate Brain with fallback
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeSettings();

        // Initialize Ultimate Brain System in background
        try {
          const initResult =
            await ultimateBrainCentralNervousSystem.initialize();
          setIsUltimateBrainInitialized(initResult.success);

          if (initResult.success) {
            toast.success("🧠 Ultimate Brain System Activated!");
          } else {
            console.warn(
              "Ultimate Brain failed to initialize, using autonomous mode",
            );
            setIsUltimateBrainInitialized(false);
          }
        } catch (brainError) {
          console.warn(
            "Ultimate Brain initialization failed, using autonomous mode:",
            brainError,
          );
          // Continue without Ultimate Brain - app should still work
          setIsUltimateBrainInitialized(false);
        }

        setUserLoading(false);
      } catch (error) {
        console.error("App initialization error:", error);
        setUserLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Real-time Ultimate Brain health monitoring
  const { data: ultimateBrainHealth } = useQuery({
    queryKey: ["ultimateBrainHealth"],
    queryFn: async () => {
      if (!isUltimateBrainInitialized) return null;

      try {
        const health =
          await ultimateBrainCentralNervousSystem.getSystemHealth();
        return health;
      } catch (error) {
        console.warn("Ultimate Brain health check failed:", error);
        return null;
      }
    },
    refetchInterval: 30000,
    enabled: isUltimateBrainInitialized,
  });

  // Streamlined navigation for user-friendly main tools
  const navigationItems: NavigationItem[] = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Home className="w-5 h-5" />,
        component: UserFriendlyDashboard,
        badge: isUltimateBrainInitialized ? "🧠" : undefined,
      },
      {
        id: "prizepicks",
        label: "PrizePicks Pro",
        icon: <Trophy className="w-5 h-5" />,
        component: PrizePicksPro,
        badge: "🏆",
      },
      {
        id: "moneymaker",
        label: "Money Maker Pro",
        icon: <DollarSign className="w-5 h-5" />,
        component: MoneyMakerPro,
        badge: "💰",
      },
      {
        id: "propollama",
        label: "propOllama",
        icon: <Brain className="w-5 h-5" />,
        component: PropOllama,
        badge: "🤖",
      },
      {
        id: "intelligence",
        label: "Intelligence Hub",
        icon: <BarChart3 className="w-5 h-5" />,
        component: EnhancedIntelligenceHub,
        badge: isUltimateBrainInitialized ? "🧠" : "⚡",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon className="w-5 h-5" />,
        component: SimpleSettings,
      },
    ],
    [isUltimateBrainInitialized, ultimateBrainHealth],
  );

  const activeComponent = navigationItems.find((item) => item.id === activeTab);
  const ActiveComponent = activeComponent?.component || UserFriendlyDashboard;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-cyan-400 text-xl font-semibold mb-2">
            Initializing Autonomous Intelligence...
          </div>
          <div className="text-gray-400">Loading advanced AI systems</div>
        </motion.div>
      </div>
    );
  }

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <header className="relative z-20 bg-black/20 backdrop-blur-xl border-b border-cyan-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent">
                    A1BETTING AUTONOMOUS AI
                  </h1>
                  <div className="text-xs text-gray-400">
                    {getUserDisplayName()} • {getUserEmail()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/40 rounded-full">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isUltimateBrainInitialized
                      ? "bg-green-400"
                      : "bg-orange-400"
                  }`}
                />
                <span className="text-xs">
                  {isUltimateBrainInitialized ? "AI Active" : "Autonomous Mode"}
                </span>
              </div>

              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-lg bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setNotificationsOpen(true)}
                className="p-2 rounded-lg bg-gray-800/40 hover:bg-gray-700/40 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex">
          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{
              x: sidebarOpen ? 0 : "-100%",
            }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-2xl border-r border-cyan-500/20 lg:relative lg:translate-x-0 lg:z-auto"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-cyan-400 mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Navigation
                </h2>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400"
                          : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Autonomous AI Status */}
              <div className="mt-auto p-6 border-t border-gray-800">
                <div className="bg-gray-800/40 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">
                      Autonomous AI
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-400">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mode:</span>
                      <span className="text-blue-400">
                        {isUltimateBrainInitialized ? "Enhanced" : "Autonomous"}
                      </span>
                    </div>
                    <div className="text-xs text-green-400 mt-2">
                      ✅ All tools AI-enhanced
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen lg:ml-0">
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ActiveComponent onNavigate={handleNavigate} />
              </motion.div>
            </div>
          </main>
        </div>

        {/* Modals */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />

        {/* Footer */}
        <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-cyan-500/20 p-6 mt-auto">
          <div className="text-center">
            <div className="text-cyan-400 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text font-bold mb-2 text-lg drop-shadow-2xl relative">
              <span className="relative z-10">
                A1BETTING AUTONOMOUS INTELLIGENCE
              </span>
            </div>
            <div className="text-cyan-300/60 font-medium">
              © 2024 Autonomous Sports Intelligence Platform • AI-Enhanced
              Tools • Real-time Analysis •{" "}
              {isUltimateBrainInitialized
                ? "🧠 Enhanced Mode"
                : "⚡ Autonomous Mode"}
            </div>
          </div>
        </footer>
      </div>
    </ApiErrorBoundary>
  );
};

export default UserFriendlyApp;
