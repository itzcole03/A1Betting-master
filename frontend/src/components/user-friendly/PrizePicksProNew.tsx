import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy,
  TrendingUp,
  Target,
  Star,
  CheckCircle,
  DollarSign,
  Activity,
  Brain,
  Zap,
  Award,
  HelpCircle,
  X,
  Users,
  RefreshCw,
  BarChart3,
  LineChart,
  Info,
  Clock,
  Flame,
  Shield,
  TrendingDown,
} from "lucide-react";
import { productionApiService, api } from "@/services/api/ProductionApiService";
import { logger, logUserAction, logError } from "@/utils/logger";
import OfflineIndicator from "@/components/ui/OfflineIndicator";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface PlayerProp {
  id: string;
  player: string;
  team: string;
  position: string;
  stat: string;
  line: number;
  overOdds: number;
  underOdds: number;
  gameTime: string;
  opponent: string;
  sport: string;
  confidence: number;
  projection: number;
  edge: number;
  pickType: "normal" | "demon" | "goblin";
  reasoning: string;
  lastGameStats: number[];
  seasonAvg: number;
  recentForm: "hot" | "cold" | "neutral";
  injuryStatus: "healthy" | "questionable" | "probable";
  weatherImpact?: number;
  homeAwayFactor: number;
}

interface SelectedPick {
  propId: string;
  choice: "over" | "under";
  player: string;
  stat: string;
  line: number;
  confidence: number;
  pickType: "normal" | "demon" | "goblin";
  projection: number;
  edge: number;
}

interface LineupEntry {
  id: string;
  picks: SelectedPick[];
  entryFee: number;
  potentialPayout: number;
  multiplier: number;
  expectedValue: number;
  winProbability: number;
  status: "draft" | "submitted" | "live" | "completed";
}

