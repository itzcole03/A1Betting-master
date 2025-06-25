class SimpleEventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, listener) {
        if (!this.listeners[event])
            this.listeners[event] = [];
        this.listeners[event].push(listener);
    }
    off(event, listener) {
        if (!this.listeners[event])
            return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
    emit(event, ...args) {
        if (!this.listeners[event])
            return;
        for (const l of this.listeners[event])
            l(...args);
    }
}
import { API_CONFIG } from '../config/apiConfig.js';
import { wrapWithRateLimit } from './rateLimit/wrapWithRateLimit.js';
// Data source types
export var DataSource;
(function (DataSource) {
    DataSource["PRIZEPICKS"] = "prizepicks";
    DataSource["ESPN"] = "espn";
    DataSource["ODDS_API"] = "odds_api";
})(DataSource || (DataSource = {}));
export class UnifiedDataService extends SimpleEventEmitter {
    constructor() {
        super();
        /**
         * Fetch data from a backend API, with caching and rate limiting.
         */
        this.fetchData = wrapWithRateLimit(async (source, endpoint, params) => {
            const cacheKey = `${source}:${endpoint}:${params ? JSON.stringify(params) : ''}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < 30000) {
                return {
                    source,
                    timestamp: cached.timestamp,
                    data: cached.data,
                    status: 'success',
                };
            }
            try {
                const baseUrl = this.getBaseUrl(source);
                const url = new URL(endpoint, baseUrl);
                if (params) {
                    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
                }
                const res = await fetch(url.toString(), {
                    method: 'GET',
                    headers: { 'x-api-key': API_CONFIG.SPORTS_DATA.API_KEY },
                });
                if (!res.ok)
                    throw new Error(`Failed to fetch data: ${res.statusText}`);
                const data = (await res.json());
                this.cache.set(cacheKey, { data, timestamp: Date.now() });
                return {
                    source,
                    timestamp: Date.now(),
                    data,
                    status: 'success',
                };
            }
            catch (error) {
                this.emit('error', { source, error });
                return {
                    source,
                    timestamp: Date.now(),
                    data: null,
                    status: 'error',
                };
            }
        });
        this.wsConnections = new Map();
        this.cache = new Map();
    }
    static getInstance() {
        if (!UnifiedDataService.instance) {
            UnifiedDataService.instance = new UnifiedDataService();
        }
        return UnifiedDataService.instance;
    }
    getBaseUrl(source) {
        switch (source) {
            case DataSource.PRIZEPICKS:
                return API_CONFIG.SPORTS_DATA.BASE_URL;
            case DataSource.ESPN:
                return API_CONFIG.NEWS.BASE_URL;
            case DataSource.ODDS_API:
                return API_CONFIG.ODDS_DATA.BASE_URL;
            default:
                return '';
        }
    }
    connectWebSocket(source, options) {
        if (this.wsConnections.has(source))
            return;
        if (!io || typeof io !== 'function')
            return;
        // @ts-expect-error: dynamic import fallback for socket.io-client
        const socket = io(this.getBaseUrl(source), { transports: ['websocket'], autoConnect: true });
        options.events.forEach(event => {
            socket.on(event, (data) => {
                this.emit(`ws:${source}:${event}`, data);
            });
        });
        socket.on('connect_error', (error) => {
            this.emit('ws:error', { source, error });
        });
        this.wsConnections.set(source, socket);
    }
    disconnectWebSocket(source) {
        const socket = this.wsConnections.get(source);
        if (socket && typeof socket.disconnect === 'function') {
            socket.disconnect();
            this.wsConnections.delete(source);
        }
    }
    clearCache() {
        this.cache.clear();
    }
}
