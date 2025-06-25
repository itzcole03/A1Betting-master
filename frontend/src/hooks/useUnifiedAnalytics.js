import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UnifiedServiceRegistry } from "../services/unified/UnifiedServiceRegistry";
import { webSocketManager } from "../services/unified/WebSocketManager";
export const useUnifiedAnalytics = (config = {}) => {
  const [state, setState] = useState({
    ml: { data: null, loading: false, error: null },
    performance: { data: null, loading: false, error: null },
    drift: { data: null, loading: false, error: null },
    betting: { data: null, loading: false, error: null },
    realtime: { data: null, loading: false, error: null },
  });
  const serviceRegistry = UnifiedServiceRegistry.getInstance();
  const analyticsService = serviceRegistry.getService("analytics");
  // Use 'as any' to bypass BaseService constraint for errorService
  const errorService = serviceRegistry.getService("error");
  // --- ML Analytics (using getModelPerformance as a proxy for ML analytics) ---
  const mlQuery = useQuery({
    queryKey: ["mlAnalytics"],
    queryFn: async () => {
      if (!analyticsService) throw { message: "Analytics service unavailable" };
      try {
        const result = await analyticsService.getModelPerformance("", "", "");
        setState((prev) => ({
          ...prev,
          ml: {
            data: result
              ? {
                  predictions: [],
                  probabilities: [],
                  metrics: result,
                  insights: { featureImportance: {}, shap: {}, lime: {} },
                }
              : null,
            loading: false,
            error: null,
          },
        }));
        return result
          ? [
              {
                model: "default",
                metrics: result,
                timestamp: new Date().toISOString(),
              },
            ]
          : null;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch ML analytics";
        if (errorService)
          errorService.handleError(new Error(errorMessage), {
            code: "ML_ANALYTICS_ERROR",
            source: "useUnifiedAnalytics",
            details: { context: "mlAnalytics" },
          });
        setState((prev) => ({
          ...prev,
          ml: { data: null, loading: false, error: errorMessage },
        }));
        throw {
          message: errorMessage,
          code: "ML_ANALYTICS_ERROR",
          context: "mlAnalytics",
        };
      }
    },
    enabled: !!config.ml,
    refetchInterval: config.ml?.autoUpdate ? config.ml.updateInterval : false,
  });
  // --- Performance Metrics ---
  const performanceQuery = useQuery({
    queryKey: ["performanceMetrics"],
    queryFn: async () => {
      if (!analyticsService) throw { message: "Analytics service unavailable" };
      try {
        const result = await analyticsService.getPerformanceMetrics("week");
        setState((prev) => ({
          ...prev,
          performance: {
            data: result
              ? [
                  {
                    model: "default",
                    metrics: result,
                    timestamp: new Date().toISOString(),
                  },
                ]
              : null,
            loading: false,
            error: null,
          },
        }));
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch performance metrics";
        if (errorService)
          errorService.handleError(new Error(errorMessage), {
            code: "PERFORMANCE_METRICS_ERROR",
            source: "useUnifiedAnalytics",
            details: { context: "performanceMetrics" },
          });
        setState((prev) => ({
          ...prev,
          performance: { data: null, loading: false, error: errorMessage },
        }));
        throw {
          message: errorMessage,
          code: "PERFORMANCE_METRICS_ERROR",
          context: "performanceMetrics",
        };
      }
    },
    enabled: !!config.performance,
  });
  // --- Drift Detection (not implemented in service, placeholder) ---
  const driftQuery = useQuery({
    queryKey: ["driftDetection"],
    queryFn: async () => {
      setState((prev) => ({
        ...prev,
        drift: { data: null, loading: false, error: null },
      }));
      return null;
    },
    enabled: !!config.drift,
  });
  // --- Betting Analytics (using getBettingStats as a proxy) ---
  const bettingQuery = useQuery({
    queryKey: ["bettingAnalytics"],
    queryFn: async () => {
      if (!analyticsService) throw { message: "Analytics service unavailable" };
      try {
        const result = await analyticsService.getBettingStats("", "", "");
        setState((prev) => ({
          ...prev,
          betting: {
            data: result
              ? {
                  roi: 0, // Not available in result
                  winRate: result.winRate ?? 0,
                  profitLoss: result.profitLoss ?? 0,
                  riskMetrics: { var: 0, sharpe: 0, sortino: 0 },
                  confidence: 0,
                }
              : null,
            loading: false,
            error: null,
          },
        }));
        return result
          ? {
              roi: 0, // Not available in result
              winRate: result.winRate ?? 0,
              profitLoss: result.profitLoss ?? 0,
              riskMetrics: { var: 0, sharpe: 0, sortino: 0 },
              confidence: 0,
            }
          : null;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch betting analytics";
        if (errorService)
          errorService.handleError(new Error(errorMessage), {
            code: "BETTING_ANALYTICS_ERROR",
            source: "useUnifiedAnalytics",
            details: { context: "bettingAnalytics" },
          });
        setState((prev) => ({
          ...prev,
          betting: { data: null, loading: false, error: errorMessage },
        }));
        throw {
          message: errorMessage,
          code: "BETTING_ANALYTICS_ERROR",
          context: "bettingAnalytics",
        };
      }
    },
    enabled: !!config.betting,
  });
  // --- Realtime Metrics (not implemented in service, placeholder) ---
  const realtimeQuery = useQuery({
    queryKey: ["realtimeMetrics"],
    queryFn: async () => {
      setState((prev) => ({
        ...prev,
        realtime: { data: null, loading: false, error: null },
      }));
      return null;
    },
    enabled: !!config.realtime,
  });
  // --- WebSocket Updates ---
  /**
   * Subscribes to analytics WebSocket events via the unified webSocketManager.
   * Updates state in response to real-time analytics events.
   */
  useEffect(() => {
    function handleAnalyticsEvent(data) {
      switch (data.type) {
        case "ml":
          setState((prev) => ({
            ...prev,
            ml: { data: data.payload, loading: false, error: null },
          }));
          break;
        case "performance":
          setState((prev) => ({
            ...prev,
            performance: { data: data.payload, loading: false, error: null },
          }));
          break;
        case "drift":
          setState((prev) => ({
            ...prev,
            drift: { data: data.payload, loading: false, error: null },
          }));
          break;
        case "betting":
          setState((prev) => ({
            ...prev,
            betting: { data: data.payload, loading: false, error: null },
          }));
          break;
        case "realtime":
          setState((prev) => ({
            ...prev,
            realtime: { data: data.payload, loading: false, error: null },
          }));
          break;
        default:
          console.warn?.("Unknown analytics WebSocket type", data.type);
      }
    }
    webSocketManager.on("analytics", handleAnalyticsEvent);
    return () => {
      webSocketManager.off("analytics", handleAnalyticsEvent);
    };
  }, []);
  // --- Memoized return values ---
  const ml = useMemo(
    () => ({
      data: state.ml.data,
      loading: state.ml.loading,
      error: state.ml.error,
      refetch: mlQuery.refetch,
    }),
    [state.ml, mlQuery.refetch],
  );
  const performance = useMemo(
    () => ({
      data: state.performance.data,
      loading: state.performance.loading,
      error: state.performance.error,
      refetch: performanceQuery.refetch,
    }),
    [state.performance, performanceQuery.refetch],
  );
  const drift = useMemo(
    () => ({
      data: state.drift.data,
      loading: state.drift.loading,
      error: state.drift.error,
      refetch: driftQuery.refetch,
    }),
    [state.drift, driftQuery.refetch],
  );
  const betting = useMemo(
    () => ({
      data: state.betting.data,
      loading: state.betting.loading,
      error: state.betting.error,
      refetch: bettingQuery.refetch,
    }),
    [state.betting, bettingQuery.refetch],
  );
  const realtime = useMemo(
    () => ({
      data: state.realtime.data,
      loading: state.realtime.loading,
      error: state.realtime.error,
      refetch: realtimeQuery.refetch,
    }),
    [state.realtime, realtimeQuery.refetch],
  );
  // TODO: Add more granular loading/error states if needed
  // TODO: Add ARIA live region support for analytics-driven UI updates
  // TODO: Add more comprehensive test coverage for analytics hook
  return {
    ml,
    performance,
    drift,
    betting,
    realtime,
    isLoading:
      state.ml.loading ||
      state.performance.loading ||
      state.drift.loading ||
      state.betting.loading ||
      state.realtime.loading,
    error:
      state.ml.error ||
      state.performance.error ||
      state.drift.error ||
      state.betting.error ||
      state.realtime.error,
  };
};

