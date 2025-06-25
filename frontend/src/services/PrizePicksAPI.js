import axios from "axios";
import { UnifiedConfigManager } from "../core/UnifiedConfigManager";
export class PrizePicksAPI {
    constructor() {
        this.lastErrorLog = 0;
        this.config = UnifiedConfigManager.getInstance();
        this.api = axios.create({
            baseURL: import.meta.env.VITE_PRIZEPICKS_API_URL ||
                "https://api.prizepicks.com/v1",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_PRIZEPICKS_API_KEY}`,
            },
        });
        // Add request interceptor for rate limiting
        this.api.interceptors.request.use(async (config) => {
            await this.rateLimiter();
            return config;
        });
        // Add response interceptor for error handling
        this.api.interceptors.response.use((response) => response, (error) => {
            this.handleApiError(error);
            throw error;
        });
    }
    static getInstance() {
        if (!PrizePicksAPI.instance) {
            PrizePicksAPI.instance = new PrizePicksAPI();
        }
        return PrizePicksAPI.instance;
    }
    async getProjections(params) {
        try {
            // In development mode, return mock data to prevent API spam
            if (import.meta.env.DEV ||
                import.meta.env.VITE_USE_MOCK_DATA === "true") {
                console.log("Using mock PrizePicks data in development mode");
                return this.getMockProjections(params);
            }
            const response = await this.api.get("/projections", {
                params,
            });
            return response.data.data;
        }
        catch (error) {
            console.warn("PrizePicks API unavailable, using mock data:", error.message);
            return this.getMockProjections(params);
        }
    }
    getMockProjections(params) {
        // Return mock data for development
        return [
            {
                id: "mock-1",
                player: {
                    id: "player-1",
                    name: "LeBron James",
                    team: "LAL",
                    position: "SF",
                    sport: "NBA",
                    stats: { points: 25.2, rebounds: 7.8, assists: 7.2 },
                },
                propType: "points",
                line: 25.5,
                game: {
                    id: "game-1",
                    homeTeam: "LAL",
                    awayTeam: "GSW",
                    sport: "NBA",
                    league: "NBA",
                    startTime: new Date(Date.now() + 3600000).toISOString(),
                    status: "scheduled",
                },
                multiplier: 2.5,
                probability: 0.55,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "mock-2",
                player: {
                    id: "player-2",
                    name: "Stephen Curry",
                    team: "GSW",
                    position: "PG",
                    sport: "NBA",
                    stats: { points: 29.8, rebounds: 5.1, assists: 6.3 },
                },
                propType: "threes",
                line: 4.5,
                game: {
                    id: "game-1",
                    homeTeam: "LAL",
                    awayTeam: "GSW",
                    sport: "NBA",
                    league: "NBA",
                    startTime: new Date(Date.now() + 3600000).toISOString(),
                    status: "scheduled",
                },
                multiplier: 3.2,
                probability: 0.62,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]
            .filter((projection) => {
            if (params.sport && projection.player.sport !== params.sport)
                return false;
            if (params.propType && projection.propType !== params.propType)
                return false;
            if (params.playerId && projection.player.id !== params.playerId)
                return false;
            return true;
        })
            .slice(0, params.limit || 10);
    }
    async getPlayer(playerId) {
        try {
            if (import.meta.env.DEV ||
                import.meta.env.VITE_USE_MOCK_DATA === "true") {
                return this.getMockPlayer(playerId);
            }
            const response = await this.api.get(`/players/${playerId}`);
            return response.data.data;
        }
        catch (error) {
            console.warn("PrizePicks API unavailable, using mock player data");
            return this.getMockPlayer(playerId);
        }
    }
    async getGame(gameId) {
        try {
            if (import.meta.env.DEV ||
                import.meta.env.VITE_USE_MOCK_DATA === "true") {
                return this.getMockGame(gameId);
            }
            const response = await this.api.get(`/games/${gameId}`);
            return response.data.data;
        }
        catch (error) {
            console.warn("PrizePicks API unavailable, using mock game data");
            return this.getMockGame(gameId);
        }
    }
    getMockPlayer(playerId) {
        return {
            id: playerId,
            name: "Mock Player",
            team: "MOCK",
            position: "PG",
            sport: "NBA",
            stats: { points: 20.5, rebounds: 5.2, assists: 4.8 },
        };
    }
    getMockGame(gameId) {
        return {
            id: gameId,
            homeTeam: "MOCK1",
            awayTeam: "MOCK2",
            sport: "NBA",
            league: "NBA",
            startTime: new Date(Date.now() + 3600000).toISOString(),
            status: "scheduled",
        };
    }
    async getPlayerProjections(playerId) {
        const response = await this.api.get("/projections", {
            params: { playerId },
        });
        return response.data.data;
    }
    async getPlayerHistory(playerId, params) {
        const response = await this.api.get(`/players/${playerId}/history`, {
            params,
        });
        return response.data.data;
    }
    async getTeamProjections(team, sport) {
        const response = await this.api.get("/projections", {
            params: { team, sport },
        });
        return response.data.data;
    }
    async rateLimiter() {
        // Implement rate limiting logic here
        // This is a placeholder - you would typically use a proper rate limiting library
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    handleApiError(error) {
        // Reduce console spam in development by limiting error logging
        if (import.meta.env.DEV) {
            // Only log once every 10 seconds to prevent spam
            const now = Date.now();
            if (!this.lastErrorLog || now - this.lastErrorLog > 10000) {
                this.lastErrorLog = now;
                if (error.response) {
                    console.warn(`PrizePicks API Error: ${error.response.status} - Using mock data instead`);
                }
                else if (error.request) {
                    console.warn("PrizePicks API Error: No response from server - Using mock data instead");
                }
                else {
                    console.warn(`PrizePicks API Error: ${error.message} - Using mock data instead`);
                }
            }
        }
        else {
            // In production, log normally
            if (error.response) {
                console.error(`PrizePicks API Error: ${error.response.status} - ${error.response.data.message}`);
            }
            else if (error.request) {
                console.error("PrizePicks API Error: No response received from server");
            }
            else {
                console.error(`PrizePicks API Error: ${error.message}`);
            }
        }
    }
}
