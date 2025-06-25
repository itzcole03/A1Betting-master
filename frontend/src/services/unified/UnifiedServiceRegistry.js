import { UnifiedErrorService } from './UnifiedErrorService.js';
import { UnifiedAnalyticsService } from './UnifiedAnalyticsService.js';
import { UnifiedBettingService } from './UnifiedBettingService.js';
import { UnifiedPredictionService } from './UnifiedPredictionService.js';
import { UnifiedStateService } from './UnifiedStateService.js';
import { UnifiedWebSocketService } from './UnifiedWebSocketService.js';
import { UnifiedNotificationService } from './UnifiedNotificationService.js';
import { UnifiedLogger } from '../unified/UnifiedLogger.js';
export class UnifiedServiceRegistry {
    constructor() {
        this.eventHandlers = new Map();
        this.services = new Map();
        this.logger = UnifiedLogger.getInstance();
        this.initializeServices();
    }
    static getInstance() {
        if (!UnifiedServiceRegistry.instance) {
            UnifiedServiceRegistry.instance = new UnifiedServiceRegistry();
        }
        return UnifiedServiceRegistry.instance;
    }
    initializeServices() {
        // Initialize core services first
        const errorService = UnifiedErrorService.getInstance(this);
        this.services.set('error', errorService);
        // Initialize other services
        this.services.set('analytics', new UnifiedAnalyticsService(this));
        this.services.set('betting', UnifiedBettingService.getInstance(this));
        this.services.set('prediction', UnifiedPredictionService.getInstance(this));
        this.services.set('state', new UnifiedStateService(this));
        this.services.set('websocket', new UnifiedWebSocketService('/ws', undefined, this));
        this.services.set('notification', new UnifiedNotificationService(this));
    }
    registerService(name, service) {
        this.services.set(name, service);
    }
    getService(name) {
        return this.services.get(name);
    }
    hasService(name) {
        return this.services.has(name);
    }
    removeService(name) {
        this.services.delete(name);
    }
    getServiceNames() {
        return Array.from(this.services.keys());
    }
    async initialize() {
        this.logger.info('Initializing service registry', 'UnifiedServiceRegistry');
        // Initialize all registered services
        for (const service of this.services.values()) {
            try {
                await service.initialize?.();
            }
            catch (error) {
                this.logger.error(`Error initializing service ${service.constructor.name}`, 'UnifiedServiceRegistry', error);
            }
        }
    }
    async cleanup() {
        this.logger.info('Cleaning up service registry', 'UnifiedServiceRegistry');
        // Clean up all registered services
        for (const service of this.services.values()) {
            try {
                await service.cleanup?.();
            }
            catch (error) {
                this.logger.error(`Error cleaning up service ${service.constructor.name}`, 'UnifiedServiceRegistry', error);
            }
        }
        this.services.clear();
        this.eventHandlers.clear();
    }
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
    }
    off(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.eventHandlers.delete(event);
            }
        }
    }
    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                }
                catch (error) {
                    this.logger.error(`Error in event handler for ${event}`, 'UnifiedServiceRegistry', error);
                }
            });
        }
    }
    getServices() {
        return new Map(this.services);
    }
}
