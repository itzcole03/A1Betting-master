/**
 * Comprehensive API Service Layer for A1Betting Frontend
 * Provides typed interfaces to all backend endpoints with proper error handling
 */

import axios, { AxiosResponse, AxiosError } from "axios";
import ApiErrorHandler from "./ApiErrorHandler";

// Define base URL based on environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only log requests in development and not for frequent polling
    if (
      import.meta.env.DEV &&
      !config.url?.includes("health") &&
      !config.url?.includes("accuracy")
    ) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Only log successful responses in development and not for frequent polling
    if (
      import.meta.env.DEV &&
      !response.config.url?.includes("health") &&
      !response.config.url?.includes("accuracy")
    ) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Only log non-network errors to reduce console noise
    const isNetworkError =
      error.code === "NETWORK_ERROR" || error.message === "Network Error";

    if (!isNetworkError) {
      console.error("API Response Error:", error);
    }

    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    // Always reject errors - no fallback data
    return Promise.reject(error);
  },
);

// Type definitions for API responses
export interface PredictionRequest {
  event_id: string;
  sport: string;
  features: Record<string, any>;
  target_accuracy?: number;
  optimization_strategy?: string;
  uncertainty_method?: string;
  require_explanations?: boolean;
}

export interface PredictionResponse {
  event_id: string;
  prediction: {
    base_prediction: number;
    quantum_correction: number;
    final_prediction: number;
    confidence_distribution: number[];
    uncertainty_bounds: { lower: number; upper: number };
  };
  quantum_metrics: {
    entanglement_score: number;
    coherence_measure: number;
    quantum_advantage: number;
    fidelity: number;
  };
  accuracy_metrics: {
    target_accuracy: number;
    classical_fallback: boolean;
  };
  processing_metrics: {
    total_processing_time: number;
    feature_engineering_time: number;
    prediction_time: number;
  };
  timestamp: string;
}

export interface ValueBet {
  event: string;
  sport: string;
  commence_time: string;
  bookmaker: string;
  outcome: string;
  odds: number;
  implied_prob: number;
  model_prob: number;
  edge: number;
  kelly_fraction: number;
  rationale: string;
}

export interface ArbitrageOpportunity {
  event: string;
  sport: string;
  commence_time: string;
  legs: Array<{
    bookmaker: string;
    outcome: string;
    odds: number;
  }>;
  profit_percent: number;
  stakes: Record<string, number>;
  guaranteed_profit: number;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  services: Record<string, string>;
  metrics: {
    uptime_seconds: number;
    memory_usage_mb: number;
    cpu_usage_percent: number;
    active_predictions: number;
  };
  version: {
    api: string;
    model: string;
    accuracy_engine: string;
  };
}

export interface AccuracyMetrics {
  overall_accuracy: number;
  directional_accuracy: number;
  profit_correlation: number;
  prediction_confidence: number;
  model_agreement: number;
  uncertainty_quality: number;
  calibration_error: number;
  feature_drift_score: number;
  prediction_latency: number;
  models_active: number;
  predictions_count: number;
  accuracy_trend: number;
  performance_stability: number;
  optimization_score: number;
  timestamp: string;
}