// Event-specific analytics hook
export const useEventAnalytics = (eventId, marketId, selectionId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    metrics: {},
    trendDelta: {},
    riskProfile: {},
    explainabilityMap: {},
    modelMetadata: {},
  });

  const serviceRegistry = UnifiedServiceRegistry.getInstance();
  const analyticsService = serviceRegistry.getService("analytics");

  useEffect(() => {
    if (!eventId || !marketId || !selectionId) return;

    const fetchEventAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using available analytics service methods
        const [performanceMetrics, bettingStats] = await Promise.all([
          analyticsService?.getPerformanceMetrics("day").catch(() => ({})),
          analyticsService
            ?.getBettingStats(eventId, marketId, selectionId)
            .catch(() => ({})),
        ]);

        setData({
          metrics: {
            accuracy: performanceMetrics?.accuracy || 0,
            precision: performanceMetrics?.precision || 0,
            recall: performanceMetrics?.recall || 0,
            winRate: bettingStats?.winRate || 0,
            profitLoss: bettingStats?.profitLoss || 0,
          },
          trendDelta: {
            accuracy: performanceMetrics?.accuracyTrend || 0,
            winRate: bettingStats?.winRateTrend || 0,
          },
          riskProfile: {
            level: "medium",
            score: 0.5,
            factors: [],
          },
          explainabilityMap: {
            features: {},
            importance: {},
          },
          modelMetadata: {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            confidence: 0.8,
          },
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch event analytics";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAnalytics();
  }, [eventId, marketId, selectionId, analyticsService]);

  // Helper functions for UI styling
  const getMetricColor = (metric, value) => {
    if (typeof value !== "number") return "gray";
    if (value >= 0.7) return "green";
    if (value >= 0.5) return "yellow";
    return "red";
  };

  const getTrendIcon = (delta) => {
    if (typeof delta !== "number") return "➡️";
    if (delta > 0) return "📈";
    if (delta < 0) return "📉";
    return "➡️";
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "low":
        return "green";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  return {
    metrics: data.metrics,
    trendDelta: data.trendDelta,
    riskProfile: data.riskProfile,
    explainabilityMap: data.explainabilityMap,
    modelMetadata: data.modelMetadata,
    isLoading: loading,
    error: error,
    getMetricColor,
    getTrendIcon,
    getRiskLevelColor,
  };
};

// END useUnifiedAnalytics
