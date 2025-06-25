import { useState, useEffect, useMemo, useCallback } from "react";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Brain,
  DollarSign,
  Home,
  Menu,
  Search,
  Settings as SettingsIcon,
  Trophy,
  TrendingUp,
  User,
} from "lucide-react";
import {
  initializeSettings,
  getUserDisplayName,
  getUserEmail,
} from "../../utils/userSettings";
import { useWebSocket } from "../../hooks/useWebSocket";
import useUserStats from "../../hooks/useUserStats";
import { Settings } from "lucide-react";
import OfflineIndicator from "../ui/OfflineIndicator";
import ApiErrorBoundary from "../ApiErrorBoundary";
import toast from "react-hot-toast";

// Import user-friendly components with enhanced AI
import MoneyMakerPro from "./MoneyMakerPro";
import PrizePicksProNew from "./PrizePicksProNew";
import PropOllama from "./PropOllama";
import UserFriendlyDashboard from "./UserFriendlyDashboard";
import SimpleSettings from "./SimpleSettings";

// Import existing components to integrate
import CleanAdvancedIntelligenceHub from "@/components/intelligence/CleanAdvancedIntelligenceHub";

// Test pages now integrated within Intelligence Hub

// Import user profile and handlers
import UserProfile from "@/components/user-friendly/UserProfile";
import {
  handleSearchClick,
  handleNotificationClick,
} from "@/components/user-friendly/SearchNotificationHandlers";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  badge?: string;
}

interface UserData {
  name: string;
  email: string;
  balance: number;
  tier: string;
  winRate: number;
  totalProfit: number;
}

// Production health check hook with optimized performance
const useHealthCheck = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [accuracy, setAccuracy] = useState(85.0);

  useEffect(() => {
    // Production health check every 30 seconds
    const healthTimer = setInterval(() => {
      try {
        setIsOnline(navigator.onLine);
        // In production, accuracy would come from real API health check
        // For now, maintain current accuracy without random changes
      } catch (error) {
        setIsOnline(false);
      }
    }, 30000);

    return () => {
      clearInterval(healthTimer);
    };
  }, []);

  return { isOnline, accuracy };
};

const UserFriendlyApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const queryClient = useQueryClient();
  const { isOnline } = useHealthCheck();

  // Fetch real user statistics from backend
  const { userStats, backendHealth, isLoading, error } = useUserStats();

  // Use backend accuracy instead of local accuracy
  const accuracy = backendHealth?.accuracy || 85.0;

  // Production user data with real backend values
  const userData: UserData = useMemo(
    () => ({
      name: getUserDisplayName() || "Ultimate User",
      email: getUserEmail() || "user@a1betting.com",
      balance: userStats.balance,
      tier: "Ultimate Brain Pro",
      winRate: userStats.winRate,
      totalProfit: userStats.totalProfit,
    }),
    [userStats],
  );

  // Initialize settings only once
  useEffect(() => {
    try {
      initializeSettings();
      toast.success("🧠 Ultimate Brain System Activated!");
    } catch (error) {
      toast.error("⚠️ Settings initialization failed");
    }
  }, []);

  // Navigation items with production components - memoized to prevent re-renders
  const navigationItems: NavigationItem[] = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Ultimate Dashboard",
        icon: <Home className="w-5 h-5" />,
        component: UserFriendlyDashboard,
        badge: isOnline ? "🧠" : undefined,
      },
      {
        id: "prizepicks",
        label: "Ultra PrizePicks",
        icon: <Trophy className="w-5 h-5" />,
        component: PrizePicksProNew,
        badge: accuracy > 80 ? "🎯" : undefined,
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
        label: "Prop AI Oracle",
        icon: <Brain className="w-5 h-5" />,
        component: PropOllama,
        badge: "🤖",
      },
      {
        id: "intelligence",
        label: "Intelligence Hub",
        icon: <BarChart3 className="w-5 h-5" />,
        component: CleanAdvancedIntelligenceHub,
        badge: isOnline ? "🧠" : "⚡",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon className="w-5 h-5" />,
        component: SimpleSettings,
      },
      {
        id: "profile",
        label: "My Profile",
        icon: <User className="w-5 h-5" />,
        component: UserProfile,
        badge: "👤",
      },
    ],
    [isOnline, accuracy],
  );

  const activeComponent = useMemo(
    () =>
      navigationItems.find((item) => item.id === activeTab)?.component ||
      UserFriendlyDashboard,
    [navigationItems, activeTab],
  );

  // Navigation handler - memoized to prevent re-renders
  const handleNavigate = useCallback(
    (page: string) => {
      setActiveTab(page);
      setSidebarOpen(false);
      toast.success(
        `Switched to ${navigationItems.find((item) => item.id === page)?.label || page}`,
        {
          duration: 2000,
          icon: "🎯",
        },
      );
    },
    [navigationItems],
  );

  // Modal handlers - memoized to prevent re-renders
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const ActiveComponent = activeComponent;

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        {/* Header */}
        <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 text-cyan-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    A1BETTING
                  </h1>
                  <p className="text-xs text-gray-400">
                    Ultimate Brain {isOnline ? "🧠 ACTIVE" : "⚡ Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* System Health Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-800/40 rounded-lg">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs text-gray-300">
                Brain {isOnline ? "OPTIMAL" : "OFFLINE"}
              </span>
              <span className="text-xs text-cyan-400">
                {accuracy.toFixed(1)}% ACC
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSearchClick}
                className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </button>

              <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-gray-800/60 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-400 hover:text-red-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
              </button>

              {/* Backend Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                <div
                  className={`w-2 h-2 rounded-full ${
                    backendHealth.status === "healthy"
                      ? "bg-green-400"
                      : backendHealth.status === "degraded"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  } animate-pulse`}
                ></div>
                <span className="text-xs text-gray-400">
                  Backend{" "}
                  {backendHealth.status === "healthy"
                    ? "Online"
                    : backendHealth.status === "degraded"
                      ? "Issues"
                      : "Offline"}
                </span>
              </div>

              {/* User Info */}
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-400">{userData.tier}</p>
                </div>
                <button
                  onClick={() => handleNavigate("profile")}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  aria-label="Profile"
                >
                  <span className="text-sm font-bold text-white">
                    {userData.name.charAt(0)}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar - Real Backend Data */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <DollarSign
                    className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""} text-green-400`}
                  />
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-green-400 font-semibold">
                    {isLoading
                      ? "..."
                      : `$${userData.balance.toLocaleString()}`}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ml-1 ${
                      error ? "bg-red-400" : "bg-green-400 animate-pulse"
                    }`}
                    title={error ? "Using cached data" : "Live data"}
                  ></div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""} text-cyan-400`}
                  />
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-cyan-400 font-semibold">
                    {isLoading
                      ? "..."
                      : `${(userData.winRate * 100).toFixed(1)}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy
                    className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""} text-purple-400`}
                  />
                  <span className="text-gray-400">Profit:</span>
                  <span className="text-purple-400 font-semibold">
                    {isLoading
                      ? "..."
                      : `+$${userData.totalProfit.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      backendHealth.status === "healthy"
                        ? "bg-green-400"
                        : backendHealth.status === "degraded"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    } animate-pulse`}
                  ></div>
                  <span className="text-gray-400 text-xs">
                    {backendHealth.status === "healthy"
                      ? "Live"
                      : backendHealth.status === "degraded"
                        ? "Degraded"
                        : "Offline"}
                  </span>
                </div>
              </div>
              <OfflineIndicator show={!isOnline} />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={toggleSidebar}
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
                  Ultimate Navigation
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

              {/* Ultimate Brain Status */}
              <div className="mt-auto p-6 border-t border-gray-800">
                <div className="bg-gray-800/40 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">
                      Ultimate Brain
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={`${
                          isOnline ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {isOnline ? "ACTIVE" : "OFFLINE"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="text-cyan-400">
                        {accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engines:</span>
                      <span className="text-purple-400">
                        {isOnline ? "6/6" : "0/6"}
                      </span>
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

        {/* Footer */}
        <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-cyan-500/20 p-6 mt-auto">
          <div className="text-center">
            <div className="text-cyan-400 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text font-bold mb-2 text-lg drop-shadow-2xl relative">
              <span className="relative z-10">
                A1BETTING ULTIMATE BRAIN INTELLIGENCE
              </span>
            </div>
            <div className="text-cyan-300/60 font-medium">
              © 2024 Ultimate Sports Intelligence Platform • Maximum Accuracy
              AI • Real-time Analysis •{" "}
              {isOnline ? "🧠 Brain Active" : "⚡ Offline"}
            </div>
          </div>
        </footer>
      </div>
    </ApiErrorBoundary>
  );
};

export default UserFriendlyApp;
