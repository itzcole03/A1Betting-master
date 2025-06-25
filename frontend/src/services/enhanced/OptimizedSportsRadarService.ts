/**
 * Optimized SportsRadar Service - Production Ready
 * Leverages all available SportsRadar trial APIs for comprehensive sports data
 * Quota: 1,000 requests per API, 1 QPS limit
 */

interface SportsRadarConfig {
  apiKey: string;
  baseUrl: string;
  quotaLimit: number;
  qpsLimit: number;
  availableAPIs: string[];
}

interface SportsRadarOdds {
  sport: string;
  event_id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    bookmaker: string;
    moneyline_home: number;
    moneyline_away: number;
    spread_home: number;
    spread_away: number;
    spread_line: number;
    total_over: number;
    total_under: number;
    total_line: number;
    last_updated: string;
  }>;
}

interface SportsRadarPlayerProps {
  player_id: string;
  player_name: string;
  position: string;
  team: string;
  props: Array<{
    prop_type: string;
    line: number;
    over_odds: number;
    under_odds: number;
    bookmaker: string;
  }>;
}

export class OptimizedSportsRadarService {
  private readonly config: SportsRadarConfig;
  private readonly cache: Map<string, { data: any; timestamp: number }>;
  private readonly cacheTTL: number = 300000; // 5 minutes to conserve API quota
  private lastRequestTime: number = 0;
  private readonly rateLimitMs: number = 1100; // 1.1 seconds to stay under 1 QPS

