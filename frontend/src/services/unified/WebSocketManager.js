// Minimal browser-compatible EventEmitter
class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    }
    off(event, fn) {
        if (!this.listeners[event])
            return;
        this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
    }
    emit(event, ...args) {
        (this.listeners[event] || []).forEach((fn) => fn(...args));
    }
}
import { useAppStore } from "../../stores/appStore";
export class WebSocketManager extends EventEmitter {
    constructor() {
        super();
        this.connections = new Map();
        this.defaultConfig = {
            url: typeof import.meta !== "undefined" &&
                import.meta.env &&
                import.meta.env.VITE_WS_URL
                ? import.meta.env.VITE_WS_URL
                : "",
            reconnectInterval: 1000,
            maxRetries: 5,
        };
    }
    static getInstance() {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }
    connect(config = {}) {
        console.log("WebSocketManager.connect() called with config:", config);
        const fullConfig = { ...this.defaultConfig, ...config };
        console.log("Full WebSocket config:", fullConfig);
        // Skip connection if WebSocket is disabled or no valid URL is configured
        if (!fullConfig.url ||
            fullConfig.url === "" ||
            fullConfig.url === "wss://api.betproai.com/ws" ||
            fullConfig.url.includes("api.betproai.com") ||
            import.meta.env.VITE_ENABLE_WEBSOCKET === "false") {
            console.log("WebSocket connection disabled. To enable: set VITE_WS_URL and VITE_ENABLE_WEBSOCKET=true in environment variables.");
            return;
        }
        const userId = useAppStore.getState().user?.id;
        const clientId = userId || `anon_client_${Math.random().toString(36).substring(2, 10)}`;
        const wsUrl = `${fullConfig.url}?client_id=${encodeURIComponent(clientId)}`;
        if (this.connections.has(wsUrl)) {
            return;
        }
        const connection = {
            socket: new WebSocket(wsUrl),
            messageQueue: [],
            isConnected: false,
            reconnectAttempts: 0,
        };
        this.setupSocketHandlers(connection, fullConfig);
        this.connections.set(wsUrl, connection);
    }
    setupSocketHandlers(connection, config) {
        const { socket } = connection;
        socket.onopen = () => {
            connection.isConnected = true;
            connection.reconnectAttempts = 0;
            this.processMessageQueue(connection);
            this.setupHeartbeat(connection, config);
            this.emit("connected", config.url);
        };
        socket.onclose = () => {
            connection.isConnected = false;
            this.clearHeartbeat(connection);
            this.emit("disconnected", config.url);
            this.handleReconnect(connection, config);
        };
        socket.onerror = (error) => {
            console.warn(`WebSocket error for ${config.url}:`, error);
            this.emit("error", { url: config.url, error });
        };
        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.emit("message", { url: config.url, message });
            }
            catch (error) {
                this.emit("error", {
                    url: config.url,
                    error: new Error("Failed to parse WebSocket message"),
                });
            }
        };
    }
    setupHeartbeat(connection, config) {
        connection.heartbeatTimer = setInterval(() => {
            if (connection.isConnected) {
                this.send(config.url, {
                    type: "ping",
                    data: {},
                    timestamp: Date.now(),
                });
            }
        }, config.reconnectInterval);
    }
    clearHeartbeat(connection) {
        if (connection.heartbeatTimer) {
            clearInterval(connection.heartbeatTimer);
            connection.heartbeatTimer = undefined;
        }
    }
    handleReconnect(connection, config) {
        if (connection.reconnectAttempts < config.maxRetries) {
            connection.reconnectAttempts++;
            console.log(`WebSocket reconnection attempt ${connection.reconnectAttempts}/${config.maxRetries} for ${config.url}`);
            setTimeout(() => {
                this.connect(config);
            }, config.reconnectInterval *
                Math.pow(2, connection.reconnectAttempts - 1));
        }
        else {
            console.warn(`Max WebSocket reconnection attempts reached for ${config.url}`);
            this.emit("reconnect_failed", config.url);
        }
    }
    processMessageQueue(connection) {
        while (connection.messageQueue.length > 0) {
            const message = connection.messageQueue.shift();
            if (message) {
                connection.socket.send(JSON.stringify(message));
            }
        }
    }
    send(url, message) {
        const connection = this.connections.get(url);
        if (!connection) {
            throw new Error(`No WebSocket connection found for URL: ${url}`);
        }
        if (connection.isConnected) {
            connection.socket.send(JSON.stringify(message));
        }
        else {
            connection.messageQueue.push(message);
        }
    }
    disconnect(url) {
        const connection = this.connections.get(url);
        if (connection) {
            this.clearHeartbeat(connection);
            connection.socket.close();
            this.connections.delete(url);
        }
    }
    isConnected(url) {
        return this.connections.get(url)?.isConnected ?? false;
    }
    getConnectionStatus() {
        const status = {};
        Array.from(this.connections.entries()).forEach(([url, connection]) => {
            status[url] = connection.isConnected;
        });
        return status;
    }
}
export const webSocketManager = WebSocketManager.getInstance();
