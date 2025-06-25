import axios from "axios";
import { UnifiedConfig } from "../unified/UnifiedConfig";
import { UnifiedLogger } from "../unified/UnifiedLogger";
import { UnifiedCache } from "../unified/UnifiedCache";
// Browser-compatible EventEmitter
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    off(event, listener) {
        if (!this.events[event])
            return;
        this.events[event] = this.events[event].filter((l) => l !== listener);
    }
    emit(event, ...args) {
        if (!this.events[event])
            return;
        this.events[event].forEach((listener) => listener(...args));
    }
}
export class BaseService extends EventEmitter {
    constructor(name, serviceRegistry) {
        super();
        this.name = name;
        this.serviceRegistry = serviceRegistry;
        this.config = UnifiedConfig.getInstance();
        this.logger = new UnifiedLogger(this.name);
        this.cache = UnifiedCache.getInstance();
        // Initialize API client
        this.api = axios.create({
            baseURL: this.config.getApiUrl(),
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.api.interceptors.request.use((config) => {
            const token = this.config.getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            this.logger.error("Request error:", error);
            return Promise.reject(error);
        });
        this.api.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            this.logger.error("Response error:", error);
            return Promise.reject(error);
        });
    }
    handleError(error, serviceError) {
        this.logger.error(`Error in ${serviceError.source}: ${error.message}`, this.name, {
            error,
            serviceError,
        });
        // Emit error event
        this.serviceRegistry.emit("error", {
            ...serviceError,
            error: error.message,
            timestamp: Date.now(),
        });
    }
    async retry(operation, maxRetries = 3, delay = 1000) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
                }
            }
        }
        throw lastError;
    }
    getCacheKey(...parts) {
        return `${this.name}:${parts.join(":")}`;
    }
    async withCache(key, operation, ttl) {
        const cached = this.cache.get(key);
        if (cached)
            return cached;
        const result = await operation();
        this.cache.set(key, result, ttl);
        return result;
    }
    // Lifecycle methods
    async initialize() {
        this.logger.info(`Initializing ${this.name} service`, this.name);
        // Override in derived classes if needed
    }
    async cleanup() {
        this.logger.info(`Cleaning up ${this.name} service`, this.name);
        // Override in derived classes if needed
    }
    async handleRequest(request) {
        try {
            return await request();
        }
        catch (error) {
            this.logger.error("Request failed:", error);
            throw error;
        }
    }
}