interface PrizePicksConfig {
  sport: "all" | "nba" | "nfl" | "mlb" | "soccer";
  maxPicks: number;
  minConfidence: number;
  entrySize: number;
  strategy: "conservative" | "balanced" | "aggressive";
  focusOnDemonsGoblins: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateMultiplier = (pickCount: number): number => {
  const multipliers = [0, 0, 3, 5, 10, 20, 40];
  return multipliers[Math.min(pickCount, 6)] || 40;
};

const formatOdds = (odds: number): string => {
  return odds > 0 ? `+${odds}` : `${odds}`;
};

const getPickTypeColor = (pickType: "normal" | "demon" | "goblin"): string => {
  switch (pickType) {
    case "demon":
      return "text-red-500 bg-red-100 dark:bg-red-900/20";
    case "goblin":
      return "text-green-500 bg-green-100 dark:bg-green-900/20";
    default:
      return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
  }
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/20";
  if (confidence >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
  return "text-red-600 bg-red-100 dark:bg-red-900/20";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PrizePicksPro: React.FC = () => {
  // State management
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([]);
  const [lineup, setLineup] = useState<LineupEntry[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState<"picks" | "lineup" | "history">("picks");
  const [config, setConfig] = useState<PrizePicksConfig>({
    sport: "all",
    maxPicks: 6,
    minConfidence: 70,
    entrySize: 25,
    strategy: "balanced",
    focusOnDemonsGoblins: true,
  });
  const [autoSelect, setAutoSelect] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"confidence" | "edge" | "player">("confidence");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [props, setProps] = useState<PlayerProp[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Data fetching functions
  const fetchProps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getPrizePicksProps({
        sport: config.sport,
        minConfidence: config.minConfidence,
      });
      
      if (response.success && response.data) {
        setProps(response.data);
        logger.info("Successfully fetched PrizePicks props", { count: response.data.length });
      } else {
        throw new Error(response.error || "Failed to fetch props");
      }
    } catch (err) {
      logger.error("Failed to fetch PrizePicks props", err);
      // Production error handling - no fallback data
      setProps([]);
      setError("Failed to load props. Please check your connection and try again.");
      logger.error("API Error fetching props:", err);
    } finally {
      setIsLoading(false);
    }
  }, [config.sport, config.minConfidence]);

  const fetchRecommendations = useCallback(async () => {
    try {
      const response = await api.getPrizePicksRecommendations({
        sport: config.sport,
        strategy: config.strategy,
        minConfidence: config.minConfidence,
      });
      
      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch recommendations");
      }
    } catch (err) {
      logger.error("Failed to fetch recommendations", err);
      // Production error handling - no fallback data
      setError("Failed to load AI recommendations. Please check your connection and try again.");
      setRecommendations([]);
    }
  }, [config]);

  const handleAutoSelectPicks = useCallback(() => {
    const topPicks = recommendations
      .filter((rec: any) => rec.confidence >= config.minConfidence)
      .slice(0, config.maxPicks)
      .map((rec: any) => ({
        propId: rec.id || `${rec.player}_${rec.stat}`,
        choice: rec.recommendedPick as "over" | "under",
        player: rec.player,
        stat: rec.stat,
        line: rec.line,
        confidence: rec.confidence,
        pickType: rec.pickType || "normal",
        projection: rec.projection,
        edge: rec.edge,
      }));

    setSelectedPicks(topPicks);
    logUserAction("auto_select_picks", { count: topPicks.length });
    alert(`Auto-selected ${topPicks.length} top picks`);
  }, [recommendations, config.minConfidence, config.maxPicks]);

  // Effects
  useEffect(() => {
    logUserAction("prizepicks_pro_opened", { 
      config,
      selectedPicksCount: selectedPicks.length 
    });
    fetchProps();
  }, [fetchProps, config, selectedPicks.length]);

  useEffect(() => {
    if (showRecommendations) {
      fetchRecommendations();
    }
  }, [showRecommendations, fetchRecommendations]);

  useEffect(() => {
    if (autoSelect && recommendations.length > 0) {
      handleAutoSelectPicks();
    }
  }, [recommendations, autoSelect, handleAutoSelectPicks]);

  // Event handlers
  const handlePickToggle = (prop: PlayerProp, choice: "over" | "under") => {
    const propId = prop.id;
    const existingIndex = selectedPicks.findIndex(
      (pick) => pick.propId === propId
    );

    if (existingIndex >= 0) {
      // Remove if same choice, update if different choice
      if (selectedPicks[existingIndex].choice === choice) {
        setSelectedPicks((prev) => prev.filter((_, i) => i !== existingIndex));
        logUserAction("pick_removed", { propId, choice });
      } else {
        setSelectedPicks((prev) =>
          prev.map((pick, i) =>
            i === existingIndex ? { ...pick, choice } : pick
          )
        );
        logUserAction("pick_updated", { propId, choice });
      }
    } else if (selectedPicks.length < config.maxPicks) {
      const newPick: SelectedPick = {
        propId,
        choice,
        player: prop.player,
        stat: prop.stat,
        line: prop.line,
        confidence: prop.confidence,
        pickType: prop.pickType,
        projection: prop.projection,
        edge: prop.edge,
      };
      setSelectedPicks((prev) => [...prev, newPick]);
      logUserAction("pick_added", { propId, choice });
    } else {
      alert(`Maximum ${config.maxPicks} picks allowed`);
    }
  };

  const calculatePickEV = (
    prop: PlayerProp,
    choice: "over" | "under"
  ): number => {
    const odds = choice === "over" ? prop.overOdds : prop.underOdds;
    const impliedProb = Math.abs(odds) / (Math.abs(odds) + 100);
    const trueProbability = prop.confidence / 100;
    
    if (choice === "under") {
      return (1 - trueProbability) / impliedProb - 1;
    }
    return trueProbability / impliedProb - 1;
  };

  const handleCreateLineup = () => {
    if (selectedPicks.length < 2) {
      alert("Need at least 2 picks for a lineup");
      return;
    }

    const entryFee = config.entrySize;
    const multiplier = calculateMultiplier(selectedPicks.length);
    const potentialPayout = entryFee * multiplier;
    const avgConfidence = selectedPicks.reduce((sum, pick) => sum + pick.confidence, 0) / selectedPicks.length;
    const expectedValue = selectedPicks.reduce((sum, pick) => sum + pick.edge, 0);

    const newLineup: LineupEntry = {
      id: `lineup_${Date.now()}`,
      picks: [...selectedPicks],
      entryFee,
      potentialPayout,
      multiplier,
      expectedValue,
      winProbability: avgConfidence,
      status: "draft",
    };

    setLineup((prev) => [...prev, newLineup]);
    setSelectedPicks([]);
    setActiveTab("lineup");
    
    logUserAction("lineup_created", { 
      pickCount: selectedPicks.length,
      entryFee,
      potentialPayout 
    });
    alert("Lineup created successfully!");
  };

  // Filtered and sorted props
  const filteredProps = useMemo(() => {
    const filtered = props.filter((prop) => {
      const matchesSearch = 
        prop.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.stat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.team.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = config.sport === "all" || prop.sport.toLowerCase() === config.sport.toLowerCase();
      const matchesConfidence = prop.confidence >= config.minConfidence;
      const matchesPickType = !config.focusOnDemonsGoblins || prop.pickType !== "normal";

      return matchesSearch && matchesSport && matchesConfidence && matchesPickType;
    });

    // Sort props
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "confidence":
          return b.confidence - a.confidence;
        case "edge":
          return b.edge - a.edge;
        case "player":
          return a.player.localeCompare(b.player);
        default:
          return 0;
      }
    });

