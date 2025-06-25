import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Cpu,
  Database,
  GitBranch,
} from "lucide-react";

export const AIEdgeML: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Edge ML Suite</h1>
        <p className="text-gray-400">
          Cutting-edge machine learning models and AI algorithms
        </p>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Model Accuracy",
            value: "97.3%",
            icon: Target,
            color: "green",
          },
          {
            label: "Processing Speed",
            value: "0.23ms",
            icon: Zap,
            color: "yellow",
          },
          { label: "Active Models", value: "47", icon: Cpu, color: "blue" },
          {
            label: "Predictions/sec",
            value: "12.4K",
            icon: Activity,
            color: "purple",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Models */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Active ML Models</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Neural Prophet",
              accuracy: "96.7%",
              status: "training",
              type: "Time Series",
            },
            {
              name: "XGBoost Ensemble",
              accuracy: "94.2%",
              status: "active",
              type: "Classification",
            },
            {
              name: "LSTM Network",
              accuracy: "91.8%",
              status: "active",
              type: "Prediction",
            },
            {
              name: "Random Forest",
              accuracy: "89.4%",
              status: "optimizing",
              type: "Regression",
            },
            {
              name: "Transformer Model",
              accuracy: "98.1%",
              status: "active",
              type: "NLP",
            },
            {
              name: "CNN Classifier",
              accuracy: "93.6%",
              status: "validating",
              type: "Image",
            },
          ].map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">
                  {model.name}
                </h4>
                <div
                  className={`w-2 h-2 rounded-full ${
                    model.status === "active"
                      ? "bg-green-400"
                      : model.status === "training"
                        ? "bg-yellow-400 animate-pulse"
                        : model.status === "optimizing"
                          ? "bg-blue-400 animate-pulse"
                          : "bg-orange-400 animate-pulse"
                  }`}
                />
              </div>
              <div className="text-xs text-gray-400 mb-1">{model.type}</div>
              <div className="text-sm font-bold text-purple-400">
                {model.accuracy}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Real-time Processing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Data Flow */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Data Pipeline</h3>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-auto" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
              <span className="text-sm text-gray-300">Data Ingestion</span>
              <span className="text-green-400 text-sm font-semibold">
                247.3 MB/s
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
              <span className="text-sm text-gray-300">Feature Engineering</span>
              <span className="text-cyan-400 text-sm font-semibold">
                1.2K features/s
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
              <span className="text-sm text-gray-300">Model Inference</span>
              <span className="text-purple-400 text-sm font-semibold">
                8.7K predictions/s
              </span>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">
              Performance Insights
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
              <div className="text-sm text-green-400 font-semibold mb-1">
                Accuracy Boost
              </div>
              <div className="text-xs text-gray-300">
                New ensemble model improved accuracy by 3.2%
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
              <div className="text-sm text-blue-400 font-semibold mb-1">
                Speed Optimization
              </div>
              <div className="text-xs text-gray-300">
                Inference time reduced by 45% with new architecture
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <div className="text-sm text-purple-400 font-semibold mb-1">
                Auto-scaling Active
              </div>
              <div className="text-xs text-gray-300">
                Dynamic resource allocation based on demand
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
