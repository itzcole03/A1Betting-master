// ============================================================================
// BASE     async getRecent(limit = 10) {
        if (this.config.enableMocking) {
            return this.getMockPredictions(limit);
        }
        return this.retryRequest(() => this.request(`/api/predictions?limit=${limit}`));
    }
    async getMetrics() {
        if (this.config.enableMocking) {
            return this.getMockMetrics();
        }
        return this.retryRequest(() => this.request("/api/engine/metrics"));
    }S
// ============================================================================
export class BaseService {
    constructor(config = {}) {
        this.config = {
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
            timeout: 10000,
            retries: 3,
            retryDelay: 1000,
            enableCaching: true,
            enableMocking: import.meta.env.DEV,
            ...config,
        };
    }
    async request(endpoint, options = {}) {
        const url = `${this.config.baseURL}${endpoint}`;
        const controller = new AbortController();
        // Set timeout
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAuthHeader(),
                    ...this.config.headers,
                    ...options.headers,
                },
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                data,
                success: true,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                throw new Error("Request timeout");
            }
            throw error;
        }
    }
    async retryRequest(requestFn, maxRetries = this.config.retries || 3) {
        let lastError;
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await requestFn();
            }
            catch (error) {
                lastError = error;
                if (i < maxRetries) {
                    await this.delay(this.config.retryDelay || 1000);
                }
            }
        }
        throw lastError;
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getAuthHeader() {
        if (typeof window === "undefined")
            return "";
        const token = localStorage.getItem("auth_token");
        return token ? `Bearer ${token}` : "";
    }
    getCacheKey(key, params) {
        if (!params)
            return key;
        const paramString = Object.keys(params)
            .sort()
            .map((k) => `${k}:${params[k]}`)
            .join("|");
        return `${key}:${paramString}`;
    }
}
// ============================================================================
// PREDICTION SERVICE
// ============================================================================
export class UniversalPredictionService extends BaseService {
    async getRecentPredictions(limit = 10) {
        if (this.config.enableMocking) {
            return this.getMockPredictions(limit);
        }
        return this.retryRequest(() => this.request(`/api/predictions?limit=${limit}`));
    }
    async getEngineMetrics() {
        if (this.config.enableMocking) {
            return this.getMockMetrics();
        }
        return this.retryRequest(() => this.request("/api/engine/metrics"));
    }
    async createPrediction(data) {
        return this.retryRequest(() => this.request("/predictions", {
            method: "POST",
            body: JSON.stringify(data),
        }));
    }
    async updatePrediction(id, data) {
        return this.retryRequest(() => this.request(`/predictions/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }));
    }
    async getMockPredictions(limit) {
        await this.delay(500); // Simulate network delay
        const mockPredictions = Array.from({ length: limit }, (_, i) => ({
            id: `pred_${i + 1}`,
            game: `Game ${i + 1}`,
            prediction: Math.random() * 100,
            confidence: 75 + Math.random() * 25,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            potentialWin: 100 + Math.random() * 500,
            odds: Math.random() > 0.5
                ? Math.floor(Math.random() * 200) + 100
                : -(Math.floor(Math.random() * 200) + 100),
            status: ["pending", "won", "lost"][Math.floor(Math.random() * 3)],
        }));
        return {
            data: mockPredictions,
            success: true,
            timestamp: new Date().toISOString(),
        };
    }
    async getMockMetrics() {
        await this.delay(300);
        return {
            data: {
                totalPredictions: 1247,
                accuracy: 89.3,
                totalProfit: 47230,
                winRate: 85.6,
                dataQuality: 94.2,
            },
            success: true,
            timestamp: new Date().toISOString(),
        };
    }
}
// ============================================================================
// BETTING SERVICE
// ============================================================================
export class UniversalBettingService extends BaseService {
    async getOpportunities() {
        if (this.config.enableMocking) {
            return this.getMockOpportunities();
        }
        return this.retryRequest(() => this.request("/api/betting/opportunities"));
    }
    async placeBet(opportunity) {
        return this.retryRequest(() => this.request("/betting/place", {
            method: "POST",
            body: JSON.stringify(opportunity),
        }));
    }
    async getBetHistory(userId) {
        return this.retryRequest(() => this.request(`/betting/history/${userId}`));
    }
    async getMockOpportunities() {
        await this.delay(400);
        const mockOpportunities = Array.from({ length: 5 }, (_, i) => ({
            id: `opp_${i + 1}`,
            sport: ["NFL", "NBA", "MLB", "NHL"][Math.floor(Math.random() * 4)],
            game: `Team A vs Team B ${i + 1}`,
            type: ["spread", "total", "moneyline"][Math.floor(Math.random() * 3)],
            odds: Math.random() > 0.5
                ? Math.floor(Math.random() * 200) + 100
                : -(Math.floor(Math.random() * 200) + 100),
            confidence: 70 + Math.random() * 30,
            expectedValue: Math.random() * 0.2,
            stake: 100,
            potentialReturn: 150 + Math.random() * 300,
            book: ["DraftKings", "FanDuel", "BetMGM"][Math.floor(Math.random() * 3)],
        }));
        return {
            data: mockOpportunities,
            success: true,
            timestamp: new Date().toISOString(),
        };
    }
}
// ============================================================================
// USER SERVICE
// ============================================================================
export class UniversalUserService extends BaseService {
    async getProfile() {
        if (this.config.enableMocking) {
            return this.getMockProfile();
        }
        return this.retryRequest(() => this.request("/user/profile"));
    }
    async updateProfile(data) {
        return this.retryRequest(() => this.request("/user/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }));
    }
    async updatePreferences(preferences) {
        return this.retryRequest(() => this.request("/user/preferences", {
            method: "PUT",
            body: JSON.stringify({ preferences }),
        }));
    }
    async getMockProfile() {
        await this.delay(300);
        return {
            data: {
                id: "user_1",
                name: "Alex Chen",
                email: "alex@example.com",
                tier: "Pro",
                balance: 127430.5,
                totalProfit: 47230,
                accuracy: 89.3,
                winRate: 85.6,
                preferences: {
                    notifications: true,
                    autobet: false,
                    riskLevel: "medium",
                },
            },
            success: true,
            timestamp: new Date().toISOString(),
        };
    }
}
// ============================================================================
// ANALYTICS SERVICE
// ============================================================================
export class UniversalAnalyticsService extends BaseService {
    async getPerformanceMetrics(timeRange = "7d") {
        return this.retryRequest(() => this.request(`/analytics/performance?range=${timeRange}`));
    }
    async getMLInsights() {
        return this.retryRequest(() => this.request("/analytics/ml-insights"));
    }
    async getMarketAnalysis() {
        return this.retryRequest(() => this.request("/analytics/market"));
    }
}
// ============================================================================
// SERVICE FACTORY
// ============================================================================
export class UniversalServiceFactory {
    static configure(config) {
        this.config = { ...this.config, ...config };
    }
    static getPredictionService() {
        if (!this.instances.has("prediction")) {
            this.instances.set("prediction", new UniversalPredictionService(this.config));
        }
        return this.instances.get("prediction");
    }
    static getBettingService() {
        if (!this.instances.has("betting")) {
            this.instances.set("betting", new UniversalBettingService(this.config));
        }
        return this.instances.get("betting");
    }
    static getUserService() {
        if (!this.instances.has("user")) {
            this.instances.set("user", new UniversalUserService(this.config));
        }
        return this.instances.get("user");
    }
    static getAnalyticsService() {
        if (!this.instances.has("analytics")) {
            this.instances.set("analytics", new UniversalAnalyticsService(this.config));
        }
        return this.instances.get("analytics");
    }
    static clearInstances() {
        this.instances.clear();
    }
}
UniversalServiceFactory.instances = new Map();
UniversalServiceFactory.config = {};
// ============================================================================
// REACT QUERY INTEGRATION
// ============================================================================
export const createQueryKeys = {
    predictions: {
        all: ["predictions"],
        recent: (limit) => ["predictions", "recent", limit],
        metrics: () => ["predictions", "metrics"],
    },
    betting: {
        all: ["betting"],
        opportunities: () => ["betting", "opportunities"],
        history: (userId) => ["betting", "history", userId],
    },
    user: {
        all: ["user"],
        profile: () => ["user", "profile"],
    },
    analytics: {
        all: ["analytics"],
        performance: (range) => ["analytics", "performance", range],
        insights: () => ["analytics", "ml-insights"],
        market: () => ["analytics", "market"],
    },
};
// Default query configurations
export const defaultQueryConfig = {
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
};
// ============================================================================
// EXPORTS
// ============================================================================
export default UniversalServiceFactory;
