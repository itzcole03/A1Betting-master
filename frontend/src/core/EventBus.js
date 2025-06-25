import EventEmitter from 'eventemitter3';
export class EventBus {
    constructor() {
        this.emitter = new EventEmitter();
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    once(event, listener) {
        this.emitter.once(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
    emit(event, data) {
        this.emitter.emit(event, data);
    }
    removeAllListeners(event) {
        this.emitter.removeAllListeners(event);
    }
    listenerCount(event) {
        return this.emitter.listenerCount(event);
    }
    listeners(event) {
        return this.emitter.listeners(event);
    }
    eventNames() {
        return this.emitter.eventNames();
    }
    // Add onAny/offAny methods for DebugPanel
    onAny(listener) {
        this.emitter.onAny(listener);
    }
    offAny(listener) {
        this.emitter.offAny(listener);
    }
}
// Singleton instance for convenience
export const eventBus = EventBus.getInstance();
