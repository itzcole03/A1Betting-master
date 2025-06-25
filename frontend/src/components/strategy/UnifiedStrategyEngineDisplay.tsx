import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Brain,
  AlertTriangle,
} from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StrategyRecommendation {
  strategyId: string;
  strategyName: string;
  confidence: number;
  expectedReturn: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
  reasoning: string[];
  data: {
    winProbability: number;
    expectedValue: number;
    kellyFraction: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  timeframe: string;
  sport: string;
  lastUpdated: number;
}

interface Props {
  recommendations?: StrategyRecommendation[];
  showDebug?: boolean;
}

// ============================================================================
// DEMO DATA
// ============================================================================

const DEMO_RECOMMENDATIONS: StrategyRecommendation[] = [
  {
    strategyId: "momentum-nba",
    strategyName: "NBA Momentum Strategy",
    confidence: 0.84,
    expectedReturn: 12.5,
    riskLevel: "medium",
    recommendation: "Strong Buy Signal - Lakers vs Warriors Over",
    reasoning: [
      "Both teams averaging 115+ points in last 5 games",
      "Historical pace indicates high-scoring matchup",
      "Weather conditions favor offensive play",
      "Key players healthy and in form",
    ],
    data: {
      winProbability: 0.67,
      expectedValue: 0.125,
      kellyFraction: 0.08,
      sharpeRatio: 1.4,
      maxDrawdown: 0.15,
    },
    timeframe: "24h",
    sport: "NBA",
    lastUpdated: Date.now() - 300000,
  },
  {
    strategyId: "value-nfl",
    strategyName: "NFL Value Betting",
    confidence: 0.92,
    expectedReturn: 18.7,
    riskLevel: "low",
    recommendation: "Patriots ML - Significant Value Detected",
    reasoning: [
      "Market overreacting to recent loss",
      "Key players returning from injury",
      "Strong defensive metrics vs opponent weakness",
      "Public betting creating line value",
    ],
    data: {
      winProbability: 0.78,
      expectedValue: 0.187,
      kellyFraction: 0.12,
      sharpeRatio: 2.1,
      maxDrawdown: 0.08,
    },
    timeframe: "3 days",
    sport: "NFL",
    lastUpdated: Date.now() - 600000,
  },
  {
    strategyId: "arbitrage-mlb",
    strategyName: "MLB Arbitrage Opportunity",
    confidence: 0.99,
    expectedReturn: 4.2,
    riskLevel: "low",
    recommendation: "Risk-Free Arbitrage - Yankees/Red Sox",
    reasoning: [
      "Price discrepancy across sportsbooks",
      "Guaranteed profit opportunity",
      "Low capital requirement",
      "Quick execution window",
    ],
    data: {
      winProbability: 1.0,
      expectedValue: 0.042,
      kellyFraction: 1.0,
      sharpeRatio: Infinity,
      maxDrawdown: 0.0,
    },
    timeframe: "2h",
    sport: "MLB",
    lastUpdated: Date.now() - 120000,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "low":
      return "text-green-600 bg-green-100 border-green-200";
    case "medium":
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    case "high":
      return "text-red-600 bg-red-100 border-red-200";
    default:
      return "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "text-green-600";
  if (confidence >= 0.6) return "text-yellow-600";
  return "text-red-600";
};

const getSportIcon = (sport: string) => {
  const icons: Record<string, string> = {
    NBA: "🏀",
    NFL: "🏈",
    MLB: "⚾",
    NHL: "🏒",
    Soccer: "⚽",
  };
  return icons[sport] || "🏆";
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// ============================================================================
// COMPONENTS
// ============================================================================

const StrategyCard: React.FC<{
  recommendation: StrategyRecommendation;
  index: number;
  showDebug: boolean;
}> = ({ recommendation, index, showDebug }) => {
  const {
    strategyName,
    confidence,
    expectedReturn,
    riskLevel,
    recommendation: rec,
    reasoning,
    data,
    timeframe,
    sport,
    lastUpdated,
  } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="glass-card hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getSportIcon(sport)}</span>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                  {strategyName}
                </CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {sport} • {timeframe}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}
              >
                {(confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Confidence
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Recommendation */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/30">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Recommendation
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {rec}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Expected Return
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                +{expectedReturn.toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Win Probability
                </span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {(data.winProbability * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Risk Level:
              </span>
            </div>
            <Badge
              variant={riskLevel as any}
              className={getRiskColor(riskLevel)}
            >
              {riskLevel.toUpperCase()}
            </Badge>
          </div>

          {/* Reasoning */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Brain className="w-4 h-4" />
              AI Reasoning:
            </div>
            <ul className="space-y-1">
              {reasoning.slice(0, 3).map((reason, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                >
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advanced Metrics (Debug Mode) */}
          {showDebug && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2"
            >
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Advanced Metrics:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  Kelly Fraction:{" "}
                  <span className="font-mono">
                    {(data.kellyFraction * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  Sharpe Ratio:{" "}
                  <span className="font-mono">
                    {data.sharpeRatio.toFixed(2)}
                  </span>
                </div>
                <div>
                  Expected Value:{" "}
                  <span className="font-mono">
                    {(data.expectedValue * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  Max Drawdown:{" "}
                  <span className="font-mono">
                    {(data.maxDrawdown * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Last Updated: {formatTimeAgo(lastUpdated)}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl mb-4">🧠</div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Strategy Engine Analyzing
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Our AI is currently processing market data and generating personalized
        betting strategies. Check back in a few moments for the latest
        recommendations.
      </p>
      <div className="mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Processing live data...
          </span>
        </div>
      </div>
    </motion.div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UnifiedStrategyEngineDisplay: React.FC<Props> = ({
  recommendations = [],
  showDebug = false,
}) => {
  // Use demo data if no recommendations provided
  const displayRecommendations =
    recommendations.length > 0 ? recommendations : DEMO_RECOMMENDATIONS;

  if (displayRecommendations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧠 Strategy Engine Intelligence
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          AI-powered betting strategies with real-time market analysis, risk
          assessment, and personalized recommendations.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600">Live Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-600">
              {displayRecommendations.length} Active Strategies
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-600">Real-time Updates</span>
          </div>
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayRecommendations.map((recommendation, index) => (
          <StrategyCard
            key={recommendation.strategyId}
            recommendation={recommendation}
            index={index}
            showDebug={showDebug}
          />
        ))}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="glass-card bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Strategy Performance Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    displayRecommendations.reduce(
                      (acc, r) => acc + r.expectedReturn,
                      0,
                    ) / displayRecommendations.length,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Expected Return
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (displayRecommendations.reduce(
                      (acc, r) => acc + r.confidence,
                      0,
                    ) /
                      displayRecommendations.length) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    displayRecommendations.filter((r) => r.riskLevel === "low")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Low Risk Strategies
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {displayRecommendations.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Strategies
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UnifiedStrategyEngineDisplay;
