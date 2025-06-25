/**
 * Simple-to-Advanced Integration Status
 * Shows how the simple user interface is powered by advanced backend systems
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Network,
  CheckCircle,
  ArrowRight,
  Eye,
  Settings,
} from "lucide-react";
import { integrationService } from "../services/integrationService";
import { enhancedBridge } from "../services/enhancedIntegrationBridge";

interface SystemStatus {
  component: string;
  simpleFeature: string;
  advancedPower: string;
  status: "active" | "inactive" | "loading";
  metrics?: any;
}

export const SimpleAdvancedIntegrationStatus: React.FC = () => {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    setIsLoading(true);
    const statuses: SystemStatus[] = [];

    // Check each integration point
    try {
      // 1. Predictions Integration
      const predictions = await enhancedBridge.getSimplifiedPredictions();
      statuses.push({
        component: "AI Predictions",
        simpleFeature: "Simple game picks displayed to users",
        advancedPower:
          "UltraAdvancedMLDashboard + Multiple ML Models + SHAP Analysis",
        status: predictions.length > 0 ? "active" : "inactive",
        metrics: {
          count: predictions.length,
          accuracy: predictions[0]?.confidence || 0,
        },
      });

      // 2. Analytics Integration
      const analytics = await enhancedBridge.getSimplifiedAnalytics();
      statuses.push({
        component: "User Analytics",
        simpleFeature: "Clean profit/loss and win rate display",
        advancedPower:
          "AdvancedAnalyticsHub + Real-time Performance Tracking + Risk Assessment",
        status: analytics.totalProfit !== undefined ? "active" : "inactive",
        metrics: {
          profit: analytics.totalProfit,
          winRate: analytics.winRate,
          roi: analytics.roi,
        },
      });

      // 3. Betting Opportunities Integration
      const opportunities = await enhancedBridge.getSimplifiedOpportunities();
      statuses.push({
        component: "Money Making Opportunities",
        simpleFeature: 'User-friendly "Make Money" buttons',
        advancedPower:
          "BettingOpportunityService + ArbitrageEngine + Kelly Criterion + Risk Management",
        status: opportunities.length > 0 ? "active" : "inactive",
        metrics: {
          opportunities: opportunities.length,
          avgReturn: opportunities[0]?.expectedReturn || 0,
        },
      });

      // 4. Backend API Integration
      const health = await integrationService.checkSystemHealth();
      statuses.push({
        component: "Real-time Data",
        simpleFeature: "Live stats and instant updates",
        advancedPower:
          "WebSocket Manager + Real-time Data Orchestrator + Multi-source API Integration",
        status: health.status === "online" ? "active" : "inactive",
        metrics: {
          uptime: health.data?.uptime || 0,
          services: Object.keys(health.data?.services || {}).length,
        },
      });

      // 5. Money Maker Integration
      const moneyMaker = await enhancedBridge.getMoneyMakerRecommendations(
        100,
        "balanced",
      );
      statuses.push({
        component: "Money Maker Pro",
        simpleFeature: "One-click investment recommendations",
        advancedPower:
          "UltimateMoneyMaker + Portfolio Optimization + Multi-model Ensemble + Advanced Risk Algorithms",
        status: moneyMaker.picks.length > 0 ? "active" : "inactive",
        metrics: {
          picks: moneyMaker.picks.length,
          projectedROI: moneyMaker.roi,
          confidence: moneyMaker.confidence,
        },
      });
    } catch (error) {
      console.error("Error checking integration status:", error);
    }

    setSystemStatuses(statuses);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "inactive":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "loading":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "inactive":
        return <Shield className="w-5 h-5 text-red-400" />;
      case "loading":
        return <Cpu className="w-5 h-5 text-yellow-400 animate-spin" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center">
          <Cpu className="w-8 h-8 text-cyan-400 animate-spin mr-3" />
          <span className="text-white text-lg">
            Checking Integration Status...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Brain className="w-6 h-6 text-cyan-400 mr-3" />
          Simple Interface ↔ Advanced Systems Integration
        </h2>
        <p className="text-gray-300">
          Your user-friendly interface is powered by sophisticated backend
          systems running behind the scenes
        </p>
      </div>

      <div className="space-y-4">
        {systemStatuses.map((system, index) => (
          <motion.div
            key={system.component}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border backdrop-blur-sm ${getStatusColor(system.status)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {getStatusIcon(system.status)}
                <h3 className="font-semibold text-white ml-3">
                  {system.component}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(system.status)}`}
              >
                {system.status.toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div>
                <h4 className="text-sm font-medium text-cyan-300 mb-1 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  What Users See (Simple)
                </h4>
                <p className="text-sm text-gray-300">{system.simpleFeature}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1 flex items-center">
                  <Settings className="w-3 h-3 mr-1" />
                  Powered By (Advanced)
                </h4>
                <p className="text-sm text-gray-300">{system.advancedPower}</p>
              </div>
            </div>

            {system.metrics && (
              <div className="flex items-center space-x-6 pt-2 border-t border-gray-700">
                {Object.entries(system.metrics).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:{" "}
                    </span>
                    <span className="text-white font-medium">
                      {typeof value === "number"
                        ? key.includes("Rate") ||
                          key.includes("ROI") ||
                          key.includes("confidence")
                          ? `${Math.round(value)}%`
                          : key.includes("profit")
                            ? `$${value.toLocaleString()}`
                            : value.toLocaleString()
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          Integration Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {systemStatuses.filter((s) => s.status === "active").length}
            </div>
            <div className="text-sm text-gray-400">Active Systems</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {systemStatuses.length}
            </div>
            <div className="text-sm text-gray-400">Total Integrations</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-gray-400">User Friendly</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">Advanced</div>
            <div className="text-sm text-gray-400">Backend Power</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
          <span>Simple UI</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Enhanced Bridge</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Advanced ML/Analytics</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Backend APIs</span>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={checkIntegrationStatus}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
        >
          Refresh Status
        </button>

        <button
          onClick={() => window.open("/docs/integration", "_blank")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          View Documentation
        </button>
      </div>
    </div>
  );
};

export default SimpleAdvancedIntegrationStatus;
