/**
 * Production-Ready TheOdds API Service
 * Integrates with backend TheOdds API endpoints
 */

export interface TheOddsSport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface TheOddsEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: TheOddsBookmaker[];
}

export interface TheOddsBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: TheOddsMarket[];
}

export interface TheOddsMarket {
  key: string;
  last_update: string;
  outcomes: TheOddsOutcome[];
}

export interface TheOddsOutcome {
  name: string;
  price: number;
  point?: number;
}

export interface TheOddsScore {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
  last_update: string;
}

export class EnhancedTheOddsService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number = 30000; // 30 seconds for odds data

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
        const errorData = await response.json().catch(() => ({}));

        // Handle graceful degradation responses
        if (response.status === 503 && errorData.suggestion) {
          console.warn("API temporarily unavailable:", errorData.message);
          // Return the fallback data if available
          if (errorData.sports || errorData.odds || errorData.scores) {
            return errorData;
          }
        }

        throw new Error(
          `TheOdds API error: ${response.status} ${response.statusText}`,
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
      console.error("TheOdds API request failed:", error);
      throw error;
    }
  }

  /**
   * Get available sports
   */
  async getSports(): Promise<TheOddsSport[]> {
    const endpoint = "/api/theodds/sports";
    return await this.makeRequest<TheOddsSport[]>(endpoint);
  }

  /**
   * Get odds for a sport
   */
  async getOdds(
    sport: string,
    regions: string = "us",
    markets: string = "h2h",
    oddsFormat: string = "decimal",
  ): Promise<TheOddsEvent[]> {
    const endpoint = `/api/theodds/odds/${sport}`;
    const params = new URLSearchParams({
      regions,
      markets,
      oddsFormat,
    });
    return await this.makeRequest<TheOddsEvent[]>(`${endpoint}?${params}`);
  }

  /**
   * Get odds for a specific event
   */
  async getEventOdds(
    sport: string,
    eventId: string,
    regions: string = "us",
    markets: string = "h2h,spreads,totals",
    oddsFormat: string = "decimal",
  ): Promise<TheOddsEvent> {
    const endpoint = `/api/theodds/odds/${sport}/events/${eventId}`;
    const params = new URLSearchParams({
      regions,
      markets,
      oddsFormat,
    });
    return await this.makeRequest<TheOddsEvent>(`${endpoint}?${params}`);
  }

  /**
   * Get scores for a sport
   */
  async getScores(
    sport: string,
    daysFrom: string = "1",
  ): Promise<TheOddsScore[]> {
    const endpoint = `/api/theodds/scores/${sport}`;
    const params = new URLSearchParams({ daysFrom });
    return await this.makeRequest<TheOddsScore[]>(`${endpoint}?${params}`);
  }

  /**
   * Get live odds for multiple sports
   */
  async getLiveOdds(
    sports: string[] = ["americanfootball_nfl", "basketball_nba"],
  ): Promise<Record<string, TheOddsEvent[]>> {
    const results: Record<string, TheOddsEvent[]> = {};

    for (const sport of sports) {
      try {
        results[sport] = await this.getOdds(sport, "us", "h2h,spreads,totals");
      } catch (error) {
        console.warn(`Failed to fetch odds for ${sport}:`, error);
        results[sport] = [];
      }
    }

    return results;
  }

  /**
   * Find best odds across bookmakers
   */
  async getBestOdds(sport: string): Promise<
    Array<{
      event: string;
      market: string;
      bestOdds: number;
      bookmaker: string;
      team?: string;
    }>
  > {
    try {
      const events = await this.getOdds(sport, "us", "h2h,spreads,totals");
      const bestOdds: Array<any> = [];

      events.forEach((event) => {
        event.bookmakers.forEach((bookmaker) => {
          bookmaker.markets.forEach((market) => {
            market.outcomes.forEach((outcome) => {
              const existing = bestOdds.find(
                (b) =>
                  b.event === `${event.home_team} vs ${event.away_team}` &&
                  b.market === market.key &&
                  b.team === outcome.name,
              );

              if (!existing || outcome.price > existing.bestOdds) {
                if (existing) {
                  const index = bestOdds.indexOf(existing);
                  bestOdds[index] = {
                    event: `${event.home_team} vs ${event.away_team}`,
                    market: market.key,
                    bestOdds: outcome.price,
                    bookmaker: bookmaker.title,
                    team: outcome.name,
                  };
                } else {
                  bestOdds.push({
                    event: `${event.home_team} vs ${event.away_team}`,
                    market: market.key,
                    bestOdds: outcome.price,
                    bookmaker: bookmaker.title,
                    team: outcome.name,
                  });
                }
              }
            });
          });
        });
      });

      return bestOdds;
    } catch (error) {
      console.error("Failed to calculate best odds:", error);
      return [];
    }
  }

  /**
   * Health check for TheOdds API
   */
  async healthCheck(): Promise<{ status: string; message?: string }> {
    try {
      const sports = await this.getSports();
      return {
        status: "healthy",
        message: `Found ${sports.length} available sports`,
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
export const theOddsService = new EnhancedTheOddsService();
