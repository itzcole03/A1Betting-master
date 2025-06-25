import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Eye,
  BarChart3,
  Activity,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  SortDesc,
  Calendar,
  Map,
  Users,
  Thermometer,
  Wind,
  Trophy,
  Shield,
  Cpu,
  Database,
  Network,
  Gauge,
  LineChart,
  PieChart,
} from "lucide-react";

// Import consolidated systems
import { MegaCard, MegaButton, MegaInput, MegaAlert } from "../mega/MegaUI";
import { useTheme } from "../../providers/SafeThemeProvider";
import {
  usePredictions,
  useEngineMetrics,
  useToast,
  useDebounce,
} from "../../hooks/UniversalHooks";
import { UniversalServiceFactory } from "../../services/UniversalServiceLayer";
import {
  formatters,
  analytics as analyticsUtils,
} from "../../utils/UniversalUtils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EnhancedPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: "nfl" | "nba" | "mlb" | "nhl" | "soccer";
  league: string;
  market: string;
  prediction: string;
  odds: number;
  confidence: number;
  valueEdge: number;
  expectedValue: number;
  status: "upcoming" | "live" | "completed";
  gameTime: string;
  modelPredictions: Array<{
    modelName: string;
    prediction: string;
    confidence: number;
    factors: Array<{ name: string; weight: number }>;
  }>;
  context: {
    weather?: { temperature: number; conditions: string };
    injuries: Array<{ player: string; impact: "high" | "medium" | "low" }>;
    venue: { name: string; capacity: number; homeAdvantage: number };
    market: {
      volume: number;
      liquidity: number;
      efficiency: number;
      movement: "up" | "down" | "stable";
    };
  };
  performance: {
    modelAccuracy: number;
    recentPerformance: number;
    consistencyScore: number;
  };
  reasoning: {
    factors: Array<{ factor: string; impact: number; confidence: number }>;
    keyInsights: string[];
    riskFactors: string[];
  };
}

interface PredictionFilters {
  sport: string;
  market: string;
  riskLevel: string;
  status: string;
  minConfidence: number;
  minEdge: number;
}

// ============================================================================
// THEMED COMPONENTS
// ============================================================================

