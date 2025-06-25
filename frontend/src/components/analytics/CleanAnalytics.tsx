import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Target,
  Activity,
  PieChart,
  LineChart,
  DollarSign,
  Percent,
  Clock,
  Shield,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface ModelPerformance {
  id: string;
  name: string;
  accuracy: number;
  predictions: number;
  profit: number;
  roi: number;
  sharpeRatio: number;
  maxDrawdown: number;
  lastUpdated: Date;
  status: "active" | "training" | "offline";
}

interface AnalyticsMetrics {
  totalPredictions: number;
  accuracy: number;
  profit: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  avgStake: number;
  totalVolume: number;
  bestModel: string;
  worstModel: string;
  riskScore: number;
  confidenceScore: number;
}

export const CleanAnalytics: React.FC = () => {
  const [models, setModels] = useState<ModelPerformance[]>([
    {
      id: "1",
      name: "NBA Advanced Model v3.2",
      accuracy: 94.7,
      predictions: 1247,
      profit: 8247.63,
      roi: 67.3,
      sharpeRatio: 2.8,
      maxDrawdown: -8.2,
      lastUpdated: new Date(),
      status: "active",
    },
    {
      id: "2",
      name: "NFL Player Props AI v1.8",
      accuracy: 89.2,
      predictions: 893,
      profit: 5621.45,
      roi: 54.7,
      sharpeRatio: 2.3,
      maxDrawdown: -12.1,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
      status: "active",
    },
    {
      id: "3",
      name: "Ensemble Model v2.1",
      accuracy: 91.8,
      predictions: 2156,
      profit: 12847.92,
      roi: 78.9,
      sharpeRatio: 3.1,
      maxDrawdown: -6.5,
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
      status: "active",
    },
    {
      id: "4",
      name: "Deep Learning Predictor v4.0",
      accuracy: 87.4,
      predictions: 567,
      profit: 3421.78,
      roi: 42.8,
      sharpeRatio: 1.9,
      maxDrawdown: -15.3,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      status: "training",
    },
  ]);

  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalPredictions: 4863,
    accuracy: 91.3,
    profit: 30138.78,
    roi: 64.7,
    winRate: 87.2,
    avgOdds: 1.89,
    avgStake: 247.5,
    totalVolume: 1203470,
    bestModel: "Ensemble Model v2.1",
    worstModel: "Deep Learning Predictor v4.0",
    riskScore: 3.7,
    confidenceScore: 94.2,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModels((prev) =>
        prev.map((model) => ({
          ...model,
          accuracy: Math.max(
            80,
            Math.min(98, model.accuracy + (Math.random() - 0.5) * 0.5),
          ),
          profit: Math.max(0, model.profit + (Math.random() - 0.3) * 100),
          roi: Math.max(0, model.roi + (Math.random() - 0.5) * 2),
          lastUpdated: new Date(),
        })),
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "training":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "offline":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={12} className="text-green-400" />;
      case "training":
        return <Clock size={12} className="text-yellow-400" />;
      case "offline":
        return <AlertTriangle size={12} className="text-red-400" />;
      default:
        return <Activity size={12} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30 border border-gray-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
              <BarChart3 size={40} className="text-purple-400" />
              <span>Advanced Analytics</span>
            </h1>
            <p className="text-xl text-gray-300">
              Real-time performance tracking with advanced ML metrics and market
              analysis
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">
              {metrics.accuracy}%
            </div>
            <div className="text-gray-400">Overall Accuracy</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <DollarSign size={24} className="text-green-400" />
            </div>
            <div className="text-sm text-green-400 font-bold">+64.7%</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${metrics.profit.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Profit</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={24} className="text-blue-400" />
            </div>
            <div className="text-sm text-blue-400 font-bold">+2.8%</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metrics.winRate}%
          </div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Brain size={24} className="text-purple-400" />
            </div>
            <div className="text-sm text-purple-400 font-bold">Live</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metrics.totalPredictions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Predictions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Shield size={24} className="text-yellow-400" />
            </div>
            <div className="text-sm text-yellow-400 font-bold">Low</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metrics.riskScore}/10
          </div>
          <div className="text-sm text-gray-400">Risk Score</div>
        </motion.div>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Brain size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Model Performance
                </h2>
                <p className="text-sm text-gray-400">
                  Real-time AI model analytics
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {model.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-sm font-bold border ${getStatusColor(model.status)} flex items-center space-x-1`}
                      >
                        {getStatusIcon(model.status)}
                        <span>{model.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {model.predictions.toLocaleString()} predictions • Last
                      updated: {model.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ${model.profit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Profit</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Accuracy</div>
                    <div className="text-lg font-bold text-white">
                      {model.accuracy.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">ROI</div>
                    <div className="text-lg font-bold text-green-400">
                      {model.roi.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Sharpe</div>
                    <div className="text-lg font-bold text-blue-400">
                      {model.sharpeRatio.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Max DD</div>
                    <div className="text-lg font-bold text-red-400">
                      {model.maxDrawdown.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Predictions</div>
                    <div className="text-lg font-bold text-white">
                      {model.predictions}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp size={18} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Performance Summary
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Best Model</span>
                <span className="text-sm text-green-400 font-medium">
                  {metrics.bestModel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg Odds</span>
                <span className="text-sm text-white">{metrics.avgOdds}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg Stake</span>
                <span className="text-sm text-white">${metrics.avgStake}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Volume</span>
                <span className="text-sm text-white">
                  ${metrics.totalVolume.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Shield size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Risk Analysis
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Portfolio Risk</span>
                  <span className="text-sm text-white">
                    {metrics.riskScore}/10
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                    style={{ width: `${(metrics.riskScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Confidence</span>
                  <span className="text-sm text-white">
                    {metrics.confidenceScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${metrics.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 rounded-lg transition-all text-left">
                <div className="font-medium">Export Report</div>
                <div className="text-xs text-gray-400">
                  Download analytics PDF
                </div>
              </button>

              <button className="w-full p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 text-green-400 hover:text-green-300 rounded-lg transition-all text-left">
                <div className="font-medium">Model Comparison</div>
                <div className="text-xs text-gray-400">Compare performance</div>
              </button>

              <button className="w-full p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 text-purple-400 hover:text-purple-300 rounded-lg transition-all text-left">
                <div className="font-medium">Retrain Models</div>
                <div className="text-xs text-gray-400">
                  Update with new data
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanAnalytics;
