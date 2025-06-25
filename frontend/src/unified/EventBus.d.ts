import { EventMap } from '../types/core.js';
type EventHandler<T> = (data: T) => void;
export declare class EventBus {
    /**
     * Publishes an event to all registered handlers.
     * @param event The event object with type and payload.
     */
    publish<K extends keyof EventMap>(event: {
        type: K;
        payload?: EventMap[K];
    }): Promise<void>;
    private static instance;
    private handlers;
    private constructor();
    static getInstance(): EventBus;
    on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void;
    off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void;
    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void;
    clear(): void;
    getHandlerCount<K extends keyof EventMap>(event: K): number;
    hasHandlers<K extends keyof EventMap>(event: K): boolean;
}
export {};