    return filtered;
  }, [props, searchQuery, config, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <OfflineIndicator 
        show={!!error} 
        service="PrizePicks API" 
        onRetry={fetchProps}
      />
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PrizePicks Pro
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 ml-6">
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                  {selectedPicks.length}/{config.maxPicks} Picks
                </div>
                {selectedPicks.length > 0 && (
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    ${(config.entrySize * calculateMultiplier(selectedPicks.length)).toFixed(2)} Potential
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showRecommendations
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
                title="Toggle AI recommendations"
              >
                <Brain className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setAutoSelect(!autoSelect)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  autoSelect
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
                title="Toggle auto-select mode"
              >
                <Zap className="h-5 w-5" />
              </button>

              <button
                onClick={fetchProps}
                disabled={isLoading}
                className="p-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 dark:bg-slate-800/60 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: "picks", label: "Player Props", icon: Target },
              { id: "lineup", label: "My Lineups", icon: Users },
              { id: "history", label: "History", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "picks" && (
          <div className="space-y-6">
            {/* Filters and Controls */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Search players, teams, or stats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <select
                    value={config.sport}
                    onChange={(e) => setConfig(prev => ({ ...prev, sport: e.target.value as any }))}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select sport filter"
                  >
                    <option value="all">All Sports</option>
                    <option value="nba">NBA</option>
                    <option value="nfl">NFL</option>
                    <option value="mlb">MLB</option>
                    <option value="soccer">Soccer</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Sort options"
                  >
                    <option value="confidence">Sort by Confidence</option>
                    <option value="edge">Sort by Edge</option>
                    <option value="player">Sort by Player</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.focusOnDemonsGoblins}
                      onChange={(e) => setConfig(prev => ({ ...prev, focusOnDemonsGoblins: e.target.checked }))}
                      className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Demons & Goblins Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Player Props Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProps.map((prop) => {
                  const selectedPick = selectedPicks.find(p => p.propId === prop.id);
                  
                  return (
                    <div
                      key={prop.id}
                      className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
                        selectedPick
                          ? "border-blue-300 dark:border-blue-600 shadow-md"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{prop.player}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPickTypeColor(prop.pickType)}`}>
                              {prop.pickType.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {prop.team} {prop.opponent} • {new Date(prop.gameTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-2 py-1 text-xs font-bold rounded-full ${getConfidenceColor(prop.confidence)}`}>
                          {prop.confidence.toFixed(0)}%
                        </div>
                      </div>

                      {/* Stat Line */}
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {prop.line} {prop.stat}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Projection: {prop.projection.toFixed(1)} | Edge: {prop.edge > 0 ? "+" : ""}{prop.edge.toFixed(1)}%
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button
                          onClick={() => handlePickToggle(prop, "over")}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            selectedPick?.choice === "over"
                              ? "bg-green-500 text-white shadow-md"
                              : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/40"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold">Over</div>
                            <div className="text-sm">{formatOdds(prop.overOdds)}</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handlePickToggle(prop, "under")}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            selectedPick?.choice === "under"
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold">Under</div>
                            <div className="text-sm">{formatOdds(prop.underOdds)}</div>
                          </div>
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Season Avg:</span>
                          <span>{prop.seasonAvg.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Form:</span>
                          <span className={`font-medium ${
                            prop.recentForm === "hot" ? "text-red-500" : 
                            prop.recentForm === "cold" ? "text-blue-500" : "text-slate-500"
                          }`}>
                            {prop.recentForm.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected Picks Summary */}
            {selectedPicks.length > 0 && (
              <div className="fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Selected Picks</h3>
                  <button
                    onClick={() => setSelectedPicks([])}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="Clear all picks"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {selectedPicks.map((pick) => (
                    <div key={pick.propId} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                      <div>
                        <div className="font-medium">{pick.player}</div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {pick.choice.toUpperCase()} {pick.line} {pick.stat}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getConfidenceColor(pick.confidence)}`}>
                          {pick.confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Entry Fee:</span>
                    <span className="font-medium">${config.entrySize}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span>Potential Payout:</span>
                    <span className="font-bold text-green-600">
                      ${(config.entrySize * calculateMultiplier(selectedPicks.length)).toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCreateLineup}
                    disabled={selectedPicks.length < 2}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Lineup ({selectedPicks.length}/6)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "lineup" && (
          <div className="space-y-6">
            {lineup.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No Lineups Yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first lineup by selecting player props and clicking "Create Lineup"
                </p>
                <button
                  onClick={() => setActiveTab("picks")}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Props
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {lineup.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {entry.picks.length}-Pick Entry
                      </h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        entry.status === "draft" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300" :
                        entry.status === "submitted" ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300" :
                        entry.status === "live" ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300" :
                        "bg-slate-100 dark:bg-slate-900/20 text-slate-800 dark:text-slate-300"
                      }`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {entry.picks.map((pick, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                          <div>
                            <div className="font-medium">{pick.player}</div>
                            <div className="text-slate-500 dark:text-slate-400">
                              {pick.choice.toUpperCase()} {pick.line} {pick.stat}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-medium ${getConfidenceColor(pick.confidence)}`}>
                              {pick.confidence.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400">Entry Fee</div>
                          <div className="font-bold">${entry.entryFee}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-slate-400">Potential Payout</div>
                          <div className="font-bold text-green-600">${entry.potentialPayout.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-slate-400">Multiplier</div>
                          <div className="font-bold">{entry.multiplier}x</div>
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-slate-400">Win Probability</div>
                          <div className="font-bold">{entry.winProbability.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    {entry.status === "draft" && (
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                          Submit Entry
                        </button>
                        <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Track your performance and analyze your betting history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizePicksPro;
