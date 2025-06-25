import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Brain,
  Target,
  Zap,
  Activity,
  Shield,
  Clock,
  Star,
  Eye,
  BarChart3,
  Percent,
  Calculator,
} from "lucide-react";

interface OpportunityCandidate {
  id: string;
  sport: string;
  game: string;
  prediction: string;
  confidence: number;
  odds: number;
  expectedValue: number;
  edge: number;
  recommendedStake: number;
  maxStake: number;
  riskLevel: "low" | "medium" | "high";
  timeLeft: string;
  bookmaker: string;
  model: string;
  lastUpdated: Date;
}

interface PortfolioMetrics {
  totalValue: number;
  totalStaked: number;
  expectedReturn: number;
  roi: number;
  winRate: number;
  activePositions: number;
  diversificationScore: number;
  riskScore: number;
}

export const CleanMoneyMaker: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityCandidate[]>([
    {
      id: "1",
      sport: "NBA",
      game: "Lakers vs Warriors",
      prediction: "Over 235.5 Points",
      confidence: 94,
      odds: 1.85,
      expectedValue: 12.3,
      edge: 8.5,
      recommendedStake: 250,
      maxStake: 500,
      riskLevel: "low",
      timeLeft: "2h 15m",
      bookmaker: "DraftKings",
      model: "NBA Advanced Model v3.2",
      lastUpdated: new Date(),
    },
    {
      id: "2",
      sport: "NBA",
      game: "Celtics vs Heat",
      prediction: "Celtics -5.5",
      confidence: 87,
      odds: 1.92,
      expectedValue: 8.7,
      edge: 6.2,
      recommendedStake: 180,
      maxStake: 400,
      riskLevel: "medium",
      timeLeft: "4h 32m",
      bookmaker: "FanDuel",
      model: "Ensemble Model v2.1",
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "3",
      sport: "NFL",
      game: "Chiefs vs Bills",
      prediction: "Josh Allen Over 2.5 TD",
      confidence: 89,
      odds: 2.15,
      expectedValue: 15.8,
      edge: 12.4,
      recommendedStake: 320,
      maxStake: 600,
      riskLevel: "low",
      timeLeft: "6h 45m",
      bookmaker: "BetMGM",
      model: "Player Props AI v1.8",
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000),
    },
  ]);

  const [portfolio, setPortfolio] = useState<PortfolioMetrics>({
    totalValue: 12847.63,
    totalStaked: 8500.0,
    expectedReturn: 15234.88,
    roi: 51.2,
    winRate: 73.8,
    activePositions: 8,
    diversificationScore: 8.7,
    riskScore: 4.2,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());

  // Simulate opportunity scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setOpportunities((prev) =>
        prev.map((opp) => ({
          ...opp,
          confidence: Math.max(
            75,
            Math.min(95, opp.confidence + (Math.random() - 0.5) * 2),
          ),
          expectedValue: Math.max(
            3,
            Math.min(25, opp.expectedValue + (Math.random() - 0.5) * 1),
          ),
          edge: Math.max(
            1,
            Math.min(15, opp.edge + (Math.random() - 0.5) * 0.5),
          ),
          lastUpdated: new Date(),
        })),
      );
      setLastScan(new Date());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const runScan = async () => {
    setIsScanning(true);
    // Simulate AI scanning process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsScanning(false);
    setLastScan(new Date());
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-green-900/30 via-blue-900/20 to-purple-900/30 border border-gray-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
              <DollarSign size={40} className="text-green-400" />
              <span>AI Money Maker</span>
            </h1>
            <p className="text-xl text-gray-300">
              AI-powered opportunity detection with advanced portfolio
              optimization
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">
              +${portfolio.expectedReturn.toLocaleString()}
            </div>
            <div className="text-gray-400">Expected Return</div>
          </div>
        </div>
      </motion.div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <DollarSign size={24} className="text-green-400" />
            </div>
            <div className="text-sm text-green-400 font-bold">+51.2%</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${portfolio.totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Portfolio Value</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={24} className="text-blue-400" />
            </div>
            <div className="text-sm text-blue-400 font-bold">+3.2%</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {portfolio.winRate}%
          </div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Activity size={24} className="text-purple-400" />
            </div>
            <div className="text-sm text-purple-400 font-bold">Live</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {portfolio.activePositions}
          </div>
          <div className="text-sm text-gray-400">Active Positions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Shield size={24} className="text-yellow-400" />
            </div>
            <div className="text-sm text-yellow-400 font-bold">Low</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {portfolio.riskScore}/10
          </div>
          <div className="text-sm text-gray-400">Risk Score</div>
        </motion.div>
      </div>

      {/* AI Scanner */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Opportunities */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Brain size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  AI Opportunities
                </h2>
                <p className="text-sm text-gray-400">
                  47 models analyzing live data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">
                Last scan: {lastScan.toLocaleTimeString()}
              </div>
              <button
                onClick={runScan}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-all flex items-center space-x-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Run Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-bold">
                        {opportunity.sport}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-sm font-bold ${getRiskColor(opportunity.riskLevel)}`}
                      >
                        {opportunity.riskLevel} risk
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {opportunity.game}
                    </h3>
                    <p className="text-blue-400 font-medium">
                      {opportunity.prediction}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      +{opportunity.expectedValue.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Expected Value</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-lg font-bold text-white">
                      {opportunity.confidence}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Odds</div>
                    <div className="text-lg font-bold text-white">
                      {opportunity.odds}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Edge</div>
                    <div className="text-lg font-bold text-green-400">
                      {opportunity.edge}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Stake</div>
                    <div className="text-lg font-bold text-white">
                      ${opportunity.recommendedStake}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Time</div>
                    <div className="text-lg font-bold text-white">
                      {opportunity.timeLeft}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {opportunity.model} • {opportunity.bookmaker}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all">
                      Place Bet
                    </button>
                    <button className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all">
                      Analyze
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Kelly Calculator */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Calculator size={18} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Kelly Calculator
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Win Probability (%)
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
                  placeholder="85"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Decimal Odds
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
                  placeholder="1.85"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Bankroll ($)
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
                  placeholder="10000"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
                Calculate Optimal Stake
              </button>
            </div>
          </div>

          {/* Risk Management */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Shield size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Risk Management
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Daily Limit</span>
                <span className="text-sm text-white">$2,500 / $5,000</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                  style={{ width: "50%" }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Weekly Limit</span>
                <span className="text-sm text-white">$8,200 / $15,000</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: "55%" }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Max Position</span>
                <span className="text-sm text-white">5% of bankroll</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <BarChart3 size={18} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">This Week</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Profit</span>
                <span className="text-sm text-green-400 font-bold">
                  +$2,847
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Bets Placed</span>
                <span className="text-sm text-white">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Win Rate</span>
                <span className="text-sm text-white">78.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Best Bet</span>
                <span className="text-sm text-green-400">+$485</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanMoneyMaker;
