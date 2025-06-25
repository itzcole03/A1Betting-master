import { EventBus } from "../unified/EventBus.js";
import { PerformanceMonitor } from "../unified/PerformanceMonitor.js";
export class SportsRadarAdapter {
    async fetchData() {
        return this.fetch();
    }
    constructor() {
        this.id = "sports-radar";
        this.type = "sports-data";
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.config = {
            apiKey: import.meta.env.VITE_SPORTRADAR_API_KEY || "",
            baseUrl: "https://api.sportradar.com/sports/v1",
            cacheTimeout: 10000, // Assuming a default cache timeout
        };
        this.cache = {
            data: null,
            timestamp: 0,
        };
        this.apiKey = import.meta.env.VITE_SPORTRADAR_API_KEY || null;
        this.baseUrl = "https://api.sportradar.com/sports/v1";
    }
    async isAvailable() {
        try {
            const response = await fetch(`${this.config.baseUrl}/status?api_key=${this.config.apiKey}`);
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Fetches the latest SportsRadar data, using cache if valid.
     */
    async fetch() {
        const traceId = this.performanceMonitor.startTrace("sports-radar-fetch");
        try {
            if (this.isCacheValid()) {
                return this.cache.data;
            }
            const data = await this.fetchSportsRadarData();
            this.cache = {
                data,
                timestamp: Date.now(),
            };
            this.eventBus.publish({
                type: "sports-radar-updated",
                payload: { data },
            });
            this.performanceMonitor.endTrace(traceId);
            return data;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    async fetchSportsRadarData() {
        const response = await fetch(`${this.config.baseUrl}/games/schedule?api_key=${this.config.apiKey}`);
        if (!response.ok) {
            throw new Error(`SportsRadar API error: ${response.statusText}`);
        }
        return await response.json();
    }
    isCacheValid() {
        return (this.cache.data !== null &&
            Date.now() - this.cache.timestamp < this.config.cacheTimeout);
    }
    clearCache() {
        this.cache = {
            data: null,
            timestamp: 0,
        };
    }
    async connect() { }
    async disconnect() { }
    async getData() {
        return this.cache.data;
    }
    isConnected() {
        return true;
    }
    getMetadata() {
        return { id: this.id, type: this.type };
    }
    async getOdds(eventId) {
        if (!this.apiKey) {
            console.warn("SportsRadar API key not configured. Skipping odds fetch.");
            return null;
        }
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}/odds`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`SportsRadar API error: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Error fetching odds from SportsRadar:", error);
            return null;
        }
    }
    async getEventDetails(eventId) {
        if (!this.apiKey) {
            console.warn("SportsRadar API key not configured. Skipping event details fetch.");
            return null;
        }
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`SportsRadar API error: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Error fetching event details from SportsRadar:", error);
            return null;
        }
    }
}
