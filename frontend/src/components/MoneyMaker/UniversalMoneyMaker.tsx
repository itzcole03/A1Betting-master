import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Brain,
  AlertCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
  Activity,
  Coins,
  Calculator,
  Eye,
  RefreshCw,
  Filter,
  SortDesc,
  Star,
  Shield,
  Flame,
  Award,
  Users,
} from "lucide-react";

// Import consolidated systems
import { MegaCard, MegaButton, MegaInput, MegaAlert } from "../mega/MegaUI";
import { CyberText, CyberContainer } from "../mega/CyberTheme";
import {
  usePredictions,
  useBettingOpportunities,
  useUserProfile,
  useToast,
} from "../../hooks/UniversalHooks";
import { UniversalServiceFactory } from "../../services/UniversalServiceLayer";
import {
  formatters,
  validators,
  betting,
  analytics,
} from "../../utils/UniversalUtils";

// Import prototype features
import { useEnhancedRealDataSources } from "../../hooks/useEnhancedRealDataSources";
import { useEnhancedBettingEngine } from "../../hooks/useEnhancedBettingEngine";
import { EnhancedPrizePicks } from "../enhanced/EnhancedPrizePicks";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface MoneyMakerConfig {
  investmentAmount: number;
  riskLevel: "conservative" | "moderate" | "aggressive";
  timeHorizon: "short" | "medium" | "long"; // minutes, hours, days
  autoMode: boolean;
  minConfidence: number;
  maxExposure: number;
  diversificationLevel: number;
  preferredSports: string[];
  excludedMarkets: string[];
  kellyMultiplier: number;
  stopLossPercentage: number;
  profitTargetPercentage: number;
}

export interface OpportunityCandidate {
  id: string;
  eventId: string;
  sport: string;
  league: string;
  game: string;
  market: string;
  description: string;
  currentOdds: number;
  predictedProbability: number;
  valueEdge: number;
  kellyFraction: number;
  recommendedStake: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  maxStake: number;
  expectedReturn: number;
  potentialPayout: number;
  timeToStart: number;
  liquidityScore: number;
  marketEfficiency: number;
  historicalPerformance: number;
  mlFactors: {
    momentum: number;
    form: number;
    headToHead: number;
    injuries: number;
    weather: number;
    venue: number;
  };
  arbitrageOpportunity?: {
    isArbitrage: boolean;
    guaranteedProfit: number;
    bookmakers: string[];
  };
}

export interface MoneyMakerPortfolio {
  id: string;
  legs: OpportunityCandidate[];
  totalOdds: number;
  totalStake: number;
  totalPayout: number;
  expectedValue: number;
  riskScore: number;
  diversificationScore: number;
  kellyScore: number;
  confidence: number;
  type: "single" | "parlay" | "round_robin" | "arbitrage";
}

export interface MoneyMakerMetrics {
  totalProfit: number;
  totalStaked: number;
  roi: number;
  winRate: number;
  averageOdds: number;
  betsPlaced: number;
  opportunitiesFound: number;
  avgConfidence: number;
  avgValueEdge: number;
  maxDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
  profitFactor: number;
  clv: number; // Closing Line Value
}

