import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Eye,
  Calculator,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import SafeChart from "../ui/SafeChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// Core UI Components
import GlassCard from "../ui/GlassCard";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";

interface AnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "good" | "warning" | "critical";
  description: string;
  trend: "up" | "down" | "neutral";
}

interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  lastUpdated: string;
}

interface AdvancedAnalyticsHubProps {
  className?: string;
}

const AdvancedAnalyticsHub: React.FC<AdvancedAnalyticsHubProps> = ({
  className = "",
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    {
      name: "Overall Accuracy",
      value: 94.7,
      unit: "%",
      change: 2.3,
      status: "good",
      description: "Model prediction accuracy",
      trend: "up",
    },
    {
      name: "Profit Margin",
      value: 18.2,
      unit: "%",
      change: 1.8,
      status: "good",
      description: "Average profit margin",
      trend: "up",
    },
    {
      name: "Risk Score",
      value: 23.4,
      unit: "/100",
      change: -5.2,
      status: "good",
      description: "Portfolio risk assessment",
      trend: "down",
    },
    {
      name: "Win Rate",
      value: 72.8,
      unit: "%",
      change: 4.1,
      status: "good",
      description: "Successful prediction rate",
      trend: "up",
    },
  ]);

  const [models, setModels] = useState<ModelPerformance[]>([
    {
      modelName: "XGBoost Ensemble",
      accuracy: 95.2,
      precision: 94.8,
      recall: 93.7,
      f1Score: 94.2,
      auc: 0.97,
      lastUpdated: "2 minutes ago",
    },
    {
      modelName: "Neural Network",
      accuracy: 92.1,
      precision: 91.5,
      recall: 90.8,
      f1Score: 91.1,
      auc: 0.94,
      lastUpdated: "5 minutes ago",
    },
    {
      modelName: "Random Forest",
      accuracy: 89.7,
      precision: 88.9,
      recall: 87.3,
      f1Score: 88.1,
      auc: 0.91,
      lastUpdated: "8 minutes ago",
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Accuracy %",
        data: [85, 87, 91, 93, 94, 95],
        borderColor: "rgb(6, 255, 165)",
        backgroundColor: "rgba(6, 255, 165, 0.2)",
        tension: 0.4,
      },
      {
        label: "Profit %",
        data: [12, 14, 16, 17, 18, 19],
        borderColor: "rgb(0, 212, 255)",
        backgroundColor: "rgba(0, 212, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Ensure models array has data before creating chart data
  const modelComparisonData =
    models && models.length > 0
      ? {
          labels: models.map((m) => m?.modelName || "Unknown"),
          datasets: [
            {
              label: "Accuracy",
              data: models.map((m) => m?.accuracy || 0),
              backgroundColor: [
                "rgba(6, 255, 165, 0.8)",
                "rgba(0, 212, 255, 0.8)",
                "rgba(124, 58, 237, 0.8)",
              ],
            },
          ],
        }
      : {
          labels: ["Loading..."],
          datasets: [
            {
              label: "Accuracy",
              data: [0],
              backgroundColor: ["rgba(156, 163, 175, 0.3)"],
            },
          ],
        };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Advanced Analytics Hub
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time performance monitoring and insights
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Activity
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard
              label={metric.name}
              value={`${metric.value}${metric.unit}`}
              icon="📊"
              change={`${metric.change > 0 ? "+" : ""}${metric.change}%`}
              trend={metric.trend}
            />
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Performance Trends" className="h-96">
          <SafeChart
            type="line"
            data={performanceData}
            loadingMessage="Loading performance trends..."
            options={{
              plugins: {
                legend: {
                  position: "top" as const,
                  labels: { color: "#e5e7eb" },
                },
              },
            }}
          />
        </GlassCard>

        <GlassCard title="Model Comparison" className="h-96">
          <SafeChart
            type="bar"
            data={modelComparisonData}
            loadingMessage="Loading model comparison..."
            options={{
              plugins: {
                legend: {
                  position: "top" as const,
                  labels: { color: "#e5e7eb" },
                },
              },
            }}
          />
        </GlassCard>
      </div>

      {/* Model Performance Table */}
      <GlassCard title="Model Performance Details">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-gray-300">Model</th>
                <th className="py-3 text-gray-300">Accuracy</th>
                <th className="py-3 text-gray-300">Precision</th>
                <th className="py-3 text-gray-300">Recall</th>
                <th className="py-3 text-gray-300">F1-Score</th>
                <th className="py-3 text-gray-300">AUC</th>
                <th className="py-3 text-gray-300">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <motion.tr
                  key={model.modelName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 text-white font-semibold">
                    {model.modelName}
                  </td>
                  <td className="py-3 text-green-400">{model.accuracy}%</td>
                  <td className="py-3 text-cyan-400">{model.precision}%</td>
                  <td className="py-3 text-blue-400">{model.recall}%</td>
                  <td className="py-3 text-purple-400">{model.f1Score}%</td>
                  <td className="py-3 text-yellow-400">{model.auc}</td>
                  <td className="py-3 text-gray-400">{model.lastUpdated}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* System Status */}
      <GlassCard title="System Health">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Data Sources</h4>
            <StatusIndicator status="active" label="ESPN API" />
            <StatusIndicator status="active" label="SportsRadar" />
            <StatusIndicator status="warning" label="PrizePicks" />
            <StatusIndicator status="active" label="Weather API" />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">ML Models</h4>
            <StatusIndicator status="active" label="XGBoost Ensemble" />
            <StatusIndicator status="active" label="Neural Network" />
            <StatusIndicator status="active" label="Random Forest" />
            <StatusIndicator status="error" label="LSTM Model" />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <StatusIndicator status="active" label="Prediction Engine" />
            <StatusIndicator status="active" label="Risk Manager" />
            <StatusIndicator status="active" label="Performance Tracker" />
            <StatusIndicator status="active" label="Alert System" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdvancedAnalyticsHub;