// API Service Class
export class ApiService {
  // Authentication endpoints
  static async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  }

  // Prediction endpoints
  static async getUltraAccuracyPrediction(
    request: PredictionRequest,
  ): Promise<PredictionResponse> {
    const response = await apiClient.post(
      "/api/v4/predict/ultra-accuracy",
      request,
    );
    return response.data;
  }

  static async getPredictionExplanation(predictionId: string): Promise<any> {
    const response = await apiClient.get(`/api/v4/explain/${predictionId}`);
    return response.data;
  }

  // Betting endpoints
  static async getValueBets(): Promise<ValueBet[]> {
    try {
      const response = await apiClient.get("/api/v4/betting/value-bets");
      return response.data.value_bets || [];
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getValueBets", []);
    }
  }

  static async getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    try {
      const response = await apiClient.get("/api/v4/betting/arbitrage");
      return response.data.arbitrage_opportunities || [];
    } catch (error) {
      return ApiErrorHandler.handleError(
        error,
        "getArbitrageOpportunities",
        [],
      );
    }
  }

  static async placeBet(betData: {
    event: string;
    outcome: string;
    bookmaker: string;
    odds: number;
    stake: number;
  }): Promise<any> {
    const response = await apiClient.post("/api/v4/betting/place-bet", betData);
    return response.data;
  }

  // User management endpoints
  static async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v4/user/profile/${userId}`);
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getUserProfile", {
        name: "User",
        email: "user@a1betting.com",
        tier: "Free",
      });
    }
  }

  static async updateUserProfile(
    userId: string,
    profileData: any,
  ): Promise<any> {
    try {
      const response = await apiClient.put(
        `/api/v4/user/profile/${userId}`,
        profileData,
      );
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "updateUserProfile", {
        success: false,
      });
    }
  }

  static async getUserAnalytics(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(
        `/api/v4/user/profit-analytics?user_id=${userId}`,
      );
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getUserAnalytics", {
        current_balance: 0,
        total_profit: 0,
        daily: {},
        yearly: {},
      });
    }
  }

  // Model management endpoints
  static async startModelRetraining(config?: any): Promise<{ job_id: string }> {
    const response = await apiClient.post("/api/v4/model/retrain", config);
    return response.data;
  }

  static async getRetrainingStatus(jobId: string): Promise<any> {
    const response = await apiClient.get(
      `/api/v4/model/retrain/status/${jobId}`,
    );
    return response.data;
  }

  static async rollbackModel(): Promise<any> {
    const response = await apiClient.post("/api/v4/model/rollback");
    return response.data;
  }

  // Data quality endpoints
  static async getDataDriftReport(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/data/drift");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getDataDriftReport", {
        drift_score: 0,
        status: "offline",
      });
    }
  }

  static async getDataQualityReport(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/data/quality");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getDataQualityReport", {
        quality_score: 0,
        status: "offline",
      });
    }
  }

  // Ensemble endpoints
  static async getEnsembleDiversityMetrics(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/ensemble/diversity");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getEnsembleDiversityMetrics", {
        diversity_score: 0,
        models: [],
      });
    }
  }

  static async getEnsembleCandidates(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/ensemble/candidates");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getEnsembleCandidates", {
        candidate_models: [],
      });
    }
  }

  // Monitoring endpoints
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response = await apiClient.get("/health");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getHealthStatus", {
        status: "offline",
        timestamp: new Date().toISOString(),
        services: {},
        metrics: {
          uptime_seconds: 0,
          memory_usage_mb: 0,
          cpu_usage_percent: 0,
          active_predictions: 0,
        },
        version: {
          api: "unknown",
          model: "unknown",
          accuracy_engine: "unknown",
        },
      } as HealthStatus);
    }
  }

  static async getAccuracyMetrics(): Promise<AccuracyMetrics> {
    try {
      const response = await apiClient.get(
        "/api/ultra-accuracy/model-performance",
      );
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getAccuracyMetrics", {
        overall_accuracy: 0,
        directional_accuracy: 0,
        profit_correlation: 0,
        prediction_confidence: 0,
        model_agreement: 0,
        uncertainty_quality: 0,
        calibration_error: 0,
        feature_drift_score: 0,
        prediction_latency: 0,
        models_active: 0,
        predictions_count: 0,
        accuracy_trend: 0,
        performance_stability: 0,
        optimization_score: 0,
        timestamp: new Date().toISOString(),
      } as AccuracyMetrics);
    }
  }

  static async getAccuracyAlerts(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/accuracy/alerts");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getAccuracyAlerts", []);
    }
  }

  static async getSystemResources(): Promise<any> {
    try {
      const response = await apiClient.get("/api/v4/monitoring/resources");
      return response.data;
    } catch (error) {
      return ApiErrorHandler.handleError(error, "getSystemResources", {
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        network_latency: 0,
      });
    }
  }

  // Documentation endpoint
  static async getAggregateDocumentation(): Promise<any> {
    const response = await apiClient.get("/api/v4/docs/aggregate");
    return response.data;
  }

  // Audit endpoints
  static async getPredictionAudit(params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get(
      `/api/v4/audit/predictions?${queryParams}`,
    );
    return response.data;
  }

  // Export betting data
  static async exportBettingData(
    format: "csv" | "json" = "json",
  ): Promise<any> {
    const response = await apiClient.get(
      `/api/v4/betting/export?format=${format}`,
    );
    return response.data;
  }
}

// Export singleton instance
export const api = ApiService;
export default ApiService;
