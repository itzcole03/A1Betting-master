import { BaseService } from './BaseService';
export class UnifiedStateService extends BaseService {
    constructor(registry) {
        super('state', registry);
        this.storageKey = 'app_state';
        this.persistState = true;
        this.errorService = registry.getService('error');
        this.state = this.getInitialState();
        this.loadState();
    }
    getInitialState() {
        return {
            user: null,
            session: null,
            notifications: [],
            performance: {
                lastUpdate: Date.now(),
                metrics: {},
            },
            settings: {
                theme: 'system',
                notifications: true,
                sound: true,
                language: 'en',
            },
        };
    }
    loadState() {
        try {
            if (this.persistState) {
                const savedState = localStorage.getItem(this.storageKey);
                if (savedState) {
                    this.state = JSON.parse(savedState);
                }
            }
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'STATE_ERROR',
                source: 'UnifiedStateService',
                details: { method: 'loadState' },
            });
        }
    }
    saveState() {
        try {
            if (this.persistState) {
                localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            }
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'STATE_ERROR',
                source: 'UnifiedStateService',
                details: { method: 'saveState' },
            });
        }
    }
    getState() {
        return { ...this.state };
    }
    setState(newState) {
        try {
            this.state = {
                ...this.state,
                ...newState,
            };
            this.saveState();
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'STATE_ERROR',
                source: 'UnifiedStateService',
                details: { method: 'setState', newState },
            });
        }
    }
    updateUser(user) {
        this.setState({ user });
    }
    updateSession(session) {
        this.setState({ session });
    }
    addNotification(notification) {
        const newNotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            read: false,
        };
        this.setState({
            notifications: [newNotification, ...this.state.notifications],
        });
    }
    markNotificationAsRead(notificationId) {
        this.setState({
            notifications: this.state.notifications.map(notification => notification.id === notificationId ? { ...notification, read: true } : notification),
        });
    }
    clearNotifications() {
        this.setState({ notifications: [] });
    }
    updatePerformanceMetrics(metrics) {
        this.setState({
            performance: {
                lastUpdate: Date.now(),
                metrics,
            },
        });
    }
    updateSettings(settings) {
        this.setState({
            settings: {
                ...this.state.settings,
                ...settings,
            },
        });
    }
    resetState() {
        this.state = this.getInitialState();
        this.saveState();
    }
}
