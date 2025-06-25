/**
 * PrizePicks Projections Service
 * Free API integration for real player projections and daily fantasy data
 * No API key required - public endpoint
 */

interface PrizePicksProjection {
  id: string;
  type: string;
  attributes: {
    stat_type: string;
    line_score: number;
    under_odds: number;
    over_odds: number;
    status: string;
    start_time: string;
    description: string;
    market_id: string;
  };
  relationships: {
    league: {
      data: {
        id: string;
        type: string;
      };
    };
    new_player: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

interface PrizePicksPlayer {
  id: string;
  type: string;
  attributes: {
    name: string;
    position: string;
    team: string;
    slug: string;
    image_url?: string;
  };
}

interface PrizePicksLeague {
  id: string;
  type: string;
  attributes: {
    name: string;
    slug: string;
    image_url?: string;
    sport: string;
  };
}

interface ProcessedProjection {
  player_name: string;
  player_id: string;
  position: string;
  team: string;
  league: string;
  sport: string;
  stat_type: string;
  line: number;
  over_odds: number;
  under_odds: number;
  start_time: string;
  status: string;
  value_score: number;
  projection_confidence: number;
}

export class PrizePicksProjectionsService {
  private readonly baseUrl: string = "https://api.prizepicks.com";
  private readonly cache: Map<string, { data: any; timestamp: number }>;
  private readonly cacheTTL: number = 300000; // 5 minutes for projections
  private lastRequestTime: number = 0;
  private readonly rateLimitMs: number = 1000; // 1 second between requests

  constructor() {
    this.cache = new Map();
    console.log("✓ PrizePicks Projections Service initialized (free API)");
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
    useCache: boolean = true,
  ): Promise<T> {
    const cacheKey = endpoint;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
    }

    await this.enforceRateLimit();

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "A1Betting-PrizePicks/1.0",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `PrizePicks API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Cache the response
      if (useCache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error("PrizePicks API request failed:", error);
      throw error;
    }
  }

  /**
   * Get all current projections from PrizePicks
   */
  async getProjections(): Promise<{
    projections: ProcessedProjection[];
    leagues: PrizePicksLeague[];
    players: PrizePicksPlayer[];
    raw_count: number;
    processed_count: number;
  }> {
    try {
      const data = await this.makeRequest("/projections");

      if (!data || !data.data) {
        throw new Error("Invalid response from PrizePicks API");
      }

      const projections: PrizePicksProjection[] = data.data.filter(
        (item: any) => item.type === "projection",
      );
      const players: PrizePicksPlayer[] =
        data.included?.filter((item: any) => item.type === "new_player") || [];
      const leagues: PrizePicksLeague[] =
        data.included?.filter((item: any) => item.type === "league") || [];

      // Create lookup maps for efficient processing
      const playerMap = new Map<string, PrizePicksPlayer>();
      players.forEach((player) => playerMap.set(player.id, player));

      const leagueMap = new Map<string, PrizePicksLeague>();
      leagues.forEach((league) => leagueMap.set(league.id, league));

      // Process projections
      const processedProjections = projections.map((projection) => {
        const player = playerMap.get(
          projection.relationships.new_player.data.id,
        );
        const league = leagueMap.get(projection.relationships.league.data.id);

        const valueScore = this.calculateValueScore(
          projection.attributes.line_score,
          projection.attributes.over_odds,
          projection.attributes.under_odds,
        );

        const confidence = this.calculateProjectionConfidence(
          projection.attributes.stat_type,
          projection.attributes.status,
          league?.attributes.sport || "unknown",
        );

        return {
          player_name: player?.attributes.name || "Unknown",
          player_id: player?.id || "unknown",
          position: player?.attributes.position || "Unknown",
          team: player?.attributes.team || "Unknown",
          league: league?.attributes.name || "Unknown",
          sport: league?.attributes.sport || "Unknown",
          stat_type: projection.attributes.stat_type,
          line: projection.attributes.line_score,
          over_odds: projection.attributes.over_odds,
          under_odds: projection.attributes.under_odds,
          start_time: projection.attributes.start_time,
          status: projection.attributes.status,
          value_score: valueScore,
          projection_confidence: confidence,
        };
      });

      return {
        projections: processedProjections,
        leagues,
        players,
        raw_count: projections.length,
        processed_count: processedProjections.length,
      };
    } catch (error) {
      console.error("Error fetching PrizePicks projections:", error);
      return {
        projections: [],
        leagues: [],
        players: [],
        raw_count: 0,
        processed_count: 0,
      };
    }
  }

  /**
   * Get projections filtered by sport
   */
  async getProjectionsBySport(sport: string): Promise<ProcessedProjection[]> {
    try {
      const data = await this.getProjections();

      const sportFilter = sport.toLowerCase();
      return data.projections.filter(
        (projection) =>
          projection.sport.toLowerCase().includes(sportFilter) ||
          projection.league.toLowerCase().includes(sportFilter),
      );
    } catch (error) {
      console.error(`Error fetching ${sport} projections:`, error);
      return [];
    }
  }

  /**
   * Get projections for specific stat types
   */
  async getProjectionsByStatType(
    statTypes: string[],
  ): Promise<ProcessedProjection[]> {
    try {
      const data = await this.getProjections();

      return data.projections.filter((projection) =>
        statTypes.some((statType) =>
          projection.stat_type.toLowerCase().includes(statType.toLowerCase()),
        ),
      );
    } catch (error) {
      console.error("Error fetching projections by stat type:", error);
      return [];
    }
  }

  /**
   * Get high-value projections based on value score
   */
  async getHighValueProjections(
    minValueScore: number = 0.6,
  ): Promise<ProcessedProjection[]> {
    try {
      const data = await this.getProjections();

      return data.projections
        .filter((projection) => projection.value_score >= minValueScore)
        .sort((a, b) => b.value_score - a.value_score);
    } catch (error) {
      console.error("Error fetching high-value projections:", error);
      return [];
    }
  }

  /**
   * Get projections for NBA
   */
  async getNBAProjections(): Promise<ProcessedProjection[]> {
    return this.getProjectionsBySport("nba");
  }

  /**
   * Get projections for NFL
   */
  async getNFLProjections(): Promise<ProcessedProjection[]> {
    return this.getProjectionsBySport("nfl");
  }

  /**
   * Get projections for MLB
   */
  async getMLBProjections(): Promise<ProcessedProjection[]> {
    return this.getProjectionsBySport("mlb");
  }

  /**
   * Get player prop alternatives for DFS optimization
   */
  async getPlayerPropAlternatives(
    playerName: string,
  ): Promise<ProcessedProjection[]> {
    try {
      const data = await this.getProjections();

      return data.projections.filter((projection) =>
        projection.player_name.toLowerCase().includes(playerName.toLowerCase()),
      );
    } catch (error) {
      console.error(`Error fetching props for ${playerName}:`, error);
      return [];
    }
  }

  /**
   * Calculate value score for a projection
   */
  private calculateValueScore(
    line: number,
    overOdds: number,
    underOdds: number,
  ): number {
    // Convert odds to implied probability
    const overImplied = Math.abs(overOdds) / (Math.abs(overOdds) + 100);
    const underImplied = Math.abs(underOdds) / (Math.abs(underOdds) + 100);

    // Calculate market efficiency (lower is better for value)
    const totalImplied = overImplied + underImplied;
    const marketEfficiency = Math.max(0, 1 - totalImplied);

    // Factor in line size relative to sport averages
    const lineValue = this.normalizeLineValue(line);

    // Combine factors for overall value score
    return Math.min(1, marketEfficiency * 0.6 + lineValue * 0.4);
  }

  /**
   * Calculate projection confidence based on various factors
   */
  private calculateProjectionConfidence(
    statType: string,
    status: string,
    sport: string,
  ): number {
    let confidence = 0.75; // Base confidence

    // Adjust based on stat type reliability
    const reliableStats = [
      "points",
      "rebounds",
      "assists",
      "yards",
      "receptions",
    ];
    if (reliableStats.some((stat) => statType.toLowerCase().includes(stat))) {
      confidence += 0.1;
    }

    // Adjust based on status
    if (status === "active") {
      confidence += 0.1;
    } else if (status === "pending") {
      confidence -= 0.05;
    }

    // Adjust based on sport (some sports have more predictable stats)
    if (sport === "NBA") {
      confidence += 0.05; // Higher scoring, more predictable
    } else if (sport === "NFL") {
      confidence -= 0.05; // More variance
    }

    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Normalize line value for comparison across different stat types
   */
  private normalizeLineValue(line: number): number {
    // Simple normalization - could be improved with sport-specific logic
    if (line <= 0) return 0;
    if (line >= 100) return 0.3; // Very high lines are typically harder to predict
    if (line >= 50) return 0.5;
    if (line >= 20) return 0.7;
    return 0.9; // Lower lines typically have more historical data
  }

  /**
   * Get market comparison data
   */
  async getMarketComparison(): Promise<{
    sport_breakdown: Record<string, number>;
    stat_type_breakdown: Record<string, number>;
    avg_over_odds: number;
    avg_under_odds: number;
    total_markets: number;
  }> {
    try {
      const data = await this.getProjections();

      const sportBreakdown: Record<string, number> = {};
      const statTypeBreakdown: Record<string, number> = {};
      let totalOverOdds = 0;
      let totalUnderOdds = 0;

      data.projections.forEach((projection) => {
        // Sport breakdown
        sportBreakdown[projection.sport] =
          (sportBreakdown[projection.sport] || 0) + 1;

        // Stat type breakdown
        statTypeBreakdown[projection.stat_type] =
          (statTypeBreakdown[projection.stat_type] || 0) + 1;

        // Odds accumulation
        totalOverOdds += projection.over_odds;
        totalUnderOdds += projection.under_odds;
      });

      return {
        sport_breakdown: sportBreakdown,
        stat_type_breakdown: statTypeBreakdown,
        avg_over_odds:
          data.projections.length > 0
            ? totalOverOdds / data.projections.length
            : 0,
        avg_under_odds:
          data.projections.length > 0
            ? totalUnderOdds / data.projections.length
            : 0,
        total_markets: data.projections.length,
      };
    } catch (error) {
      console.error("Error generating market comparison:", error);
      return {
        sport_breakdown: {},
        stat_type_breakdown: {},
        avg_over_odds: 0,
        avg_under_odds: 0,
        total_markets: 0,
      };
    }
  }

  /**
   * Health check for PrizePicks API
   */
  async healthCheck(): Promise<{
    status: string;
    response_time: number;
    projections_available: number;
    sports_covered: string[];
    last_updated: string;
  }> {
    const startTime = Date.now();

    try {
      const data = await this.getProjections();
      const responseTime = Date.now() - startTime;

      const sportsSet = new Set(data.projections.map((p) => p.sport));

      return {
        status: data.projections.length > 0 ? "healthy" : "degraded",
        response_time: responseTime,
        projections_available: data.projections.length,
        sports_covered: Array.from(sportsSet),
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "offline",
        response_time: Date.now() - startTime,
        projections_available: 0,
        sports_covered: [],
        last_updated: new Date().toISOString(),
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
  getCacheStats(): { size: number; hit_rate: number; data_freshness: number } {
    const now = Date.now();
    const freshDataCount = Array.from(this.cache.values()).filter(
      (item) => now - item.timestamp < this.cacheTTL,
    ).length;

    return {
      size: this.cache.size,
      hit_rate: this.cache.size > 0 ? freshDataCount / this.cache.size : 0,
      data_freshness:
        this.cache.size > 0 ? (freshDataCount / this.cache.size) * 100 : 100,
    };
  }
}

// Export singleton instance
export const prizePicksProjectionsService = new PrizePicksProjectionsService();
export default prizePicksProjectionsService;
