import { EventEmitter } from 'events';
import { ArbitrageOpportunity } from '../../types/betting';
import { LineShoppingResult } from '../../types/betting';
export interface Notification {
    id: string;
    type: 'arbitrage' | 'lineShopping' | 'modelUpdate' | 'system';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: number;
    data?: any;
    read: boolean;
}
export interface NotificationPreferences {
    arbitrage: boolean;
    lineShopping: boolean;
    modelUpdates: boolean;
    systemAlerts: boolean;
    minProfitThreshold: number;
    minConfidenceThreshold: number;
    quietHours: {
        enabled: boolean;
        start: number;
        end: number;
    };
}
export declare class NotificationManager extends EventEmitter {
    private notifications;
    private preferences;
    private readonly MAX_NOTIFICATIONS;
    constructor();
    /**
     * Update notification preferences
     */
    updatePreferences(preferences: Partial<NotificationPreferences>): void;
    /**
     * Get current notification preferences
     */
    getPreferences(): NotificationPreferences;
    /**
     * Check if notifications should be sent based on quiet hours
     */
    private isWithinQuietHours;
    /**
     * Create a new notification
     */
    private createNotification;
    /**
     * Notify about arbitrage opportunity
     */
    notifyArbitrageOpportunity(opportunity: ArbitrageOpportunity): void;
    /**
     * Notify about line shopping opportunity
     */
    notifyLineShoppingOpportunity(result: LineShoppingResult): void;
    /**
     * Notify about model updates
     */
    notifyModelUpdate(message: string, data?: any): void;
    /**
     * Notify about system alerts
     */
    notifySystemAlert(title: string, message: string, priority?: Notification['priority']): void;
    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): void;
    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void;
    /**
     * Get all notifications
     */
    getNotifications(): Notification[];
    /**
     * Get unread notifications
     */
    getUnreadNotifications(): Notification[];
    /**
     * Clear all notifications
     */
    clearNotifications(): void;
}
