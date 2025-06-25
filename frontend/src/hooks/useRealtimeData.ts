import { useState, useEffect, useCallback } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface Prediction {
  id: string;
  sport: string;
  game: string;
  player?: string;
  market: string;
  prediction: string;
  odds: number;
  confidence: number;
  expectedValue: number;
  timestamp: number;
  status: "active" | "completed" | "cancelled";
}

interface DataSource {
  id: string;
  name: string;
  type: "odds" | "stats" | "news" | "weather" | "social";
  status: "connected" | "disconnected" | "error";
  lastUpdate: number | null;
  quality: number; // 0-1
  reliability: number; // 0-1
}

interface RealTimeDataState {
  predictions: Prediction[];
  dataSources: DataSource[];
  loading: boolean;
  connectionStatus: "connected" | "connecting" | "disconnected" | "error";
  dataQuality: number;
  lastUpdate: Date | null;
  connectedSourcesCount: number;
  totalSourcesCount: number;
  reliability: number;
}

// ============================================================================
// MOCK DATA FOR DEMONSTRATION
// ============================================================================

const mockDataSources: DataSource[] = [
  {
    id: "odds-api-1",
    name: "The Odds API",
    type: "odds",
    status: "connected",
    lastUpdate: Date.now() - 30000,
    quality: 0.95,
    reliability: 0.92,
  },
  {
    id: "espn-api",
    name: "ESPN Stats API",
    type: "stats",
    status: "connected",
    lastUpdate: Date.now() - 45000,
    quality: 0.89,
    reliability: 0.94,
  },
  {
    id: "weather-api",
    name: "Weather API",
    type: "weather",
    status: "connected",
    lastUpdate: Date.now() - 120000,
    quality: 0.87,
    reliability: 0.88,
  },
  {
    id: "social-sentiment",
    name: "Social Sentiment",
    type: "social",
    status: "connected",
    lastUpdate: Date.now() - 60000,
    quality: 0.73,
    reliability: 0.69,
  },
  {
    id: "news-api",
    name: "Sports News API",
    type: "news",
    status: "disconnected",
    lastUpdate: Date.now() - 300000,
    quality: 0.82,
    reliability: 0.79,
  },
];

const mockPredictions: Prediction[] = [
  {
    id: "pred-1",
    sport: "NBA",
    game: "Lakers vs Warriors",
    player: "LeBron James",
    market: "Points",
    prediction: "Over 27.5",
    odds: -110,
    confidence: 0.78,
    expectedValue: 12.5,
    timestamp: Date.now() - 60000,
    status: "active",
  },
  {
    id: "pred-2",
    sport: "NFL",
    game: "Chiefs vs Bills",
    market: "Total Points",
    prediction: "Over 52.5",
    odds: -105,
    confidence: 0.85,
    expectedValue: 18.3,
    timestamp: Date.now() - 120000,
    status: "active",
  },
  {
    id: "pred-3",
    sport: "NBA",
    game: "Celtics vs Heat",
    player: "Jayson Tatum",
    market: "Rebounds",
    prediction: "Under 8.5",
    odds: +115,
    confidence: 0.72,
    expectedValue: 9.8,
    timestamp: Date.now() - 180000,
    status: "active",
  },
];

// ============================================================================
// REAL-TIME DATA HOOK
// ============================================================================

