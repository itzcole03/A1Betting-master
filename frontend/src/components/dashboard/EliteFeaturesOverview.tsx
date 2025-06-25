import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  DollarSign,
  BarChart3,
  Target,
  Activity,
  Zap,
  TrendingUp,
  Shield,
  Database,
  Globe,
  Cpu,
  Eye,
  Settings,
  Users,
  Award,
  Lock,
  Unlock,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";

// Elite Features Data from the error screen
const eliteFeatures = [
  {
    category: "Core Analytics",
    features: [
      {
        name: "Business Dashboard",
        icon: <BarChart3 className="w-5 h-5" />,
        status: "active",
        description: "Real-time business intelligence",
      },
      {
        name: "AI Business Analysis",
        icon: <Brain className="w-5 h-5" />,
        status: "active",
        description: "Advanced AI-powered analysis",
      },
      {
        name: "Elite Analytics",
        icon: <TrendingUp className="w-5 h-5" />,
        status: "premium",
        description: "Premium analytics suite",
      },
      {
        name: "Model Analysis",
        icon: <Activity className="w-5 h-5" />,
        status: "ai",
        description: "Deep model performance analysis",
      },
    ],
  },
  {
    category: "Money Making",
    features: [
      {
        name: "Money Maker",
        icon: <DollarSign className="w-5 h-5" />,
        status: "active",
        description: "AI-powered money generation",
      },
      {
        name: "AI Arbitrage",
        icon: <Target className="w-5 h-5" />,
        status: "pro",
        description: "Arbitrage opportunity detection",
      },
      {
        name: "Elite Bankroll",
        icon: <Shield className="w-5 h-5" />,
        status: "premium",
        description: "Advanced bankroll management",
      },
      {
        name: "AI Edge ML",
        icon: <Cpu className="w-5 h-5" />,
        status: "ai",
        description: "Machine learning edge detection",
      },
    ],
  },
  {
    category: "Sports Intelligence",
    features: [
      {
        name: "Mega Sports",
        icon: <Zap className="w-5 h-5" />,
        status: "mega",
        description: "Comprehensive sports analytics",
      },
      {
        name: "SQL Sports",
        icon: <Database className="w-5 h-5" />,
        status: "active",
        description: "Advanced sports data queries",
      },
      {
        name: "Elite Sports",
        icon: <Award className="w-5 h-5" />,
        status: "elite",
        description: "Premium sports intelligence",
      },
      {
        name: "Sports Advantage",
        icon: <TrendingUp className="w-5 h-5" />,
        status: "pro",
        description: "Competitive sports advantage",
      },
    ],
  },
  {
    category: "Market & Trading",
    features: [
      {
        name: "Market Connector",
        icon: <Globe className="w-5 h-5" />,
        status: "live",
        description: "Real-time market connections",
      },
      {
        name: "Trading Engine",
        icon: <Activity className="w-5 h-5" />,
        status: "active",
        description: "Automated trading algorithms",
      },
      {
        name: "Risk Analysis",
        icon: <Shield className="w-5 h-5" />,
        status: "premium",
        description: "Advanced risk assessment",
      },
      {
        name: "Portfolio Manager",
        icon: <BarChart3 className="w-5 h-5" />,
        status: "pro",
        description: "Smart portfolio optimization",
      },
    ],
  },
  {
    category: "Simulation & Testing",
    features: [
      {
        name: "Real Simulator",
        icon: <Play className="w-5 h-5" />,
        status: "beta",
        description: "Real-time strategy simulation",
      },
      {
        name: "Strategy Tester",
        icon: <Target className="w-5 h-5" />,
        status: "active",
        description: "Backtesting and validation",
      },
      {
        name: "ML Validator",
        icon: <Brain className="w-5 h-5" />,
        status: "ai",
        description: "Machine learning validation",
      },
      {
        name: "Performance Monitor",
        icon: <Eye className="w-5 h-5" />,
        status: "live",
        description: "Real-time performance tracking",
      },
    ],
  },
];

