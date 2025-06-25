import { ToastOptions } from 'react-toastify';
interface NotificationConfig {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    draggable: boolean;
    progress: number | undefined;
}
interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    title?: string;
    timestamp: number;
    read: boolean;
    data?: any;
}
declare class UnifiedNotificationService {
    private static instance;
    private readonly settingsService;
    private notifications;
    private readonly STORAGE_KEY;
    private readonly MAX_NOTIFICATIONS;
    private defaultConfig;
    protected constructor();
    static getInstance(): UnifiedNotificationService;
    private loadNotifications;
    private saveNotifications;
    private createNotification;
    private showToast;
    notify(type: Notification['type'], message: string, title?: string, data?: any, options?: ToastOptions): void;
    private dispatchNotificationEvent;
    getNotifications(): Notification[];
    getUnreadNotifications(): Notification[];
    markAsRead(id: string): void;
    markAllAsRead(): void;
    clearNotifications(): void;
    clearOldNotifications(maxAge: number): void;
    getNotificationCount(): number;
    getUnreadCount(): number;
    updateConfig(config: Partial<NotificationConfig>): void;
}
export default UnifiedNotificationService;
