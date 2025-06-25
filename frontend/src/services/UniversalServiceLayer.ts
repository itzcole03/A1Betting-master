import { QueryClient } from "@tanstack/react-query";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ServiceConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  enableCaching?: boolean;
  enableMocking?: boolean;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface CacheConfig {
  key: string;
  ttl: number; // Time to live in seconds
  staleTime?: number;
  refetchInterval?: number;
}

// Prediction related types
export interface Prediction {
  id: string;
  game: string;
  prediction: number;
  confidence: number;
  timestamp: string;
  potentialWin?: number;
  odds?: number;
  status: "pending" | "won" | "lost" | "void";
}

export interface EngineMetrics {
  totalPredictions: number;
  accuracy: number;
  totalProfit: number;
  winRate: number;
  dataQuality: number;
}

// Betting related types
export interface BetOpportunity {
  id: string;
  sport: string;
  game: string;
  type: string;
  odds: number;
  confidence: number;
  expectedValue: number;
  stake: number;
  potentialReturn: number;
  book: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: string;
  balance: number;
  totalProfit: number;
  accuracy: number;
  winRate: number;
  preferences: Record<string, any>;
}

// ============================================================================
// BASE SERVICE CLASS
// ============================================================================

export class BaseService {
  protected config: ServiceConfig;
  protected queryClient?: QueryClient;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      enableCaching: true,
      enableMocking: import.meta.env.DEV,
      ...config,
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.getAuthHeader(),
          ...this.config.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw error;
    }
  }

  protected async retryRequest<T>(
    requestFn: () => Promise<APIResponse<T>>,
    maxRetries = this.config.retries || 3,
  ): Promise<APIResponse<T>> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        if (i < maxRetries) {
          await this.delay(this.config.retryDelay || 1000);
        }
      }
    }

    throw lastError;
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected getAuthHeader(): string {
    if (typeof window === "undefined") return "";

    const token = localStorage.getItem("auth_token");
    return token ? `Bearer ${token}` : "";
  }

  protected getCacheKey(key: string, params?: Record<string, any>): string {
    if (!params) return key;

    const paramString = Object.keys(params)
      .sort()
      .map((k) => `${k}:${params[k]}`)
      .join("|");

    return `${key}:${paramString}`;
  }
}

// ============================================================================
// PREDICTION SERVICE
// ============================================================================

export class UniversalPredictionService extends BaseService {
  async getRecentPredictions(limit = 10): Promise<APIResponse<Prediction[]>> {
    if (this.config.enableMocking) {
      return this.getMockPredictions(limit);
    }

    return this.retryRequest(() =>
      this.request<Prediction[]>(`/predictions/recent?limit=${limit}`),
    );
  }

  async getEngineMetrics(): Promise<APIResponse<EngineMetrics>> {
    if (this.config.enableMocking) {
      return this.getMockMetrics();
    }

    return this.retryRequest(() =>
      this.request<EngineMetrics>("/predictions/metrics"),
    );
  }

