import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Target,
  Brain,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

// Money-making scores for modules
const MODULE_SCORES = {
  "advanced-analytics": { money: 95, accuracy: 12, profit: 25000 },
  "ultra-accuracy": { money: 92, accuracy: 18, profit: 22000 },
  "ultra-ml": { money: 88, accuracy: 15, profit: 20000 },
  "realtime-accuracy": { money: 85, accuracy: 10, profit: 18000 },
  "strategy-engine": { money: 82, accuracy: 6, profit: 15000 },
  "performance-analytics": { money: 78, accuracy: 5, profit: 10000 },
  "ml-model-center": { money: 75, accuracy: 8, profit: 12000 },
  "mega-analytics": { money: 90, accuracy: 20, profit: 30000 },
};

interface EnhancedModuleCardProps {
  module: any;
  isActive: boolean;
  onToggle: () => void;
}

export const EnhancedModuleCard: React.FC<EnhancedModuleCardProps> = ({
  module,
  isActive,
  onToggle,
}) => {
  const scores = MODULE_SCORES[module.id as keyof typeof MODULE_SCORES] || {
    money: 50,
    accuracy: 3,
    profit: 5000,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateY: 1 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
        isActive
          ? "bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-blue-500/15 border-green-400/50 shadow-lg shadow-green-500/20"
          : "bg-slate-800/30 border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/25"
      }`}
      onClick={onToggle}
    >
      {/* Money-Making Score Badge */}
      {scores.money >= 80 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          💰 {scores.money}%
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg transition-colors ${isActive ? "bg-green-500/20" : "bg-slate-600/20"}`}
          >
            {module.icon}
          </div>
          <div>
            <span className="font-semibold text-sm block">{module.name}</span>
            <span className="text-xs text-slate-400 capitalize">
              {module.category}
            </span>
          </div>
        </div>
        {isActive ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <ToggleRight className="w-5 h-5 text-green-400" />
          </div>
        ) : (
          <ToggleLeft className="w-5 h-5 text-slate-400" />
        )}
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Money Impact</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  scores.money >= 90
                    ? "bg-gradient-to-r from-green-500 to-emerald-400"
                    : scores.money >= 70
                      ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                      : "bg-gradient-to-r from-blue-500 to-cyan-400"
                }`}
                style={{ width: `${Math.min(scores.money, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-green-400">
              {scores.money}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Accuracy Boost</span>
          <span className="text-xs font-medium text-blue-400">
            +{scores.accuracy}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Daily Profit</span>
          <span className="text-xs font-medium text-green-400">
            +${scores.profit.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Priority and Status */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`text-xs ${
            module.priority === "critical"
              ? "border-red-400/60 text-red-300 bg-red-500/10"
              : module.priority === "high"
                ? "border-orange-400/60 text-orange-300 bg-orange-500/10"
                : module.priority === "medium"
                  ? "border-yellow-400/60 text-yellow-300 bg-yellow-500/10"
                  : "border-green-400/60 text-green-300 bg-green-500/10"
          }`}
        >
          {module.priority}
        </Badge>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">
            {module.computationLevel}
          </span>
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              module.computationLevel === "light"
                ? "bg-green-400"
                : module.computationLevel === "medium"
                  ? "bg-yellow-400"
                  : module.computationLevel === "heavy"
                    ? "bg-orange-400"
                    : "bg-red-400"
            }`}
          ></div>
        </div>
      </div>

      {/* Active indicator glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 animate-pulse pointer-events-none"></div>
      )}
    </motion.div>
  );
};

// Performance dashboard component
export const ModulePerformanceDashboard: React.FC<{
  activeModules: Set<string>;
  moduleConfigs: any[];
}> = ({ activeModules, moduleConfigs }) => {
  const activeConfigs = moduleConfigs.filter((config) =>
    activeModules.has(config.id),
  );

  const totalProfitContribution = activeConfigs.reduce((sum, m) => {
    const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
    return sum + (scores?.profit || 5000);
  }, 0);

  const avgAccuracyBoost =
    activeConfigs.length > 0
      ? activeConfigs.reduce((sum, m) => {
          const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
          return sum + (scores?.accuracy || 3);
        }, 0)
      : 85;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-500/30 relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-300 uppercase tracking-wide font-semibold">
                Active Profit Engine
              </p>
              <p className="text-2xl font-bold text-green-400">
                ${totalProfitContribution.toLocaleString()}
              </p>
              <p className="text-xs text-green-300">Daily contribution</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent animate-pulse" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border-blue-500/30 relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-300 uppercase tracking-wide font-semibold">
                Prediction Power
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {avgAccuracyBoost.toFixed(1)}%
              </p>
              <p className="text-xs text-blue-300">Combined boost</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent animate-pulse" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 border-purple-500/30 relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-300 uppercase tracking-wide font-semibold">
                Module Status
              </p>
              <p className="text-2xl font-bold text-purple-400">
                {activeModules.size}/{moduleConfigs.length}
              </p>
              <p className="text-xs text-purple-300">Optimal: 6-8 active</p>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
};

export default { EnhancedModuleCard, ModulePerformanceDashboard };
