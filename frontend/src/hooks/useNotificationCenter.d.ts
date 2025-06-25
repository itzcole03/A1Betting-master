export type NotificationType = 'success' | 'error' | 'info';
export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: number;
}
export declare function useNotificationCenter(): {
    notifications: Notification[];
    addNotification: (type: NotificationType, message: string) => void;
    removeNotification: (id: string) => void;
};
