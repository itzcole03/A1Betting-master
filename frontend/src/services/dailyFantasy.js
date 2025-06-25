import { apiService } from "./api";
class DailyFantasyService {
    constructor() {
        this.config = {
            baseUrl: import.meta.env.VITE_DAILY_FANTASY_API_URL ||
                "https://api.dailyfantasy.com/v1",
            apiKey: import.meta.env.VITE_DAILY_FANTASY_API_KEY ||
                "f3ac5a9c-cf01-4dc8-8edb-c02bf6c31a4d",
        };
    }
    async getContests(options) {
        try {
            const response = await apiService.get("/daily-fantasy/contests", {
                params: options,
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get contests:", error);
            throw error;
        }
    }
    async getPlayers(options) {
        try {
            const response = await apiService.get("/daily-fantasy/players", {
                params: options,
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get players:", error);
            throw error;
        }
    }
    async getPlayerStats(playerId, options) {
        try {
            const response = await apiService.get(`/daily-fantasy/players/${playerId}/stats`, {
                params: options,
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get player stats:", error);
            throw error;
        }
    }
    async getLineups(options) {
        try {
            const response = await apiService.get("/daily-fantasy/lineups", {
                params: options,
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get lineups:", error);
            throw error;
        }
    }
    async createLineup(contestId, players) {
        try {
            const response = await apiService.post("/daily-fantasy/lineups", {
                contestId,
                players,
            }, {
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to create lineup:", error);
            throw error;
        }
    }
    async getContestResults(contestId) {
        try {
            const response = await apiService.get(`/daily-fantasy/contests/${contestId}/results`, {
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get contest results:", error);
            throw error;
        }
    }
    async getOptimalLineup(contestId, constraints) {
        try {
            const response = await apiService.post(`/daily-fantasy/contests/${contestId}/optimal-lineup`, {
                constraints,
            }, {
                headers: {
                    "X-API-Key": this.config.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Failed to get optimal lineup:", error);
            throw error;
        }
    }
}
export const dailyFantasyService = new DailyFantasyService();
