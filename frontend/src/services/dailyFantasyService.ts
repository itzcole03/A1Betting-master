/**
 * Production-Ready DailyFantasy Service
 * Integrates with backend DailyFantasy API endpoints
 */

export interface DailyFantasyPlayer {
  id: string;
  name: string;
  position: string;
  team: string;
  salary: number;
  projectedPoints: number;
  averagePoints: number;
  isInjured: boolean;
}

export interface DailyFantasyContest {
  id: string;
  name: string;
  sport: string;
  entryFee: number;
  totalPrizes: number;
  maxEntries: number;
  startTime: string;
  salaryCap: number;
}

export interface DailyFantasyLineup {
  lineup: DailyFantasyPlayer[];
  projectedPoints: number;
  totalSalary: number;
  confidence: number;
}

export interface DailyFantasyProjection {
  playerId: string;
  projectedPoints: number;
  projectedStats: Record<string, number>;
  confidence: number;
  lastUpdated: string;
}

class EnhancedDailyFantasyService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number = 300000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    this.cache = new Map();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `DailyFantasy API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("DailyFantasy API request failed:", error);
      throw error;
    }
  }

  /**
   * Get contests by sport
   */
  async getContests(sport: string): Promise<DailyFantasyContest[]> {
    const endpoint = `/api/dailyfantasy/contests/${sport}`;
    return await this.makeRequest<DailyFantasyContest[]>(endpoint);
  }

  /**
   * Get players for a specific contest
   */
  async getPlayers(contestId: string): Promise<DailyFantasyPlayer[]> {
    const endpoint = `/api/dailyfantasy/contests/${contestId}/players`;
    return await this.makeRequest<DailyFantasyPlayer[]>(endpoint);
  }

  /**
   * Get player projections
   */
  async getPlayerProjections(
    playerId: string,
  ): Promise<DailyFantasyProjection> {
    const endpoint = `/api/dailyfantasy/players/${playerId}/projections`;
    return await this.makeRequest<DailyFantasyProjection>(endpoint);
  }

  /**
   * Generate optimal lineup
   */
  async getOptimalLineup(
    contestId: string,
    strategy: string = "balanced",
    budget?: number,
    constraints?: Record<string, any>,
  ): Promise<DailyFantasyLineup> {
    const endpoint = "/api/dailyfantasy/lineups/optimize";
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify({
        contestId,
        strategy,
        budget,
        constraints,
      }),
    };
    return await this.makeRequest<DailyFantasyLineup>(endpoint, options);
  }

  /**
   * Health check for DailyFantasy API
   */
  async healthCheck(): Promise<{ status: string; message?: string }> {
    try {
      const contests = await this.getContests("nba");
      return {
        status: "healthy",
        message: `Found ${contests.length} NBA contests`,
      };
    } catch (error) {
      return {
        status: "degraded",
        message: (error as Error).message,
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; totalRequests: number } {
    return {
      size: this.cache.size,
      totalRequests: this.cache.size,
    };
  }
}

// Export singleton instance
export const dailyFantasyService = new EnhancedDailyFantasyService();
