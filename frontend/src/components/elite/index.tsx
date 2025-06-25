import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  DollarSign,
  Database,
  BarChart3,
  Link,
  Gamepad2,
} from "lucide-react";

// Mega Sports Component
export const MegaSports: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
            <Zap className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Mega Sports Platform
        </h1>
        <p className="text-gray-400">
          Advanced sports analytics and prediction engine
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">Live Games</h3>
          <div className="text-3xl font-bold text-orange-400">247</div>
          <div className="text-sm text-gray-400">Currently tracking</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">Predictions</h3>
          <div className="text-3xl font-bold text-green-400">94.2%</div>
          <div className="text-sm text-gray-400">Accuracy rate</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">Profit</h3>
          <div className="text-3xl font-bold text-cyan-400">$47.2K</div>
          <div className="text-sm text-gray-400">This month</div>
        </div>
      </div>
    </div>
  );
};

// Elite Bankroll Component
export const EliteBankroll: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-xl border border-yellow-500/30">
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Elite Bankroll Manager
        </h1>
        <p className="text-gray-400">
          Professional bankroll management and risk assessment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Balance
          </h3>
          <div className="text-4xl font-bold text-green-400 mb-2">$127,450</div>
          <div className="text-sm text-gray-400">+18.3% this week</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Risk Assessment
          </h3>
          <div className="text-4xl font-bold text-blue-400 mb-2">Low</div>
          <div className="text-sm text-gray-400">Optimal allocation</div>
        </div>
      </div>
    </div>
  );
};

// SQL Sports Component
export const SQLSports: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          SQL Sports Analytics
        </h1>
        <p className="text-gray-400">
          Database-driven sports intelligence and querying
        </p>
      </motion.div>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Query Console</h3>
        <div className="bg-gray-900/50 p-4 rounded-lg font-mono text-sm">
          <div className="text-green-400">SELECT * FROM player_stats</div>
          <div className="text-cyan-400">WHERE accuracy &gt; 0.85</div>
          <div className="text-yellow-400">ORDER BY profit DESC;</div>
        </div>
      </div>
    </div>
  );
};

// Model Analysis Component
export const ModelAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Model Analysis Suite
        </h1>
        <p className="text-gray-400">
          Deep dive analytics for ML model performance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">
            Active Models
          </h3>
          <div className="text-3xl font-bold text-purple-400">47</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">
            Avg Accuracy
          </h3>
          <div className="text-3xl font-bold text-green-400">93.7%</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">Processing</h3>
          <div className="text-3xl font-bold text-cyan-400">Real-time</div>
        </div>
      </div>
    </div>
  );
};

// Market Connector Component
export const MarketConnector: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
            <Link className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Market Connector</h1>
        <p className="text-gray-400">
          Live market data integration and API connections
        </p>
      </motion.div>

      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Live Connections</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
            <span className="text-gray-300">DraftKings API</span>
            <span className="text-green-400">Connected</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
            <span className="text-gray-300">FanDuel API</span>
            <span className="text-green-400">Connected</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
            <span className="text-gray-300">PrizePicks API</span>
            <span className="text-green-400">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Real Simulator Component
export const RealSimulator: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
            <Gamepad2 className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Real Simulator</h1>
        <p className="text-gray-400">
          Advanced betting simulation and strategy testing
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Simulation Results
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-green-400 font-semibold">87.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Profit</span>
              <span className="text-cyan-400 font-semibold">$1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown</span>
              <span className="text-orange-400 font-semibold">-12.4%</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Simulations
          </h3>
          <div className="text-3xl font-bold text-indigo-400 mb-2">3</div>
          <div className="text-sm text-gray-400">Running scenarios</div>
        </div>
      </div>
    </div>
  );
};
