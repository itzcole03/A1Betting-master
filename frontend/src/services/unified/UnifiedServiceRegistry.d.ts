import { WebSocketMessage } from '../../types/webSocket.js';
type EventHandler = (data: WebSocketMessage['data']) => void;
export declare class UnifiedServiceRegistry {
    private static instance;
    private services;
    private eventHandlers;
    private logger;
    private constructor();
    static getInstance(): UnifiedServiceRegistry;
    private initializeServices;
    registerService<T>(name: string, service: T): void;
    getService<T>(name: string): T | undefined;
    hasService(name: string): boolean;
    removeService(name: string): void;
    getServiceNames(): string[];
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    on(event: string, handler: EventHandler): void;
    off(event: string, handler: EventHandler): void;
    emit(event: string, data: WebSocketMessage['data'] | unknown): void;
    getServices(): Map<string, unknown>;
}
export {};
