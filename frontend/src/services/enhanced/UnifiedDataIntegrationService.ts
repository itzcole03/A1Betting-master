/**
 * Unified Data Integration Service
 * Orchestrates data from multiple real providers:
 * - DailyFantasy: DraftKings, SportsDataIO, FairPlay
 * - Odds: The-Odds-API, OddsJam, SportsDataIO
 * - Sportsbooks: DraftKings, FanDuel, BetMGM, Caesars
 */

import { enhancedDailyFantasyService } from "./DailyFantasyService";
import { enhancedTheOddsService } from "./TheOddsService";
import { sportsbookDataService } from "./SportsbookDataService";
import { optimizedSportsRadarService } from "./OptimizedSportsRadarService";
import { autonomousSportsbookService } from "./AutonomousSportsbookService";
import { prizePicksProjectionsService } from "./PrizePicksProjectionsService";

interface UnifiedSportsData {
  sport: string;
  league?: string;
  events: Array<{
    event_id: string;
    home_team: string;
    away_team: string;
    commence_time: string;
    odds: {
      moneyline_home: number;
      moneyline_away: number;
      spread_line: number;
      total_line: number;
      best_sportsbook: string;
    };
    dfs_data?: {
      contests: number;
      avg_entry_fee: number;
      top_players: Array<{
        name: string;
        position: string;
        salary: number;
        projected_points: number;
      }>;
    };
    arbitrage_opportunities?: Array<{
      type: string;
      profit_margin: number;
    }>;
  }>;
  sources: {
    odds_providers: string[];
    dfs_providers: string[];
    sportsbooks: string[];
  };
  last_updated: string;
}

interface DataSourceHealth {
  provider: string;
  status: "healthy" | "degraded" | "offline";
  response_time: number;
  last_updated: string;
  availability_percentage: number;
}

interface IntegrationMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  cache_hit_rate: number;
  uptime_percentage: number;
  data_freshness_score: number;
}

export class UnifiedDataIntegrationService {
  private readonly cache: Map<string, { data: any; timestamp: number }>;
  private readonly cacheTTL: number = 60000; // 1 minute for unified data
  private readonly healthCheckInterval: number = 300000; // 5 minutes

  private healthStatus: Map<string, DataSourceHealth> = new Map();
  private metrics: IntegrationMetrics = {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    average_response_time: 0,
    cache_hit_rate: 0,
    uptime_percentage: 100,
    data_freshness_score: 100,
  };

  constructor() {
    this.cache = new Map();
    this.startHealthMonitoring();
  }

