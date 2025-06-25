import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Grid,
  List,
  Layers2,
  DollarSign,
  Target,
  Brain,
  ToggleRight,
  ToggleLeft,
  Zap,
  Power,
  Minimize,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Star,
  Award,
  Flame,
  Crown,
  Gem,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Enhanced module scoring system for money-making potential
const MODULE_SCORES = {
  "advanced-analytics": {
    money: 95,
    accuracy: 12,
    profit: 25000,
    roi: 245,
    reliability: 98,
    description: "Core analytics driving 95% of profitable opportunities",
  },
  "ultra-accuracy": {
    money: 92,
    accuracy: 18,
    profit: 22000,
    roi: 220,
    reliability: 96,
    description: "Ultra-precise predictions with highest accuracy boost",
  },
  "ultra-ml": {
    money: 88,
    accuracy: 15,
    profit: 20000,
    roi: 200,
    reliability: 94,
    description: "Advanced ML models for superior prediction power",
  },
  "realtime-accuracy": {
    money: 85,
    accuracy: 10,
    profit: 18000,
    roi: 180,
    reliability: 92,
    description: "Real-time analysis for instant profit opportunities",
  },
  "strategy-engine": {
    money: 82,
    accuracy: 6,
    profit: 15000,
    roi: 150,
    reliability: 90,
    description: "Strategic betting optimization for consistent wins",
  },
  "performance-analytics": {
    money: 78,
    accuracy: 5,
    profit: 10000,
    roi: 100,
    reliability: 88,
    description: "Performance tracking for continuous improvement",
  },
  "ml-model-center": {
    money: 75,
    accuracy: 8,
    profit: 12000,
    roi: 120,
    reliability: 86,
    description: "Centralized ML management for optimal results",
  },
  "mega-analytics": {
    money: 90,
    accuracy: 20,
    profit: 30000,
    roi: 300,
    reliability: 95,
    description: "Mega-powered analytics for maximum profit generation",
  },
  "ensemble-insights": {
    money: 68,
    accuracy: 14,
    profit: 8000,
    roi: 80,
    reliability: 84,
    description: "Ensemble learning for robust predictions",
  },
  "cyber-analytics": {
    money: 70,
    accuracy: 7,
    profit: 9000,
    roi: 90,
    reliability: 82,
    description: "Cyber-enhanced analytics for edge detection",
  },
};

interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  dependencies: string[];
  computationLevel: "light" | "medium" | "heavy" | "extreme";
  isActive: boolean;
}

interface EnhancedModuleManagementProps {
  modules: ModuleConfig[];
  activeModules: Set<string>;
  onToggleModule: (moduleId: string) => void;
  onBatchActivate?: (moduleIds: string[]) => void;
}

