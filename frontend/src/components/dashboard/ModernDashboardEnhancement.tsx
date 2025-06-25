import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Brain,
  Zap,
  BarChart3,
  Activity,
  Eye,
  Shield,
  Clock,
  Star,
} from "lucide-react";

// Import our modern components
import ModernActivityFeed from "../ui/ModernActivityFeed";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  trend?: number[];
  loading?: boolean;
}

interface OpportunityCardProps {
  game: string;
  prediction: string;
  confidence: number;
  odds: number;
  value: number;
  timeLeft: string;
  status: "hot" | "warm" | "cool";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  trend,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          <div className="h-8 bg-gray-700/50 rounded w-1/2" />
          <div className="h-3 bg-gray-700/50 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp size={12} />;
      case "negative":
        return <TrendingDown size={12} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl hover:border-gray-700/50 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
          <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}
          >
            {getChangeIcon()}
            <span>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>

        {trend && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(...trend)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">Trend</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  game,
  prediction,
  confidence,
  odds,
  value,
  timeLeft,
  status,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "hot":
        return "from-red-500/20 to-orange-500/20 border-red-500/30";
      case "warm":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case "cool":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "hot":
        return "🔥";
      case "warm":
        return "⚡";
      case "cool":
        return "❄️";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-2xl border bg-gradient-to-br backdrop-blur-xl hover:shadow-lg transition-all cursor-pointer ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{getStatusIcon()}</span>
            <h3 className="font-semibold text-white">{game}</h3>
          </div>
          <p className="text-sm text-gray-300">{prediction}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Value</div>
          <div className="text-lg font-bold text-green-400">+{value}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-400">Confidence</div>
          <div className="text-sm font-medium text-white">{confidence}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Odds</div>
          <div className="text-sm font-medium text-white">{odds}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Time Left</div>
          <div className="text-sm font-medium text-white">{timeLeft}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export const ModernDashboardEnhancement: React.FC = () => {
  const [metrics, setMetrics] = useState([
    {
      title: "Total Profit",
      value: "$12,847",
      change: 15.3,
      changeType: "positive" as const,
      icon: <DollarSign size={20} />,
      trend: [65, 78, 85, 92, 89],
    },
    {
      title: "Win Rate",
      value: "89.2%",
      change: 2.1,
      changeType: "positive" as const,
      icon: <Target size={20} />,
      trend: [82, 85, 87, 89, 89],
    },
    {
      title: "AI Confidence",
      value: "94.7%",
      change: 1.8,
      changeType: "positive" as const,
      icon: <Brain size={20} />,
      trend: [88, 91, 93, 95, 95],
    },
    {
      title: "Active Models",
      value: "47",
      change: 0,
      changeType: "neutral" as const,
      icon: <Activity size={20} />,
      trend: [45, 46, 47, 47, 47],
    },
  ]);

  const [opportunities] = useState([
    {
      game: "Lakers vs Warriors",
      prediction: "Over 235.5 Points",
      confidence: 94,
      odds: 1.85,
      value: 12.3,
      timeLeft: "2h 15m",
      status: "hot" as const,
    },
    {
      game: "Celtics vs Heat",
      prediction: "Celtics -5.5",
      confidence: 87,
      odds: 1.92,
      value: 8.7,
      timeLeft: "4h 32m",
      status: "warm" as const,
    },
    {
      game: "Nuggets vs Suns",
      prediction: "Under 228.5 Points",
      confidence: 81,
      odds: 1.78,
      value: 6.2,
      timeLeft: "6h 45m",
      status: "cool" as const,
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Opportunities column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Zap size={20} className="text-yellow-400" />
              <span>Live Opportunities</span>
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <OpportunityCard key={index} {...opportunity} />
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">
                    Today's Performance
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    +$2,347
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Eye size={16} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Watching</div>
                  <div className="text-lg font-bold text-blue-400">
                    12 Games
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity feed column */}
        <div className="space-y-6">
          <ModernActivityFeed maxItems={6} showTimeline={true} />

          {/* System Status */}
          <div className="p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield size={18} className="text-green-400" />
              <span>System Status</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Model Performance</span>
                <span className="text-sm text-white">94.7%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Data Latency</span>
                <span className="text-sm text-white">12ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Last Update</span>
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <Clock size={12} />
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardEnhancement;
