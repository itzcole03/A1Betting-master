// RefereeService: Provides referee stats and advanced modeling for sports events.
// Integrates with external referee APIs for real-time data.
import { wrapWithRateLimit } from '../rateLimit/wrapWithRateLimit.js';
import { API_CONFIG } from '../../config/apiConfig.js';
export class RefereeService {
    constructor() {
        /**
         * Fetch referee stats from backend/external API
         */
        this.getRefereeStats = wrapWithRateLimit(async (refereeId) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/referees/${refereeId}/stats`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY }
            });
            if (!res.ok)
                throw new Error(`Failed to fetch referee stats: ${res.statusText}`);
            return (await res.json());
        });
        /**
         * Batch fetch referee stats by IDs
         */
        this.getRefereeStatsBatch = wrapWithRateLimit(async (refereeIds) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/referees/batch`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refereeIds })
            });
            if (!res.ok)
                throw new Error(`Failed to fetch referee stats batch: ${res.statusText}`);
            return (await res.json());
        });
        /**
         * Search referees by name
         */
        this.searchReferees = wrapWithRateLimit(async (query) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/referees/search?q=${encodeURIComponent(query)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY }
            });
            if (!res.ok)
                throw new Error(`Failed to search referees: ${res.statusText}`);
            return (await res.json());
        });
        /**
         * Fetch advanced modeling/analytics for a referee
         */
        this.getRefereeModeling = wrapWithRateLimit(async (refereeId) => {
            const url = `${API_CONFIG.SPORTS_DATA.BASE_URL}/referees/${refereeId}/modeling`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY }
            });
            if (!res.ok)
                throw new Error(`Failed to fetch referee modeling: ${res.statusText}`);
            return (await res.json());
        });
    }
}
export const refereeService = new RefereeService();
