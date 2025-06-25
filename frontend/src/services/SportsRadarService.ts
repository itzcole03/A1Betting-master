/**
 * Enhanced SportsRadar API Service
 * Integrates with multiple SportsRadar APIs for comprehensive sports data
 */

export interface SportsRadarAPIEndpoints {
  // Odds Comparison APIs
  oddsComparison: {
    prematch: string;
    playerProps: string;
    futures: string;
    regular: string;
  };
  
  // Sports APIs
  sports: {
    nba: string;
    wnba: string;
    nfl: string;
    nhl: string;
    mlb: string;
    soccer: string;
    tennis: string;
    golf: string;
    mma: string;
  };
}

export interface SportsRadarConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: number;
  quotaLimit: number;
  cacheTTL: number;
}

export interface OddsData {
  eventId: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  odds: {
    moneyline: {
      home: number;
      away: number;
    };
    spread: {
      line: number;
      home: number;
      away: number;
    };
    total: {
      line: number;
      over: number;
      under: number;
    };
  };
  playerProps?: Array<{
    playerId: string;
    playerName: string;
    propType: string;
    line: number;
    overOdds: number;
    underOdds: number;
  }>;
  timestamp: string;
}

export interface PlayerStatsData {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  season: string;
  stats: {
    games: number;
    points: number;
    rebounds: number;
    assists: number;
    [key: string]: number;
  };
  recentForm: Array<{
    gameId: string;
    date: string;
    opponent: string;
    stats: Record<string, number>;
  }>;
}

export interface GameData {
  gameId: string;
  sport: string;
  status: 'scheduled' | 'live' | 'completed';
  scheduled: string;
  homeTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
  awayTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
  score?: {
    home: number;
    away: number;
  };
  period?: {
    current: number;
    timeRemaining?: string;
  };
}

export class EnhancedSportsRadarService {
  private config: SportsRadarConfig;
  private cache: Map<string, { data: any; timestamp: number }>;
  private requestQueue: Array<() => Promise<any>>;
  private lastRequestTime: number;

