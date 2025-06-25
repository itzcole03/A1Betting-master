import axios from 'axios';
import { EventBus } from '../unified/EventBus.js';
import { UnifiedConfig } from '../unified/UnifiedConfig.js';
export class SportradarService {
    constructor() {
        const configManager = UnifiedConfig.getInstance();
        this.config = configManager.get('sportradar');
        this.client = axios.create({
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: { 'X-API-Key': this.config.apiKey },
        });
        this.eventBus = EventBus.getInstance();
    }
    static getInstance() {
        if (!SportradarService.instance) {
            SportradarService.instance = new SportradarService();
        }
        return SportradarService.instance;
    }
    async getPlayerStats(playerId, options) {
        const response = await this.client.get(`/players/${playerId}/stats`, { params: options });
        return response.data;
    }
    async getTeamStats(teamId, options) {
        const response = await this.client.get(`/teams/${teamId}/stats`, { params: options });
        return response.data;
    }
    async getGameSchedule(options) {
        const response = await this.client.get('/schedule', { params: options });
        return response.data;
    }
    async getInjuries(options) {
        const response = await this.client.get('/injuries', { params: options });
        const injuries = response.data;
        this.eventBus.emit('injury:update', {
            injuries,
            timestamp: Date.now(),
        });
        return injuries;
    }
    async getMatchup(matchupId) {
        const response = await this.client.get(`/matchups/${matchupId}`);
        const match = response.data;
        this.eventBus.emit('match:update', {
            match,
            timestamp: Date.now(),
        });
        return match;
    }
    /**
     * Extracts and returns normalized features for ensemble prediction.
     * @param context - { playerId, teamId, matchupId }
     * @returns Normalized feature object
     */
    async getFeatures(context) {
        const features = {};
        if (context.playerId) {
            const stats = await this.getPlayerStats(context.playerId);
            for (const [k, v] of Object.entries(stats)) {
                features[`playerStat_${k}`] = v;
            }
        }
        if (context.teamId) {
            const stats = await this.getTeamStats(context.teamId);
            for (const [k, v] of Object.entries(stats)) {
                features[`teamStat_${k}`] = v;
            }
        }
        if (context.matchupId) {
            const matchup = await this.getMatchup(context.matchupId);
            features.matchupId = matchup.id;
            features.homeTeam = matchup.homeTeam;
            features.awayTeam = matchup.awayTeam;
            features.date = matchup.date;
        }
        return features;
    }
}
export const sportradarService = SportradarService.getInstance();
