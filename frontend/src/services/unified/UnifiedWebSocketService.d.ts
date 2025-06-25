import { BaseService } from "./BaseService.js";
import { UnifiedServiceRegistry } from "./UnifiedServiceRegistry.js";
import { WebSocketMessage } from "../../types/webSocket.js";
export interface WebSocketConfig {
    reconnectAttempts: number;
    reconnectInterval: number;
    pingInterval: number;
    pongTimeout: number;
    messageQueueSize: number;
    autoReconnect: boolean;
    debug: boolean;
}
export declare class UnifiedWebSocketService extends BaseService {
    private url;
    private socket;
    private reconnectAttempts;
    private messageQueue;
    private isProcessingQueue;
    private subscriptions;
    private pingInterval;
    private pongTimeout;
    private lastPongTime;
    private wsConfig;
    constructor(url: string, wsConfig: WebSocketConfig | undefined, serviceRegistry: UnifiedServiceRegistry);
    connect(): Promise<void>;
    disconnect(): void;
    subscribe(channel: string, callback: (data: WebSocketMessage["data"]) => void): () => void;
    send(message: WebSocketMessage): void;
    private setupEventHandlers;
    private handleMessage;
    private handleDisconnect;
    private queueMessage;
    private processMessageQueue;
    private startPingInterval;
    private stopPingInterval;
    private setPongTimeout;
    private clearPongTimeout;
}
