/**
 * Integration Status Component
 * Shows the status of backend-frontend integration with live data
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Database,
  Wifi,
} from "lucide-react";
import { integrationService } from "../services/integrationService";

interface StatusItem {
  name: string;
  status: "success" | "error" | "loading";
  message: string;
  data?: any;
}

export const IntegrationStatus: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    checkAllIntegrations();

    // Check every 30 seconds
    const interval = setInterval(checkAllIntegrations, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAllIntegrations = async () => {
    setIsLoading(true);
    const newStatuses: StatusItem[] = [];

    // Check system health
    try {
      const health = await integrationService.checkSystemHealth();
      newStatuses.push({
        name: "Backend API",
        status: health.status === "online" ? "success" : "error",
        message:
          health.status === "online"
            ? "Connected and operational"
            : `Offline: ${health.error}`,
        data: health.data,
      });
    } catch (error) {
      newStatuses.push({
        name: "Backend API",
        status: "error",
        message: "Connection failed",
        data: null,
      });
    }

    // Check betting opportunities
    try {
      const opportunities = await integrationService.getBettingOpportunities(
        undefined,
        3,
      );
      newStatuses.push({
        name: "Betting Data",
        status: opportunities.length > 0 ? "success" : "error",
        message: `${opportunities.length} opportunities available`,
        data: opportunities,
      });
    } catch (error) {
      newStatuses.push({
        name: "Betting Data",
        status: "error",
        message: "Failed to fetch betting data",
        data: null,
      });
    }

    // Check analytics
    try {
      const analytics = await integrationService.getUserAnalytics("test-user");
      newStatuses.push({
        name: "Analytics Service",
        status: analytics.current_balance !== undefined ? "success" : "error",
        message: `Balance: $${analytics.current_balance?.toLocaleString() || 0}`,
        data: analytics,
      });
    } catch (error) {
      newStatuses.push({
        name: "Analytics Service",
        status: "error",
        message: "Analytics unavailable",
        data: null,
      });
    }

    // Check model performance
    try {
      const accuracy = await integrationService.getAccuracyMetrics();
      newStatuses.push({
        name: "ML Models",
        status: accuracy.overall_accuracy > 0 ? "success" : "error",
        message: `${(accuracy.overall_accuracy * 100).toFixed(1)}% accuracy`,
        data: accuracy,
      });
    } catch (error) {
      newStatuses.push({
        name: "ML Models",
        status: "error",
        message: "Model performance unavailable",
        data: null,
      });
    }

    // Check transactions
    try {
      const transactions = await integrationService.getTransactions();
      newStatuses.push({
        name: "Transaction System",
        status: "success",
        message: `${transactions.total_count} transactions tracked`,
        data: transactions,
      });
    } catch (error) {
      newStatuses.push({
        name: "Transaction System",
        status: "error",
        message: "Transaction data unavailable",
        data: null,
      });
    }

    setStatuses(newStatuses);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "loading":
        return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 border-green-500/30";
      case "error":
        return "bg-red-500/10 border-red-500/30";
      case "loading":
        return "bg-yellow-500/10 border-yellow-500/30";
      default:
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  const overallStatus = statuses.every((s) => s.status === "success")
    ? "success"
    : statuses.some((s) => s.status === "success")
      ? "partial"
      : "error";

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wifi className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            Backend Integration Status
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              overallStatus === "success"
                ? "bg-green-500/20 text-green-400"
                : overallStatus === "partial"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {overallStatus === "success"
              ? "✅ All Systems Operational"
              : overallStatus === "partial"
                ? "⚠️ Partial Integration"
                : "❌ Integration Issues"}
          </div>

          <button
            onClick={checkAllIntegrations}
            disabled={isLoading}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border backdrop-blur-sm ${getStatusBg(item.status)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{item.name}</h3>
              {getStatusIcon(item.status)}
            </div>

            <p className="text-sm text-gray-300 mb-3">{item.message}</p>

            {item.data && (
              <div className="space-y-2">
                {item.name === "Backend API" && item.data && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">{item.data.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white">{item.data.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white">
                        {Math.round(item.data.uptime)}s
                      </span>
                    </div>
                  </div>
                )}

                {item.name === "Betting Data" &&
                  item.data &&
                  item.data.length > 0 && (
                    <div className="text-xs space-y-1">
                      {item.data.slice(0, 2).map((opp: any) => (
                        <div
                          key={opp.id}
                          className="flex justify-between text-gray-300"
                        >
                          <span className="truncate">{opp.event}</span>
                          <span className="text-cyan-400">{opp.odds}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {item.name === "Analytics Service" && item.data && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-green-400">
                        {(item.data.win_rate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ROI:</span>
                      <span className="text-cyan-400">
                        {item.data.roi.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Wagered:</span>
                      <span className="text-white">
                        ${item.data.total_wagered?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                )}

                {item.name === "ML Models" && item.data && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Precision:</span>
                      <span className="text-green-400">
                        {(item.data.precision * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recall:</span>
                      <span className="text-cyan-400">
                        {(item.data.recall * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">F1 Score:</span>
                      <span className="text-purple-400">
                        {(item.data.f1_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
          Integration Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {statuses.filter((s) => s.status === "success").length}
            </div>
            <div className="text-sm text-gray-400">Services Online</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-red-400">
              {statuses.filter((s) => s.status === "error").length}
            </div>
            <div className="text-sm text-gray-400">Services Offline</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {statuses.length > 0
                ? Math.round(
                    (statuses.filter((s) => s.status === "success").length /
                      statuses.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-gray-400">System Health</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-white">
              {Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s
            </div>
            <div className="text-sm text-gray-400">Last Check</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatus;