  // Available SportsRadar APIs based on trial access
  private readonly apiEndpoints = {
    // Odds Comparison APIs
    odds_comparison_prematch: "/odds-comparison/trial/v2/en/us",
    odds_comparison_player_props:
      "/odds-comparison-player-props/trial/v1/en/us",
    odds_comparison_futures: "/odds-comparison-futures/trial/v1/en/us",
    odds_comparison_regular: "/odds-comparison/trial/v2/en/us",

    // Sports APIs
    nba: "/nba/trial/v8/en",
    nfl: "/nfl/trial/v7/en",
    nhl: "/nhl/trial/v7/en",
    mlb: "/mlb/trial/v7/en",
    wnba: "/wnba/trial/v8/en",
    mma: "/mma/trial/v2/en",
    soccer: "/soccer/trial/v4/en",
    golf: "/golf/trial/v3/en",
    tennis: "/tennis/trial/v3/en",
  };

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_SPORTRADAR_API_KEY || "",
      baseUrl:
        import.meta.env.VITE_SPORTRADAR_API_ENDPOINT ||
        "https://api.sportradar.com",
      quotaLimit: 1000,
      qpsLimit: 1,
      availableAPIs: Object.keys(this.apiEndpoints),
    };
    this.cache = new Map();

    if (this.config.apiKey) {
      console.log(
        "✓ SportsRadar API configured with comprehensive trial access",
      );
      console.log(`✓ Available APIs: ${this.config.availableAPIs.join(", ")}`);
    } else {
      console.warn("⚠ SportsRadar API key not configured");
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitMs - timeSinceLastRequest),
      );
    }
    this.lastRequestTime = Date.now();
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {},
    useCache: boolean = true,
  ): Promise<T> {
    const queryParams = new URLSearchParams({
      api_key: this.config.apiKey,
      ...params,
    });

    const url = `${this.config.baseUrl}${endpoint}?${queryParams}`;
    const cacheKey = url;

    // Check cache first to conserve quota
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
    }

    await this.enforceRateLimit();

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "A1Betting-SportsRadar/1.0",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `SportsRadar API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Cache to conserve quota
      if (useCache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error("SportsRadar API request failed:", error);
      throw error;
    }
  }

  /**
   * Get comprehensive odds from Odds Comparison APIs
   */
  async getOddsComparison(
    sport: string,
    market: string = "prematch",
  ): Promise<SportsRadarOdds[]> {
    try {
      const endpoint =
        market === "player_props"
          ? this.apiEndpoints.odds_comparison_player_props
          : this.apiEndpoints.odds_comparison_prematch;

      const data = await this.makeRequest(
        `${endpoint}/sports/${sport}/events.json`,
      );

      return this.transformOddsData(data, sport);
    } catch (error) {
      console.error("Error fetching odds comparison:", error);
      return [];
    }
  }

  /**
   * Get player props from SportsRadar
   */
  async getPlayerProps(
    sport: string,
    eventId?: string,
  ): Promise<SportsRadarPlayerProps[]> {
    try {
      const endpoint = this.apiEndpoints.odds_comparison_player_props;
      const path = eventId
        ? `${endpoint}/sports/${sport}/events/${eventId}/markets.json`
        : `${endpoint}/sports/${sport}/events.json`;

      const data = await this.makeRequest(path);

      return this.transformPlayerPropsData(data);
    } catch (error) {
      console.error("Error fetching player props:", error);
      return [];
    }
  }

  /**
   * Get NBA data using NBA API
   */
  async getNBAData(
    dataType: "games" | "standings" | "players" = "games",
    date?: string,
  ): Promise<any> {
    try {
      const currentDate = date || new Date().toISOString().split("T")[0];
      let path = "";

      switch (dataType) {
        case "games":
          path = `/games/${currentDate}/schedule.json`;
          break;
        case "standings":
          path = "/standings.json";
          break;
        case "players":
          path = "/players/active.json";
          break;
      }

      return await this.makeRequest(`${this.apiEndpoints.nba}${path}`);
    } catch (error) {
      console.error("Error fetching NBA data:", error);
      return null;
    }
  }

  /**
   * Get NFL data using NFL API
   */
  async getNFLData(
    dataType: "games" | "standings" | "teams" = "games",
    week?: number,
  ): Promise<any> {
    try {
      let path = "";

      switch (dataType) {
        case "games":
          const currentWeek = week || 1;
          path = `/games/2024/REG/${currentWeek}/schedule.json`;
          break;
        case "standings":
          path = "/standings.json";
          break;
        case "teams":
          path = "/teams.json";
          break;
      }

      return await this.makeRequest(`${this.apiEndpoints.nfl}${path}`);
    } catch (error) {
      console.error("Error fetching NFL data:", error);
      return null;
    }
  }

  /**
   * Get multi-sport data efficiently
   */
  async getMultiSportData(sports: string[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    // Process sports in batches to respect rate limits
    for (const sport of sports) {
      try {
        if (this.apiEndpoints[sport as keyof typeof this.apiEndpoints]) {
          results[sport] = await this.getSportData(sport);
        } else {
          console.warn(`Sport ${sport} not available in SportsRadar trial`);
        }
      } catch (error) {
        console.error(`Error fetching ${sport} data:`, error);
        results[sport] = null;
      }
    }

    return results;
  }

  /**
   * Get specific sport data
   */
  private async getSportData(sport: string): Promise<any> {
    const endpoint = this.apiEndpoints[sport as keyof typeof this.apiEndpoints];
    if (!endpoint) return null;

    try {
      // Try to get current games/schedule
      const currentDate = new Date().toISOString().split("T")[0];
      return await this.makeRequest(
        `${endpoint}/games/${currentDate}/schedule.json`,
      );
    } catch (error) {
      // Fallback to league info
      try {
        return await this.makeRequest(`${endpoint}/league/hierarchy.json`);
      } catch (fallbackError) {
        console.error(`Failed to get ${sport} data:`, fallbackError);
        return null;
      }
    }
  }

  /**
   * Transform odds data to unified format
   */
  private transformOddsData(data: any, sport: string): SportsRadarOdds[] {
    if (!data || !data.events) return [];

    return data.events.map((event: any) => ({
      sport,
      event_id: event.id,
      commence_time: event.scheduled,
      home_team:
        event.competitors?.find((c: any) => c.qualifier === "home")?.name ||
        "Unknown",
      away_team:
        event.competitors?.find((c: any) => c.qualifier === "away")?.name ||
        "Unknown",
      bookmakers:
        event.markets?.map((market: any) => ({
          bookmaker: market.books?.[0]?.name || "SportsRadar",
          moneyline_home:
            market.outcomes?.find((o: any) => o.type === "home")?.odds || 0,
          moneyline_away:
            market.outcomes?.find((o: any) => o.type === "away")?.odds || 0,
          spread_home:
            market.outcomes?.find((o: any) => o.type === "home")?.spread_odds ||
            0,
          spread_away:
            market.outcomes?.find((o: any) => o.type === "away")?.spread_odds ||
            0,
          spread_line:
            market.outcomes?.find((o: any) => o.type === "home")?.spread || 0,
          total_over:
            market.outcomes?.find((o: any) => o.type === "over")?.odds || 0,
          total_under:
            market.outcomes?.find((o: any) => o.type === "under")?.odds || 0,
          total_line:
            market.outcomes?.find((o: any) => o.type === "over")?.total || 0,
          last_updated: event.last_updated || new Date().toISOString(),
        })) || [],
    }));
  }

  /**
   * Transform player props data
   */
  private transformPlayerPropsData(data: any): SportsRadarPlayerProps[] {
    if (!data || !data.markets) return [];

    const playerPropsMap = new Map<string, SportsRadarPlayerProps>();

    data.markets.forEach((market: any) => {
      if (market.player) {
        const playerId = market.player.id;

        if (!playerPropsMap.has(playerId)) {
          playerPropsMap.set(playerId, {
            player_id: playerId,
            player_name: market.player.name,
            position: market.player.position || "Unknown",
            team: market.player.team || "Unknown",
            props: [],
          });
        }

        const playerProp = playerPropsMap.get(playerId)!;
        playerProp.props.push({
          prop_type: market.specifier || "Unknown",
          line: market.handicap || 0,
          over_odds:
            market.outcomes?.find((o: any) => o.type === "over")?.odds || 0,
          under_odds:
            market.outcomes?.find((o: any) => o.type === "under")?.odds || 0,
          bookmaker: market.books?.[0]?.name || "SportsRadar",
        });
      }
    });

    return Array.from(playerPropsMap.values());
  }

  /**
   * Get quota usage and remaining requests
   */
  getQuotaUsage(): {
    used_requests: number;
    remaining_requests: number;
    cache_hits: number;
    recommendations: string[];
  } {
    const cacheHits = this.cache.size;
    const estimatedUsedRequests = Math.max(0, cacheHits - 50); // Estimate based on cache
    const remainingRequests = Math.max(
      0,
      this.config.quotaLimit - estimatedUsedRequests,
    );

    const recommendations = [];
    if (remainingRequests < 100) {
      recommendations.push("⚠ Low quota remaining - increase cache usage");
    }
    if (cacheHits < 50) {
      recommendations.push("💡 Consider longer cache TTL to conserve quota");
    }

    return {
      used_requests: estimatedUsedRequests,
      remaining_requests: remainingRequests,
      cache_hits: cacheHits,
      recommendations,
    };
  }

  /**
   * Health check for all available APIs
   */
  async healthCheck(): Promise<{
    overall: string;
    apis: Record<string, { status: string; message: string }>;
    quota: any;
  }> {
    const apiResults: Record<string, { status: string; message: string }> = {};

    // Test core APIs
    const coreAPIs = ["odds_comparison_prematch", "nba", "nfl"];

    for (const api of coreAPIs) {
      try {
        const endpoint =
          this.apiEndpoints[api as keyof typeof this.apiEndpoints];
        await this.makeRequest(`${endpoint}/sports.json`, {}, false);
        apiResults[api] = { status: "healthy", message: "API responsive" };
      } catch (error) {
        apiResults[api] = {
          status: "degraded",
          message: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    const healthyAPIs = Object.values(apiResults).filter(
      (r) => r.status === "healthy",
    ).length;
    const overall = healthyAPIs > 0 ? "healthy" : "degraded";

    return {
      overall,
      apis: apiResults,
      quota: this.getQuotaUsage(),
    };
  }

  /**
   * Clear cache to free memory
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    apis_covered: string[];
    cache_efficiency: number;
  } {
    const apisCovered = Array.from(this.cache.keys())
      .map((key) => key.split("/")[3]) // Extract API name from URL
      .filter((api, index, arr) => arr.indexOf(api) === index);

    return {
      size: this.cache.size,
      apis_covered: apisCovered,
      cache_efficiency: Math.min(
        (this.cache.size / this.config.quotaLimit) * 100,
        100,
      ),
    };
  }
}

// Export singleton instance
export const optimizedSportsRadarService = new OptimizedSportsRadarService();
export default optimizedSportsRadarService;
