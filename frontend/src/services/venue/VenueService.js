// VenueService: Provides venue information and advanced modeling for sports events.
import axios from 'axios';
export class VenueService {
    /**
     * Fetch venue by ID from external API
     */
    async getVenueById(venueId) {
        try {
            const res = await axios.get(`/api/venues/${venueId}`);
            return res.data;
        }
        catch (_err) {
            // fallback to null if not found
            return null;
        }
    }
    /**
     * Search venues by name/city/state
     */
    async searchVenues(query) {
        const res = await axios.get(`/api/venues?search=${encodeURIComponent(query)}`);
        return res.data;
    }
    /**
     * Batch fetch venues by IDs
     */
    async getVenuesByIds(ids) {
        const res = await axios.post(`/api/venues/batch`, { ids });
        return res.data;
    }
    /**
     * Advanced modeling endpoint for venue analytics.
     * Integrates with backend ML/analytics API for venue modeling.
     */
    async getVenueModeling(venueId) {
        // Example: Replace with real API call when available
        // const response = await axios.get<{ venueId: string; model: string; score: number }>(`/api/venues/${venueId}/modeling`);
        // return response.data;
        throw new Error('Venue modeling integration not yet implemented. Please connect to the backend ML/analytics API.');
    }
}
export const venueService = new VenueService();
