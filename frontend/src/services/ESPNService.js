import axios from 'axios';
import { EventBus } from '../unified/EventBus.js';
import { UnifiedConfig } from '../unified/UnifiedConfig.js';
export class ESPNService {
    /**
     * Extracts and returns normalized features for a given context (game, player, team, etc.)
     * to be used in ensemble prediction. This enables ESPNService to contribute structured
     * data to the unified prediction engine for maximum accuracy.
     *
     * @param context - An object containing identifiers and parameters for feature extraction.
     *                  Example: { gameId, playerId, teamId, metric, date, ... }
     * @returns A Promise resolving to a normalized feature object.
     */
    async getFeatures(context) {
        const features = {};
        // Game-level features
        if (context.gameId) {
            const game = await this.getGame(context.gameId);
            if (game) {
                features.gameId = game.id;
                features.sport = game.sport;
                features.league = game.league;
                features.homeTeam = game.homeTeam.name;
                features.awayTeam = game.awayTeam.name;
                features.homeScore = game.homeTeam.score ?? 0;
                features.awayScore = game.awayTeam.score ?? 0;
                features.status = game.status;
                features.venue = game.venue.name;
                if (game.weather) {
                    features.weather_temperature = game.weather.temperature;
                    features.weather_condition = game.weather.condition;
                    features.weather_windSpeed = game.weather.windSpeed;
                }
                features.startTime = game.startTime;
            }
        }
        // Player-level features
        if (context.playerId) {
            const player = await this.getPlayer(context.playerId);
            if (player) {
                features.playerId = player.id;
                features.playerName = player.name;
                features.playerPosition = player.position;
                features.playerTeam = player.team;
                features.playerStatus = player.status;
                // Flatten stats
                for (const [statKey, statValue] of Object.entries(player.stats)) {
                    features[`playerStat_${statKey}`] = statValue;
                }
                // Flatten projections
                if (player.projections) {
                    for (const [projKey, projValue] of Object.entries(player.projections)) {
                        features[`playerProjection_${projKey}`] = projValue;
                    }
                }
            }
        }
        // Team-level features
        if (context.teamId) {
            const roster = await this.getTeamRoster(context.teamId);
            features.teamRosterSize = roster.length;
            // Optionally, aggregate team stats from roster
            const totalStats = {};
            for (const player of roster) {
                for (const [statKey, statValue] of Object.entries(player.stats)) {
                    totalStats[statKey] = (totalStats[statKey] || 0) + statValue;
                }
            }
            for (const [statKey, statValue] of Object.entries(totalStats)) {
                features[`teamStat_${statKey}`] = statValue;
            }
        }
        // News/headlines features
        if (context.teamId || context.playerId) {
            const headlines = await this.getHeadlines({
                team: context.teamId,
                player: context.playerId,
                limit: 5,
            });
            features.news_count = headlines.length;
            features.news_types = Array.from(new Set(headlines.map(h => h.type)));
        }
        return features;
    }
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.configManager = UnifiedConfig.getInstance();
        this.cache = new Map();
        this.espnConfig = this.configManager.get('espn');
        this.client = axios.create({
            baseURL: this.espnConfig.baseUrl,
            timeout: this.espnConfig.timeout,
        });
        this.setupEventListeners();
    }
    static getInstance() {
        if (!ESPNService.instance) {
            ESPNService.instance = new ESPNService();
        }
        return ESPNService.instance;
    }
    // Legacy config initializer is now unused; config is loaded directly from UnifiedConfig
    // private initializeConfig(): ESPNConfig { ... }
    setupEventListeners() {
        // Listen for game status updates
        this.eventBus.on('game:status', async (event) => {
            try {
                const game = await this.getGame(event.game.id);
                if (game) {
                    this.eventBus.emit('game:status', {
                        game,
                        timestamp: Date.now(),
                    });
                }
            }
            catch (error) {
                console.error('Error handling game status update:', error);
            }
        });
        // Listen for player updates
        this.eventBus.on('player:update', async (event) => {
            try {
                const player = await this.getPlayer(event.player.id);
                if (player) {
                    this.eventBus.emit('player:update', {
                        player,
                        timestamp: Date.now(),
                    });
                }
            }
            catch (error) {
                console.error('Error handling player update:', error);
            }
        });
    }
    getCacheKey(endpoint, params) {
        return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
    }
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.espnConfig.cacheTimeout) {
            return cached.data;
        }
        return null;
    }
    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    async getGames(params) {
        const cacheKey = this.getCacheKey('games', params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get('/games', { params });
        const games = response.data.games;
        this.setCachedData(cacheKey, games);
        return games;
    }
    async getGame(gameId) {
        const cacheKey = this.getCacheKey(`game:${gameId}`);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/games/${gameId}`);
        const game = response.data;
        this.setCachedData(cacheKey, game);
        return game;
    }
    async getPlayers(params) {
        const cacheKey = this.getCacheKey('players', params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get('/athletes', { params });
        const players = response.data.athletes;
        this.setCachedData(cacheKey, players);
        return players;
    }
    async getPlayer(playerId) {
        const cacheKey = this.getCacheKey(`player:${playerId}`);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/athletes/${playerId}`);
        const player = response.data;
        this.setCachedData(cacheKey, player);
        return player;
    }
    async getPlayerStats(playerId, params) {
        const cacheKey = this.getCacheKey(`player:${playerId}:stats`, params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/athletes/${playerId}/stats`, { params });
        const stats = response.data.stats;
        this.setCachedData(cacheKey, stats);
        return stats;
    }
    async getPlayerProjections(playerId, params) {
        const cacheKey = this.getCacheKey(`player:${playerId}:projections`, params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/athletes/${playerId}/projections`, { params });
        const projections = response.data.projections;
        this.setCachedData(cacheKey, projections);
        return projections;
    }
    async getHeadlines(params) {
        const cacheKey = this.getCacheKey('headlines', params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get('/news', { params });
        const headlines = response.data.articles;
        this.setCachedData(cacheKey, headlines);
        return headlines;
    }
    async getTeamSchedule(teamId, params) {
        const cacheKey = this.getCacheKey(`team:${teamId}:schedule`, params);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/teams/${teamId}/schedule`, { params });
        const games = response.data.games;
        this.setCachedData(cacheKey, games);
        return games;
    }
    async getTeamRoster(teamId) {
        const cacheKey = this.getCacheKey(`team:${teamId}:roster`);
        const cached = this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const response = await this.client.get(`/teams/${teamId}/roster`);
        const players = response.data.athletes;
        this.setCachedData(cacheKey, players);
        return players;
    }
    clearCache() {
        this.cache.clear();
    }
    clearCacheItem(key) {
        this.cache.delete(key);
    }
}
