import { DataSource } from "../unified/DataSource";
import { EventBus } from "../unified/EventBus";
import { PerformanceMonitor } from "../unified/PerformanceMonitor";
import { sportsRadarService, type OddsData, type GameData } from "@/services/SportsRadarService";

export interface OddsProvider {
  getOdds(eventId: string): Promise<unknown>;
}

interface SportsRadarConfig {
  apiKey: string;
  baseUrl: string;
  cacheTimeout: number;
}

export interface SportsRadarData {
  games: {
    id: string;
    status: string;
    scheduled: string;
    home: {
      name: string;
      alias: string;
      statistics: Record<string, number>;
    };
    away: {
      name: string;
      alias: string;
      statistics: Record<string, number>;
    };
    players: Array<{
      id: string;
      name: string;
      team: string;
      position: string;
      statistics: Record<string, number>;
      injuries: Array<{
        type: string;
        status: string;
        startDate: string;
      }>;
    }>;
  }[];
}

export class SportsRadarAdapter
  implements DataSource<SportsRadarData>, OddsProvider {
  public readonly id = "sports-radar";
  public readonly type = "sports-data";

  public async fetchData(): Promise<SportsRadarData> {
    return this.fetch();
  }

  private readonly eventBus: EventBus;
  private readonly performanceMonitor: PerformanceMonitor;
  private readonly config: SportsRadarConfig;
  private cache: {
    data: SportsRadarData | null;
    timestamp: number;
  };
  private apiKey: string | null;
  private baseUrl: string;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.config = {
      apiKey: import.meta.env.VITE_SPORTRADAR_API_KEY || "",
      baseUrl: import.meta.env.VITE_SPORTRADAR_API_ENDPOINT || "https://api.sportradar.com",
      cacheTimeout: parseInt(import.meta.env.VITE_SPORTSRADAR_CACHE_TTL || "300000"),
    };
    this.cache = {
      data: null,
      timestamp: 0,
    };
    this.apiKey = import.meta.env.VITE_SPORTRADAR_API_KEY || null;
    this.baseUrl = import.meta.env.VITE_SPORTRADAR_API_ENDPOINT || "https://api.sportradar.com";
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const healthCheck = await sportsRadarService.healthCheck();
      return healthCheck.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Fetches the latest SportsRadar data, using enhanced service with cache if valid.
   */
  public async fetch(): Promise<SportsRadarData> {
    const traceId = this.performanceMonitor.startTrace("sports-radar-fetch");

    try {
      if (this.isCacheValid()) {
        return this.cache.data!;
      }

      const data = await this.fetchSportsRadarData();

      this.cache = {
        data,
        timestamp: Date.now(),
      };

      this.eventBus.publish({
        type: "sports-radar-updated",
        payload: {
          data: data as unknown as Record<string, unknown>,
          timestamp: Date.now()
        },
      });

      this.performanceMonitor.endTrace(traceId);
      return data;
    } catch (error) {
      this.performanceMonitor.endTrace(traceId, error as Error);
      throw error;
    }
  }

  private async fetchSportsRadarData(): Promise<SportsRadarData> {
    try {
      // Use the enhanced service to get NBA games
      const nbaGames = await sportsRadarService.getNBAGames();
      
      // Transform GameData to SportsRadarData format for backward compatibility
      const games = nbaGames.map((game: GameData) => ({
        id: game.gameId,
        status: game.status,
        scheduled: game.scheduled,
        home: {
          name: game.homeTeam.name,
          alias: game.homeTeam.abbreviation,
          statistics: {}
        },
        away: {
          name: game.awayTeam.name,
          alias: game.awayTeam.abbreviation,
          statistics: {}
        },
        players: [] // Will be populated with additional requests if needed
      }));

      return { games };
    } catch (error) {
      // Fallback to direct API call if enhanced service fails
      const response = await fetch(
        `${this.config.baseUrl}/nba/v7/en/games/${new Date().toISOString().split('T')[0]}/schedule.json?api_key=${this.config.apiKey}`,
      );

      if (!response.ok) {
        throw new Error(`SportsRadar API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transform response to expected format
      return {
        games: result.games?.map((game: any) => ({
          id: game.id,
          status: game.status,
          scheduled: game.scheduled,
          home: {
            name: game.home.name,
            alias: game.home.alias,
            statistics: {}
          },
          away: {
            name: game.away.name,
            alias: game.away.alias,
            statistics: {}
          },
          players: []
        })) || []
      };
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cache.data !== null &&
      Date.now() - this.cache.timestamp < this.config.cacheTimeout
    );
  }

  public clearCache(): void {
    this.cache = {
      data: null,
      timestamp: 0,
    };
    sportsRadarService.clearCache();
  }

  public async connect(): Promise<void> { }
  public async disconnect(): Promise<void> { }
  public async getData(): Promise<SportsRadarData> {
    return this.cache.data as SportsRadarData;
  }
  public isConnected(): boolean {
    return true;
  }
  public getMetadata(): Record<string, unknown> {
    return { 
      id: this.id, 
      type: this.type,
      cacheStats: sportsRadarService.getCacheStats()
    };
  }

  async getOdds(eventId: string): Promise<unknown> {
    if (!this.apiKey) {
      console.warn("SportsRadar API key not configured. Skipping odds fetch.");
      return null;
    }

    try {
      // Use enhanced service for odds comparison
      const oddsData = await sportsRadarService.getOddsComparison('basketball', eventId);
      return oddsData.length > 0 ? oddsData[0] : null;
    } catch (error) {
      console.error("Error fetching odds from SportsRadar:", error);
      return null;
    }
  }

  async getEventDetails(eventId: string): Promise<unknown> {
    if (!this.apiKey) {
      console.warn(
        "SportsRadar API key not configured. Skipping event details fetch.",
      );
      return null;
    }

    try {
      // Use enhanced service for player props
      const playerProps = await sportsRadarService.getPlayerPropsOdds('basketball', eventId);
      return { playerProps };
    } catch (error) {
      console.error("Error fetching event details from SportsRadar:", error);
      return null;
    }
  }

  // New enhanced methods using the service
  async getPlayerStats(sport: string, playerId: string): Promise<unknown> {
    try {
      return await sportsRadarService.getPlayerStats(sport, playerId);
    } catch (error) {
      console.error("Error fetching player stats:", error);
      return null;
    }
  }

  async getOddsComparison(sport: string): Promise<OddsData[]> {
    try {
      return await sportsRadarService.getOddsComparison(sport);
    } catch (error) {
      console.error("Error fetching odds comparison:", error);
      return [];
    }
  }
}
