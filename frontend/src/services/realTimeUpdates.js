import { notificationService } from "./notification.js";
// import { useWebSocket } from "@/hooks/useWebSocket.js"; // No longer used in service layer
/**
 * Real-time updates feature flag and env config.
 */
const VITE_DISABLE_REALTIME = import.meta.env.VITE_DISABLE_REALTIME === "true";
const VITE_WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
function reportRealtimeStatus(source, connected, quality) {
    if (typeof window !== "undefined" && window.appStatus) {
        window.appStatus["realtime"] = {
            connected,
            quality,
            timestamp: Date.now(),
        };
    }
    // Optionally: emit event or log
    console.info(`[RealTimeUpdatesService] ${source} status:`, {
        connected,
        quality,
    });
}
class RealTimeUpdatesService {
    constructor() {
        this.liveOdds = new Map();
        this.injuries = new Map();
        this.lineMovements = new Map();
        this.breakingNews = new Map();
        this.predictions = new Map();
        this.subscribers = new Map();
        this.CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
        this.cache = new Map();
        // WebSocket logic is now handled outside the class for React compliance
        this.ws = null;
        this.connected = false;
        if (!VITE_DISABLE_REALTIME) {
            this.initializeWebSocket();
        }
        else {
            reportRealtimeStatus("disabled", false, 0);
        }
    }
    /**
     * Returns the singleton instance of RealTimeUpdatesService.
     */
    static getInstance() {
        if (!RealTimeUpdatesService.instance) {
            RealTimeUpdatesService.instance = new RealTimeUpdatesService();
        }
        return RealTimeUpdatesService.instance;
    }
    /**
     * Initialize the WebSocket connection for real-time updates.
     * Reports connection status for UI.
     */
    /**
     * Initialize the WebSocket connection for real-time updates.
     * Reports connection status for UI.
     */
    initializeWebSocket() {
        // Safety checks to prevent invalid WebSocket connections
        if (!VITE_WS_URL ||
            VITE_WS_URL === "" ||
            VITE_WS_URL === "wss://api.betproai.com/ws" ||
            VITE_WS_URL.includes("api.betproai.com") ||
            VITE_WS_URL.includes("localhost:3000") ||
            VITE_WS_URL.includes("localhost:8000") ||
            VITE_WS_URL.includes("localhost:3001") ||
            import.meta.env.VITE_ENABLE_WEBSOCKET === "false" ||
            VITE_DISABLE_REALTIME) {
            console.log("WebSocket connection disabled for realtime updates service:", VITE_WS_URL);
            reportRealtimeStatus("websocket", false, 0);
            return;
        }
        // Use a standard WebSocket for non-React environments
        this.ws = new WebSocket(VITE_WS_URL);
        this.ws.onopen = () => reportRealtimeStatus("websocket", true, 1);
        this.ws.onerror = () => reportRealtimeStatus("websocket", false, 0.5);
        this.ws.onclose = () => reportRealtimeStatus("websocket", false, 0);
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "odds:update":
                        if (this.isLiveOdds(data.payload))
                            this.updateLiveOdds(data.payload);
                        break;
                    case "injury:update":
                        if (this.isInjuryUpdate(data.payload))
                            this.updateInjuryStatus(data.payload);
                        break;
                    case "line:movement":
                        if (this.isLineMovement(data.payload))
                            this.recordLineMovement(data.payload);
                        break;
                    case "news:update":
                        if (this.isBreakingNews(data.payload))
                            this.addBreakingNews(data.payload);
                        break;
                    case "prediction:update":
                        if (this.isPrediction(data.payload))
                            this.updatePrediction(data.payload);
                        break;
                }
            }
            catch (err) {
                console.warn("Failed to parse WebSocket message:", err);
            }
        };
    }
    // Live Odds
    /**
     * Returns the latest live odds for a given propId, using cache if available.
     */
    async getLiveOdds(propId) {
        const cacheKey = `odds_${propId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached &&
            typeof cached === "object" &&
            cached !== null &&
            "propId" in cached &&
            "value" in cached &&
            "overMultiplier" in cached &&
            "underMultiplier" in cached) {
            return cached;
        }
        const odds = this.liveOdds.get(propId);
        if (odds) {
            this.setCache(cacheKey, odds);
        }
        return odds || null;
    }
    /**
     * Updates the live odds and notifies subscribers.
     */
    async updateLiveOdds(odds) {
        this.liveOdds.set(odds.propId, odds);
        this.notifySubscribers("odds", odds);
        this.setCache(`odds_${odds.propId}`, odds);
    }
    // Injury Updates
    async getInjuryUpdate(playerId) {
        return this.injuries.get(playerId) || null;
    }
    async updateInjuryStatus(update) {
        this.injuries.set(update.playerId, update);
        this.notifySubscribers("injury", update);
        if (update.status === "out" || update.status === "questionable") {
            notificationService.notify("warning", `${update.playerName} (${update.team}) is ${update.status} - ${update.injury}`);
        }
    }
    // Line Movements
    async getLineMovements(propId) {
        return this.lineMovements.get(propId) || [];
    }
    async recordLineMovement(movement) {
        const movements = this.lineMovements.get(movement.propId) || [];
        movements.push(movement);
        this.lineMovements.set(movement.propId, movements);
        this.notifySubscribers("lineMovement", movement);
        if (Math.abs(movement.newValue - movement.oldValue) >= 0.5) {
            notificationService.notify("info", `Line moved ${movement.direction} from ${movement.oldValue} to ${movement.newValue}`);
        }
    }
    // Breaking News
    async getBreakingNews() {
        return Array.from(this.breakingNews.values()).sort((a, b) => b.timestamp - a.timestamp);
    }
    async addBreakingNews(news) {
        this.breakingNews.set(news.id, news);
        this.notifySubscribers("breakingNews", news);
        if (news.impact === "high") {
            notificationService.notify("error", news.title);
        }
    }
    // Predictions
    async getPrediction(id) {
        return this.predictions.get(id) || null;
    }
    async updatePrediction(prediction) {
        this.predictions.set(prediction.id, prediction);
        this.notifySubscribers("prediction", prediction);
    }
    // Subscription System
    /**
     * Subscribe to a real-time update event.
     * Returns an unsubscribe function.
     */
    subscribe(type, callback) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }
        this.subscribers.get(type).add(callback);
        return () => {
            const subscribers = this.subscribers.get(type);
            if (subscribers) {
                subscribers.delete(callback);
            }
        };
    }
    /**
     * Notify all subscribers of a given event type.
     */
    notifySubscribers(type, data) {
        const subscribers = this.subscribers.get(type);
        if (subscribers) {
            subscribers.forEach((callback) => callback(data));
        }
    }
    // Sport-specific Updates
    async getSportUpdates(sport) {
        const cacheKey = `sport_updates_${sport}`;
        const cached = this.getFromCache(cacheKey);
        if (cached &&
            typeof cached === "object" &&
            cached !== null &&
            "odds" in cached &&
            "injuries" in cached &&
            "lineMovements" in cached &&
            "news" in cached &&
            "predictions" in cached &&
            Array.isArray(cached.odds) &&
            Array.isArray(cached.injuries) &&
            Array.isArray(cached.lineMovements) &&
            Array.isArray(cached.news) &&
            Array.isArray(cached.predictions)) {
            return cached;
        }
        const updates = {
            odds: Array.from(this.liveOdds.values()).filter((odds) => odds.propId.startsWith(sport)),
            injuries: Array.from(this.injuries.values()).filter((injury) => injury.team.startsWith(sport)),
            lineMovements: Array.from(this.lineMovements.values())
                .flat()
                .filter((movement) => movement.propId.startsWith(sport)),
            news: Array.from(this.breakingNews.values()).filter((news) => news.title.toLowerCase().includes(sport.toLowerCase())),
            predictions: Array.from(this.predictions.values()).filter((prediction) => typeof prediction.event === "string" &&
                prediction.event.toLowerCase().includes(sport.toLowerCase())),
        };
        this.setCache(cacheKey, updates);
        return updates;
    }
    // Cache Management
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
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    /**
     * Returns true if the real-time service is connected.
     */
    isConnected() {
        return !VITE_DISABLE_REALTIME && this.connected;
    }
    /**
     * Production real-time service only - no simulation fallback
     */
    simulateRealtime() {
        // Production mode - no simulation
        console.warn("Real-time simulation disabled in production");
        return;
    }
    // Type guards for event payloads
    isLiveOdds(data) {
        return (typeof data === "object" &&
            data !== null &&
            "propId" in data &&
            "value" in data);
    }
    isInjuryUpdate(data) {
        return (typeof data === "object" &&
            data !== null &&
            "playerId" in data &&
            "status" in data);
    }
    isLineMovement(data) {
        return (typeof data === "object" &&
            data !== null &&
            "propId" in data &&
            "oldValue" in data &&
            "newValue" in data);
    }
    isBreakingNews(data) {
        return (typeof data === "object" &&
            data !== null &&
            "id" in data &&
            "title" in data);
    }
    isPrediction(data) {
        return (typeof data === "object" &&
            data !== null &&
            "id" in data &&
            "prediction" in data);
    }
}
// TODO: Add comprehensive unit and integration tests for all fallback and error-handling logic.
export const realTimeUpdates = RealTimeUpdatesService.getInstance();
if (VITE_DISABLE_REALTIME) {
    realTimeUpdates.simulateRealtime();
}
