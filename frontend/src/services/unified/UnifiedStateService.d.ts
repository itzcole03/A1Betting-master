import { BaseService } from './BaseService';
import { UnifiedServiceRegistry } from './UnifiedServiceRegistry';
export interface AppState {
    user: {
        id: string;
        username: string;
        preferences: Record<string, any>;
    } | null;
    session: {
        id: string;
        startTime: number;
        lastActivity: number;
    } | null;
    notifications: {
        id: string;
        type: 'info' | 'success' | 'warning' | 'error';
        message: string;
        timestamp: number;
        read: boolean;
    }[];
    performance: {
        lastUpdate: number;
        metrics: Record<string, any>;
    };
    settings: {
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
        sound: boolean;
        language: string;
    };
}
export declare class UnifiedStateService extends BaseService {
    private errorService;
    private state;
    private readonly storageKey;
    private readonly persistState;
    constructor(registry: UnifiedServiceRegistry);
    private getInitialState;
    private loadState;
    private saveState;
    getState(): AppState;
    setState(newState: Partial<AppState>): void;
    updateUser(user: AppState['user']): void;
    updateSession(session: AppState['session']): void;
    addNotification(notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>): void;
    markNotificationAsRead(notificationId: string): void;
    clearNotifications(): void;
    updatePerformanceMetrics(metrics: Record<string, any>): void;
    updateSettings(settings: Partial<AppState['settings']>): void;
    resetState(): void;
}
