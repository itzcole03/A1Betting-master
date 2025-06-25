import { apiService } from './api';
class OddsJamService {
    constructor() {
        this.config = {
            apiKey: process.env.REACT_APP_ODDSJAM_API_KEY || '',
            baseUrl: process.env.REACT_APP_ODDSJAM_API_URL || 'https://api.oddsjam.com',
        };
    }
    async getOdds(sport, date) {
        try {
            const params = { apiKey: this.config.apiKey };
            if (date)
                params.date = date;
            const response = await apiService.get(`/oddsjam/${sport}/odds`, params);
            return response;
        }
        catch (error) {
            console.error('Failed to fetch odds:', error);
            throw error;
        }
    }
    async getMarketAnalysis(marketId) {
        try {
            const response = await apiService.get(`/oddsjam/markets/${marketId}/analysis`, { apiKey: this.config.apiKey });
            return response;
        }
        catch (error) {
            console.error('Failed to fetch market analysis:', error);
            throw error;
        }
    }
    async getBookmakers() {
        try {
            const response = await apiService.get('/oddsjam/bookmakers', {
                apiKey: this.config.apiKey,
            });
            return response;
        }
        catch (error) {
            console.error('Failed to fetch bookmakers:', error);
            throw error;
        }
    }
    async getHistoricalOdds(marketId, days) {
        try {
            const response = await apiService.get(`/oddsjam/markets/${marketId}/history`, {
                apiKey: this.config.apiKey,
                days,
            });
            return response;
        }
        catch (error) {
            console.error('Failed to fetch historical odds:', error);
            throw error;
        }
    }
    async getArbitrageOpportunities(sport) {
        try {
            const response = await apiService.get(`/oddsjam/${sport}/arbitrage`, {
                apiKey: this.config.apiKey,
            });
            return response;
        }
        catch (error) {
            console.error('Failed to fetch arbitrage opportunities:', error);
            throw error;
        }
    }
}
export const oddsjamService = new OddsJamService();
