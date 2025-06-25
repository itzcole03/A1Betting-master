import React, { useState, useEffect } from "react";
import {
  CYBER_COLORS,
  CYBER_GRADIENTS,
  CyberContainer,
  CyberText,
} from "./CyberTheme";
import {
  UniversalDashboard,
  UniversalMoneyMaker,
  UniversalAnalytics,
} from "../index";
import MegaAdminPanel from "./MegaAdminPanel";
import MegaPrizePicks from "./MegaPrizePicks";
import { MegaSidebar, MegaHeader, MegaAppShell } from "./MegaLayout";
import { MegaCard, MegaButton } from "./MegaUI";
import {
  MegaArbitrageEngine,
  MegaPredictionEngine,
  MegaRevolutionaryInterface,
} from "./MegaFeatures";
import {
  Brain,
  Target,
  BarChart3,
  Zap,
  TrendingUp,
  DollarSign,
  Settings,
  User,
  Shield,
  Activity,
  Menu,
  X,
  Home,
  Wifi,
  WifiOff,
  Bell,
  LogOut,
  Moon,
  Sun,
  Trophy,
  UserCog,
} from "lucide-react";

// MASTER MEGA APP - Consolidates all functionality with cyber theme
const MegaApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [connectedSources, setConnectedSources] = useState(12);
  const [dataQuality, setDataQuality] = useState(87);
  const [notifications, setNotifications] = useState(3);

  const [user] = useState({
    name: "Alex Chen",
    email: "alex@a1betting.com",
    balance: 127430.5,
    tier: "Quantum Pro",
    accuracy: 97.3,
    winRate: 89.4,
    totalProfit: 47230,
  });

  // Auto-update system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectedSources(Math.floor(Math.random() * 5) + 10);
      setDataQuality(Math.floor(Math.random() * 20) + 80);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      component: MegaDashboard,
      description: "Overview and system status",
    },
    {
      id: "money-maker",
      label: "Money Maker",
      icon: DollarSign,
      component: MegaBetting,
      description: "AI-powered betting opportunities",
    },
    {
      id: "prizepicks",
      label: "PrizePicks Pro",
      icon: Trophy,
      component: MegaPrizePicks,
      description: "Professional prop analysis with lineup builder",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      component: MegaAnalytics,
      description: "Advanced ML insights",
    },
    {
      id: "real-time",
      label: "Real-time Monitor",
      icon: Activity,
      description: "Live data streams",
    },
    {
      id: "arbitrage",
      label: "Arbitrage Scanner",
      icon: Shield,
      description: "Cross-platform opportunities",
    },
    {
      id: "predictions",
      label: "Quantum Predictions",
      icon: Brain,
      description: "Advanced ML predictions",
    },
    {
      id: "admin",
      label: "Admin Panel",
      icon: UserCog,
      component: MegaAdminPanel,
      description: "System administration and user management",
    },
  ];

  const getConnectionStatus = () => {
    if (connectedSources === 0) {
      return { icon: WifiOff, text: "No Data", color: "#ff4757" };
    }
    if (connectedSources < 8) {
      return { icon: Wifi, text: "Limited", color: CYBER_COLORS.accent };
    }
    return { icon: Wifi, text: "Connected", color: CYBER_COLORS.primary };
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  const renderCurrentPage = () => {
    const currentItem = navigationItems.find((item) => item.id === currentPage);

    // Handle components with direct implementations
    if (currentItem?.component) {
      const Component = currentItem.component;
      return (
        <Component
          connectedSources={connectedSources}
          dataQuality={dataQuality}
          userBalance={user.balance}
          userStats={user}
          autoMode={true}
          autoRefresh={true}
          showAdvanced={true}
        />
      );
    }

    // Use MegaFeatures for enhanced functionality
    switch (currentPage) {
      case "arbitrage":
        return (
          <div style={{ padding: "24px" }}>
            <MegaArbitrageEngine
              isScanning={true}
              onToggleScanning={(scanning) =>
                console.log("Arbitrage scanning:", scanning)
              }
            />
          </div>
        );
      case "predictions":
        return (
          <div style={{ padding: "24px" }}>
            <MegaPredictionEngine isRealTime={true} />
          </div>
        );
      case "real-time":
        return (
          <div style={{ padding: "24px" }}>
            <MegaRevolutionaryInterface />
          </div>
        );
      default:
        // Fallback for any remaining placeholder pages
        if (currentItem && !currentItem.component) {
          return (
            <div style={{ padding: "24px" }}>
              <MegaCard
                variant="glass"
                padding="lg"
                style={{ textAlign: "center" }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <Activity size={48} color={CYBER_COLORS.primary} />
                </div>
                <CyberText
                  variant="title"
                  style={{ marginBottom: "8px", fontSize: "24px" }}
                >
                  {currentItem.label}
                </CyberText>
                <CyberText variant="body" color="muted">
                  {currentItem.description} - Coming Soon
                </CyberText>
              </MegaCard>
            </div>
          );
        }

        // Default to dashboard
        return (
          <MegaDashboard
            connectedSources={connectedSources}
            dataQuality={dataQuality}
            userStats={user}
          />
        );
    }
  };

  return (
    <MegaAppShell
      sidebar={
        <MegaSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          navigationItems={navigationItems}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          systemStatus={{
            connectedSources,
            dataQuality,
            isOnline: true,
          }}
        />
      }
      header={
        <MegaHeader
          title={
            navigationItems.find((item) => item.id === currentPage)?.label ||
            "Dashboard"
          }
          subtitle={
            navigationItems.find((item) => item.id === currentPage)?.description
          }
          notifications={notifications}
          onNotificationsClick={() => console.log("Notifications clicked")}
          user={user}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(!darkMode)}
        />
      }
    >
      {renderCurrentPage()}
    </MegaAppShell>
  );
};

export default MegaApp;