const statusConfig = {
  active: {
    color: "bg-green-500",
    textColor: "text-green-400",
    label: "ACTIVE",
  },
  pro: { color: "bg-purple-500", textColor: "text-purple-400", label: "PRO" },
  premium: {
    color: "bg-yellow-500",
    textColor: "text-yellow-400",
    label: "PREMIUM",
  },
  ai: { color: "bg-cyan-500", textColor: "text-cyan-400", label: "AI" },
  live: { color: "bg-red-500", textColor: "text-red-400", label: "LIVE" },
  beta: { color: "bg-orange-500", textColor: "text-orange-400", label: "BETA" },
  mega: { color: "bg-pink-500", textColor: "text-pink-400", label: "MEGA" },
  elite: {
    color: "bg-indigo-500",
    textColor: "text-indigo-400",
    label: "ELITE",
  },
};

// Navigation mapping for features to app sections
const featureNavigation: Record<string, string> = {
  "Business Dashboard": "analytics",
  "AI Business Analysis": "analytics",
  "Elite Analytics": "analytics",
  "Model Analysis": "ml-center",
  "Money Maker": "money-maker",
  "AI Arbitrage": "arbitrage",
  "Elite Bankroll": "money-maker",
  "AI Edge ML": "ml-center",
  "Mega Sports": "analytics",
  "SQL Sports": "analytics",
  "Elite Sports": "analytics",
  "Sports Advantage": "analytics",
  "Market Connector": "analytics",
  "Trading Engine": "arbitrage",
  "Risk Analysis": "analytics",
  "Portfolio Manager": "money-maker",
  "Real Simulator": "ai-predictions",
  "Strategy Tester": "ai-predictions",
  "ML Validator": "ml-center",
  "Performance Monitor": "analytics",
};

interface EliteFeaturesOverviewProps {
  onNavigate?: (sectionId: string) => void;
}

const EliteFeaturesOverview: React.FC<EliteFeaturesOverviewProps> = ({
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleFeatureLaunch = (featureName: string) => {
    const navigationTarget = featureNavigation[featureName];
    if (navigationTarget && onNavigate) {
      onNavigate(navigationTarget);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Elite Sports Intelligence Platform
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive suite of AI-powered sports betting and analytics tools
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh All"}
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-400">47</p>
              <p className="text-sm text-green-300">AI Models Active</p>
            </div>
            <Brain className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-cyan-400">12</p>
              <p className="text-sm text-cyan-300">Data Sources</p>
            </div>
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-400">94.7%</p>
              <p className="text-sm text-purple-300">Accuracy Rate</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-400">$127K</p>
              <p className="text-sm text-yellow-300">Monthly Profit</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Feature Categories Tabs */}
      <div className="flex flex-wrap gap-2">
        {eliteFeatures.map((category, index) => (
          <motion.button
            key={category.category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(index)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              activeCategory === index
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black"
                : "bg-gray-800/50 text-gray-400 hover:text-gray-300 border border-gray-700/50"
            }`}
          >
            {category.category}
          </motion.button>
        ))}
      </div>

      {/* Features Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {eliteFeatures[activeCategory].features.map((feature, index) => {
          const config =
            statusConfig[feature.status as keyof typeof statusConfig];
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => handleFeatureLaunch(feature.name)}
              className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50 rounded-xl cursor-pointer group transform hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 ${config.textColor} transition-all`}
                >
                  {feature.icon}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${config.color} ${feature.status === "live" ? "animate-pulse" : ""}`}
                  />
                  <span className={`text-xs font-bold ${config.textColor}`}>
                    {config.label}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {feature.name}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFeatureLaunch(feature.name)}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                >
                  Launch
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 transition-all"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* System Status */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold">
              All Systems Operational
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 font-semibold">
              Real-time Data Streaming
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-purple-400 font-semibold">
              AI Models Learning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliteFeaturesOverview;