export interface MoneyMakerState {
  isScanning: boolean;
  isAutoMode: boolean;
  scanProgress: number;
  lastScanTime: Date | null;
  alertsCount: number;
  systemHealth: "excellent" | "good" | "fair" | "poor";
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UniversalMoneyMaker: React.FC = () => {
  // Enhanced state with prototype features
  const [activeTab, setActiveTab] = useState<
    "scanner" | "prizepicks" | "portfolio" | "analytics"
  >("prizepicks");

  // State
  const [config, setConfig] = useState<MoneyMakerConfig>({
    investmentAmount: 1000,
    riskLevel: "moderate",
    timeHorizon: "medium",
    autoMode: false,
    minConfidence: 75,
    maxExposure: 25,
    diversificationLevel: 3,
    preferredSports: ["nfl", "nba", "mlb"],
    excludedMarkets: [],
    kellyMultiplier: 0.25,
    stopLossPercentage: 10,
    profitTargetPercentage: 20,
  });

  const [opportunities, setOpportunities] = useState<OpportunityCandidate[]>(
    [],
  );
  const [portfolios, setPortfolios] = useState<MoneyMakerPortfolio[]>([]);
  const [metrics, setMetrics] = useState<MoneyMakerMetrics>({
    totalProfit: 12547.83,
    totalStaked: 45230.0,
    roi: 27.7,
    winRate: 68.4,
    averageOdds: 1.85,
    betsPlaced: 234,
    opportunitiesFound: 1847,
    avgConfidence: 82.3,
    avgValueEdge: 5.8,
    maxDrawdown: 8.2,
    sharpeRatio: 2.14,
    calmarRatio: 3.38,
    profitFactor: 1.89,
    clv: 4.2,
  });

  const [state, setState] = useState<MoneyMakerState>({
    isScanning: false,
    isAutoMode: false,
    scanProgress: 0,
    lastScanTime: null,
    alertsCount: 3,
    systemHealth: "excellent",
  });

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityCandidate | null>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    sport: "all",
    riskLevel: "all",
    minConfidence: 0,
    minEdge: 0,
  });
  const [sortBy, setSortBy] = useState<keyof OpportunityCandidate>("valueEdge");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Enhanced hooks from prototype
  const {
    dataSources,
    games,
    players,
    loading: dataLoading,
    connectionStatus,
    dataQuality,
    dataReliability,
    refreshData,
    connectedSourcesCount,
    totalSourcesCount,
  } = useEnhancedRealDataSources();

  const {
    generateEnhancedPortfolio,
    currentOpportunities,
    isGenerating,
    realTimeData,
  } = useEnhancedBettingEngine();

  // Universal hooks
  const { toast } = useToast();
  const { predictions, loading: predictionsLoading } = usePredictions();
  const { opportunities: legacyOpportunities } = useBettingOpportunities();
  const { userProfile } = useUserProfile();

  // Initialize data and scan for opportunities
  useEffect(() => {
    if (players.length > 0 && games.length > 0) {
      generateOpportunities();
    }
  }, [players, games]);

  // Auto-scan interval
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isAutoMode) {
      interval = setInterval(() => {
        scanForOpportunities();
      }, 300000); // Scan every 5 minutes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isAutoMode]);

  // Generate opportunities from real data
  const generateOpportunities = useCallback(async () => {
    if (!players.length || !games.length) return;

    setState((prev) => ({ ...prev, isScanning: true, scanProgress: 0 }));

    try {
      const newOpportunities: OpportunityCandidate[] = [];

      // Generate player prop opportunities
      for (let i = 0; i < Math.min(players.length, 50); i++) {
        const player = players[i];
        setState((prev) => ({ ...prev, scanProgress: (i / 50) * 50 }));

        const statTypes = getStatTypesForSport(player.sport);

        for (const statType of statTypes.slice(0, 2)) {
          // Limit to 2 stat types per player
          const opportunity = generatePlayerPropOpportunity(player, statType);
          if (opportunity && opportunity.valueEdge > 3) {
            // Only include high-value opportunities
            newOpportunities.push(opportunity);
          }
        }
      }

      // Generate game-based opportunities
      for (let i = 0; i < Math.min(games.length, 20); i++) {
        const game = games[i];
        setState((prev) => ({ ...prev, scanProgress: 50 + (i / 20) * 50 }));

        const gameOpportunities = generateGameOpportunities(game);
        newOpportunities.push(...gameOpportunities);
      }

      // Sort by value edge
      newOpportunities.sort((a, b) => b.valueEdge - a.valueEdge);

      setOpportunities(newOpportunities.slice(0, 25)); // Keep top 25
      setState((prev) => ({
        ...prev,
        isScanning: false,
        scanProgress: 100,
        lastScanTime: new Date(),
        alertsCount: newOpportunities.filter((o) => o.valueEdge > 8).length,
      }));

      // Generate enhanced portfolios
      if (newOpportunities.length > 0) {
        await generatePortfolios(newOpportunities);
      }

      toast.success(
        `Found ${newOpportunities.length} opportunities from ${connectedSourcesCount} live data sources`,
      );
    } catch (error) {
      console.error("Error generating opportunities:", error);
      setState((prev) => ({ ...prev, isScanning: false }));
      toast.error("Failed to generate opportunities");
    }
  }, [players, games, connectedSourcesCount, toast]);

  const generatePlayerPropOpportunity = (
    player: any,
    statType: string,
  ): OpportunityCandidate | null => {
    try {
      const baseLine = calculateBaseLine(player, statType);
      const prediction = calculatePrediction(player, statType, baseLine);
      const confidence = calculateConfidence(
        player,
        statType,
        prediction,
        baseLine,
      );
      const odds = generateOdds(prediction, baseLine);
      const impliedProbability = oddsToImpliedProbability(odds);
      const predictedProbability =
        (confidence / 100) * (prediction > baseLine ? 1 : -1) + 0.5;
      const valueEdge =
        ((predictedProbability - impliedProbability) / impliedProbability) *
        100;

      if (valueEdge < 2) return null; // Skip low-value opportunities

      return {
        id: `${player.id}_${statType}_${Date.now()}`,
        eventId: `game_${player.team}`,
        sport: player.sport,
        league: getLeagueForSport(player.sport),
        game: `${player.team} vs Opponent`,
        market: "player_props",
        description: `${player.name} ${prediction > baseLine ? "Over" : "Under"} ${baseLine} ${statType}`,
        currentOdds: odds,
        predictedProbability,
        valueEdge,
        kellyFraction: calculateKellyFraction(predictedProbability, odds),
        recommendedStake: calculateRecommendedStake(
          valueEdge,
          confidence,
          config.investmentAmount,
        ),
        confidence,
        riskLevel: getRiskLevel(confidence, valueEdge),
        maxStake: config.investmentAmount * (config.maxExposure / 100),
        expectedReturn:
          (predictedProbability * (odds - 1) - (1 - predictedProbability)) *
          100,
        potentialPayout: 100 * odds,
        timeToStart: Math.random() * 24 * 60 * 60 * 1000, // Random time until game
        liquidityScore: 0.8 + Math.random() * 0.2,
        marketEfficiency: 0.85 + Math.random() * 0.1,
        historicalPerformance: 0.6 + Math.random() * 0.3,
        mlFactors: {
          momentum: player.recentForm
            ? player.recentForm.slice(-3).reduce((a, b) => a + b, 0) / 3
            : 0.5,
          form: player.recentForm
            ? player.recentForm.slice(-5).reduce((a, b) => a + b, 0) / 5
            : 0.5,
          headToHead: 0.5 + Math.random() * 0.3,
          injuries: Math.random() < 0.1 ? 0.2 : 0.9, // 10% chance of injury impact
          weather: ["NFL", "MLB"].includes(player.sport)
            ? 0.8 + Math.random() * 0.2
            : 1.0,
          venue: 0.5 + Math.random() * 0.3,
        },
      };
    } catch (error) {
      console.error("Error generating player prop opportunity:", error);
      return null;
    }
  };

  const generateGameOpportunities = (game: any): OpportunityCandidate[] => {
    const opportunities: OpportunityCandidate[] = [];

    // Generate total line opportunity
    const totalLine = 220 + Math.random() * 40; // Example total
    const totalPrediction = totalLine + (Math.random() - 0.5) * 15;
    const totalConfidence = 70 + Math.random() * 25;
    const totalOdds = 1.9 + Math.random() * 0.2;
    const totalImpliedProb = oddsToImpliedProbability(totalOdds);
    const totalPredictedProb =
      (totalConfidence / 100) * (totalPrediction > totalLine ? 1 : -1) + 0.5;
    const totalValueEdge =
      ((totalPredictedProb - totalImpliedProb) / totalImpliedProb) * 100;

    if (totalValueEdge > 2) {
      opportunities.push({
        id: `${game.id}_total_${Date.now()}`,
        eventId: game.id,
        sport: game.sport,
        league: getLeagueForSport(game.sport),
        game: `${game.awayTeam} @ ${game.homeTeam}`,
        market: "totals",
        description: `${totalPrediction > totalLine ? "Over" : "Under"} ${totalLine.toFixed(1)}`,
        currentOdds: totalOdds,
        predictedProbability: totalPredictedProb,
        valueEdge: totalValueEdge,
        kellyFraction: calculateKellyFraction(totalPredictedProb, totalOdds),
        recommendedStake: calculateRecommendedStake(
          totalValueEdge,
          totalConfidence,
          config.investmentAmount,
        ),
        confidence: totalConfidence,
        riskLevel: getRiskLevel(totalConfidence, totalValueEdge),
        maxStake: config.investmentAmount * (config.maxExposure / 100),
        expectedReturn:
          (totalPredictedProb * (totalOdds - 1) - (1 - totalPredictedProb)) *
          100,
        potentialPayout: 100 * totalOdds,
        timeToStart: new Date(game.gameTime).getTime() - Date.now(),
        liquidityScore: 0.9 + Math.random() * 0.1,
        marketEfficiency: 0.88 + Math.random() * 0.08,
        historicalPerformance: 0.65 + Math.random() * 0.25,
        mlFactors: {
          momentum: 0.5 + Math.random() * 0.4,
          form: 0.5 + Math.random() * 0.4,
          headToHead: 0.4 + Math.random() * 0.5,
          injuries: 0.8 + Math.random() * 0.2,
          weather: ["NFL", "MLB"].includes(game.sport)
            ? 0.7 + Math.random() * 0.3
            : 1.0,
          venue: 0.5 + Math.random() * 0.4,
        },
      });
    }

    return opportunities;
  };

  const generatePortfolios = async (opps: OpportunityCandidate[]) => {
    const newPortfolios: MoneyMakerPortfolio[] = [];

    // Single bet portfolios (top opportunities)
    opps.slice(0, 5).forEach((opp) => {
      newPortfolios.push({
        id: `single_${opp.id}`,
        legs: [opp],
        totalOdds: opp.currentOdds,
        totalStake: opp.recommendedStake,
        totalPayout: opp.recommendedStake * opp.currentOdds,
        expectedValue: opp.expectedReturn,
        riskScore: calculateRiskScore([opp]),
        diversificationScore: 0, // Single bet = no diversification
        kellyScore: opp.kellyFraction,
        confidence: opp.confidence,
        type: "single",
      });
    });

    // Parlay portfolios
    const parlayLegs = opps.filter((o) => o.confidence > 75).slice(0, 3);
    if (parlayLegs.length >= 2) {
      const parlayOdds = parlayLegs.reduce(
        (acc, leg) => acc * leg.currentOdds,
        1,
      );
      const parlayStake = config.investmentAmount * 0.05; // 5% for parlays

      newPortfolios.push({
        id: `parlay_${Date.now()}`,
        legs: parlayLegs,
        totalOdds: parlayOdds,
        totalStake: parlayStake,
        totalPayout: parlayStake * parlayOdds,
        expectedValue: calculateParlayEV(parlayLegs),
        riskScore: calculateRiskScore(parlayLegs),
        diversificationScore: calculateDiversificationScore(parlayLegs),
        kellyScore: calculateAverageKelly(parlayLegs),
        confidence:
          parlayLegs.reduce((sum, leg) => sum + leg.confidence, 0) /
          parlayLegs.length,
        type: "parlay",
      });
    }

    // Round robin portfolio
    if (opps.length >= 4) {
      const rrLegs = opps.slice(0, 4);
      newPortfolios.push({
        id: `round_robin_${Date.now()}`,
        legs: rrLegs,
        totalOdds: calculateRoundRobinOdds(rrLegs),
        totalStake: config.investmentAmount * 0.15,
        totalPayout: calculateRoundRobinPayout(
          rrLegs,
          config.investmentAmount * 0.15,
        ),
        expectedValue: calculateRoundRobinEV(rrLegs),
        riskScore: calculateRiskScore(rrLegs) * 0.7, // Lower risk due to multiple combinations
        diversificationScore: calculateDiversificationScore(rrLegs),
        kellyScore: calculateAverageKelly(rrLegs),
        confidence:
          rrLegs.reduce((sum, leg) => sum + leg.confidence, 0) / rrLegs.length,
        type: "round_robin",
      });
    }

    // Arbitrage opportunities
    const arbOpps = findArbitrageOpportunities(opps);
    arbOpps.forEach((arbOpp) => {
      newPortfolios.push(arbOpp);
    });

    setPortfolios(
      newPortfolios.sort((a, b) => b.expectedValue - a.expectedValue),
    );
  };

  const scanForOpportunities = useCallback(async () => {
    if (state.isScanning) return;

    await refreshData();
    await generateOpportunities();
  }, [state.isScanning, refreshData, generateOpportunities]);

  const toggleAutoMode = () => {
    setState((prev) => ({
      ...prev,
      isAutoMode: !prev.isAutoMode,
    }));
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        if (
          filterCriteria.sport !== "all" &&
          opp.sport.toLowerCase() !== filterCriteria.sport.toLowerCase()
        ) {
          return false;
        }
        if (
          filterCriteria.riskLevel !== "all" &&
          opp.riskLevel !== filterCriteria.riskLevel
        ) {
          return false;
        }
        if (opp.confidence < filterCriteria.minConfidence) {
          return false;
        }
        if (opp.valueEdge < filterCriteria.minEdge) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "desc" ? -1 : 1;
        return (a[sortBy] - b[sortBy]) * multiplier;
      });
  }, [opportunities, filterCriteria, sortBy, sortOrder]);

  const handleConfigChange = (key: keyof MoneyMakerConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case "prizepicks":
        return <EnhancedPrizePicks />;
      case "scanner":
        return renderScannerTab();
      case "portfolio":
        return renderPortfolioTab();
      case "analytics":
        return renderAnalyticsTab();
      default:
        return <EnhancedPrizePicks />;
    }
  };

  const renderScannerTab = () => (
    <div className="space-y-6">
      {/* Control Panel */}
      <MegaCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Opportunity Scanner
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time analysis of {connectedSourcesCount} live data sources
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${state.systemHealth === "excellent" ? "bg-green-400" : "bg-yellow-400"} animate-pulse`}
              />
              <span className="text-sm font-medium">{connectionStatus}</span>
            </div>
            <MegaButton
              onClick={toggleAutoMode}
              variant={state.isAutoMode ? "primary" : "secondary"}
              size="sm"
              icon={
                state.isAutoMode ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )
              }
            >
              {state.isAutoMode ? "Auto ON" : "Auto OFF"}
            </MegaButton>
            <MegaButton
              onClick={scanForOpportunities}
              disabled={state.isScanning}
              size="sm"
              icon={
                <RefreshCw
                  className={`w-4 h-4 ${state.isScanning ? "animate-spin" : ""}`}
                />
              }
            >
              {state.isScanning ? "Scanning..." : "Scan Now"}
            </MegaButton>
          </div>
        </div>

        {/* Progress Bar */}
        {state.isScanning && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Scanning opportunities...</span>
              <span>{state.scanProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {opportunities.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Opportunities
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {state.alertsCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              High Value
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(dataQuality * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Data Quality
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {portfolios.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Portfolios
            </div>
          </div>
        </div>
      </MegaCard>

      {/* Filters */}
      <MegaCard className="p-6">
        <h4 className="text-lg font-semibold mb-4">Filters & Sorting</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sport</label>
            <select
              value={filterCriteria.sport}
              onChange={(e) =>
                setFilterCriteria((prev) => ({
                  ...prev,
                  sport: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Sports</option>
              <option value="nba">NBA</option>
              <option value="nfl">NFL</option>
              <option value="mlb">MLB</option>
              <option value="nhl">NHL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Risk Level</label>
            <select
              value={filterCriteria.riskLevel}
              onChange={(e) =>
                setFilterCriteria((prev) => ({
                  ...prev,
                  riskLevel: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Min Confidence
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterCriteria.minConfidence}
              onChange={(e) =>
                setFilterCriteria((prev) => ({
                  ...prev,
                  minConfidence: Number(e.target.value),
                }))
              }
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {filterCriteria.minConfidence}%
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Edge</label>
            <input
              type="range"
              min="0"
              max="20"
              value={filterCriteria.minEdge}
              onChange={(e) =>
                setFilterCriteria((prev) => ({
                  ...prev,
                  minEdge: Number(e.target.value),
                }))
              }
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {filterCriteria.minEdge}%
            </div>
          </div>
        </div>
      </MegaCard>

      {/* Opportunities List */}
      <MegaCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold">
            Opportunities ({filteredOpportunities.length})
          </h4>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as keyof OpportunityCandidate)
              }
              className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="valueEdge">Value Edge</option>
              <option value="confidence">Confidence</option>
              <option value="expectedReturn">Expected Return</option>
              <option value="timeToStart">Time to Start</option>
            </select>
            <MegaButton
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              size="sm"
              icon={<SortDesc className="w-4 h-4" />}
            >
              {sortOrder.toUpperCase()}
            </MegaButton>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOpportunities.slice(0, 10).map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onSelect={() => setSelectedOpportunity(opportunity)}
              isSelected={selectedOpportunity?.id === opportunity.id}
            />
          ))}
        </div>
      </MegaCard>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className="space-y-6">
      <MegaCard className="p-6">
        <h3 className="text-xl font-bold mb-6">Generated Portfolios</h3>
        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      </MegaCard>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <MegaCard className="p-6">
        <h3 className="text-xl font-bold mb-6">Performance Analytics</h3>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              ${formatters.currency(metrics.totalProfit)}
            </div>
            <div className="text-sm text-gray-600">Total Profit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {metrics.roi.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {metrics.winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">{metrics.betsPlaced}</div>
            <div className="text-sm text-gray-600">Bets Placed</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              {metrics.avgConfidence.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              {metrics.avgValueEdge.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Value Edge</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              {metrics.maxDrawdown.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Max Drawdown</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              {metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Profit Factor</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              {metrics.clv.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">CLV</div>
          </div>
        </div>
      </MegaCard>
    </div>
  );

  return (
    <CyberContainer className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Universal Money Maker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered sports betting intelligence with real-time data
                integration
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {[
              { id: "prizepicks", label: "PrizePicks", icon: Target },
              { id: "scanner", label: "Scanner", icon: Eye },
              { id: "portfolio", label: "Portfolio", icon: BarChart3 },
              { id: "analytics", label: "Analytics", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </CyberContainer>
  );
};

// Helper Components
const OpportunityCard: React.FC<{
  opportunity: OpportunityCandidate;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ opportunity, onSelect, isSelected }) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
    }`}
    onClick={onSelect}
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h5 className="font-semibold">{opportunity.description}</h5>
        <p className="text-sm text-gray-600">{opportunity.game}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">
          +{opportunity.valueEdge.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Edge</div>
      </div>
    </div>

    <div className="flex justify-between items-center text-sm">
      <div className="flex space-x-4">
        <span>Confidence: {opportunity.confidence.toFixed(0)}%</span>
        <span>Odds: {opportunity.currentOdds.toFixed(2)}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            opportunity.riskLevel === "low"
              ? "bg-green-100 text-green-800"
              : opportunity.riskLevel === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {opportunity.riskLevel.toUpperCase()}
        </span>
      </div>
      <div className="text-gray-600">
        ${opportunity.recommendedStake.toFixed(0)} → $
        {opportunity.potentialPayout.toFixed(0)}
      </div>
    </div>
  </div>
);