  private endpoints: SportsRadarAPIEndpoints = {
    oddsComparison: {
      prematch: '/odds-comparison/prematch',
      playerProps: '/odds-comparison/player-props',
      futures: '/odds-comparison/futures',
      regular: '/odds-comparison/regular'
    },
    sports: {
      nba: '/nba/v7/en',
      wnba: '/wnba/v7/en',
      nfl: '/nfl/v7/en',
      nhl: '/nhl/v7/en',
      mlb: '/mlb/v7/en',
      soccer: '/soccer/v4/en',
      tennis: '/tennis/v3/en',
      golf: '/golf/v3/en',
      mma: '/mma/v2/en'
    }
  };

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_SPORTRADAR_API_KEY || '',
      baseUrl: import.meta.env.VITE_SPORTRADAR_API_ENDPOINT || 'https://api.sportradar.com',
      rateLimit: parseInt(import.meta.env.VITE_SPORTSRADAR_RATE_LIMIT || '1'),
      quotaLimit: parseInt(import.meta.env.VITE_SPORTSRADAR_QUOTA_LIMIT || '1000'),
      cacheTTL: parseInt(import.meta.env.VITE_SPORTSRADAR_CACHE_TTL || '300000')
    };
    
    this.cache = new Map();
    this.requestQueue = [];
    this.lastRequestTime = 0;
  }

  /**
   * Generic API request method with rate limiting and caching
   */
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.config.cacheTTL) {
      return cached.data;
    }

    // Rate limiting - ensure we don't exceed 1 QPS
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.config.rateLimit;
    
    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }

    const queryParams = new URLSearchParams({
      api_key: this.config.apiKey,
      ...params
    });

    const url = `${this.config.baseUrl}${endpoint}?${queryParams}`;
    
    try {
      this.lastRequestTime = Date.now();
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`SportsRadar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('SportsRadar API request failed:', error);
      throw error;
    }
  }

  /**
   * Get NBA games and schedule
   */
  async getNBAGames(date?: string): Promise<GameData[]> {
    const endpoint = `${this.endpoints.sports.nba}/games/${date || new Date().toISOString().split('T')[0]}/schedule.json`;
    const response = await this.makeRequest<any>(endpoint);
    
    return response.games?.map((game: any) => ({
      gameId: game.id,
      sport: 'NBA',
      status: game.status,
      scheduled: game.scheduled,
      homeTeam: {
        id: game.home.id,
        name: game.home.name,
        abbreviation: game.home.alias
      },
      awayTeam: {
        id: game.away.id,
        name: game.away.name,
        abbreviation: game.away.alias
      },
      score: game.home_points !== undefined ? {
        home: game.home_points,
        away: game.away_points
      } : undefined
    })) || [];
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(sport: string, playerId: string, season?: string): Promise<PlayerStatsData | null> {
    const sportEndpoint = this.endpoints.sports[sport as keyof typeof this.endpoints.sports];
    if (!sportEndpoint) {
      throw new Error(`Unsupported sport: ${sport}`);
    }

    const endpoint = `${sportEndpoint}/players/${playerId}/profile.json`;
    const response = await this.makeRequest<any>(endpoint);

    if (!response.player) {
      return null;
    }

    return {
      playerId: response.player.id,
      playerName: response.player.full_name,
      team: response.player.primary_position,
      position: response.player.position,
      season: season || '2024-25',
      stats: response.player.seasons?.[0]?.totals || {},
      recentForm: response.player.seasons?.[0]?.games?.slice(-10) || []
    };
  }

  /**
   * Get odds comparison data
   */
  async getOddsComparison(sport: string, eventId?: string): Promise<OddsData[]> {
    const endpoint = `${this.endpoints.oddsComparison.prematch}/${sport.toLowerCase()}/events.json`;
    const params = eventId ? { event_id: eventId } : {};
    
    const response = await this.makeRequest<any>(endpoint, params);
    
    return response.events?.map((event: any) => ({
      eventId: event.id,
      sport: sport.toUpperCase(),
      homeTeam: event.competitors?.find((c: any) => c.qualifier === 'home')?.name || 'Unknown',
      awayTeam: event.competitors?.find((c: any) => c.qualifier === 'away')?.name || 'Unknown',
      odds: {
        moneyline: {
          home: event.markets?.find((m: any) => m.type === 'moneyline')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'home')?.price || 0,
          away: event.markets?.find((m: any) => m.type === 'moneyline')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'away')?.price || 0
        },
        spread: {
          line: event.markets?.find((m: any) => m.type === 'spread')?.books?.[0]?.outcomes?.[0]?.spread || 0,
          home: event.markets?.find((m: any) => m.type === 'spread')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'home')?.price || 0,
          away: event.markets?.find((m: any) => m.type === 'spread')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'away')?.price || 0
        },
        total: {
          line: event.markets?.find((m: any) => m.type === 'total')?.books?.[0]?.outcomes?.[0]?.total || 0,
          over: event.markets?.find((m: any) => m.type === 'total')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'over')?.price || 0,
          under: event.markets?.find((m: any) => m.type === 'total')?.books?.[0]?.outcomes?.find((o: any) => o.type === 'under')?.price || 0
        }
      },
      timestamp: new Date().toISOString()
    })) || [];
  }

  /**
   * Get player props odds
   */
  async getPlayerPropsOdds(sport: string, eventId: string): Promise<OddsData['playerProps']> {
    const endpoint = `${this.endpoints.oddsComparison.playerProps}/${sport.toLowerCase()}/events/${eventId}/markets.json`;
    
    const response = await this.makeRequest<any>(endpoint);
    
    return response.markets?.filter((market: any) => market.type === 'player_prop')?.map((market: any) => ({
      playerId: market.player?.id || '',
      playerName: market.player?.name || 'Unknown',
      propType: market.specifier || '',
      line: market.handicap || 0,
      overOdds: market.books?.[0]?.outcomes?.find((o: any) => o.type === 'over')?.price || 0,
      underOdds: market.books?.[0]?.outcomes?.find((o: any) => o.type === 'under')?.price || 0
    })) || [];
  }

  /**
   * Health check to verify API access
   */
  async healthCheck(): Promise<{ status: string; availableAPIs: string[] }> {
    const availableAPIs: string[] = [];
    
    try {
      // Test NBA API access
      await this.makeRequest(`${this.endpoints.sports.nba}/league/hierarchy.json`);
      availableAPIs.push('NBA');
    } catch (e) {
      console.warn('NBA API not accessible');
    }

    try {
      // Test Odds Comparison API access
      await this.makeRequest(`${this.endpoints.oddsComparison.prematch}/basketball/events.json`);
      availableAPIs.push('Odds Comparison');
    } catch (e) {
      console.warn('Odds Comparison API not accessible');
    }

    return {
      status: availableAPIs.length > 0 ? 'healthy' : 'degraded',
      availableAPIs
    };
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
      totalRequests: this.cache.size // Simplified for now
    };
  }
}

// Export singleton instance
export const sportsRadarService = new EnhancedSportsRadarService();
