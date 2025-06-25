declare class EventEmitter {
    private listeners;
    on(event: string, fn: Function): void;
    off(event: string, fn: Function): void;
    emit(event: string, ...args: any[]): void;
}
import { WSMessage, WebSocketConfig } from "../../types/core";
export declare class WebSocketManager extends EventEmitter {
    private static instance;
    private connections;
    private readonly defaultConfig;
    private constructor();
    static getInstance(): WebSocketManager;
    connect(config?: Partial<WebSocketConfig>): void;
    private setupSocketHandlers;
    private setupHeartbeat;
    private clearHeartbeat;
    private handleReconnect;
    private processMessageQueue;
    send(url: string, message: WSMessage): void;
    disconnect(url: string): void;
    isConnected(url: string): boolean;
    getConnectionStatus(): Record<string, boolean>;
}
export declare const webSocketManager: WebSocketManager;
export {};
