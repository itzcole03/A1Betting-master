import React, { useState, useEffect } from "react";
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
import { AdvancedIntelligenceHub } from "./AdvancedIntelligenceHub";
import { UltraAccuracyDashboard } from "../overview/UltraAccuracyOverview";
import { AdminSettings } from "../admin/AdminSettings";

interface IntelligenceHubProps {
  onNavigate?: (page: string) => void;
}

export const EnhancedIntelligenceHub: React.FC<IntelligenceHubProps> = ({
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [systemMetrics, setSystemMetrics] = useState<any>(null);

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

export default EnhancedIntelligenceHub;
