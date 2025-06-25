import { notificationService } from './notification.js';
import axios from 'axios';
import { wrapWithRateLimit } from './rateLimit/wrapWithRateLimit.js';
import { API_CONFIG } from '../config/apiConfig.js';
const axiosInstance = axios;
export class SportsAnalyticsService {
    constructor() {
        this.cache = new Map();
        this.CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
        this.subscribers = new Map();
        /**
         * Fetch player stats from backend API (production-ready)
         */
        this.getPlayerStats = wrapWithRateLimit(async (sport, playerId) => {
            const cacheKey = `player_${sport}_${playerId}`;
            const cached = this.getFromCache(cacheKey);
            if (cached)
                return cached;
            try {
                const res = await axiosInstance.get(`${API_CONFIG.SPORTS_DATA.BASE_URL}/players/${playerId}/stats`, { params: { sport }, headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY } });
                this.setCache(cacheKey, res.data);
                return res.data;
            }
            catch (error) {
                notificationService.notify('error', 'Error fetching player stats', { message: 'Please try again later' });
                throw error;
            }
        });
        /**
         * Fetch team stats from backend API (production-ready)
         */
        this.getTeamStats = wrapWithRateLimit(async (sport, teamId) => {
            const cacheKey = `team_${sport}_${teamId}`;
            const cached = this.getFromCache(cacheKey);
            if (cached)
                return cached;
            try {
                const res = await axiosInstance.get(`${API_CONFIG.SPORTS_DATA.BASE_URL}/teams/${teamId}/stats`, { params: { sport }, headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY } });
                this.setCache(cacheKey, res.data);
                return res.data;
            }
            catch (error) {
                notificationService.notify('error', 'Error fetching team stats', { message: 'Please try again later' });
                throw error;
            }
        });
        /**
         * Analyze a prop using backend ML/analytics API (production-ready)
         */
        this.analyzeProp = wrapWithRateLimit(async (sport, propId) => {
            const cacheKey = `prop_${sport}_${propId}`;
            const cached = this.getFromCache(cacheKey);
            if (cached)
                return cached;
            try {
                const res = await axiosInstance.get(`${API_CONFIG.SPORTS_DATA.BASE_URL}/props/${propId}/analyze`, { params: { sport }, headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY } });
                this.setCache(cacheKey, res.data);
                return res.data;
            }
            catch (error) {
                notificationService.notify('error', 'Error analyzing prop', { message: 'Please try again later' });
                throw error;
            }
        });
        /**
         * Get betting recommendations from backend API (production-ready)
         */
        this.getRecommendations = wrapWithRateLimit(async (sport) => {
            try {
                const res = await axiosInstance.get(`${API_CONFIG.SPORTS_DATA.BASE_URL}/recommendations`, { params: { sport }, headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY } });
                return res.data;
            }
            catch (error) {
                notificationService.notify('error', 'Error fetching recommendations', { message: 'Please try again later' });
                throw error;
            }
        });
    }
    static getInstance() {
        if (!SportsAnalyticsService.instance) {
            SportsAnalyticsService.instance = new SportsAnalyticsService();
        }
        return SportsAnalyticsService.instance;
    }
    /**
     * Subscribe to analytics events (playerStats, teamStats, propPrediction, recommendations)
     * @param event Event name
     * @param callback Callback with event data
     */
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }
        // Type assertion is safe due to event map
        this.subscribers.get(event).add(callback);
        return () => {
            this.subscribers.get(event)?.delete(callback);
        };
    }
    // (notifySubscribers is kept for future event-driven features)
    /**
     * Get a value from the cache if valid, otherwise null.
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    /**
     * Set a value in the cache.
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    // Sport-specific analysis methods
    async analyzeNBAProp(propId) {
        return this.analyzeProp('nba', propId);
    }
    async analyzeWNBAProp(propId) {
        return this.analyzeProp('nba', propId);
    }
    async analyzeMLBProp(propId) {
        return this.analyzeProp('mlb', propId);
    }
    async analyzeSoccerProp(propId) {
        return this.analyzeProp('soccer', propId);
    }
}
export const sportsAnalytics = SportsAnalyticsService.getInstance();
