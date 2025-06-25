import EventEmitter from "eventemitter3";
import axios from "axios";
import { io } from "socket.io-client";
import { z } from "zod";
// Data source types
export var DataSource;
(function (DataSource) {
    DataSource["PRIZEPICKS"] = "prizepicks";
    DataSource["ESPN"] = "espn";
    DataSource["ODDS_API"] = "odds_api";
})(DataSource || (DataSource = {}));
// Unified response schema
const DataResponseSchema = z.object({
    source: z.nativeEnum(DataSource),
    timestamp: z.number(),
    data: z.unknown(),
    status: z.enum(["success", "error"]),
});
export class UnifiedDataService extends EventEmitter {
    constructor() {
        super();
        this.apiClients = new Map();
        this.wsConnections = new Map();
        this.cache = new Map();
        this.initializeClients();
        this.initializeWebSockets();
    }
    static getInstance() {
        if (!UnifiedDataService.instance) {
            UnifiedDataService.instance = new UnifiedDataService();
        }
        return UnifiedDataService.instance;
    }
    initializeClients() {
        // Initialize API clients
        Object.values(DataSource).forEach((source) => {
            this.apiClients.set(source, axios.create({
                baseURL: this.getBaseUrl(source),
                timeout: 10000,
            }));
        });
    }
    initializeWebSockets() {
        // Initialize WebSocket connections for each data source
        Object.values(DataSource).forEach((source) => {
            const wsUrl = this.getWebSocketUrl(source);
            // Safety checks to prevent invalid WebSocket connections
            if (!wsUrl ||
                wsUrl === "" ||
                wsUrl === "wss://api.betproai.com/ws" ||
                wsUrl.includes("api.betproai.com") ||
                wsUrl.includes("localhost:8000") ||
                wsUrl.includes("localhost:3001") ||
                import.meta.env.VITE_ENABLE_WEBSOCKET === "false") {
                console.log("WebSocket connection disabled for data source:", source, wsUrl);
                return;
            }
            const ws = new WebSocket(wsUrl);
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.emit(`ws:${source}:${data.type}`, data);
            };
            ws.onerror = (error) => {
                this.emit("error", { source, error });
            };
            this.wsConnections.set(source, ws);
        });
    }
    getBaseUrl(source) {
        // Configure base URLs for different data sources
        const urls = {
            [DataSource.PRIZEPICKS]: import.meta.env.VITE_PRIZEPICKS_API_URL,
            [DataSource.ESPN]: import.meta.env.VITE_ESPN_API_URL,
            [DataSource.ODDS_API]: import.meta.env.VITE_ODDS_API_URL,
        };
        return urls[source] || "";
    }
    getWebSocketUrl(source) {
        switch (source) {
            case DataSource.PRIZEPICKS:
                return "wss://api.prizepicks.com/ws";
            case DataSource.ODDS_API:
                return "wss://api.odds-api.com/ws";
            default:
                throw new Error(`Unknown data source: ${source}`);
        }
    }
    async fetchData(source, endpoint) {
        try {
            const response = await fetch(this.getApiUrl(source, endpoint));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            this.emit("error", { source, endpoint, error });
            throw error;
        }
    }
    getApiUrl(source, endpoint) {
        const baseUrl = this.getBaseUrl(source);
        return `${baseUrl}${endpoint}`;
    }
    async fetchDataFromApi(source, endpoint, params) {
        const cacheKey = `${source}:${endpoint}:${JSON.stringify(params)}`;
        const cached = this.cache.get(cacheKey);
        // Return cached data if it's less than 30 seconds old
        if (cached && Date.now() - cached.timestamp < 30000) {
            return {
                source,
                timestamp: cached.timestamp,
                data: cached.data,
                status: "success",
            };
        }
        try {
            const client = this.apiClients.get(source);
            if (!client)
                throw new Error(`No client found for source: ${source}`);
            const response = await client.get(endpoint, { params });
            // Cache the response
            this.cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now(),
            });
            return {
                source,
                timestamp: Date.now(),
                data: response.data,
                status: "success",
            };
        }
        catch (error) {
            this.emit("error", { source, error });
            return {
                source,
                timestamp: Date.now(),
                data: null,
                status: "error",
            };
        }
    }
    connectWebSocket(source, options) {
        if (this.wsConnections.has(source))
            return;
        const socket = io(this.getBaseUrl(source), {
            transports: ["websocket"],
            autoConnect: true,
        });
        options.events.forEach((event) => {
            socket.on(event, (data) => {
                this.emit(`ws:${source}:${event}`, data);
            });
        });
        socket.on("connect_error", (error) => {
            this.emit("ws:error", { source, error });
        });
        this.wsConnections.set(source, socket);
    }
    disconnectWebSocket(source) {
        const socket = this.wsConnections.get(source);
        if (socket) {
            socket.disconnect();
            this.wsConnections.delete(source);
        }
    }
    clearCache() {
        this.cache.clear();
    }
}