export const useRealTimeData = () => {
  const [state, setState] = useState<RealTimeDataState>({
    predictions: [],
    dataSources: mockDataSources,
    loading: true,
    connectionStatus: "connecting",
    dataQuality: 0,
    lastUpdate: null,
    connectedSourcesCount: 0,
    totalSourcesCount: mockDataSources.length,
    reliability: 0,
  });

  // Initialize data and start real-time updates
  useEffect(() => {
    const initializeData = async () => {
      setState((prev) => ({
        ...prev,
        loading: true,
        connectionStatus: "connecting",
      }));

      // Simulate API connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const connectedSources = mockDataSources.filter(
        (source) => source.status === "connected",
      );
      const avgQuality =
        connectedSources.reduce((sum, source) => sum + source.quality, 0) /
        connectedSources.length;
      const avgReliability =
        connectedSources.reduce((sum, source) => sum + source.reliability, 0) /
        connectedSources.length;

      setState((prev) => ({
        ...prev,
        predictions: mockPredictions,
        loading: false,
        connectionStatus: "connected",
        dataQuality: avgQuality,
        connectedSourcesCount: connectedSources.length,
        reliability: avgReliability,
        lastUpdate: new Date(),
      }));
    };

    initializeData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        // Randomly update some prediction confidences
        const updatedPredictions = prev.predictions.map((pred) => ({
          ...pred,
          confidence: Math.max(
            0.5,
            Math.min(0.95, pred.confidence + (Math.random() - 0.5) * 0.05),
          ),
        }));

        // Update data source statuses occasionally
        const updatedSources = prev.dataSources.map((source) => {
          if (Math.random() < 0.1) {
            // 10% chance to update
            return {
              ...source,
              lastUpdate:
                source.status === "connected" ? Date.now() : source.lastUpdate,
              quality:
                source.status === "connected"
                  ? Math.max(
                      0.6,
                      Math.min(
                        0.98,
                        source.quality + (Math.random() - 0.5) * 0.03,
                      ),
                    )
                  : source.quality,
            };
          }
          return source;
        });

        const connectedSources = updatedSources.filter(
          (source) => source.status === "connected",
        );
        const avgQuality =
          connectedSources.length > 0
            ? connectedSources.reduce(
                (sum, source) => sum + source.quality,
                0,
              ) / connectedSources.length
            : 0;

        return {
          ...prev,
          predictions: updatedPredictions,
          dataSources: updatedSources,
          dataQuality: avgQuality,
          lastUpdate: new Date(),
        };
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState((prev) => ({
      ...prev,
      loading: false,
      lastUpdate: new Date(),
      predictions: mockPredictions.map((pred) => ({
        ...pred,
        confidence: Math.max(0.6, Math.min(0.95, Math.random() * 0.35 + 0.6)),
        timestamp: Date.now(),
      })),
    }));
  }, []);

  // Get all predictions
  const getAllPredictions = useCallback(() => {
    return state.predictions;
  }, [state.predictions]);

  // Get top predictions by confidence
  const getTopPredictions = useCallback(
    (limit: number = 10) => {
      return state.predictions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit);
    },
    [state.predictions],
  );

  // Get predictions by sport
  const getPredictionsBySport = useCallback(
    (sport: string) => {
      return state.predictions.filter(
        (pred) => pred.sport.toLowerCase() === sport.toLowerCase(),
      );
    },
    [state.predictions],
  );

  // Get data source by type
  const getDataSourcesByType = useCallback(
    (type: DataSource["type"]) => {
      return state.dataSources.filter((source) => source.type === type);
    },
    [state.dataSources],
  );

  return {
    // State
    predictions: state.predictions,
    dataSources: state.dataSources,
    loading: state.loading,
    connectionStatus: state.connectionStatus,
    dataQuality: state.dataQuality,
    lastUpdate: state.lastUpdate,
    connectedSourcesCount: state.connectedSourcesCount,
    totalSourcesCount: state.totalSourcesCount,
    reliability: state.reliability,

    // Actions
    refreshData,

    // Computed data
    getAllPredictions,
    getTopPredictions,
    getPredictionsBySport,
    getDataSourcesByType,

    // Derived state
    isConnected: state.connectionStatus === "connected",
    hasRecentData: state.lastUpdate
      ? Date.now() - state.lastUpdate.getTime() < 300000
      : false, // 5 minutes
    healthScore: (state.dataQuality + state.reliability) / 2,
    activePredictionsCount: state.predictions.filter(
      (p) => p.status === "active",
    ).length,
  };
};

export default useRealTimeData;
