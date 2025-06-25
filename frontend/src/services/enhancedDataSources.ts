export interface EnhancedDataSource {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  quality: number;
  reliability: number;
  lastUpdate: Date;
  data: any;
  error: string | null;
  metrics: {
    latency: number;
    uptime: number;
    errorRate: number;
  };
}

export class EnhancedDataSourceManager {
  private sources: Map<string, EnhancedDataSource> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  async initializeAllSources(): Promise<Map<string, EnhancedDataSource>> {
    const sourceConfigs = [
      {
        id: "espn_api",
        name: "ESPN API",
        category: "sports_data",
        endpoint: "https://site.api.espn.com/apis/site/v2/sports",
      },
      {
        id: "prizepicks_props",
        name: "PrizePicks Props",
        category: "prizepicks",
        endpoint: "https://api.prizepicks.com/projections",
      },
      {
        id: "odds_api",
        name: "Odds API",
        category: "odds",
        endpoint: "https://api.the-odds-api.com/v4/sports",
      },
      {
        id: "reddit_sentiment",
        name: "Reddit Sentiment",
        category: "sentiment",
        endpoint: "https://www.reddit.com/r/sportsbook/hot.json",
      },
      {
        id: "weather_api",
        name: "Weather API",
        category: "weather",
        endpoint: "https://api.open-meteo.com/v1/forecast",
      },
    ];

    for (const config of sourceConfigs) {
      try {
        const source = await this.initializeSource(config);
        this.sources.set(config.id, source);
      } catch (error) {
        console.warn(`Failed to initialize ${config.name}:`, error);
        // Add as disconnected source
        this.sources.set(config.id, {
          id: config.id,
          name: config.name,
          category: config.category,
          connected: false,
          quality: 0,
          reliability: 0,
          lastUpdate: new Date(),
          data: null,
          error: error.message,
          metrics: { latency: 0, uptime: 0, errorRate: 1 },
        });
      }
    }

    // Start periodic updates
    this.startPeriodicUpdates();

    return this.sources;
  }

