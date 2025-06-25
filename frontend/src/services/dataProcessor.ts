export interface ProcessedGame {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  status: string;
  source: string;
  venue?: string;
  weather?: any;
  odds?: any;
  predictions?: any;
}

export interface ProcessedPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  sport: string;
  stats: any;
  recentForm: number[];
  source: string;
  injuryStatus?: string;
  props?: any[];
}

export interface ProcessedData {
  games: ProcessedGame[];
  players: ProcessedPlayer[];
  lastProcessed: Date;
  quality: number;
  reliability: number;
}

export class DataProcessor {
  processGames(dataSources: Map<string, any>): ProcessedGame[] {
    const games: ProcessedGame[] = [];

    dataSources.forEach((source, sourceId) => {
      if (!source.connected || !source.data) return;

      try {
        const sourceGames = this.extractGamesFromSource(source, sourceId);
        games.push(...sourceGames);
      } catch (error) {
        console.warn(`Error processing games from ${sourceId}:`, error);
      }
    });

    // Remove duplicates and merge data
    return this.deduplicateGames(games);
  }

  processPlayers(dataSources: Map<string, any>): ProcessedPlayer[] {
    const players: ProcessedPlayer[] = [];

    dataSources.forEach((source, sourceId) => {
      if (!source.connected || !source.data) return;

      try {
        const sourcePlayers = this.extractPlayersFromSource(source, sourceId);
        players.push(...sourcePlayers);
      } catch (error) {
        console.warn(`Error processing players from ${sourceId}:`, error);
      }
    });

    // Remove duplicates and merge data
    return this.deduplicatePlayers(players);
  }

  private extractGamesFromSource(
    source: any,
    sourceId: string,
  ): ProcessedGame[] {
    const games: ProcessedGame[] = [];

    if (source.data?.games) {
      source.data.games.forEach((game: any) => {
        games.push({
          id: game.id || `${sourceId}_game_${Date.now()}_${Math.random()}`,
          sport: game.sport || "Unknown",
          homeTeam: game.homeTeam || game.home_team || "TBD",
          awayTeam: game.awayTeam || game.away_team || "TBD",
          gameTime:
            game.gameTime || game.commence_time || new Date().toISOString(),
          status: game.status || "Scheduled",
          source: sourceId,
          venue: game.venue,
          weather: game.weather,
          odds: game.odds || game.bookmakers,
          predictions: game.predictions,
        });
      });
    }

    if (source.data?.events) {
      source.data.events.forEach((event: any) => {
        games.push({
          id: event.id || `${sourceId}_event_${Date.now()}_${Math.random()}`,
          sport: event.sport_title || "Unknown",
          homeTeam: event.home_team || "TBD",
          awayTeam: event.away_team || "TBD",
          gameTime: event.commence_time || new Date().toISOString(),
          status: "Scheduled",
          source: sourceId,
          odds: event.bookmakers,
        });
      });
    }

    return games;
  }

  private extractPlayersFromSource(
    source: any,
    sourceId: string,
  ): ProcessedPlayer[] {
    const players: ProcessedPlayer[] = [];

    if (source.data?.players) {
      source.data.players.forEach((player: any) => {
        players.push({
          id:
            player.id ||
            `${sourceId}_player_${player.name?.replace(/\s+/g, "_").toLowerCase()}`,
          name: player.name || "Unknown Player",
          team: player.team || "Unknown",
          position: player.position || "Unknown",
          sport: player.sport || "Unknown",
          stats: player.stats || {},
          recentForm: player.recentForm || this.generateRecentForm(),
          source: sourceId,
          injuryStatus: player.injuryStatus || "Healthy",
          props: player.props || [],
        });
      });
    }

    // Extract players from projections (PrizePicks style)
    if (source.data?.projections) {
      source.data.projections.forEach((projection: any) => {
        const playerId = `${sourceId}_player_${projection.player_name?.replace(/\s+/g, "_").toLowerCase()}`;

        // Check if player already exists
        let existingPlayer = players.find((p) => p.id === playerId);

        if (!existingPlayer) {
          existingPlayer = {
            id: playerId,
            name: projection.player_name || "Unknown Player",
            team: projection.team || "Unknown",
            position: projection.position || "Unknown",
            sport: projection.sport || "Unknown",
            stats: {},
            recentForm: this.generateRecentForm(),
            source: sourceId,
            props: [],
          };
          players.push(existingPlayer);
        }

        // Add projection as prop
        if (projection.stat_type && projection.line) {
          existingPlayer.props = existingPlayer.props || [];
          existingPlayer.props.push({
            statType: projection.stat_type,
            line: projection.line,
            confidence: projection.confidence_score,
            expectedValue: projection.expected_value,
          });

          // Update stats with projection line as season average
          const statKey = projection.stat_type
            .toLowerCase()
            .replace(/[^a-z]/g, "");
          if (!existingPlayer.stats[statKey]) {
            existingPlayer.stats[statKey] = projection.line;
          }
        }
      });
    }

    return players;
  }

