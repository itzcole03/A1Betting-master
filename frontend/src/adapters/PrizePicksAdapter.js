import { unifiedMonitor } from './../core/UnifiedMonitor.ts'; // Updated import path
import { PrizePicksAPI, } from './../api/PrizePicksAPI.ts'; // Updated import path
export class PrizePicksAdapter {
    constructor(config) {
        this.id = 'prize-picks';
        this.type = 'sports-projections';
        this.config = {
            cacheTimeout: 300000, // Default 5 minutes
            apiKey: '', // Explicitly pass empty string if not provided
            ...config,
        };
        this.prizePicksApi = new PrizePicksAPI({
            apiKey: this.config.apiKey, // This will be an empty string if not in .env
            baseUrl: this.config.baseUrl || 'https://api.prizepicks.com',
        });
        this.cache = {
            data: null,
            timestamp: 0,
        };
    }
    async isAvailable() {
        // return Boolean(this.config.apiKey); // No longer dependent on API key
        return true; // Assume available for scraping
    }
    async fetch() {
        const trace = unifiedMonitor.startTrace('prize-picks-adapter-fetch', 'adapter.fetch');
        try {
            if (this.isCacheValid()) {
                return this.cache.data;
            }
            const rawApiResponse = await this.prizePicksApi.fetchProjections(this.config.defaultLeagueId);
            const transformedData = this.transformData(rawApiResponse);
            this.cache = {
                data: transformedData,
                timestamp: Date.now(),
            };
            unifiedMonitor.endTrace(trace);
            return transformedData;
        }
        catch (error) {
            unifiedMonitor.endTrace(trace);
            console.error(`[PrizePicksAdapter] Error during fetch: ${error.message}`);
            throw error;
        }
    }
    transformData(apiResponse) {
        const includedPlayersMap = new Map();
        const includedLeaguesMap = new Map();
        if (apiResponse.included) {
            apiResponse.included.forEach(item => {
                if (item.type === 'new_player') {
                    const rawPlayer = item;
                    includedPlayersMap.set(rawPlayer.id, {
                        id: rawPlayer.id,
                        name: rawPlayer.attributes.name,
                        team: rawPlayer.attributes.team_name,
                        position: rawPlayer.attributes.position,
                        image_url: rawPlayer.attributes.image_url,
                    });
                }
                else if (item.type === 'league') {
                    const rawLeague = item;
                    includedLeaguesMap.set(rawLeague.id, {
                        id: rawLeague.id,
                        name: rawLeague.attributes.name,
                        sport: rawLeague.attributes.sport,
                    });
                }
            });
        }
        const projections = apiResponse.data.map(rawProj => {
            const playerId = rawProj.relationships.new_player.data.id;
            const playerDetail = includedPlayersMap.get(playerId);
            return {
                id: rawProj.id,
                playerId: playerId,
                player: playerDetail,
                statType: rawProj.attributes.stat_type,
                line: rawProj.attributes.line_score,
                description: rawProj.attributes.description,
                startTime: rawProj.attributes.start_time,
            };
        });
        return {
            projections: projections,
            players: Array.from(includedPlayersMap.values()),
            leagues: Array.from(includedLeaguesMap.values()),
            lastUpdated: new Date().toISOString(),
        };
    }
    isCacheValid() {
        if (!this.cache.data)
            return false;
        const age = Date.now() - this.cache.timestamp;
        return age < (this.config.cacheTimeout || 0);
    }
    clearCache() {
        this.cache = { data: null, timestamp: 0 };
    }
    async connect() {
        /* No-op */
    }
    async disconnect() {
        /* No-op */
    }
    async getData() {
        if (!this.cache.data) {
            // throw new Error('No data available in PrizePicksAdapter. Call fetch() first.');
            // Attempt to fetch if no data is available, common for initial load or if cache cleared
            console.warn('[PrizePicksAdapter] No data in cache for getData(), attempting fetch...');
            return await this.fetch();
        }
        return this.cache.data;
    }
    isConnected() {
        return true;
    }
    getMetadata() {
        return {
            id: this.id,
            type: this.type,
            description: 'Adapter for PrizePicks projection data',
            defaultLeagueId: this.config.defaultLeagueId,
        };
    }
}
