import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Brain,
  AlertCircle,
  Activity,
  BarChart3,
  Cpu,
  Eye,
  RefreshCw,
} from "lucide-react";

// Import existing Money Maker component
import UltimateMoneyMaker from "../MoneyMaker/UltimateMoneyMaker";

// Cyber UI Components
import GlassCard from "../ui/GlassCard";
import CyberButton from "../ui/CyberButton";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";

// Existing services and types
import { useBetting, useUser } from "../../store/unified/UnifiedStoreManager";
import { mlEngine } from "../../services/ml/UnifiedMLEngine";

interface BettingOpportunity {
  id: string;
  description: string;
  odds: number;
  confidence: number;
  expectedValue: number;
  kellySize: number;
  models: string[];
  sport: string;
  event: string;
  market: string;
  recommendation: "STRONG_BUY" | "BUY" | "HOLD" | "PASS";
  riskLevel: "low" | "medium" | "high";
  profit: number;
  timeRemaining: string;
}

interface CyberMoneyMakerState {
  isScanning: boolean;
  autoMode: boolean;
  scanInterval: number;
  opportunities: BettingOpportunity[];
  totalProfit: number;
  successRate: number;
  activeModels: number;
  lastScanTime: Date | null;
}

const CyberUltimateMoneyMaker: React.FC = () => {
  // State management
  const [state, setState] = useState<CyberMoneyMakerState>({
    isScanning: false,
    autoMode: false,
    scanInterval: 30000, // 30 seconds
    opportunities: [],
    totalProfit: 0,
    successRate: 0,
    activeModels: 47,
    lastScanTime: null,
  });

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<BettingOpportunity | null>(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Existing store integration
  const { bankroll, addBet, addOpportunity } = useBetting();
  const { preferences } = useUser();

  // Generate mock opportunities with cyber enhancement
  const generateOpportunities = useCallback(async (): Promise<
    BettingOpportunity[]
  > => {
    // Simulate AI scanning process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockOpportunities: BettingOpportunity[] = [
      {
        id: "cyber-opp-1",
        description: "Lakers vs Warriors - Lakers Moneyline",
        sport: "NBA",
        event: "Lakers vs Warriors",
        market: "Moneyline",
        odds: 2.1,
        confidence: 0.847,
        expectedValue: 0.124,
        kellySize: 0.058,
        models: ["XGBoost-V3", "Neural-Net-Pro", "Quantum-Predictor"],
        recommendation: "STRONG_BUY",
        riskLevel: "medium",
        profit: 247.5,
        timeRemaining: "2h 15m",
      },
      {
        id: "cyber-opp-2",
        description: "Chiefs vs Bills - Over 47.5 Total Points",
        sport: "NFL",
        event: "Chiefs vs Bills",
        market: "Total Points",
        odds: 1.91,
        confidence: 0.923,
        expectedValue: 0.156,
        kellySize: 0.072,
        models: ["Ensemble-Alpha", "Deep-Learning-V2", "Statistical-Master"],
        recommendation: "STRONG_BUY",
        riskLevel: "low",
        profit: 334.8,
        timeRemaining: "1h 47m",
      },
      {
        id: "cyber-opp-3",
        description: "Luka Dončić Over 29.5 Points",
        sport: "NBA",
        event: "Mavs vs Suns",
        market: "Player Props",
        odds: 1.85,
        confidence: 0.789,
        expectedValue: 0.098,
        kellySize: 0.045,
        models: ["Player-Analytics-Pro", "Form-Tracker", "Injury-Predictor"],
        recommendation: "BUY",
        riskLevel: "low",
        profit: 186.2,
        timeRemaining: "3h 22m",
      },
    ];

    return mockOpportunities;
  }, []);

  // Cyber scanning function
  const performCyberScan = useCallback(async () => {
    setState((prev) => ({ ...prev, isScanning: true }));

    try {
      const opportunities = await generateOpportunities();
      const totalProfit = opportunities.reduce(
        (sum, opp) => sum + opp.profit,
        0,
      );
      const avgConfidence =
        opportunities.reduce((sum, opp) => sum + opp.confidence, 0) /
        opportunities.length;

      setState((prev) => ({
        ...prev,
        opportunities,
        totalProfit,
        successRate: avgConfidence * 100,
        lastScanTime: new Date(),
        isScanning: false,
      }));
    } catch (error) {
      console.error("Cyber scan failed:", error);
      setState((prev) => ({ ...prev, isScanning: false }));
    }
  }, [generateOpportunities]);

  // Auto scanning effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.autoMode) {
      intervalId = setInterval(performCyberScan, state.scanInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.autoMode, state.scanInterval, performCyberScan]);

  // Initial scan
  useEffect(() => {
    performCyberScan();
  }, [performCyberScan]);

  // Handle bet placement with cyber enhancement
  const handleCyberBetPlacement = async (opportunity: BettingOpportunity) => {
    setIsPlacingBet(true);

    try {
      // Simulate bet placement process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add to betting store
      await addBet({
        id: `bet-${Date.now()}`,
        amount: bankroll * opportunity.kellySize,
        odds: opportunity.odds,
        sport: opportunity.sport,
        market: opportunity.market,
        description: opportunity.description,
        status: "pending",
        timestamp: Date.now(),
        confidence: opportunity.confidence,
        expectedValue: opportunity.expectedValue,
      });

      // Success notification would go here
      console.log(`✅ Cyber bet placed: ${opportunity.description}`);
    } catch (error) {
      console.error("❌ Cyber bet placement failed:", error);
    } finally {
      setIsPlacingBet(false);
      setSelectedOpportunity(null);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "STRONG_BUY":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "BUY":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "HOLD":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "PASS":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Cyber Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-6 text-electric-400 float-element">
          <DollarSign className="w-16 h-16 mx-auto" />
        </div>
        <h1 className="holographic text-4xl font-black mb-4">
          CYBER MONEY MAKER
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          AI-powered profit maximization with quantum-enhanced opportunity
          detection
        </p>
      </div>

      {/* Control Panel */}
      <GlassCard title="Quantum Control Center" glowing={state.isScanning}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Total Profit"
            value={`$${state.totalProfit.toFixed(2)}`}
            icon="fa-dollar-sign"
            change="+12.4%"
            trend="up"
          />
          <MetricCard
            label="Success Rate"
            value={`${state.successRate.toFixed(1)}%`}
            icon="fa-target"
            change="+3.2%"
            trend="up"
          />
          <MetricCard
            label="Active Models"
            value={state.activeModels.toString()}
            icon="fa-brain"
            change="+2"
            trend="up"
          />
          <MetricCard
            label="Opportunities"
            value={state.opportunities.length.toString()}
            icon="fa-search"
            change="+5"
            trend="up"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <CyberButton
            label={state.isScanning ? "SCANNING..." : "QUANTUM SCAN"}
            onClick={performCyberScan}
            variant="primary"
            size="lg"
            icon="fa-search"
            disabled={state.isScanning}
          />

          <CyberButton
            label={state.autoMode ? "AUTO MODE ON" : "AUTO MODE OFF"}
            onClick={() =>
              setState((prev) => ({ ...prev, autoMode: !prev.autoMode }))
            }
            variant={state.autoMode ? "secondary" : "ghost"}
            size="md"
            icon="fa-robot"
          />

          <div className="flex items-center space-x-4">
            <StatusIndicator
              status={state.isScanning ? "warning" : "active"}
              label={
                state.lastScanTime
                  ? `Last scan: ${state.lastScanTime.toLocaleTimeString()}`
                  : "Ready to scan"
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* Opportunities Display */}
      <GlassCard
        title="Quantum Opportunities"
        glowing={state.opportunities.length > 0}
      >
        <div className="space-y-4">
          {state.opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:shadow-neon transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Opportunity Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {opportunity.description}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{opportunity.sport}</span>
                    <span>•</span>
                    <span>{opportunity.market}</span>
                    <span>•</span>
                    <span className={getRiskColor(opportunity.riskLevel)}>
                      {opportunity.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-lg border text-xs font-bold ${getRecommendationColor(opportunity.recommendation)}`}
                  >
                    {opportunity.recommendation}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {opportunity.timeRemaining}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 glass-card rounded-lg">
                  <div className="text-xl font-bold text-electric-400">
                    {opportunity.odds.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Odds</div>
                </div>
                <div className="text-center p-3 glass-card rounded-lg">
                  <div className="text-xl font-bold text-green-400">
                    {(opportunity.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Confidence</div>
                </div>
                <div className="text-center p-3 glass-card rounded-lg">
                  <div className="text-xl font-bold text-blue-400">
                    {(opportunity.expectedValue * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Expected Value</div>
                </div>
                <div className="text-center p-3 glass-card rounded-lg">
                  <div className="text-xl font-bold text-purple-400">
                    {(opportunity.kellySize * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Kelly Size</div>
                </div>
                <div className="text-center p-3 glass-card rounded-lg">
                  <div className="text-xl font-bold text-yellow-400">
                    ${opportunity.profit.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Est. Profit</div>
                </div>
              </div>

              {/* AI Models */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">AI Models:</div>
                <div className="flex flex-wrap gap-2">
                  {opportunity.models.map((model, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-electric-400/20 text-electric-400 rounded text-xs font-medium"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <CyberButton
                label={
                  isPlacingBet && selectedOpportunity?.id === opportunity.id
                    ? "PLACING BET..."
                    : "PLACE QUANTUM BET"
                }
                onClick={() => {
                  setSelectedOpportunity(opportunity);
                  handleCyberBetPlacement(opportunity);
                }}
                variant="primary"
                className="w-full"
                icon="fa-rocket"
                disabled={isPlacingBet}
              />
            </motion.div>
          ))}

          {state.opportunities.length === 0 && !state.isScanning && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 text-gray-500">🔍</div>
              <div className="text-gray-400 mb-4">
                No opportunities detected
              </div>
              <CyberButton
                label="RUN QUANTUM SCAN"
                onClick={performCyberScan}
                variant="ghost"
                icon="fa-search"
              />
            </div>
          )}

          {state.isScanning && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 text-electric-400 animate-pulse">
                ⚡
              </div>
              <div className="text-electric-400 mb-2">
                QUANTUM SCANNING IN PROGRESS
              </div>
              <div className="text-sm text-gray-400">
                Analyzing 47 neural networks across multiple markets...
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Integration with Original Component */}
      <GlassCard title="Legacy Money Maker Integration">
        <div className="p-4 glass-card rounded-lg">
          <UltimateMoneyMaker
            opportunities={state.opportunities.map((opp) => ({
              id: opp.id,
              description: opp.description,
              odds: opp.odds,
              confidence: opp.confidence,
              expectedValue: opp.expectedValue,
              kellySize: opp.kellySize,
              models: opp.models,
            }))}
            onPlaceBet={async (opportunity) => {
              await handleCyberBetPlacement(opportunity as BettingOpportunity);
            }}
          />
        </div>
      </GlassCard>
    </div>
  );
};

export default CyberUltimateMoneyMaker;