const EnhancedModuleCard: React.FC<{
  module: ModuleConfig;
  isActive: boolean;
  onToggle: () => void;
  rank: number;
}> = ({ module, isActive, onToggle, rank }) => {
  const scores = MODULE_SCORES[module.id as keyof typeof MODULE_SCORES] || {
    money: 50,
    accuracy: 3,
    profit: 5000,
    roi: 50,
    reliability: 75,
    description: "Standard module functionality",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "from-red-500 to-pink-500";
      case "high":
        return "from-orange-500 to-yellow-500";
      case "medium":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  const getMoneyScoreColor = (score: number) => {
    if (score >= 90) return "from-yellow-400 to-orange-500";
    if (score >= 80) return "from-green-500 to-emerald-400";
    if (score >= 70) return "from-blue-500 to-cyan-400";
    return "from-gray-500 to-slate-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      whileHover={{
        scale: 1.03,
        rotateY: 2,
        boxShadow: isActive
          ? "0 25px 50px -12px rgba(34, 197, 94, 0.4)"
          : "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 backdrop-blur-lg ${
        isActive
          ? "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-blue-500/20 border-green-400/60 shadow-2xl"
          : "bg-slate-800/40 border-slate-600/40 hover:border-slate-500/60 hover:bg-slate-700/30 shadow-lg"
      }`}
      onClick={onToggle}
    >
      {/* Top Ranking Badge */}
      {rank <= 3 && (
        <div className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm shadow-lg">
          {rank === 1 ? (
            <Crown className="w-4 h-4" />
          ) : rank === 2 ? (
            <Award className="w-4 h-4" />
          ) : (
            <Star className="w-4 h-4" />
          )}
        </div>
      )}

      {/* Money-Making Score Badge */}
      {scores.money >= 80 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className={`absolute -top-2 -right-2 bg-gradient-to-r ${getMoneyScoreColor(scores.money)} text-black text-xs font-bold px-3 py-1 rounded-full shadow-xl`}
        >
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {scores.money}%
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-br from-green-500/30 to-blue-500/30 shadow-lg"
                : "bg-slate-600/30"
            }`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {module.icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{module.name}</h3>
            <p className="text-xs text-slate-400 capitalize">
              {module.category}
            </p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {isActive ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <ToggleRight className="w-6 h-6 text-green-400" />
            </div>
          ) : (
            <ToggleLeft className="w-6 h-6 text-slate-400" />
          )}
        </motion.div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-2">
        {scores.description}
      </p>

      {/* Performance Metrics Grid */}
      <div className="space-y-3 mb-4">
        {/* Money Impact Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Money Impact
            </span>
            <span className="text-xs font-bold text-green-400">
              {scores.money}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getMoneyScoreColor(scores.money)}`}
              initial={{ width: 0 }}
              animate={{ width: `${scores.money}%` }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-300">Accuracy</span>
              <span className="text-xs font-bold text-blue-400">
                +{scores.accuracy}%
              </span>
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-300">ROI</span>
              <span className="text-xs font-bold text-green-400">
                {scores.roi}%
              </span>
            </div>
          </div>
        </div>

        {/* Daily Profit */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg p-2 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300">Daily Profit</span>
            <span className="text-xs font-bold text-emerald-400">
              +${scores.profit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs bg-gradient-to-r ${getPriorityColor(module.priority)} text-white border-0`}
          >
            {module.priority}
          </Badge>
          {scores.reliability >= 90 && (
            <CheckCircle className="w-3 h-3 text-green-400" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 capitalize">
            {module.computationLevel}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              module.computationLevel === "light"
                ? "bg-green-400"
                : module.computationLevel === "medium"
                  ? "bg-yellow-400"
                  : module.computationLevel === "heavy"
                    ? "bg-orange-400"
                    : "bg-red-400"
            }`}
          />
        </div>
      </div>

      {/* Active Glow Effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 pointer-events-none"
            style={{
              background:
                "linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))",
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PerformanceDashboard: React.FC<{
  activeModules: Set<string>;
  moduleConfigs: ModuleConfig[];
}> = ({ activeModules, moduleConfigs }) => {
  const activeConfigs = moduleConfigs.filter((config) =>
    activeModules.has(config.id),
  );

  const metrics = useMemo(() => {
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
        : 0;

    const avgMoneyScore =
      activeConfigs.length > 0
        ? activeConfigs.reduce((sum, m) => {
            const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
            return sum + (scores?.money || 50);
          }, 0) / activeConfigs.length
        : 0;

    const totalROI = activeConfigs.reduce((sum, m) => {
      const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
      return sum + (scores?.roi || 50);
    }, 0);

    return {
      totalProfitContribution,
      avgAccuracyBoost,
      avgMoneyScore,
      totalROI,
    };
  }, [activeConfigs]);

  const dashboardCards = [
    {
      title: "Active Profit Engine",
      value: `$${metrics.totalProfitContribution.toLocaleString()}`,
      subtitle: "Daily contribution",
      icon: DollarSign,
      gradient: "from-green-500/15 to-emerald-500/15",
      border: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      title: "Prediction Power",
      value: `${metrics.avgAccuracyBoost.toFixed(1)}%`,
      subtitle: "Combined boost",
      icon: Target,
      gradient: "from-blue-500/15 to-cyan-500/15",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      title: "Money Score",
      value: `${metrics.avgMoneyScore.toFixed(1)}%`,
      subtitle: "Average rating",
      icon: Sparkles,
      gradient: "from-purple-500/15 to-pink-500/15",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      title: "Total ROI",
      value: `${metrics.totalROI.toFixed(0)}%`,
      subtitle: "Return potential",
      icon: TrendingUp,
      gradient: "from-orange-500/15 to-yellow-500/15",
      border: "border-orange-500/30",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {dashboardCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`bg-gradient-to-br ${card.gradient} ${card.border} relative overflow-hidden hover:scale-105 transition-transform duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold opacity-80 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.iconColor} mb-1`}>
                    {card.value}
                  </p>
                  <p className="text-xs opacity-70">{card.subtitle}</p>
                </div>
                <card.icon className={`w-10 h-10 ${card.iconColor}`} />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                animate={{ x: [-100, 300] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export const EnhancedModuleManagement: React.FC<
  EnhancedModuleManagementProps
> = ({ modules, activeModules, onToggleModule, onBatchActivate }) => {
  const [moduleLayout, setModuleLayout] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"money" | "accuracy" | "profit">(
    "money",
  );

  // Smart recommendations
  const getSmartRecommendations = useCallback(() => {
    const profitOptimized = modules
      .filter((m) => {
        const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
        return scores && scores.money >= 85;
      })
      .sort((a, b) => {
        const scoresA = MODULE_SCORES[a.id as keyof typeof MODULE_SCORES];
        const scoresB = MODULE_SCORES[b.id as keyof typeof MODULE_SCORES];
        return (scoresB?.profit || 0) - (scoresA?.profit || 0);
      })
      .slice(0, 6)
      .map((m) => m.id);

    const accuracyOptimized = modules
      .filter((m) => {
        const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
        return scores && scores.accuracy >= 10;
      })
      .sort((a, b) => {
        const scoresA = MODULE_SCORES[a.id as keyof typeof MODULE_SCORES];
        const scoresB = MODULE_SCORES[b.id as keyof typeof MODULE_SCORES];
        return (scoresB?.accuracy || 0) - (scoresA?.accuracy || 0);
      })
      .slice(0, 6)
      .map((m) => m.id);

    const balanced = modules
      .filter((m) => {
        const scores = MODULE_SCORES[m.id as keyof typeof MODULE_SCORES];
        return scores && scores.money >= 70 && scores.accuracy >= 5;
      })
      .sort((a, b) => {
        const scoresA = MODULE_SCORES[a.id as keyof typeof MODULE_SCORES];
        const scoresB = MODULE_SCORES[b.id as keyof typeof MODULE_SCORES];
        const totalA = (scoresA?.money || 0) + (scoresA?.accuracy || 0) * 5;
        const totalB = (scoresB?.money || 0) + (scoresB?.accuracy || 0) * 5;
        return totalB - totalA;
      })
      .slice(0, 8)
      .map((m) => m.id);

    return { profitOptimized, accuracyOptimized, balanced };
  }, [modules]);

  const recommendations = getSmartRecommendations();

  // Sort modules by selected criteria
  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => {
      const scoresA = MODULE_SCORES[a.id as keyof typeof MODULE_SCORES];
      const scoresB = MODULE_SCORES[b.id as keyof typeof MODULE_SCORES];

      if (sortBy === "money") {
        return (scoresB?.money || 0) - (scoresA?.money || 0);
      } else if (sortBy === "accuracy") {
        return (scoresB?.accuracy || 0) - (scoresA?.accuracy || 0);
      } else {
        return (scoresB?.profit || 0) - (scoresA?.profit || 0);
      }
    });
  }, [modules, sortBy]);

  const handleQuickAction = (action: string) => {
    if (!onBatchActivate) return;

    switch (action) {
      case "profit-optimized":
        onBatchActivate(recommendations.profitOptimized);
        toast.success("🚀 Activated profit-optimized modules!");
        break;
      case "accuracy-optimized":
        onBatchActivate(recommendations.accuracyOptimized);
        toast.success("🎯 Activated accuracy-optimized modules!");
        break;
      case "balanced":
        onBatchActivate(recommendations.balanced);
        toast.success("⚖️ Activated balanced configuration!");
        break;
      case "critical":
        const criticalModules = modules
          .filter((m) => m.priority === "critical")
          .map((m) => m.id);
        onBatchActivate(criticalModules);
        toast.success("⚡ Activated critical modules only!");
        break;
      case "all":
        onBatchActivate(modules.map((m) => m.id));
        toast.success("💪 Full power mode activated!");
        break;
      case "minimal":
        onBatchActivate([]);
        toast.success("🔧 Reset to minimal configuration!");
        break;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Intelligent Module Management
              </h2>
              <p className="text-sm text-slate-400 font-normal">
                Optimize for maximum profitability
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Sort Controls */}
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
              {[
                { key: "money", icon: DollarSign, label: "Money" },
                { key: "accuracy", icon: Target, label: "Accuracy" },
                { key: "profit", icon: TrendingUp, label: "Profit" },
              ].map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  size="sm"
                  variant={sortBy === key ? "default" : "ghost"}
                  onClick={() => setSortBy(key as any)}
                  className="h-8 px-2"
                  title={`Sort by ${label}`}
                >
                  <Icon className="w-3 h-3" />
                </Button>
              ))}
            </div>

            {/* Layout Controls */}
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
              <Button
                size="sm"
                variant={moduleLayout === "grid" ? "default" : "ghost"}
                onClick={() => setModuleLayout("grid")}
                className="h-8 px-2"
              >
                <Grid className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant={moduleLayout === "list" ? "default" : "ghost"}
                onClick={() => setModuleLayout("list")}
                className="h-8 px-2"
              >
                <List className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Performance Dashboard */}
        <PerformanceDashboard
          activeModules={activeModules}
          moduleConfigs={modules}
        />

        {/* Smart Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => handleQuickAction("profit-optimized")}
            className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Max Profit Setup
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {recommendations.profitOptimized.length}
            </Badge>
          </Button>
          <Button
            onClick={() => handleQuickAction("accuracy-optimized")}
            className="h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Target className="w-5 h-5 mr-2" />
            Max Accuracy Setup
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {recommendations.accuracyOptimized.length}
            </Badge>
          </Button>
          <Button
            onClick={() => handleQuickAction("balanced")}
            className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Balanced Setup
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {recommendations.balanced.length}
            </Badge>
          </Button>
        </div>

        {/* Enhanced Module Grid */}
        <div
          className={`grid gap-6 ${
            moduleLayout === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {sortedModules.map((module, index) => (
            <EnhancedModuleCard
              key={module.id}
              module={module}
              isActive={activeModules.has(module.id)}
              onToggle={() => onToggleModule(module.id)}
              rank={index + 1}
            />
          ))}
        </div>

        {/* Traditional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
          <Button
            onClick={() => handleQuickAction("critical")}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <Zap className="w-4 h-4 mr-2" />
            Critical Only
          </Button>
          <Button
            onClick={() => handleQuickAction("all")}
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
          >
            <Power className="w-4 h-4 mr-2" />
            Full Power
          </Button>
          <Button
            onClick={() => handleQuickAction("minimal")}
            variant="outline"
            className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10 hover:border-slate-500/50"
          >
            <Minimize className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleManagement;
