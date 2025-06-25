import { apiService } from './api';
class SportradarService {
    constructor() {
        this.config = {
            baseUrl: process.env.REACT_APP_SPORTRADAR_API_URL || 'https://api.sportradar.com/v1',
            apiKey: process.env.REACT_APP_SPORTRADAR_API_KEY || 'zi7atwynSXOAyizHo1L3fR5Yv8mfBX12LccJbCHb',
        };
    }
    async getPlayerStats(playerId, options) {
        try {
            const response = await apiService.get(`/sportradar/players/${playerId}/stats`, {
                params: options,
                headers: {
                    'X-API-Key': this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get player stats:', error);
            throw error;
        }
    }
    async getInjuries(options) {
        try {
            const response = await apiService.get('/sportradar/injuries', {
                params: options,
                headers: {
                    'X-API-Key': this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get injuries:', error);
            throw error;
        }
    }
    async getMatchup(matchupId) {
        try {
            const response = await apiService.get(`/sportradar/matchups/${matchupId}`, {
                headers: {
                    'X-API-Key': this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get matchup:', error);
            throw error;
        }
    }
    async getTeamStats(teamId, options) {
        try {
            const response = await apiService.get(`/sportradar/teams/${teamId}/stats`, {
                params: options,
                headers: {
                    'X-API-Key': this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get team stats:', error);
            throw error;
        }
    }
    async getGameSchedule(options) {
        try {
            const response = await apiService.get('/sportradar/schedule', {
                params: options,
                headers: {
                    'X-API-Key': this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get game schedule:', error);
            throw error;
        }
    }
}
export const sportradarService = new SportradarService();
