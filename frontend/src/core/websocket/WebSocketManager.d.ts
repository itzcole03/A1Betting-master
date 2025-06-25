import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { UnifiedLogger } from '../logging/types';
interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
}
interface WebSocketEvents {
    message: [clientId: string, message: any, topic?: string];
    disconnect: [clientId: string];
}
export declare class WebSocketManager extends EventEmitter {
    private logger;
    private clients;
    private readonly MAX_RECONNECT_ATTEMPTS;
    private readonly RECONNECT_DELAY;
    private readonly PING_INTERVAL;
    private readonly MESSAGE_QUEUE_LIMIT;
    private pingInterval;
    constructor(logger: UnifiedLogger);
    on<K extends keyof WebSocketEvents>(event: K, listener: (...args: WebSocketEvents[K]) => void): this;
    emit<K extends keyof WebSocketEvents>(event: K, ...args: WebSocketEvents[K]): boolean;
    private startPingInterval;
    connect(socket: WebSocket): Promise<string>;
    private setupSocketHandlers;
    private handleMessage;
    private handleSubscribe;
    private handleUnsubscribe;
    private handlePing;
    private handleClientDisconnect;
    private attemptReconnect;
    private removeClient;
    sendMessage(clientId: string, message: WebSocketMessage): void;
    private queueMessage;
    private sendPing;
    private sendError;
    broadcast(message: WebSocketMessage, topic?: string): void;
    getClientCount(): number;
    getSubscriberCount(topic: string): number;
    cleanup(): void;
}
export {};
