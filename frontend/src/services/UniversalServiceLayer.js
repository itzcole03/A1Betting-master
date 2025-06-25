// ============================================================================
// BASE SERVICE CLASS
// ============================================================================
export class BaseService {
    constructor(config = {}) {
        this.config = {
            baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
            timeout: 10000,
            retries: 3,
            retryDelay: 1000,
            enableCaching: true,
            enableMocking: false, // Disabled for production
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
    async retryRequest(requestFn, attempt = 1) {
        try {
            return await requestFn();
        }
        catch (error) {
            if (attempt < this.config.retries &&
                (error.name === "AbortError" || error.message.includes("timeout"))) {
                await this.delay(this.config.retryDelay * attempt);
                return this.retryRequest(requestFn, attempt + 1);
            }
            throw error;
        }
    }
    async delay(ms) {
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
    async getRecent(limit = 10) {
        return this.retryRequest(() => this.request(`/api/predictions?limit=${limit}`));
    }

    async getMetrics() {
        return this.retryRequest(() => this.request("/api/engine/metrics"));
    }

    async createPrediction(data) {
        return this.retryRequest(() => this.request("/api/predictions", {
            method: "POST",
            body: JSON.stringify(data),
        }));
    }

    async updatePrediction(id, data) {
        return this.retryRequest(() => this.request(`/api/predictions/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }));
    }
}

// ============================================================================
// BETTING SERVICE
// ============================================================================
export class UniversalBettingService extends BaseService {
    async getOpportunities(options = {}) {
        const params = new URLSearchParams();
        if (options.limit) params.append('limit', options.limit);
        if (options.sport) params.append('sport', options.sport);
        const queryString = params.toString();
        const endpoint = `/api/betting/opportunities${queryString ? '?' + queryString : ''}`;
        return this.retryRequest(() => this.request(endpoint));
    }

    async placeBet(opportunity) {
        return this.retryRequest(() => this.request("/api/betting/place", {
            method: "POST",
            body: JSON.stringify(opportunity),
        }));
    }

    async getBetHistory(userId) {
        return this.retryRequest(() => this.request(`/api/betting/history/${userId}`));
    }
}

// ============================================================================
// USER SERVICE
// ============================================================================
export class UniversalUserService extends BaseService {
    async getProfile() {
        return this.retryRequest(() => this.request("/api/users/profile"));
    }

    async getMockProfile() {
        return this.retryRequest(() => this.request("/api/users/profile/mock"));
    }

    async updateProfile(data) {
        return this.retryRequest(() => this.request("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }));
    }

    async getBankroll() {
        return this.retryRequest(() => this.request("/api/users/bankroll"));
    }
}

// ============================================================================
// QUERY KEYS AND CONFIG
// ============================================================================
export const createQueryKeys = {
    predictions: {
        all: () => ['predictions'],
        recent: (limit) => ['predictions', 'recent', limit],
        metrics: () => ['predictions', 'metrics'],
    },
    betting: {
        all: () => ['betting'],
        opportunities: (sport, limit) => ['betting', 'opportunities', sport, limit],
        history: (userId) => ['betting', 'history', userId],
    },
    user: {
        all: () => ['user'],
        profile: () => ['user', 'profile'],
        bankroll: () => ['user', 'bankroll'],
    },
};

export const defaultQueryConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// ============================================================================
// FACTORY
// ============================================================================
export class UniversalServiceFactory {
    static predictionService = null;
    static bettingService = null;
    static userService = null;

    static getPredictionService() {
        if (!this.predictionService) {
            this.predictionService = new UniversalPredictionService();
        }
        return this.predictionService;
    }

    static getBettingService() {
        if (!this.bettingService) {
            this.bettingService = new UniversalBettingService();
        }
        return this.bettingService;
    }

    static getUserService() {
        if (!this.userService) {
            this.userService = new UniversalUserService();
        }
        return this.userService;
    }

    static reset() {
        this.predictionService = null;
        this.bettingService = null;
        this.userService = null;
    }
}
