import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Target,
  Brain,
  Activity,
  Zap,
} from "lucide-react";

interface MoneyMakerOpportunity {
  id: string;
  description: string;
  expectedProfit: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  timeframe: string;
}

interface UltimateMoneyMakerProps {
  className?: string;
}

export const UltimateMoneyMaker: React.FC<UltimateMoneyMakerProps> = ({
  className = "",
}) => {
  const [opportunities, setOpportunities] = useState<MoneyMakerOpportunity[]>([
    {
      id: "1",
      description: "NFL Over/Under Arbitrage",
      expectedProfit: 1250.75,
      confidence: 94.2,
      riskLevel: "low",
      timeframe: "2h 34m",
    },
    {
      id: "2",
      description: "NBA Spread Value Bet",
      expectedProfit: 850.25,
      confidence: 87.8,
      riskLevel: "medium",
      timeframe: "4h 12m",
    },
    {
      id: "3",
      description: "MLB ML Edge Play",
      expectedProfit: 650.5,
      confidence: 82.3,
      riskLevel: "low",
      timeframe: "6h 45m",
    },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(24750.85);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding new opportunities
    }, 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Ultimate Money Maker
          </h1>
          <p className="text-gray-400 mt-1">
            AI-powered profit generation system
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScan}
          disabled={isScanning}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 transition-all"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block" />
              Scanning...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2 inline" />
              Scan Markets
            </>
          )}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-400">
                ${totalEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-green-300">Total Earnings</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {opportunities.length}
              </p>
              <p className="text-sm text-blue-300">Active Opportunities</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
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
              <p className="text-2xl font-bold text-purple-400">91.2%</p>
              <p className="text-sm text-purple-300">Success Rate</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Current Opportunities</h2>
        {opportunities.map((opportunity, index) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl hover:border-green-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                  {opportunity.description}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-green-400 font-bold">
                    +${opportunity.expectedProfit.toLocaleString()}
                  </span>
                  <span className="text-cyan-400">
                    {opportunity.confidence}% confidence
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      opportunity.riskLevel === "low"
                        ? "bg-green-500/20 text-green-400"
                        : opportunity.riskLevel === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {opportunity.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Expires in</p>
                <p className="text-white font-bold">{opportunity.timeframe}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UltimateMoneyMaker;