  private async initializeSource(config: any): Promise<EnhancedDataSource> {
    const startTime = Date.now();

    try {
      // Simulate API call with timeout
      const data = await this.fetchSourceData(config.endpoint, config.category);
      const latency = Date.now() - startTime;

      return {
        id: config.id,
        name: config.name,
        category: config.category,
        connected: true,
        quality: 0.85 + Math.random() * 0.1, // Simulate quality score
        reliability: 0.9 + Math.random() * 0.08,
        lastUpdate: new Date(),
        data,
        error: null,
        metrics: {
          latency,
          uptime: 0.99 + Math.random() * 0.01,
          errorRate: Math.random() * 0.05,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private async fetchSourceData(
    endpoint: string,
    category: string,
  ): Promise<any> {
    // Simulate different data based on category
    switch (category) {
      case "sports_data":
        return this.generateSportsData();
      case "prizepicks":
        return this.generatePrizePicksData();
      case "odds":
        return this.generateOddsData();
      case "sentiment":
        return this.generateSentimentData();
      case "weather":
        return this.generateWeatherData();
      default:
        return { message: "Mock data", timestamp: new Date() };
    }
  }

  private generateSportsData(): any {
    return {
      games: [
        {
          id: "game_1",
          sport: "NBA",
          homeTeam: "Lakers",
          awayTeam: "Warriors",
          gameTime: new Date(Date.now() + 3600000).toISOString(),
          status: "Scheduled",
        },
      ],
      players: [
        {
          id: "player_1",
          name: "LeBron James",
          team: "Lakers",
          position: "SF",
          sport: "NBA",
          stats: { points: 25.4, rebounds: 7.8, assists: 6.2 },
        },
      ],
    };
  }

  private generatePrizePicksData(): any {
    return {
      projections: [
        {
          id: "proj_1",
          player_name: "LeBron James",
          stat_type: "Points",
          line: 25.5,
          sport: "NBA",
          confidence_score: 0.85,
          expected_value: 3.2,
        },
      ],
    };
  }

  private generateOddsData(): any {
    return {
      events: [
        {
          id: "event_1",
          sport_title: "NBA",
          commence_time: new Date(Date.now() + 3600000).toISOString(),
          bookmakers: [
            {
              title: "DraftKings",
              markets: [
                {
                  key: "h2h",
                  outcomes: [
                    { name: "Lakers", price: 1.85 },
                    { name: "Warriors", price: 1.95 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  private generateSentimentData(): any {
    return {
      posts: [
        {
          title: "Lakers looking strong tonight",
          sentiment_score: 0.7,
          upvotes: 156,
          comments: 43,
        },
      ],
      overall_sentiment: 0.6,
    };
  }

  private generateWeatherData(): any {
    return {
      current_weather: {
        temperature: 72,
        windspeed: 8,
        precipitation: 0,
      },
      game_impact_score: 0.1,
    };
  }

  private startPeriodicUpdates(): void {
    this.updateInterval = setInterval(async () => {
      await this.refreshAllSources();
    }, 300000); // Update every 5 minutes
  }

  async refreshAllSources(): Promise<void> {
    const updatePromises = Array.from(this.sources.keys()).map(
      async (sourceId) => {
        try {
          await this.refreshSource(sourceId);
        } catch (error) {
          console.warn(`Failed to refresh source ${sourceId}:`, error);
        }
      },
    );

    await Promise.all(updatePromises);
  }

  private async refreshSource(sourceId: string): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source) return;

    const startTime = Date.now();

    try {
      const data = await this.fetchSourceData("", source.category);
      const latency = Date.now() - startTime;

      // Update source
      this.sources.set(sourceId, {
        ...source,
        connected: true,
        lastUpdate: new Date(),
        data,
        error: null,
        metrics: {
          ...source.metrics,
          latency,
        },
      });
    } catch (error) {
      this.sources.set(sourceId, {
        ...source,
        connected: false,
        error: error.message,
        metrics: {
          ...source.metrics,
          errorRate: Math.min(1, source.metrics.errorRate + 0.1),
        },
      });
    }
  }

  getConnectedSources(): EnhancedDataSource[] {
    return Array.from(this.sources.values()).filter(
      (source) => source.connected,
    );
  }

  getSourcesByCategory(category: string): EnhancedDataSource[] {
    return Array.from(this.sources.values()).filter(
      (source) => source.category === category,
    );
  }

  getOverallDataQuality(): number {
    const connectedSources = this.getConnectedSources();
    if (connectedSources.length === 0) return 0;

    return (
      connectedSources.reduce((sum, source) => sum + source.quality, 0) /
      connectedSources.length
    );
  }

  getSourceReliability(): number {
    const connectedSources = this.getConnectedSources();
    if (connectedSources.length === 0) return 0;

    return (
      connectedSources.reduce((sum, source) => sum + source.reliability, 0) /
      connectedSources.length
    );
  }

  getAllSources(): Map<string, EnhancedDataSource> {
    return new Map(this.sources);
  }

  getDataSourceMetrics(): any {
    const connectedSources = this.getConnectedSources();

    return {
      totalSources: this.sources.size,
      connectedSources: connectedSources.length,
      averageLatency:
        connectedSources.reduce((sum, s) => sum + s.metrics.latency, 0) /
        connectedSources.length,
      averageUptime:
        connectedSources.reduce((sum, s) => sum + s.metrics.uptime, 0) /
        connectedSources.length,
      averageErrorRate:
        connectedSources.reduce((sum, s) => sum + s.metrics.errorRate, 0) /
        connectedSources.length,
      dataQuality: this.getOverallDataQuality(),
      reliability: this.getSourceReliability(),
    };
  }

  disconnect(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const enhancedDataSourceManager = new EnhancedDataSourceManager();
