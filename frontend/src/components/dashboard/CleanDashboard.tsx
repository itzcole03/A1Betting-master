import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Activity, Clock } from "lucide-react";

// Import our real components
import MetricsOverview from "./MetricsOverview";
import LiveOpportunities from "./LiveOpportunities";
import ModernActivityFeed from "../ui/ModernActivityFeed";

interface CleanDashboardProps {
  className?: string;
}

export const CleanDashboard: React.FC<CleanDashboardProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-cyan-900/30 border border-gray-700/50 backdrop-blur-xl overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                AI Sports Intelligence Platform
              </h1>
              <p className="text-xl text-gray-300">
                Real-time data • Advanced ML predictions • 94.2% accuracy
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-medium">
                    System Online
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock size={16} />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">94.2%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">+$18K</div>
                <div className="text-sm text-gray-400">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">91.5%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Overview */}
      <MetricsOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Live Opportunities - Takes up 2 columns */}
        <div className="xl:col-span-2">
          <LiveOpportunities />
        </div>

        {/* Activity Feed - Takes up 1 column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <ModernActivityFeed maxItems={8} showTimeline={true} />
          </div>

          {/* System Status */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <BarChart3 size={18} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                System Health
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">
                    Online
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Model Performance</span>
                <span className="text-sm text-white font-medium">94.7%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Data Latency</span>
                <span className="text-sm text-white font-medium">12ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active Models</span>
                <span className="text-sm text-white font-medium">47</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Connected Sources</span>
                <span className="text-sm text-white font-medium">8/8</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Data Quality: 98.3%</span>
                <span>Uptime: 99.9%</span>
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
                <div className="font-medium">Run New Analysis</div>
                <div className="text-xs text-gray-400">
                  Generate fresh predictions
                </div>
              </button>

              <button className="w-full p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 text-green-400 hover:text-green-300 rounded-lg transition-all text-left">
                <div className="font-medium">View Opportunities</div>
                <div className="text-xs text-gray-400">
                  Check latest betting edges
                </div>
              </button>

              <button className="w-full p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 text-purple-400 hover:text-purple-300 rounded-lg transition-all text-left">
                <div className="font-medium">Configure Models</div>
                <div className="text-xs text-gray-400">
                  Adjust AI parameters
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanDashboard;
