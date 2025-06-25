import axios from 'axios';
import { BaseApiService } from './ApiService.js';
export class PrizePicksApiService extends BaseApiService {
    initializeClient() {
        return axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout || 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    handleError(error) {
        this.emit('error', error);
        console.error('[PrizePicks API Error]:', error);
    }
    handleResponse(response) {
        this.emit('response', response);
    }
    async get(endpoint, params) {
        try {
            this.emit('request', endpoint);
            const response = await this.client.get(endpoint, { params });
            const apiResponse = {
                data: response.data,
                status: response.status,
                timestamp: Date.now(),
            };
            this.handleResponse(apiResponse);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async post(endpoint, data) {
        try {
            this.emit('request', endpoint);
            const response = await this.client.post(endpoint, data);
            const apiResponse = {
                data: response.data,
                status: response.status,
                timestamp: Date.now(),
            };
            this.handleResponse(apiResponse);
            return response.data;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    // PrizePicks specific methods
    async getAvailableProps() {
        return this.get('/props/available');
    }
    async getPlayerStats(playerId) {
        // Returns player details and stats, strictly typed
        return this.get(`/players/${playerId}/stats`);
    }
    async getGameDetails(gameId) {
        // Returns full game details, strictly typed
        return this.get(`/games/${gameId}`);
    }
}
