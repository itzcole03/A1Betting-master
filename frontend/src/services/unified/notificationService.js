import { toast } from 'react-toastify';
import UnifiedSettingsService from './settingsService';
class UnifiedNotificationService {
    constructor() {
        this.notifications = [];
        this.STORAGE_KEY = 'esa_notifications';
        this.MAX_NOTIFICATIONS = 100;
        this.defaultConfig = {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };
        this.settingsService = UnifiedSettingsService.getInstance();
        this.loadNotifications();
    }
    static getInstance() {
        if (!UnifiedNotificationService.instance) {
            UnifiedNotificationService.instance = new UnifiedNotificationService();
        }
        return UnifiedNotificationService.instance;
    }
    loadNotifications() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.notifications = JSON.parse(stored);
            }
        }
        catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
        }
    }
    saveNotifications() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notifications));
        }
        catch (error) {
            console.error('Error saving notifications:', error);
        }
    }
    createNotification(type, message, title, data) {
        return {
            id: Date.now().toString(),
            type,
            message,
            title,
            timestamp: Date.now(),
            read: false,
            data,
        };
    }
    showToast(notification, options) {
        const config = { ...this.defaultConfig, ...options };
        switch (notification.type) {
            case 'success':
                toast.success(notification.message, config);
                break;
            case 'error':
                toast.error(notification.message, config);
                break;
            case 'warning':
                toast.warning(notification.message, config);
                break;
            default:
                toast.info(notification.message, config);
        }
    }
    notify(type, message, title, data, options) {
        const preferences = this.settingsService.getPreferences();
        // Check if notifications are enabled
        if (!preferences.notifications.enabled) {
            return;
        }
        // Create and store notification
        const notification = this.createNotification(type, message, title, data);
        this.notifications.unshift(notification);
        // Trim notifications if exceeding max limit
        if (this.notifications.length > this.MAX_NOTIFICATIONS) {
            this.notifications = this.notifications.slice(0, this.MAX_NOTIFICATIONS);
        }
        // Save notifications
        this.saveNotifications();
        // Show toast if appropriate
        if (preferences.notifications.desktop) {
            this.showToast(notification, options);
        }
        // Dispatch notification event
        this.dispatchNotificationEvent(notification);
    }
    dispatchNotificationEvent(notification) {
        const event = new CustomEvent('notification', {
            detail: notification,
        });
        window.dispatchEvent(event);
    }
    getNotifications() {
        return [...this.notifications];
    }
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }
    markAllAsRead() {
        this.notifications.forEach(n => (n.read = true));
        this.saveNotifications();
    }
    clearNotifications() {
        this.notifications = [];
        this.saveNotifications();
    }
    clearOldNotifications(maxAge) {
        const cutoff = Date.now() - maxAge;
        this.notifications = this.notifications.filter(n => n.timestamp > cutoff);
        this.saveNotifications();
    }
    getNotificationCount() {
        return this.notifications.length;
    }
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }
    updateConfig(config) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
    }
}
UnifiedNotificationService.instance = null;
export default UnifiedNotificationService;