  /**
   * Get unified sports data combining all providers
   */
  async getUnifiedSportsData(
    sport: string,
    league?: string,
  ): Promise<UnifiedSportsData> {
    const startTime = Date.now();
    this.metrics.total_requests++;

    try {
      const cacheKey = `unified_${sport}_${league || "all"}`;

      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        this.metrics.cache_hit_rate =
          this.metrics.cache_hit_rate * 0.9 + 0.1 * 1;
        return cached.data;
      }

      // Fetch data from all sources in parallel - prioritizing configured APIs
      const [theOddsData, sportsRadarData, dfsData, autonomousSportsbookData] =
        await Promise.allSettled([
          enhancedTheOddsService.getAggregatedOdds(sport),
          optimizedSportsRadarService.getOddsComparison(sport),
          enhancedDailyFantasyService.getComprehensiveDFSData(sport),
          autonomousSportsbookService.getAllAutonomousOdds(sport),
        ]);

      // Process and merge the data
      const unifiedData = await this.mergeDataSources(
        sport,
        league,
        theOddsData,
        sportsRadarData,
        dfsData,
        autonomousSportsbookData,
      );

      // Cache the result
      this.cache.set(cacheKey, {
        data: unifiedData,
        timestamp: Date.now(),
      });

      this.metrics.successful_requests++;
      this.metrics.average_response_time =
        this.metrics.average_response_time * 0.9 +
        0.1 * (Date.now() - startTime);
      this.metrics.cache_hit_rate = this.metrics.cache_hit_rate * 0.9 + 0.1 * 0;

      return unifiedData;
    } catch (error) {
      this.metrics.failed_requests++;
      console.error("Unified data integration error:", error);

      // Return fallback data
      return this.getFallbackData(sport, league);
    }
  }

  /**
   * Merge data from multiple sources with optimized API usage
   */
  private async mergeDataSources(
    sport: string,
    league: string | undefined,
    theOddsResult: PromiseSettledResult<any>,
    sportsRadarResult: PromiseSettledResult<any>,
    dfsResult: PromiseSettledResult<any>,
    autonomousResult: PromiseSettledResult<any>,
  ): Promise<UnifiedSportsData> {
    const sources = {
      odds_providers: [] as string[],
      dfs_providers: [] as string[],
      sportsbooks: [] as string[],
    };

    const events: any[] = [];

    // Process The-Odds-API data (Primary)
    let theOddsEvents: any[] = [];
    if (theOddsResult.status === "fulfilled" && theOddsResult.value) {
      theOddsEvents = theOddsResult.value;
      sources.odds_providers.push("The-Odds-API");
    }

    // Process SportsRadar data (Primary)
    let sportsRadarEvents: any[] = [];
    if (sportsRadarResult.status === "fulfilled" && sportsRadarResult.value) {
      sportsRadarEvents = sportsRadarResult.value;
      sources.odds_providers.push("SportsRadar");
    }

    // Process DFS data
    let dfsData: any = null;
    if (dfsResult.status === "fulfilled" && dfsResult.value) {
      dfsData = dfsResult.value;
      sources.dfs_providers = dfsData.sources
        ? Object.values(dfsData.sources)
        : ["DraftKings", "SportsDataIO"];
    }

    // Process autonomous sportsbook data
    let autonomousEvents: any[] = [];
    if (autonomousResult.status === "fulfilled" && autonomousResult.value) {
      autonomousEvents = autonomousResult.value;
      sources.sportsbooks.push("DraftKings", "FanDuel", "BetMGM", "Caesars");
    }

    // Merge events data
    const eventMap = new Map<string, any>();

    // Add The-Odds-API events (Priority)
    for (const event of theOddsEvents) {
      const key = `${event.home_team}_vs_${event.away_team}`;
      eventMap.set(key, {
        event_id: event.event_id || event.id,
        home_team: event.home_team,
        away_team: event.away_team,
        commence_time: event.commence_time,
        odds: {
          moneyline_home: event.best_odds?.home_ml?.odds || 0,
          moneyline_away: event.best_odds?.away_ml?.odds || 0,
          spread_line: event.best_odds?.home_spread?.line || 0,
          total_line: event.best_odds?.over?.line || 0,
          best_sportsbook:
            event.best_odds?.home_ml?.sportsbook || "The-Odds-API",
        },
      });
    }

    // Add SportsRadar events
    for (const event of sportsRadarEvents) {
      const key = `${event.home_team}_vs_${event.away_team}`;
      if (!eventMap.has(key)) {
        eventMap.set(key, {
          event_id: event.event_id,
          home_team: event.home_team,
          away_team: event.away_team,
          commence_time: event.commence_time,
          odds: {
            moneyline_home: event.bookmakers?.[0]?.moneyline_home || 0,
            moneyline_away: event.bookmakers?.[0]?.moneyline_away || 0,
            spread_line: event.bookmakers?.[0]?.spread_line || 0,
            total_line: event.bookmakers?.[0]?.total_line || 0,
            best_sportsbook: "SportsRadar",
          },
        });
      }
    }

    // Add autonomous sportsbook data
    for (const event of autonomousEvents) {
      const key = `${event.event}_autonomous`;
      if (!eventMap.has(key.replace("_autonomous", ""))) {
        eventMap.set(key.replace("_autonomous", ""), {
          event_id: `autonomous_${event.event.replace(" ", "_")}`,
          home_team: event.event.split(" vs ")[0] || "Home",
          away_team: event.event.split(" vs ")[1] || "Away",
          commence_time: event.last_updated,
          odds: {
            moneyline_home: event.odds.moneyline_home || 0,
            moneyline_away: event.odds.moneyline_away || 0,
            spread_line: event.odds.spread_line || 0,
            total_line: event.odds.total_line || 0,
            best_sportsbook: event.sportsbook,
          },
        });
      }
    }

    // Add DFS data to events
    if (dfsData && dfsData.contests) {
      const dfsInfo = {
        contests: dfsData.contests.length,
        avg_entry_fee:
          dfsData.contests.reduce(
            (sum: number, c: any) => sum + c.entry_fee,
            0,
          ) / dfsData.contests.length,
        top_players:
          dfsData.players?.slice(0, 5).map((p: any) => ({
            name: p.name,
            position: p.position,
            salary: p.salary,
            projected_points: p.projected_fantasy_points || p.projectedPoints,
          })) || [],
      };

      // Add DFS data to all events
      eventMap.forEach((event) => {
        event.dfs_data = dfsInfo;
      });
    }

    // Get arbitrage opportunities
    try {
      const arbitrageOpps =
        await sportsbookDataService.getArbitrageOpportunities(sport);

      // Match arbitrage opportunities to events
      eventMap.forEach((event) => {
        const matchingArb = arbitrageOpps.find(
          (arb) =>
            arb.event.includes(event.home_team) &&
            arb.event.includes(event.away_team),
        );

        if (matchingArb) {
          event.arbitrage_opportunities = [
            {
              type: "Moneyline",
              profit_margin: matchingArb.profit_margin,
            },
          ];
        }
      });
    } catch (error) {
      console.warn("Failed to get arbitrage opportunities:", error);
    }

    return {
      sport,
      league,
      events: Array.from(eventMap.values()),
      sources,
      last_updated: new Date().toISOString(),
    };
  }

  /**
   * Get fallback data when all providers fail
   */
  private getFallbackData(sport: string, league?: string): UnifiedSportsData {
    return {
      sport,
      league,
      events: [
        {
          event_id: "fallback_1",
          home_team: "Lakers",
          away_team: "Warriors",
          commence_time: new Date(Date.now() + 3600000).toISOString(),
          odds: {
            moneyline_home: -110,
            moneyline_away: +105,
            spread_line: -3.5,
            total_line: 225.5,
            best_sportsbook: "Mock Data",
          },
          dfs_data: {
            contests: 2,
            avg_entry_fee: 25,
            top_players: [
              {
                name: "LeBron James",
                position: "SF",
                salary: 11500,
                projected_points: 58.2,
              },
              {
                name: "Stephen Curry",
                position: "PG",
                salary: 10800,
                projected_points: 54.7,
              },
            ],
          },
        },
      ],
      sources: {
        odds_providers: ["Fallback"],
        dfs_providers: ["Fallback"],
        sportsbooks: ["Fallback"],
      },
      last_updated: new Date().toISOString(),
    };
  }

  /**
   * Get real-time arbitrage opportunities across all providers
   */
  async getArbitrageOpportunities(sport: string): Promise<
    Array<{
      event: string;
      opportunity_type: string;
      profit_margin: number;
      required_capital: number;
      bets: Array<{
        sportsbook: string;
        market: string;
        odds: number;
        stake: number;
        potential_return: number;
      }>;
      confidence_score: number;
      time_sensitivity: "high" | "medium" | "low";
    }>
  > {
    try {
      const [theOddsArb, sportsbookArb] = await Promise.allSettled([
        enhancedTheOddsService.findArbitrageOpportunities(sport),
        sportsbookDataService.getArbitrageOpportunities(sport),
      ]);

      const opportunities: any[] = [];

      // Process The-Odds-API arbitrage
      if (theOddsArb.status === "fulfilled") {
        for (const arb of theOddsArb.value) {
          opportunities.push({
            event: arb.event,
            opportunity_type: arb.type,
            profit_margin: arb.profit_margin,
            required_capital: arb.total_stake,
            bets: arb.bets.map((bet: any) => ({
              sportsbook: bet.sportsbook,
              market: bet.outcome,
              odds: bet.odds,
              stake: bet.stake,
              potential_return: bet.stake * bet.odds,
            })),
            confidence_score: Math.min(arb.profit_margin * 10, 100),
            time_sensitivity:
              arb.profit_margin > 3
                ? "high"
                : arb.profit_margin > 1
                  ? "medium"
                  : "low",
          });
        }
      }

      // Process sportsbook arbitrage
      if (sportsbookArb.status === "fulfilled") {
        for (const arb of sportsbookArb.value) {
          // Avoid duplicates
          const exists = opportunities.find(
            (opp) =>
              opp.event === arb.event && opp.opportunity_type === "Moneyline",
          );

          if (!exists) {
            opportunities.push({
              event: arb.event,
              opportunity_type: "Moneyline",
              profit_margin: arb.profit_margin,
              required_capital: arb.total_stake,
              bets: arb.bets.map((bet: any) => ({
                sportsbook: bet.sportsbook,
                market: bet.market,
                odds: bet.odds,
                stake: bet.stake,
                potential_return: bet.stake * bet.odds,
              })),
              confidence_score: Math.min(arb.profit_margin * 10, 100),
              time_sensitivity:
                arb.profit_margin > 3
                  ? "high"
                  : arb.profit_margin > 1
                    ? "medium"
                    : "low",
            });
          }
        }
      }

      // Sort by profit margin
      return opportunities.sort((a, b) => b.profit_margin - a.profit_margin);
    } catch (error) {
      console.error("Error getting arbitrage opportunities:", error);
      return [];
    }
  }

  /**
   * Get optimal DFS lineups with real-time data
   */
  async getOptimalDFSLineups(
    sport: string,
    strategy: "cash" | "gpp" | "balanced" = "balanced",
    site: "draftkings" | "fanduel" = "draftkings",
  ): Promise<{
    lineup: Array<{
      player: string;
      position: string;
      salary: number;
      projected_points: number;
      ownership_projection: number;
      value_score: number;
    }>;
    total_salary: number;
    projected_points: number;
    optimization_score: number;
    confidence: number;
    stack_info?: {
      primary_stack: string;
      correlation_bonus: number;
    };
    meta: {
      generated_at: string;
      strategy_used: string;
      data_sources: string[];
    };
  }> {
    try {
      const [dfsData, optimalLineup] = await Promise.allSettled([
        enhancedDailyFantasyService.getComprehensiveDFSData(sport),
        enhancedDailyFantasyService.getOptimalLineup(
          sport,
          50000,
          site,
          strategy,
        ),
      ]);

      let lineup: any[] = [];
      let totalSalary = 0;
      let projectedPoints = 0;
      let optimizationScore = 0;
      let stackInfo;

      if (optimalLineup.status === "fulfilled" && optimalLineup.value) {
        const optimal = optimalLineup.value;
        lineup = optimal.players.map((player: any) => ({
          player: player.name,
          position: player.position,
          salary: player.salary,
          projected_points: player.projectedPoints,
          ownership_projection: Math.random() * 30, // Mock ownership
          value_score: (player.projectedPoints / player.salary) * 1000,
        }));
        totalSalary = optimal.totalSalary;
        projectedPoints = optimal.projectedPoints;
        optimizationScore = optimal.optimization_score;
        stackInfo = optimal.stack_info;
      } else if (dfsData.status === "fulfilled" && dfsData.value?.players) {
        // Fallback to simple optimization
        const players = dfsData.value.players.slice(0, 8); // Typical lineup size
        lineup = players.map((player: any) => ({
          player: player.name,
          position: player.position,
          salary: player.salary,
          projected_points:
            player.projected_fantasy_points || player.projectedPoints,
          ownership_projection: Math.random() * 30,
          value_score:
            ((player.projected_fantasy_points || player.projectedPoints) /
              player.salary) *
            1000,
        }));
        totalSalary = players.reduce(
          (sum: number, p: any) => sum + p.salary,
          0,
        );
        projectedPoints = players.reduce(
          (sum: number, p: any) =>
            sum + (p.projected_fantasy_points || p.projectedPoints),
          0,
        );
        optimizationScore = 0.85;
      }

      return {
        lineup,
        total_salary: totalSalary,
        projected_points: projectedPoints,
        optimization_score: optimizationScore,
        confidence: optimizationScore * 100,
        stack_info: stackInfo,
        meta: {
          generated_at: new Date().toISOString(),
          strategy_used: strategy,
          data_sources:
            dfsData.status === "fulfilled"
              ? Object.values(dfsData.value?.sources || {})
              : ["Fallback"],
        },
      };
    } catch (error) {
      console.error("Error generating optimal lineup:", error);
      throw error;
    }
  }

  /**
   * Start health monitoring for all providers
   */
  private startHealthMonitoring(): void {
    setInterval(async () => {
      await this.updateHealthStatus();
    }, this.healthCheckInterval);

    // Initial health check
    this.updateHealthStatus();
  }

  /**
   * Update health status for all providers
   */
  private async updateHealthStatus(): Promise<void> {
    const providers = [
      { name: "TheOdds-API", service: enhancedTheOddsService },
      { name: "SportsRadar", service: optimizedSportsRadarService },
      { name: "PrizePicks-Free", service: prizePicksProjectionsService },
      { name: "DailyFantasy", service: enhancedDailyFantasyService },
      { name: "AutonomousSportsbooks", service: autonomousSportsbookService },
    ];

    for (const provider of providers) {
      const startTime = Date.now();

      try {
        const health = await provider.service.healthCheck();
        const responseTime = Date.now() - startTime;

        this.healthStatus.set(provider.name, {
          provider: provider.name,
          status: health.overall === "healthy" ? "healthy" : "degraded",
          response_time: responseTime,
          last_updated: new Date().toISOString(),
          availability_percentage: this.calculateAvailability(provider.name),
        });
      } catch (error) {
        this.healthStatus.set(provider.name, {
          provider: provider.name,
          status: "offline",
          response_time: Date.now() - startTime,
          last_updated: new Date().toISOString(),
          availability_percentage: this.calculateAvailability(
            provider.name,
            false,
          ),
        });
      }
    }

    this.updateMetrics();
  }

  /**
   * Calculate availability percentage for a provider
   */
  private calculateAvailability(
    provider: string,
    isHealthy: boolean = true,
  ): number {
    const current = this.healthStatus.get(provider);
    if (!current) return isHealthy ? 100 : 0;

    // Simple moving average
    return current.availability_percentage * 0.9 + (isHealthy ? 10 : 0);
  }

  /**
   * Update overall metrics
   */
  private updateMetrics(): void {
    const healthyProviders = Array.from(this.healthStatus.values()).filter(
      (h) => h.status === "healthy",
    ).length;

    const totalProviders = this.healthStatus.size;
    this.metrics.uptime_percentage =
      totalProviders > 0 ? (healthyProviders / totalProviders) * 100 : 100;

    // Calculate data freshness score based on cache usage and update frequency
    const cacheAge =
      Date.now() -
      Math.max(...Array.from(this.cache.values()).map((c) => c.timestamp));

    this.metrics.data_freshness_score = Math.max(0, 100 - cacheAge / 60000); // Decrease by age in minutes
  }

  /**
   * Get comprehensive health status
   */
  getHealthStatus(): {
    overall_status: string;
    providers: DataSourceHealth[];
    metrics: IntegrationMetrics;
    recommendations: string[];
  } {
    const providers = Array.from(this.healthStatus.values());
    const healthyCount = providers.filter((p) => p.status === "healthy").length;

    let overallStatus = "offline";
    if (healthyCount === providers.length) {
      overallStatus = "healthy";
    } else if (healthyCount > 0) {
      overallStatus = "degraded";
    }

    const recommendations: string[] = [];

    if (this.metrics.cache_hit_rate < 0.7) {
      recommendations.push(
        "Consider increasing cache TTL for better performance",
      );
    }

    if (this.metrics.uptime_percentage < 90) {
      recommendations.push(
        "Multiple providers experiencing issues - check API keys and network connectivity",
      );
    }

    if (this.metrics.data_freshness_score < 70) {
      recommendations.push(
        "Data is getting stale - consider reducing cache TTL or increasing update frequency",
      );
    }

    return {
      overall_status: overallStatus,
      providers,
      metrics: this.metrics,
      recommendations,
    };
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.cache.clear();
    enhancedDailyFantasyService.clearCache();
    enhancedTheOddsService.clearCache();
    sportsbookDataService.clearCache();
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.clearAllCaches();
    sportsbookDataService.cleanup();
  }
}

// Export singleton instance
export const unifiedDataIntegrationService =
  new UnifiedDataIntegrationService();
export default unifiedDataIntegrationService;
