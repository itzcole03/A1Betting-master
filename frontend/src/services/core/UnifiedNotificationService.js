import { UnifiedLogger } from '@/core/UnifiedLogger';
import { WebSocket } from 'ws';
export class UnifiedNotificationService {
    constructor(registry) {
        this.MAX_QUEUE_SIZE = 1000;
        this.logger = UnifiedLogger.getInstance();
        this.wsClients = new Set();
        this.notificationQueue = [];
    }
    static getInstance(registry) {
        if (!UnifiedNotificationService.instance) {
            UnifiedNotificationService.instance = new UnifiedNotificationService(registry);
        }
        return UnifiedNotificationService.instance;
    }
    addWebSocketClient(ws) {
        this.wsClients.add(ws);
        this.logger.info('New WebSocket client connected', 'notification');
        ws.on('close', () => {
            this.wsClients.delete(ws);
            this.logger.info('WebSocket client disconnected', 'notification');
        });
    }
    sendNotification(notification) {
        // Add to queue
        this.notificationQueue.push(notification);
        if (this.notificationQueue.length > this.MAX_QUEUE_SIZE) {
            this.notificationQueue.shift(); // Remove oldest notification
        }
        // Log notification
        this.logger.info(`Notification: ${notification.title} - ${notification.message}`, 'notification', notification);
        // Broadcast to WebSocket clients
        this.broadcastNotification(notification);
    }
    broadcastNotification(notification) {
        const message = JSON.stringify(notification);
        this.wsClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
    getNotifications(count = 10) {
        return this.notificationQueue.slice(-count);
    }
    clearNotifications() {
        this.notificationQueue = [];
    }
    getActiveClientsCount() {
        return this.wsClients.size;
    }
}
