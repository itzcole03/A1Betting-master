import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Activity,
  Brain,
  Eye,
} from "lucide-react";

export const BusinessAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Business Analysis Suite
        </h1>
        <p className="text-gray-400">
          Advanced business intelligence and market analytics
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Revenue Growth",
            value: "+127%",
            icon: TrendingUp,
            color: "green",
          },
          {
            label: "Market Share",
            value: "23.4%",
            icon: Target,
            color: "blue",
          },
          {
            label: "ROI Analysis",
            value: "341%",
            icon: DollarSign,
            color: "yellow",
          },
          { label: "Efficiency", value: "94.2%", icon: Zap, color: "purple" },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analysis Panels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Market Analysis */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">
              Market Analysis
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Market Volatility</span>
              <span className="text-green-400 font-semibold">Low Risk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trend Direction</span>
              <span className="text-blue-400 font-semibold">Bullish</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volume Analysis</span>
              <span className="text-purple-400 font-semibold">
                High Activity
              </span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <div className="text-sm text-green-400 font-semibold mb-1">
                Opportunity Detected
              </div>
              <div className="text-xs text-gray-300">
                Market conditions favor aggressive betting strategies
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
              <div className="text-sm text-yellow-400 font-semibold mb-1">
                Risk Assessment
              </div>
              <div className="text-xs text-gray-300">
                Moderate volatility expected in next 24 hours
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">
            Real-time Business Metrics
          </h3>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">$47,293</div>
            <div className="text-sm text-gray-400">Daily Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">+18.3%</div>
            <div className="text-sm text-gray-400">Growth Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">2,847</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
