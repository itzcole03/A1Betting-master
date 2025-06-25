import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  FireIcon,
  XMarkIcon,
  UsersIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { productionApiService, api } from "@/services/api/ProductionApiService";
import { logger, logUserAction } from "@/utils/logger";
import OfflineIndicator from "@/components/ui/OfflineIndicator";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface PlayerProp {
  id: string;
  player: string;
  team: string;
  opponent: string;
  stat: string;
  line: number;
  overOdds: number;
  underOdds: number;
  confidence: number;
  pickType: "over" | "under" | null;
  projection: number;
  edge: number;
  recent_form: number[];
  season_stats: {
    average: number;
    games: number;
    hit_rate: number;
  };
  matchup_data: {
    defense_rank: number;
    pace: number;
    total: number;
  };
  weather?: {
    condition: string;
    temp: number;
    wind: number;
  };
  injury_report?: string;
  last_5_games: number[];
  vs_opponent: number[];
}

interface SelectedPick {
  propId: string;
  choice: "over" | "under";
  player: string;
  stat: string;
  line: number;
  confidence: number;
  pickType: string;
  projection: number;
  edge: number;
}

interface LineupEntry {
  picks: SelectedPick[];
  entryFee: number;
  potentialPayout: number;
  riskLevel: "low" | "medium" | "high";
  strategy: string;
}

interface PrizePicksStats {
  totalLineups: number;
  winRate: number;
  profit: number;
  avgConfidence: number;
  bestStreak: number;
  currentStreak: number;
}