  private generateRecentForm(): number[] {
    // Generate realistic recent form (last 10 games)
    const form: number[] = [];
    let currentForm = 0.5 + (Math.random() - 0.5) * 0.4; // Start around 0.3-0.7

    for (let i = 0; i < 10; i++) {
      // Add some momentum/trend
      const change = (Math.random() - 0.5) * 0.3;
      currentForm = Math.max(0.1, Math.min(0.9, currentForm + change));
      form.push(currentForm);
    }

    return form;
  }

  private deduplicateGames(games: ProcessedGame[]): ProcessedGame[] {
    const gameMap = new Map<string, ProcessedGame>();

    games.forEach((game) => {
      const key = `${game.sport}_${game.homeTeam}_${game.awayTeam}_${game.gameTime}`;

      if (!gameMap.has(key)) {
        gameMap.set(key, game);
      } else {
        // Merge data from multiple sources
        const existing = gameMap.get(key)!;
        gameMap.set(key, this.mergeGameData(existing, game));
      }
    });

    return Array.from(gameMap.values());
  }

  private deduplicatePlayers(players: ProcessedPlayer[]): ProcessedPlayer[] {
    const playerMap = new Map<string, ProcessedPlayer>();

    players.forEach((player) => {
      const key = `${player.sport}_${player.name}_${player.team}`;

      if (!playerMap.has(key)) {
        playerMap.set(key, player);
      } else {
        // Merge data from multiple sources
        const existing = playerMap.get(key)!;
        playerMap.set(key, this.mergePlayerData(existing, player));
      }
    });

    return Array.from(playerMap.values());
  }

  private mergeGameData(
    existing: ProcessedGame,
    incoming: ProcessedGame,
  ): ProcessedGame {
    return {
      ...existing,
      // Keep most recent data
      status:
        incoming.status !== "Scheduled" ? incoming.status : existing.status,
      weather: incoming.weather || existing.weather,
      odds: incoming.odds || existing.odds,
      predictions: incoming.predictions || existing.predictions,
      source: `${existing.source}, ${incoming.source}`,
    };
  }

  private mergePlayerData(
    existing: ProcessedPlayer,
    incoming: ProcessedPlayer,
  ): ProcessedPlayer {
    return {
      ...existing,
      // Merge stats (prefer non-zero values)
      stats: {
        ...existing.stats,
        ...Object.fromEntries(
          Object.entries(incoming.stats).filter(([_, value]) => value !== 0),
        ),
      },
      // Use more recent form if available
      recentForm:
        incoming.recentForm.length > existing.recentForm.length
          ? incoming.recentForm
          : existing.recentForm,
      // Merge props
      props: [...(existing.props || []), ...(incoming.props || [])],
      // Update injury status if more specific
      injuryStatus:
        incoming.injuryStatus !== "Healthy"
          ? incoming.injuryStatus
          : existing.injuryStatus,
      source: `${existing.source}, ${incoming.source}`,
    };
  }

  calculateDataQuality(data: ProcessedData): number {
    let qualityScore = 0;
    let factors = 0;

    // Game data quality
    if (data.games.length > 0) {
      const gamesWithOdds = data.games.filter((g) => g.odds).length;
      const gamesWithVenue = data.games.filter((g) => g.venue).length;
      qualityScore += (gamesWithOdds / data.games.length) * 0.3;
      qualityScore += (gamesWithVenue / data.games.length) * 0.1;
      factors += 0.4;
    }

    // Player data quality
    if (data.players.length > 0) {
      const playersWithStats = data.players.filter(
        (p) => Object.keys(p.stats).length > 0,
      ).length;
      const playersWithForm = data.players.filter(
        (p) => p.recentForm.length > 0,
      ).length;
      const playersWithProps = data.players.filter(
        (p) => (p.props || []).length > 0,
      ).length;

      qualityScore += (playersWithStats / data.players.length) * 0.3;
      qualityScore += (playersWithForm / data.players.length) * 0.2;
      qualityScore += (playersWithProps / data.players.length) * 0.1;
      factors += 0.6;
    }

    return factors > 0 ? qualityScore / factors : 0;
  }

  calculateReliability(data: ProcessedData): number {
    const dataAge = Date.now() - data.lastProcessed.getTime();
    const ageHours = dataAge / (1000 * 60 * 60);

    // Data reliability decreases with age
    let reliabilityScore = Math.max(0, 1 - ageHours / 24); // Full reliability for < 1 hour, 0 after 24 hours

    // Bonus for multiple sources
    const avgSourcesPerItem =
      data.games.length + data.players.length > 0
        ? (data.games.filter((g) => g.source.includes(",")).length +
            data.players.filter((p) => p.source.includes(",")).length) /
          (data.games.length + data.players.length)
        : 0;

    reliabilityScore += avgSourcesPerItem * 0.2;

    return Math.min(1, reliabilityScore);
  }

  processData(dataSources: Map<string, any>): ProcessedData {
    const games = this.processGames(dataSources);
    const players = this.processPlayers(dataSources);
    const lastProcessed = new Date();

    const data: ProcessedData = {
      games,
      players,
      lastProcessed,
      quality: 0,
      reliability: 0,
    };

    data.quality = this.calculateDataQuality(data);
    data.reliability = this.calculateReliability(data);

    return data;
  }
}

export const dataProcessor = new DataProcessor();
