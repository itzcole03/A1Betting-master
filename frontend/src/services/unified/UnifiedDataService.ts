/**
 * Unified Data Service
 * Consolidates all data fetching and ensures consistent sport filtering across components
 */

import { logger, logApiCall, logError } from "@/utils/logger";
import { productionApiService, api } from "@/services/api/ProductionApiService";
import { filterSportData, normalizeSportFilter } from "@/utils/sportFiltering";
import { UNIFIED_SPORTS, getSportConfig } from "@/constants/unifiedSports";

// Unified data interfaces
export interface UnifiedBettingOpportunity {
  id: string;
  sport: string;
  game: string;
  event: string;
  market: string;
  betType: string;
  line: number;
  odds: number;
  bookmaker: string;
  expectedValue: number;
  confidence: number;
  edge: number;
  stake?: number;
  potentialProfit?: number;
  riskLevel: "low" | "medium" | "high";
  category: "value" | "arbitrage" | "sure-bet";
  expires: string;
  timestamp: number;
}

export interface UnifiedPlayerProp {
  id: string;
  player: string;
  team: string;
  position: string;
  stat: string;
  line: number;
  overOdds: number;
  underOdds: number;
  gameTime: string;
  opponent: string;
  sport: string;
  confidence: number;
  projection: number;
  edge: number;
  pickType: "normal" | "demon" | "goblin";
  reasoning: string;
  lastGameStats: number[];
  seasonAvg: number;
  recentForm: "hot" | "cold" | "neutral";
  injuryStatus: "healthy" | "questionable" | "probable";
  weatherImpact?: number;
  homeAwayFactor: number;
  timestamp: number;
}

