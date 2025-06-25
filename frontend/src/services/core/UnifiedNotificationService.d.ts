import { UnifiedServiceRegistry } from '../unified/UnifiedServiceRegistry';
import { WebSocket } from 'ws';
export interface Notification {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: number;
    metadata?: Record<string, any>;
}
export declare class UnifiedNotificationService {
    private static instance;
    private logger;
    private wsClients;
    private notificationQueue;
    private readonly MAX_QUEUE_SIZE;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedNotificationService;
    addWebSocketClient(ws: WebSocket): void;
    sendNotification(notification: Notification): void;
    private broadcastNotification;
    getNotifications(count?: number): Notification[];
    clearNotifications(): void;
    getActiveClientsCount(): number;
}
