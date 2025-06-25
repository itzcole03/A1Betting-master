import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Target,
  Brain,
  ToggleRight,
  ToggleLeft,
  Zap,
  Power,
  Minimize,
} from "lucide-react";

interface ModuleManagementEnhancedProps {
  moduleConfigs: any[];
  activeModules: Set<string>;
  toggleModule: (id: string) => void;
  onQuickAction: (action: string) => void;
}

// Money-making score mapping for modules
const getModuleMoneyScore = (moduleId: string): number => {
  const scoreMap: Record<string, number> = {
    "advanced-analytics": 95,
    "ultra-accuracy": 92,
    "ultra-ml": 88,
    "realtime-accuracy": 85,
    "strategy-engine": 82,
    "performance-analytics": 78,
    "ml-model-center": 75,
    "universal-analytics": 72,
    "ensemble-insights": 68,
    "feature-insights": 65,
    "mega-analytics": 90,
    "cyber-analytics": 70,
  };
  return scoreMap[moduleId] || Math.floor(Math.random() * 40) + 40;
};

const getModuleAccuracyBoost = (moduleId: string): number => {
  const boostMap: Record<string, number> = {
    "advanced-analytics": 12,
    "ultra-ml": 15,
    "ultra-accuracy": 18,
    "realtime-accuracy": 10,
    "ml-model-center": 8,
    "ensemble-insights": 14,
    "strategy-engine": 6,
    "performance-analytics": 5,
    "mega-analytics": 20,
  };
  return boostMap[moduleId] || Math.floor(Math.random() * 8) + 2;
};

const getModuleProfitScore = (moduleId: string): number => {
  const profitMap: Record<string, number> = {
    "advanced-analytics": 25,
    "ultra-accuracy": 22,
    "ultra-ml": 20,
    "realtime-accuracy": 18,
    "strategy-engine": 15,
    "ml-model-center": 12,
    "performance-analytics": 10,
    "ensemble-insights": 8,
    "mega-analytics": 30,
  };
  return profitMap[moduleId] || Math.floor(Math.random() * 5) + 1;
};

export const ModuleManagementEnhanced: React.FC<
  ModuleManagementEnhancedProps
> = ({ moduleConfigs, activeModules, toggleModule, onQuickAction }) => {
  const activeConfigs = moduleConfigs.filter((config) =>
    activeModules.has(config.id),
  );

  // Calculate aggregate metrics
  const totalProfitContribution = activeConfigs.reduce(
    (sum, m) => sum + getModuleProfitScore(m.id) * 1000,
    0,
  );
  const avgAccuracyBoost =
    activeConfigs.length > 0
      ? activeConfigs.reduce((sum, m) => sum + getModuleAccuracyBoost(m.id), 0)
      : 85;

  return (
    <div className="space-y-6">
      {/* Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-500/30 relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-300 uppercase tracking-wide font-semibold">
                  Profit Engine
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
                <p className="text-xs text-blue-300">Accuracy boost</p>
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
                  Active Status
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {activeModules.size}/{moduleConfigs.length}
                </p>
                <p className="text-xs text-purple-300">Optimal: 6-8</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent animate-pulse" />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleConfigs
          .sort((a, b) => getModuleMoneyScore(b.id) - getModuleMoneyScore(a.id))
          .map((module) => {
            const isActive = activeModules.has(module.id);
            const moneyScore = getModuleMoneyScore(module.id);
            const accuracyBoost = getModuleAccuracyBoost(module.id);
            const profitScore = getModuleProfitScore(module.id);

            return (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.03, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  isActive
                    ? "bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-blue-500/15 border-green-400/50 shadow-lg shadow-green-500/20"
                    : "bg-slate-800/30 border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/25"
                }`}
                onClick={() => toggleModule(module.id)}
              >
                {/* Money-Making Score Badge */}
                {moneyScore >= 80 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    💰 {moneyScore}%
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
                      <span className="font-semibold text-sm block">
                        {module.name}
                      </span>
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
                            moneyScore >= 90
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : moneyScore >= 70
                                ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                                : "bg-gradient-to-r from-blue-500 to-cyan-400"
                          }`}
                          style={{ width: `${Math.min(moneyScore, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-green-400">
                        {moneyScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Accuracy Boost
                    </span>
                    <span className="text-xs font-medium text-blue-400">
                      +{accuracyBoost}%
                    </span>
                  </div>

                  {profitScore > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Daily Profit
                      </span>
                      <span className="text-xs font-medium text-green-400">
                        +${(profitScore * 1000).toLocaleString()}
                      </span>
                    </div>
                  )}
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
          })}
      </div>

      {/* Smart Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Button
          onClick={() => onQuickAction("profit-optimized")}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Max Profit
        </Button>
        <Button
          onClick={() => onQuickAction("critical")}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold"
        >
          <Zap className="w-4 h-4 mr-2" />
          Critical Only
        </Button>
        <Button
          onClick={() => onQuickAction("all")}
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <Power className="w-4 h-4 mr-2" />
          Full Power
        </Button>
        <Button
          onClick={() => onQuickAction("minimal")}
          variant="outline"
          className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
        >
          <Minimize className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default ModuleManagementEnhanced;
