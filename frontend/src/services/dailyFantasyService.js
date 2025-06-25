import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { errorLogger } from '../utils/errorLogger';
class DailyFantasyService {
    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.dailyFantasy.baseUrl,
            headers: {
                Authorization: `Bearer ${API_CONFIG.dailyFantasy.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async getContests(sport) {
        try {
            const response = await this.api.get(`/contests? sport=${sport}`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getContests' });
            throw error;
        }
    }
    async getPlayers(contestId) {
        try {
            const response = await this.api.get(`/contests/${contestId}/players`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getPlayers' });
            throw error;
        }
    }
    async getPlayerProjections(playerId) {
        try {
            const response = await this.api.get(`/players/${playerId}/projections`);
            return response.data.projectedPoints;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getPlayerProjections' });
            throw error;
        }
    }
    async getOptimalLineup(contestId, strategy) {
        try {
            const response = await this.api.post(`/contests/${contestId}/optimal-lineup`, {
                strategy,
            });
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getOptimalLineup' });
            throw error;
        }
    }
    async getContestResults(contestId) {
        try {
            const response = await this.api.get(`/contests/${contestId}/results`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getContestResults' });
            throw error;
        }
    }
    async getPlayerStats(playerId, timeframe) {
        try {
            const response = await this.api.get(`/players/${playerId}/stats?timeframe=${timeframe}`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getPlayerStats' });
            throw error;
        }
    }
    async getContestTrends(contestId) {
        try {
            const response = await this.api.get(`/contests/${contestId}/trends`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getContestTrends' });
            throw error;
        }
    }
    async getPlayerOwnership(contestId) {
        try {
            const response = await this.api.get(`/contests/${contestId}/ownership`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getPlayerOwnership' });
            throw error;
        }
    }
    async getSalaryChanges(contestId) {
        try {
            const response = await this.api.get(`/contests/${contestId}/salary-changes`);
            return response.data;
        }
        catch (error) {
            errorLogger.logError(error, { context: 'DailyFantasyService.getSalaryChanges' });
            throw error;
        }
    }
}
export const dailyFantasyService = new DailyFantasyService();