  async createPrediction(
    data: Partial<Prediction>,
  ): Promise<APIResponse<Prediction>> {
    return this.retryRequest(() =>
      this.request<Prediction>("/predictions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  }

  async updatePrediction(
    id: string,
    data: Partial<Prediction>,
  ): Promise<APIResponse<Prediction>> {
    return this.retryRequest(() =>
      this.request<Prediction>(`/predictions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    );
  }

  private async getMockPredictions(
    limit: number,
  ): Promise<APIResponse<Prediction[]>> {
    await this.delay(500); // Simulate network delay

    const mockPredictions: Prediction[] = Array.from(
      { length: limit },
      (_, i) => ({
        id: `pred_${i + 1}`,
        game: `Game ${i + 1}`,
        prediction: Math.random() * 100,
        confidence: 75 + Math.random() * 25,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        potentialWin: 100 + Math.random() * 500,
        odds:
          Math.random() > 0.5
            ? Math.floor(Math.random() * 200) + 100
            : -(Math.floor(Math.random() * 200) + 100),
        status: ["pending", "won", "lost"][
          Math.floor(Math.random() * 3)
        ] as any,
      }),
    );

    return {
      data: mockPredictions,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  private async getMockMetrics(): Promise<APIResponse<EngineMetrics>> {
    await this.delay(300);

    return {
      data: {
        totalPredictions: 1247,
        accuracy: 89.3,
        totalProfit: 47230,
        winRate: 85.6,
        dataQuality: 94.2,
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// BETTING SERVICE
// ============================================================================

export class UniversalBettingService extends BaseService {
  async getOpportunities(): Promise<APIResponse<BetOpportunity[]>> {
    if (this.config.enableMocking) {
      return this.getMockOpportunities();
    }

    return this.retryRequest(() =>
      this.request<BetOpportunity[]>("/betting/opportunities"),
    );
  }

  async placeBet(
    opportunity: Partial<BetOpportunity>,
  ): Promise<APIResponse<{ betId: string }>> {
    return this.retryRequest(() =>
      this.request<{ betId: string }>("/betting/place", {
        method: "POST",
        body: JSON.stringify(opportunity),
      }),
    );
  }

  async getBetHistory(userId: string): Promise<APIResponse<BetOpportunity[]>> {
    return this.retryRequest(() =>
      this.request<BetOpportunity[]>(`/betting/history/${userId}`),
    );
  }

  private async getMockOpportunities(): Promise<APIResponse<BetOpportunity[]>> {
    await this.delay(400);

    const mockOpportunities: BetOpportunity[] = Array.from(
      { length: 5 },
      (_, i) => ({
        id: `opp_${i + 1}`,
        sport: ["NFL", "NBA", "MLB", "NHL"][Math.floor(Math.random() * 4)],
        game: `Team A vs Team B ${i + 1}`,
        type: ["spread", "total", "moneyline"][Math.floor(Math.random() * 3)],
        odds:
          Math.random() > 0.5
            ? Math.floor(Math.random() * 200) + 100
            : -(Math.floor(Math.random() * 200) + 100),
        confidence: 70 + Math.random() * 30,
        expectedValue: Math.random() * 0.2,
        stake: 100,
        potentialReturn: 150 + Math.random() * 300,
        book: ["DraftKings", "FanDuel", "BetMGM"][
          Math.floor(Math.random() * 3)
        ],
      }),
    );

    return {
      data: mockOpportunities,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// USER SERVICE
// ============================================================================

export class UniversalUserService extends BaseService {
  async getProfile(): Promise<APIResponse<UserProfile>> {
    if (this.config.enableMocking) {
      return this.getMockProfile();
    }

    return this.retryRequest(() => this.request<UserProfile>("/user/profile"));
  }

  async updateProfile(
    data: Partial<UserProfile>,
  ): Promise<APIResponse<UserProfile>> {
    return this.retryRequest(() =>
      this.request<UserProfile>("/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    );
  }

  async updatePreferences(
    preferences: Record<string, any>,
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.retryRequest(() =>
      this.request<{ success: boolean }>("/user/preferences", {
        method: "PUT",
        body: JSON.stringify({ preferences }),
      }),
    );
  }

  private async getMockProfile(): Promise<APIResponse<UserProfile>> {
    await this.delay(300);

    return {
      data: {
        id: "user_1",
        name: "Alex Chen",
        email: "alex@example.com",
        tier: "Pro",
        balance: 127430.5,
        totalProfit: 47230,
        accuracy: 89.3,
        winRate: 85.6,
        preferences: {
          notifications: true,
          autobet: false,
          riskLevel: "medium",
        },
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export class UniversalAnalyticsService extends BaseService {
  async getPerformanceMetrics(timeRange = "7d"): Promise<APIResponse<any>> {
    return this.retryRequest(() =>
      this.request<any>(`/analytics/performance?range=${timeRange}`),
    );
  }

  async getMLInsights(): Promise<APIResponse<any>> {
    return this.retryRequest(() => this.request<any>("/analytics/ml-insights"));
  }

  async getMarketAnalysis(): Promise<APIResponse<any>> {
    return this.retryRequest(() => this.request<any>("/analytics/market"));
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export class UniversalServiceFactory {
  private static instances: Map<string, BaseService> = new Map();
  private static config: ServiceConfig = {};

  static configure(config: ServiceConfig) {
    this.config = { ...this.config, ...config };
  }

  static getPredictionService(): UniversalPredictionService {
    if (!this.instances.has("prediction")) {
      this.instances.set(
        "prediction",
        new UniversalPredictionService(this.config),
      );
    }
    return this.instances.get("prediction") as UniversalPredictionService;
  }

  static getBettingService(): UniversalBettingService {
    if (!this.instances.has("betting")) {
      this.instances.set("betting", new UniversalBettingService(this.config));
    }
    return this.instances.get("betting") as UniversalBettingService;
  }

  static getUserService(): UniversalUserService {
    if (!this.instances.has("user")) {
      this.instances.set("user", new UniversalUserService(this.config));
    }
    return this.instances.get("user") as UniversalUserService;
  }

  static getAnalyticsService(): UniversalAnalyticsService {
    if (!this.instances.has("analytics")) {
      this.instances.set(
        "analytics",
        new UniversalAnalyticsService(this.config),
      );
    }
    return this.instances.get("analytics") as UniversalAnalyticsService;
  }

  static clearInstances() {
    this.instances.clear();
  }
}

// ============================================================================
// REACT QUERY INTEGRATION
// ============================================================================

export const createQueryKeys = {
  predictions: {
    all: ["predictions"] as const,
    recent: (limit?: number) => ["predictions", "recent", limit] as const,
    metrics: () => ["predictions", "metrics"] as const,
  },
  betting: {
    all: ["betting"] as const,
    opportunities: () => ["betting", "opportunities"] as const,
    history: (userId: string) => ["betting", "history", userId] as const,
  },
  user: {
    all: ["user"] as const,
    profile: () => ["user", "profile"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    performance: (range: string) =>
      ["analytics", "performance", range] as const,
    insights: () => ["analytics", "ml-insights"] as const,
    market: () => ["analytics", "market"] as const,
  },
};

// Default query configurations
export const defaultQueryConfig = {
  staleTime: 30000, // 30 seconds
  cacheTime: 300000, // 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default UniversalServiceFactory;

// Export individual services for direct use
export {
  UniversalPredictionService,
  UniversalBettingService,
  UniversalUserService,
  UniversalAnalyticsService,
};

// Export types
export type {
  APIResponse,
  ServiceConfig,
  CacheConfig,
  Prediction,
  EngineMetrics,
  BetOpportunity,
  UserProfile,
};
