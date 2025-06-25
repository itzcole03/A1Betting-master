// Temporary fix for API endpoint
import { apiClient } from "./api";

export const fixedApiEndpoints = {
  getAccuracyMetrics: async () => {
    try {
      const response = await apiClient.get(
        "/api/ultra-accuracy/model-performance",
      );
      return response.data;
    } catch (error) {
      return {
        overall_accuracy: 0,
        recent_accuracy: 0,
        model_metrics: {
          precision: 0,
          recall: 0,
          f1_score: 0,
          auc_roc: 0,
        },
      };
    }
  },
};
