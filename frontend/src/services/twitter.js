import { apiService } from '../services/api/ApiService.js';
class TwitterService {
    constructor() {
        this.config = {
            apiKey: process.env.REACT_APP_TWITTER_API_KEY || '',
            baseUrl: process.env.REACT_APP_TWITTER_API_URL || 'https://api.twitter.com',
        };
    }
    async searchTweets(query, options) {
        try {
            const params = {
                apiKey: this.config.apiKey,
                query,
                ...(options || {}),
            };
            const response = await apiService.get('/twitter/search', params);
            return response;
        }
        catch (error) {
            console.error('Failed to search tweets:', error);
            throw error;
        }
    }
    async getSentimentAnalysis(entity, options) {
        try {
            const params = {
                apiKey: this.config.apiKey,
                entity,
                ...(options || {}),
            };
            const response = await apiService.get('/twitter/sentiment', params);
            return response;
        }
        catch (error) {
            console.error('Failed to get sentiment analysis:', error);
            throw error;
        }
    }
    async getTrendingTopics(sport) {
        try {
            const response = await apiService.get(`/twitter/trends/${sport}`, {
                apiKey: this.config.apiKey,
            });
            return response;
        }
        catch (error) {
            console.error('Failed to get trending topics:', error);
            throw error;
        }
    }
    async getUserSentiment(username) {
        try {
            const response = await apiService.get(`/twitter/users/${username}/sentiment`, {
                apiKey: this.config.apiKey,
            });
            return response;
        }
        catch (error) {
            console.error('Failed to get user sentiment:', error);
            throw error;
        }
    }
}
export const twitterService = new TwitterService();
