// BetTrackingService: Tracks user bets, ROI, streaks, and analytics.
// Integrates with backend persistent storage and analytics APIs.
// Use dynamic import for axios to ensure ESM compatibility
import { wrapWithRateLimit } from '../rateLimit/wrapWithRateLimit.js';
import { API_CONFIG } from '../../config/apiConfig.js';
export class BetTrackingService {
    constructor() {
        /**
         * Fetch all bets for a user from backend persistent storage
         */
        this.getUserBets = wrapWithRateLimit(async (userId) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/users/${userId}/bets`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY }
            });
            if (!res.ok)
                throw new Error(`Failed to fetch user bets: ${res.statusText}`);
            return (await res.json());
        });
        /**
         * Fetch analytics (ROI, streak, win/loss, etc.) for a user
         */
        this.getUserBetAnalytics = wrapWithRateLimit(async (userId) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/users/${userId}/bet-analytics`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY }
            });
            if (!res.ok)
                throw new Error(`Failed to fetch user bet analytics: ${res.statusText}`);
            return (await res.json());
        });
    }
}
export const betTrackingService = new BetTrackingService();