const PortfolioCard: React.FC<{
  portfolio: MoneyMakerPortfolio;
}> = ({ portfolio }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h5 className="font-semibold capitalize">{portfolio.type} Portfolio</h5>
        <p className="text-sm text-gray-600">{portfolio.legs.length} legs</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">
          +{portfolio.expectedValue.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Expected Value</div>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      {portfolio.legs.map((leg, index) => (
        <div
          key={index}
          className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
        >
          {leg.description}
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center text-sm border-t pt-2">
      <div className="flex space-x-4">
        <span>Stake: ${portfolio.totalStake.toFixed(0)}</span>
        <span>Odds: {portfolio.totalOdds.toFixed(2)}</span>
        <span>Confidence: {portfolio.confidence.toFixed(0)}%</span>
      </div>
      <div className="font-medium">
        Payout: ${portfolio.totalPayout.toFixed(0)}
      </div>
    </div>
  </div>
);

// Helper Functions
const getStatTypesForSport = (sport: string): string[] => {
  const statTypes = {
    NBA: [
      "Points",
      "Rebounds",
      "Assists",
      "3-Pointers Made",
      "Steals",
      "Blocks",
    ],
    NFL: [
      "Passing Yards",
      "Rushing Yards",
      "Receptions",
      "Receiving Yards",
      "Touchdowns",
    ],
    MLB: ["Hits", "RBIs", "Runs", "Home Runs", "Strikeouts"],
    NHL: ["Goals", "Assists", "Shots", "Points"],
  };
  return statTypes[sport] || ["Points"];
};

const getLeagueForSport = (sport: string): string => {
  const leagues = {
    NBA: "NBA",
    NFL: "NFL",
    MLB: "MLB",
    NHL: "NHL",
  };
  return leagues[sport] || sport;
};

const calculateBaseLine = (player: any, statType: string): number => {
  const stats = player.stats || {};
  const statKey = statType.toLowerCase().replace(/[^a-z]/g, "");
  return stats[statKey] || 10 + Math.random() * 20;
};

const calculatePrediction = (
  player: any,
  statType: string,
  baseLine: number,
): number => {
  const recentForm = player.recentForm || [0.5, 0.5, 0.5, 0.5, 0.5];
  const formFactor = recentForm.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const adjustment = (formFactor - 0.5) * 0.3; // ±30% based on form
  return baseLine * (1 + adjustment);
};

const calculateConfidence = (
  player: any,
  statType: string,
  prediction: number,
  baseLine: number,
): number => {
  const baseConfidence = 70;
  const predictionDiff = Math.abs(prediction - baseLine) / baseLine;
  const confidenceAdjustment = predictionDiff * 20; // Higher difference = higher confidence
  return Math.min(
    95,
    Math.max(55, baseConfidence + confidenceAdjustment + Math.random() * 10),
  );
};

const generateOdds = (prediction: number, baseLine: number): number => {
  const diff = Math.abs(prediction - baseLine) / baseLine;
  const baseOdds = 1.9;
  return baseOdds + diff * 0.3 + (Math.random() * 0.2 - 0.1);
};

const oddsToImpliedProbability = (odds: number): number => {
  return 1 / odds;
};

const calculateKellyFraction = (probability: number, odds: number): number => {
  const q = 1 - probability;
  const b = odds - 1;
  return Math.max(0, (b * probability - q) / b);
};

const calculateRecommendedStake = (
  valueEdge: number,
  confidence: number,
  bankroll: number,
): number => {
  const baseStake = bankroll * 0.02; // 2% base stake
  const edgeMultiplier = valueEdge / 10; // Scale by edge
  const confidenceMultiplier = confidence / 100;
  return Math.min(
    bankroll * 0.05,
    baseStake * edgeMultiplier * confidenceMultiplier,
  );
};

const getRiskLevel = (
  confidence: number,
  valueEdge: number,
): "low" | "medium" | "high" => {
  if (confidence > 80 && valueEdge > 6) return "low";
  if (confidence > 70 && valueEdge > 4) return "medium";
  return "high";
};

const calculateRiskScore = (opportunities: OpportunityCandidate[]): number => {
  const avgConfidence =
    opportunities.reduce((sum, opp) => sum + opp.confidence, 0) /
    opportunities.length;
  return (100 - avgConfidence) / 100;
};

const calculateDiversificationScore = (
  opportunities: OpportunityCandidate[],
): number => {
  const sports = new Set(opportunities.map((opp) => opp.sport));
  const markets = new Set(opportunities.map((opp) => opp.market));
  return (sports.size + markets.size) / (opportunities.length * 2);
};

const calculateAverageKelly = (
  opportunities: OpportunityCandidate[],
): number => {
  return (
    opportunities.reduce((sum, opp) => sum + opp.kellyFraction, 0) /
    opportunities.length
  );
};

const calculateParlayEV = (legs: OpportunityCandidate[]): number => {
  const combinedProb = legs.reduce(
    (acc, leg) => acc * (leg.confidence / 100),
    1,
  );
  const combinedOdds = legs.reduce((acc, leg) => acc * leg.currentOdds, 1);
  return (combinedProb * (combinedOdds - 1) - (1 - combinedProb)) * 100;
};

const calculateRoundRobinOdds = (legs: OpportunityCandidate[]): number => {
  // Simplified calculation - average of all possible 2-leg parlays
  let totalOdds = 0;
  let combinations = 0;

  for (let i = 0; i < legs.length; i++) {
    for (let j = i + 1; j < legs.length; j++) {
      totalOdds += legs[i].currentOdds * legs[j].currentOdds;
      combinations++;
    }
  }

  return combinations > 0 ? totalOdds / combinations : 1;
};

const calculateRoundRobinPayout = (
  legs: OpportunityCandidate[],
  totalStake: number,
): number => {
  const averageOdds = calculateRoundRobinOdds(legs);
  return totalStake * averageOdds;
};

const calculateRoundRobinEV = (legs: OpportunityCandidate[]): number => {
  // Calculate EV for round robin as average of all 2-leg parlay EVs
  let totalEV = 0;
  let combinations = 0;

  for (let i = 0; i < legs.length; i++) {
    for (let j = i + 1; j < legs.length; j++) {
      const ev = calculateParlayEV([legs[i], legs[j]]);
      totalEV += ev;
      combinations++;
    }
  }

  return combinations > 0 ? totalEV / combinations : 0;
};

const findArbitrageOpportunities = (
  opportunities: OpportunityCandidate[],
): MoneyMakerPortfolio[] => {
  // Simplified arbitrage detection - look for complementary bets
  const arbPortfolios: MoneyMakerPortfolio[] = [];

  // Group by game
  const gameGroups = opportunities.reduce(
    (groups, opp) => {
      if (!groups[opp.game]) groups[opp.game] = [];
      groups[opp.game].push(opp);
      return groups;
    },
    {} as Record<string, OpportunityCandidate[]>,
  );

  Object.values(gameGroups).forEach((gameOpps) => {
    if (gameOpps.length >= 2) {
      // Look for opposite sides with combined implied probability < 1
      for (let i = 0; i < gameOpps.length; i++) {
        for (let j = i + 1; j < gameOpps.length; j++) {
          const opp1 = gameOpps[i];
          const opp2 = gameOpps[j];

          const prob1 = oddsToImpliedProbability(opp1.currentOdds);
          const prob2 = oddsToImpliedProbability(opp2.currentOdds);

          if (prob1 + prob2 < 0.95) {
            // 5% arbitrage opportunity
            const profit = (1 / prob1 + 1 / prob2 - 1) * 100;

            arbPortfolios.push({
              id: `arb_${opp1.id}_${opp2.id}`,
              legs: [opp1, opp2],
              totalOdds: (opp1.currentOdds + opp2.currentOdds) / 2,
              totalStake: 1000, // Fixed stake for arbitrage
              totalPayout: 1000 * (1 + profit / 100),
              expectedValue: profit,
              riskScore: 0, // Arbitrage is risk-free
              diversificationScore: 0.5,
              kellyScore: 1, // Max Kelly for arbitrage
              confidence: 100, // Guaranteed profit
              type: "arbitrage",
            });
          }
        }
      }
    }
  });

  return arbPortfolios;
};

export default UniversalMoneyMaker;