const ThemedText: React.FC<{
  variant?: "title" | "body" | "caption";
  color?: "primary" | "secondary" | "muted" | "accent";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  variant = "body",
  color = "primary",
  children,
  className = "",
  style = {},
}) => {
  const { theme } = useTheme();

  const variants = {
    title: { fontSize: "18px", fontWeight: "700", lineHeight: "28px" },
    body: { fontSize: "14px", fontWeight: "400", lineHeight: "20px" },
    caption: { fontSize: "12px", fontWeight: "400", lineHeight: "16px" },
  };

  const colors = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    muted: theme.colors.text.muted,
    accent: theme.colors.primary,
  };

  return (
    <div
      className={className}
      style={{
        color: colors[color],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ThemedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
  const { theme } = useTheme();

  return (
    <div
      className={className}
      style={{
        background: theme.colors.surface,
        backdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "12px",
        padding: "24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UniversalPredictions: React.FC = () => {
  // Theme
  const { theme, isDark } = useTheme();

  // State
  const [viewMode, setViewMode] = useState<
    "cards" | "table" | "detailed" | "analytics"
  >("cards");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<PredictionFilters>({
    sport: "all",
    market: "all",
    riskLevel: "all",
    status: "all",
    minConfidence: 0,
    minEdge: 0,
  });

  // Hooks
  const debouncedSearch = useDebounce(searchQuery, 300);
  const toast = useToast();

  // Mock data for demonstration
  const enhancedPredictions: EnhancedPrediction[] = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `pred-${i}`,
        homeTeam: ["Patriots", "Lakers", "Yankees", "Bruins"][i % 4],
        awayTeam: ["Chiefs", "Warriors", "Red Sox", "Rangers"][i % 4],
        sport: ["nfl", "nba", "mlb", "nhl"][i % 4] as any,
        league: ["NFL", "NBA", "MLB", "NHL"][i % 4],
        market: ["Moneyline", "Spread", "Total", "Props"][i % 4],
        prediction: ["Home Win", "Away Win", "Over", "Under"][i % 4],
        odds: 1.5 + Math.random(),
        confidence: 60 + Math.random() * 35,
        valueEdge: Math.random() * 0.15,
        expectedValue: (Math.random() - 0.5) * 100,
        status: ["upcoming", "live", "completed"][i % 3] as any,
        gameTime: new Date(Date.now() + i * 3600000).toISOString(),
        modelPredictions: Array.from({ length: 3 }, (_, j) => ({
          modelName: `Model ${j + 1}`,
          prediction: ["Home", "Away", "Over"][j],
          confidence: 70 + Math.random() * 25,
          factors: [
            { name: "Recent Form", weight: 0.3 },
            { name: "Head to Head", weight: 0.2 },
            { name: "Venue", weight: 0.15 },
          ],
        })),
        context: {
          weather: {
            temperature: 20 + Math.random() * 15,
            conditions: "Clear",
          },
          injuries: [],
          venue: {
            name: "Stadium Name",
            capacity: 50000,
            homeAdvantage: 3 + Math.random() * 7,
          },
          market: {
            volume: 1000000,
            liquidity: 85,
            efficiency: 80,
            movement: "stable" as any,
          },
        },
        performance: {
          modelAccuracy: 75 + Math.random() * 20,
          recentPerformance: 80 + Math.random() * 15,
          consistencyScore: 70 + Math.random() * 25,
        },
        reasoning: {
          factors: [
            { factor: "Home advantage", impact: 0.15, confidence: 0.8 },
            { factor: "Recent form", impact: 0.12, confidence: 0.9 },
          ],
          keyInsights: ["Strong home record", "Favorable matchup"],
          riskFactors: ["Weather conditions", "Key player injury"],
        },
      })),
    [],
  );

  // Filtering logic
  const filteredPredictions = useMemo(() => {
    let filtered = [...enhancedPredictions];

    if (filters.sport !== "all") {
      filtered = filtered.filter((pred) => pred.sport === filters.sport);
    }
    if (filters.market !== "all") {
      filtered = filtered.filter((pred) => pred.market === filters.market);
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((pred) => pred.status === filters.status);
    }

    filtered = filtered.filter(
      (pred) =>
        pred.confidence >= filters.minConfidence &&
        pred.valueEdge >= filters.minEdge,
    );

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (pred) =>
          pred.homeTeam.toLowerCase().includes(query) ||
          pred.awayTeam.toLowerCase().includes(query) ||
          pred.league.toLowerCase().includes(query) ||
          pred.market.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [enhancedPredictions, filters, debouncedSearch]);

  // Render functions
  const renderPredictionCard = (prediction: EnhancedPrediction) => (
    <ThemedContainer key={prediction.id} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <ThemedText variant="body" className="font-semibold">
            {prediction.homeTeam} vs {prediction.awayTeam}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            {prediction.sport.toUpperCase()} • {prediction.league} •{" "}
            {prediction.market}
          </ThemedText>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded text-xs ${
              prediction.status === "live"
                ? "bg-red-500 text-white"
                : prediction.status === "upcoming"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
            }`}
          >
            {prediction.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <ThemedText variant="title" style={{ color: theme.colors.primary }}>
            {prediction.confidence.toFixed(1)}%
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            Confidence
          </ThemedText>
        </div>

        <div className="text-center">
          <ThemedText variant="title" style={{ color: theme.colors.accent }}>
            {formatters.percentage(prediction.valueEdge * 100, 1)}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            Value Edge
          </ThemedText>
        </div>

        <div className="text-center">
          <ThemedText variant="title" style={{ color: theme.colors.primary }}>
            {formatters.odds(prediction.odds)}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            Odds
          </ThemedText>
        </div>

        <div className="text-center">
          <ThemedText variant="title" style={{ color: theme.colors.accent }}>
            {formatters.currency(prediction.expectedValue)}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            Expected Value
          </ThemedText>
        </div>
      </div>

      {/* Action Button */}
      <MegaButton
        variant="primary"
        onClick={() =>
          toast.success(
            `Betting slip updated for ${prediction.homeTeam} vs ${prediction.awayTeam}`,
          )
        }
        className="w-full"
      >
        Add to Bet Slip
      </MegaButton>
    </ThemedContainer>
  );

  return (
    <div
      className="space-y-6 p-6"
      style={{
        background: theme.colors.background,
        color: theme.colors.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <ThemedContainer>
        <div className="flex items-center justify-between">
          <div>
            <ThemedText variant="title" style={{ fontSize: "32px" }}>
              Universal Predictions
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              AI-Enhanced Prediction Engine with Real-Time Intelligence
            </ThemedText>
          </div>

          <div className="flex items-center gap-3">
            <Brain size={20} style={{ color: theme.colors.primary }} />
            <ThemedText variant="body" style={{ color: theme.colors.primary }}>
              {enhancedPredictions.length} Models Active
            </ThemedText>
          </div>
        </div>
      </ThemedContainer>

      {/* Filters */}
      <ThemedContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <ThemedText variant="caption" className="mb-2">
              Sport
            </ThemedText>
            <select
              value={filters.sport}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sport: e.target.value }))
              }
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text.primary,
                borderRadius: "8px",
                padding: "8px 12px",
                width: "100%",
              }}
            >
              <option value="all">All Sports</option>
              <option value="nfl">NFL</option>
              <option value="nba">NBA</option>
              <option value="mlb">MLB</option>
              <option value="nhl">NHL</option>
            </select>
          </div>

          <div>
            <ThemedText variant="caption" className="mb-2">
              Market
            </ThemedText>
            <select
              value={filters.market}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, market: e.target.value }))
              }
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text.primary,
                borderRadius: "8px",
                padding: "8px 12px",
                width: "100%",
              }}
            >
              <option value="all">All Markets</option>
              <option value="Moneyline">Moneyline</option>
              <option value="Spread">Spread</option>
              <option value="Total">Total</option>
              <option value="Props">Props</option>
            </select>
          </div>

          <div>
            <ThemedText variant="caption" className="mb-2">
              Status
            </ThemedText>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text.primary,
                borderRadius: "8px",
                padding: "8px 12px",
                width: "100%",
              }}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <ThemedText variant="caption" className="mb-2">
              View Mode
            </ThemedText>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text.primary,
                borderRadius: "8px",
                padding: "8px 12px",
                width: "100%",
              }}
            >
              <option value="cards">Cards</option>
              <option value="table">Table</option>
              <option value="detailed">Detailed</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <MegaInput
            type="text"
            placeholder="Search teams, leagues, markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Target size={16} />}
          />
        </div>
      </ThemedContainer>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPredictions.map(renderPredictionCard)}
      </div>

      {/* Empty State */}
      {filteredPredictions.length === 0 && (
        <ThemedContainer>
          <div className="text-center py-8">
            <ThemedText variant="body" color="muted">
              No predictions found matching your criteria.
            </ThemedText>
          </div>
        </ThemedContainer>
      )}
    </div>
  );
};

export default UniversalPredictions;