export interface UnifiedDataFilters {
  sport?: string;
  minConfidence?: number;
  maxResults?: number;
  includeExpired?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UnifiedApiResponse<T> {
  success: boolean;
  data?: T[];
  count?: number;
  filters?: UnifiedDataFilters;
  error?: string;
  timestamp: number;
  cached?: boolean;
}

class UnifiedDataService {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private isValidCacheEntry(entry: {
    timestamp: number;
    ttl: number;
  }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private setCache(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && this.isValidCacheEntry(entry)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Fetch betting opportunities with unified filtering
   */
  async getBettingOpportunities(
    filters: UnifiedDataFilters = {},
  ): Promise<UnifiedApiResponse<UnifiedBettingOpportunity>> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey("betting-opportunities", filters);

    // Check cache first
    const cached =
      this.getFromCache<UnifiedApiResponse<UnifiedBettingOpportunity>>(
        cacheKey,
      );
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      logApiCall("getBettingOpportunities", { filters });

      // Normalize sport filter
      const normalizedSport = filters.sport
        ? normalizeSportFilter(filters.sport)
        : UNIFIED_SPORTS.ALL;

      const response = await api.getBettingOpportunities({
        sport: normalizedSport,
        minEdge: 2.0,
        maxResults: filters.maxResults || 50,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch betting opportunities",
        );
      }

      // Transform API data to unified format
      let opportunities: UnifiedBettingOpportunity[] = response.data.map(
        (opp: any) => ({
          id: opp.id || `bet_${Date.now()}_${Math.random()}`,
          sport: opp.sport || "unknown",
          game: opp.event || opp.game || "Unknown Game",
          event: opp.event || opp.game || "Unknown Event",
          market: opp.market || "Unknown Market",
          betType: opp.market || opp.betType || "Unknown Bet",
          line: opp.line || opp.odds || 0,
          odds: opp.odds || -110,
          bookmaker: opp.bookmaker || "DraftKings",
          expectedValue: (opp.expectedValue || opp.edge || 0) * 100,
          confidence: opp.confidence || 75,
          edge: (opp.expectedValue || opp.edge || 0) * 100,
          stake: 0,
          potentialProfit: 0,
          riskLevel: opp.riskLevel || "medium",
          category: opp.category || "value",
          expires:
            opp.expires ||
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timestamp: Date.now(),
        }),
      );

      // Apply unified sport filtering
      if (filters.sport && filters.sport !== UNIFIED_SPORTS.ALL) {
        opportunities = filterSportData(opportunities, filters.sport, {
          useCommonMappings: true,
          allowPartialMatch: true,
          caseSensitive: false,
        });
      }

      // Apply confidence filter
      if (filters.minConfidence) {
        opportunities = opportunities.filter(
          (opp) => opp.confidence >= filters.minConfidence!,
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        opportunities.sort((a, b) => {
          const aVal = (a as any)[filters.sortBy!] || 0;
          const bVal = (b as any)[filters.sortBy!] || 0;
          const direction = filters.sortOrder === "asc" ? 1 : -1;
          return (bVal - aVal) * direction;
        });
      }

      // Apply result limit
      if (filters.maxResults) {
        opportunities = opportunities.slice(0, filters.maxResults);
      }

      const result: UnifiedApiResponse<UnifiedBettingOpportunity> = {
        success: true,
        data: opportunities,
        count: opportunities.length,
        filters,
        timestamp: Date.now(),
      };

      // Cache the result
      this.setCache(cacheKey, result);

      logger.info("Successfully fetched unified betting opportunities", {
        count: opportunities.length,
        duration: Date.now() - startTime,
        filters,
      });

      return result;
    } catch (error) {
      logError(error as Error, "UnifiedDataService.getBettingOpportunities");

      return {
        success: false,
        data: [],
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Fetch player props with unified filtering
   */
  async getPlayerProps(
    filters: UnifiedDataFilters = {},
  ): Promise<UnifiedApiResponse<UnifiedPlayerProp>> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey("player-props", filters);

    // Check cache first
    const cached =
      this.getFromCache<UnifiedApiResponse<UnifiedPlayerProp>>(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      logApiCall("getPlayerProps", { filters });

      // Normalize sport filter
      const normalizedSport = filters.sport
        ? normalizeSportFilter(filters.sport)
        : UNIFIED_SPORTS.ALL;

      const response = await api.getPrizePicksProps({
        sport: normalizedSport,
        minConfidence: filters.minConfidence || 70,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch player props");
      }

      // Transform API data to unified format
      let props: UnifiedPlayerProp[] = response.data.map((prop: any) => ({
        id: prop.id || `prop_${Date.now()}_${Math.random()}`,
        player: prop.player || "Unknown Player",
        team: prop.team || "Unknown Team",
        position: prop.position || "Unknown",
        stat: prop.stat || "Points",
        line: prop.line || 0,
        overOdds: prop.overOdds || -110,
        underOdds: prop.underOdds || -110,
        gameTime: prop.gameTime || new Date().toISOString(),
        opponent: prop.opponent || "Unknown Opponent",
        sport: prop.sport || "nba",
        confidence: prop.confidence || 75,
        projection: prop.projection || prop.line || 0,
        edge: prop.edge || 5,
        pickType: prop.pickType || "normal",
        reasoning: prop.reasoning || "No reasoning provided",
        lastGameStats: prop.lastGameStats || [],
        seasonAvg: prop.seasonAvg || prop.line || 0,
        recentForm: prop.recentForm || "neutral",
        injuryStatus: prop.injuryStatus || "healthy",
        weatherImpact: prop.weatherImpact,
        homeAwayFactor: prop.homeAwayFactor || 1.0,
        timestamp: Date.now(),
      }));

      // Apply unified sport filtering
      if (filters.sport && filters.sport !== UNIFIED_SPORTS.ALL) {
        props = filterSportData(props, filters.sport, {
          useCommonMappings: true,
          allowPartialMatch: true,
          caseSensitive: false,
        });
      }

      // Apply confidence filter
      if (filters.minConfidence) {
        props = props.filter(
          (prop) => prop.confidence >= filters.minConfidence!,
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        props.sort((a, b) => {
          const aVal = (a as any)[filters.sortBy!] || 0;
          const bVal = (b as any)[filters.sortBy!] || 0;
          const direction = filters.sortOrder === "asc" ? 1 : -1;
          return (bVal - aVal) * direction;
        });
      }

      // Apply result limit
      if (filters.maxResults) {
        props = props.slice(0, filters.maxResults);
      }

      const result: UnifiedApiResponse<UnifiedPlayerProp> = {
        success: true,
        data: props,
        count: props.length,
        filters,
        timestamp: Date.now(),
      };

      // Cache the result
      this.setCache(cacheKey, result);

      logger.info("Successfully fetched unified player props", {
        count: props.length,
        duration: Date.now() - startTime,
        filters,
      });

      return result;
    } catch (error) {
      logError(error as Error, "UnifiedDataService.getPlayerProps");

      return {
        success: false,
        data: [],
        count: 0,
        error: (error as Error).message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get available sports for current user
   */
  async getAvailableSports(): Promise<string[]> {
    try {
      const cacheKey = "available-sports";
      const cached = this.getFromCache<string[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from both betting opportunities and player props to get all available sports
      const [bettingResponse, propsResponse] = await Promise.all([
        this.getBettingOpportunities({ maxResults: 100 }),
        this.getPlayerProps({ maxResults: 100 }),
      ]);

      const sportsSet = new Set<string>();

      if (bettingResponse.data) {
        bettingResponse.data.forEach((opp) => sportsSet.add(opp.sport));
      }

      if (propsResponse.data) {
        propsResponse.data.forEach((prop) => sportsSet.add(prop.sport));
      }

      const availableSports = [UNIFIED_SPORTS.ALL, ...Array.from(sportsSet)];

      // Cache for shorter time since this can change
      this.setCache(cacheKey, availableSports, 2 * 60 * 1000); // 2 minutes

      return availableSports;
    } catch (error) {
      logError(error as Error, "UnifiedDataService.getAvailableSports");

      // Return default sports if API fails
      return [
        UNIFIED_SPORTS.ALL,
        UNIFIED_SPORTS.NBA,
        UNIFIED_SPORTS.NFL,
        UNIFIED_SPORTS.MLB,
        UNIFIED_SPORTS.NHL,
        UNIFIED_SPORTS.SOCCER,
      ];
    }
  }

  /**
   * Clear cache for fresh data
   */
  clearCache(): void {
    this.cache.clear();
    logger.info("Unified data service cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService();
export default unifiedDataService;