interface HealthStatus {
  status: string;
  accuracy: number;
  activePredictions: number;
  uptime: number;
  lastUpdate: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const PrizePicksPro: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [playerProps, setPlayerProps] = useState<PlayerProp[]>([]);
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entryFee, setEntryFee] = useState<number>(5);
  const [filterSport, setFilterSport] = useState<string>("all");
  const [filterConfidence, setFilterConfidence] = useState<number>(70);
  const [sortBy, setSortBy] = useState<string>("confidence");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [stats, setStats] = useState<PrizePicksStats>({
    totalLineups: 0,
    winRate: 0,
    profit: 0,
    avgConfidence: 0,
    bestStreak: 0,
    currentStreak: 0,
  });
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: "online",
    accuracy: 85,
    activePredictions: 0,
    uptime: 99.9,
    lastUpdate: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredProps = useMemo(() => {
    let filtered = playerProps.filter((prop) => {
      if (filterSport !== "all" && !prop.team.toLowerCase().includes(filterSport.toLowerCase())) {
        return false;
      }
      if (prop.confidence < filterConfidence) {
        return false;
      }
      return true;
    });

    // Sort props
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "confidence":
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case "edge":
          aValue = a.edge;
          bValue = b.edge;
          break;
        case "projection":
          aValue = a.projection;
          bValue = b.projection;
          break;
        default:
          aValue = a.confidence;
          bValue = b.confidence;
      }

      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [playerProps, filterSport, filterConfidence, sortBy, sortOrder]);

  const potentialPayout = useMemo(() => {
    if (selectedPicks.length < 2) return 0;
    const multipliers = [0, 0, 3, 5, 10, 20, 40];
    return Math.round(entryFee * (multipliers[selectedPicks.length] || 40));
  }, [selectedPicks.length, entryFee]);

  const totalEdge = useMemo(() => {
    return selectedPicks.reduce((sum, pick) => sum + pick.edge, 0);
  }, [selectedPicks]);

  const avgConfidence = useMemo(() => {
    if (selectedPicks.length === 0) return 0;
    return Math.round(
      selectedPicks.reduce((sum, pick) => sum + pick.confidence, 0) /
        selectedPicks.length
    );
  }, [selectedPicks]);

  const riskLevel = useMemo(() => {
    if (avgConfidence >= 85) return "low";
    if (avgConfidence >= 75) return "medium";
    return "high";
  }, [avgConfidence]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchPlayerProps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getPredictions();
      
      if (response.success && response.data) {
        // Transform predictions to player props format
        const transformedProps: PlayerProp[] = response.data.map((pred, index) => ({
          id: pred.id,
          player: pred.event.split(' vs ')[0] || `Player ${index + 1}`,
          team: pred.league.substring(0, 3).toUpperCase(),
          opponent: pred.event.split(' vs ')[1] || "TBD",
          stat: "Points", // Default for now
          line: 25.5, // Default line - should come from proper API
          overOdds: pred.odds || -110,
          underOdds: -(pred.odds || 110),
          confidence: pred.confidence,
          pickType: null,
          projection: pred.modelProb * 30, // Convert to points
          edge: pred.edge,
          recent_form: [0, 0, 0, 0, 0], // Default - should come from proper API
          season_stats: {
            average: 0, // Default - should come from proper API
            games: 0, // Default - should come from proper API
            hit_rate: 0, // Default - should come from proper API
          },
          matchup_data: {
            defense_rank: 0, // Default - should come from proper API
            pace: 0, // Default - should come from proper API
            total: 0, // Default - should come from proper API
          },
          last_5_games: [0, 0, 0, 0, 0], // Default - should come from proper API
          vs_opponent: [0, 0, 0], // Default - should come from proper API
        }));
        
        setPlayerProps(transformedProps);
        logUserAction("prizepicks_props_loaded", { count: transformedProps.length });
      } else {
        // No fallback data - set empty array and error for production
        setPlayerProps([]);
        setError("No player props data available");
        logger.error("No player props data returned from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch player props";
      setError(errorMessage);
      logger.error("prizepicks_fetch_error", { error: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealthStatus = useCallback(async () => {
    try {
      const response = await api.getSystemHealth();
      if (response.success && response.data) {
        setHealthStatus({
          status: response.data.status,
          accuracy: response.data.accuracy,
          activePredictions: response.data.activePredictions,
          uptime: response.data.uptime,
          lastUpdate: response.data.lastUpdate,
        });
      }
    } catch (err) {
      logger.warn("Failed to fetch health status", err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getUserAnalytics("current-user");
      if (response.success && response.data) {
        // Transform analytics data to stats format
        const analyticsData = response.data as any;
        setStats({
          totalLineups: Object.values(analyticsData.yearly || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0),
          winRate: Number(analyticsData.winRate) || 0,
          profit: Number(analyticsData.profit) || 0,
          avgConfidence: Number(analyticsData.avgConfidence) || 0,
          bestStreak: Number(analyticsData.bestStreak) || 0,
          currentStreak: Number(analyticsData.currentStreak) || 0,
        });
      }
    } catch (err) {
      logger.warn("Failed to fetch stats", err);
    }
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchPlayerProps();
    fetchHealthStatus();
    fetchStats();
  }, [fetchPlayerProps, fetchHealthStatus, fetchStats]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(() => {
        fetchPlayerProps();
        fetchHealthStatus();
      }, refreshInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchPlayerProps, fetchHealthStatus]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handlePickToggle = (prop: PlayerProp, choice: "over" | "under") => {
    // Check if user already has a pick for this player
    const existingPickIndex = selectedPicks.findIndex(
      (pick) => pick.player === prop.player && pick.stat === prop.stat
    );

    if (existingPickIndex !== -1) {
      // Remove existing pick if clicking the same choice, or replace if different
      const existingPick = selectedPicks[existingPickIndex];
      if (existingPick.choice === choice) {
        // Remove the pick
        setSelectedPicks((prev) => prev.filter((_, index) => index !== existingPickIndex));
        return;
      } else {
        // Replace with new choice
        const updatedPick: SelectedPick = {
          ...existingPick,
          choice,
        };
        setSelectedPicks((prev) => 
          prev.map((pick, index) => index === existingPickIndex ? updatedPick : pick)
        );
        return;
      }
    }

    // Check maximum picks limit
    if (selectedPicks.length >= 6) {
      alert("Maximum 6 picks per lineup!");
      return;
    }

    // Add new pick
    const newPick: SelectedPick = {
      propId: prop.id,
      choice,
      player: prop.player,
      stat: prop.stat,
      line: prop.line,
      confidence: prop.confidence,
      pickType: prop.stat,
      projection: prop.projection,
      edge: prop.edge,
    };

    setSelectedPicks((prev) => [...prev, newPick]);
    logUserAction("pick_selected", { 
      player: prop.player, 
      stat: prop.stat, 
      choice, 
      confidence: prop.confidence 
    });
  };

  const getPickChoice = (prop: PlayerProp, choice: "over" | "under"): boolean => {
    return selectedPicks.some(
      (pick) => pick.player === prop.player && pick.stat === prop.stat && pick.choice === choice
    );
  };

  const removePick = (index: number) => {
    const removedPick = selectedPicks[index];
    setSelectedPicks((prev) => prev.filter((_, i) => i !== index));
    logUserAction("pick_removed", { 
      player: removedPick.player, 
      stat: removedPick.stat 
    });
  };

  const handleSubmitLineup = async () => {
    if (selectedPicks.length < 2) {
      alert("You need at least 2 picks to submit a lineup!");
      return;
    }

    // Validate team diversity (at least 2 different teams)
    const teams = new Set(selectedPicks.map(pick => {
      const prop = playerProps.find(p => p.player === pick.player && p.stat === pick.stat);
      return prop?.team || "";
    }));

    if (teams.size < 2) {
      alert("You need picks from at least 2 different teams!");
      return;
    }

    try {
      setIsSubmitting(true);

      const lineup: LineupEntry = {
        picks: selectedPicks,
        entryFee,
        potentialPayout,
        riskLevel,
        strategy: `${selectedPicks.length}-pick ${riskLevel} risk`,
      };

      // Mock submission - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Lineup submitted! Potential payout: $${potentialPayout}`);
      setSelectedPicks([]);
      await fetchStats(); // Refresh stats
      logUserAction("lineup_submitted", { 
        picks: selectedPicks.length, 
        entryFee, 
        potentialPayout 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit lineup";
      alert(`Failed to submit lineup: ${errorMessage}`);
      logger.error("lineup_submit_error", { error: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 85) return "text-green-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBgColor = (confidence: number): string => {
    if (confidence >= 85) return "bg-green-100";
    if (confidence >= 75) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getRiskColor = (risk: "low" | "medium" | "high"): string => {
    switch (risk) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPickButton = (prop: PlayerProp, choice: "over" | "under") => {
    const isSelected = getPickChoice(prop, choice);
    const value = choice === "over" ? prop.overOdds : prop.underOdds;
    const line = prop.line;

    return (
      <button
        onClick={() => handlePickToggle(prop, choice)}
        title={`${choice === "over" ? "Over" : "Under"} ${line} ${prop.stat}`}
        className={`
          flex-1 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
          ${isSelected
            ? choice === "over"
              ? "bg-green-600 text-white border-green-600 shadow-lg"
              : "bg-red-600 text-white border-red-600 shadow-lg"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }
        `}
      >
        <div className="text-center">
          <div className="font-bold">
            {choice === "over" ? "O" : "U"} {line}
          </div>
          <div className="text-xs opacity-80">
            {value > 0 ? `+${value}` : value}
          </div>
        </div>
      </button>
    );
  };

  const renderPropCard = (prop: PlayerProp) => (
    <div
      key={prop.id}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{prop.player}</h3>
            <p className="text-sm text-gray-600">{prop.team} vs {prop.opponent}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceBgColor(prop.confidence)} ${getConfidenceColor(prop.confidence)}`}>
          {prop.confidence}% confidence
        </div>
      </div>

      {/* Stat Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">{prop.stat}</span>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Proj: {prop.projection.toFixed(1)}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          Season Avg: {prop.season_stats.average.toFixed(1)} | Hit Rate: {Math.round(prop.season_stats.hit_rate * 100)}%
        </div>
      </div>

      {/* Pick Buttons */}
      <div className="flex space-x-2 mb-4">
        {renderPickButton(prop, "over")}
        {renderPickButton(prop, "under")}
      </div>

      {/* Advanced Stats */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recent Form:</span>
              <div className="flex space-x-1 mt-1">
                {prop.recent_form.map((value, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs ${
                      value > prop.line ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Edge:</span>
              <div className={`font-semibold ${prop.edge > 0 ? "text-green-600" : "text-red-600"}`}>
                {prop.edge > 0 ? "+" : ""}{prop.edge.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading && playerProps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading PrizePicks Props</h2>
            <p className="text-gray-600">Fetching the latest player props and recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && playerProps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Props</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPlayerProps}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <OfflineIndicator show={healthStatus?.status !== 'healthy'} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrophyIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PrizePicks Pro</h1>
                <p className="text-gray-600">AI-Powered Prop Betting Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Health Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  healthStatus.status === "online" ? "bg-green-500" : "bg-red-500"
                }`} />
                <span className="text-sm text-gray-600">
                  {healthStatus.activePredictions} active props
                </span>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={fetchPlayerProps}
                disabled={loading}
                title="Refresh props data"
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters & Selected Picks */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Win Rate:</span>
                  <span className="font-semibold text-green-600">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className={`font-semibold ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${stats.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lineups:</span>
                  <span className="font-semibold">{stats.totalLineups}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak:</span>
                  <span className="font-semibold">{stats.currentStreak}</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CogIcon className="h-5 w-5 text-blue-600 mr-2" />
                Filters & Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="sport-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Sport
                  </label>
                  <select
                    id="sport-filter"
                    value={filterSport}
                    onChange={(e) => setFilterSport(e.target.value)}
                    title="Filter by sport"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Sports</option>
                    <option value="nba">NBA</option>
                    <option value="nfl">NFL</option>
                    <option value="mlb">MLB</option>
                    <option value="nhl">NHL</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="confidence-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Confidence: {filterConfidence}%
                  </label>
                  <input
                    id="confidence-filter"
                    type="range"
                    min="50"
                    max="95"
                    value={filterConfidence}
                    onChange={(e) => setFilterConfidence(Number(e.target.value))}
                    title={`Minimum confidence: ${filterConfidence}%`}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    title="Sort props by"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="confidence">Confidence</option>
                    <option value="edge">Edge</option>
                    <option value="projection">Projection</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-advanced"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="show-advanced" className="text-sm text-gray-700">
                    Show Advanced Stats
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-refresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="auto-refresh" className="text-sm text-gray-700">
                    Auto Refresh ({refreshInterval}s)
                  </label>
                </div>
              </div>
            </div>

            {/* Selected Picks */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                Selected Picks ({selectedPicks.length}/6)
              </h3>

              {selectedPicks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No picks selected yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedPicks.map((pick, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{pick.player}</div>
                        <div className="text-sm text-gray-600">
                          {pick.choice.toUpperCase()} {pick.line} {pick.stat}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pick.confidence}% confidence
                        </div>
                      </div>
                      <button
                        onClick={() => removePick(index)}
                        title={`Remove ${pick.player} pick`}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Lineup Summary */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entry Fee:</span>
                        <span className="font-medium">${entryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Potential Payout:</span>
                        <span className="font-bold text-green-600">${potentialPayout}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Confidence:</span>
                        <span className={`font-medium ${getConfidenceColor(avgConfidence)}`}>
                          {avgConfidence}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`font-medium ${getRiskColor(riskLevel)}`}>
                          {riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmitLineup}
                      disabled={selectedPicks.length < 2 || isSubmitting}
                      title={selectedPicks.length < 2 ? "Need at least 2 picks" : "Submit lineup"}
                      className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Lineup"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Props List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Player Props ({filteredProps.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {filteredProps.length === 0 ? (
              <div className="text-center py-12">
                <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Props Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more props.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProps.map(renderPropCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizePicksPro;
