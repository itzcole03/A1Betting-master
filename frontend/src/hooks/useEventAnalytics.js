import { useState, useEffect } from "react";
import { UnifiedServiceRegistry } from "../services/unified/UnifiedServiceRegistry";

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
