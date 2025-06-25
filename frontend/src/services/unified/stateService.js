import { RiskProfileType, } from '@/types/betting';
import UnifiedLoggingService from './loggingService';
import UnifiedErrorService from './errorService';
import UnifiedSettingsService from './settingsService';
class UnifiedStateService {
    constructor(config) {
        this.history = [];
        this.subscribers = new Set();
        this.config = {
            persistToStorage: true,
            autoSave: true,
            saveInterval: 5000,
            maxHistory: 100,
            enableTimeTravel: true,
        };
        this.loggingService = UnifiedLoggingService.getInstance();
        this.errorService = UnifiedErrorService.getInstance();
        this.settingsService = UnifiedSettingsService.getInstance();
        this.state = config.initialState;
        this.STORAGE_KEY = config.storageKey;
        this.setupAutoSave();
        this.loadState();
    }
    static getInstance(config) {
        if (!UnifiedStateService.instance) {
            UnifiedStateService.instance = new UnifiedStateService(config);
        }
        return UnifiedStateService.instance;
    }
    loadState() {
        if (!this.config.persistToStorage)
            return;
        try {
            const savedState = localStorage.getItem(this.STORAGE_KEY);
            if (savedState) {
                this.state = JSON.parse(savedState);
            }
        }
        catch (error) {
            this.errorService.handleError(error instanceof Error ? error : new Error('Failed to load state'), 'StateService', 'low', { action: 'loadState' });
        }
    }
    saveState() {
        if (!this.config.persistToStorage)
            return;
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        }
        catch (error) {
            this.errorService.handleError(error instanceof Error ? error : new Error('Failed to save state'), 'StateService', 'low', { action: 'saveState' });
        }
    }
    setupAutoSave() {
        if (this.config.autoSave) {
            this.saveIntervalId = window.setInterval(() => {
                this.saveState();
            }, this.config.saveInterval);
        }
    }
    recordStateChange(previousState, newState, source, action) {
        const change = {
            timestamp: Date.now(),
            previousState,
            newState,
            source,
            action,
        };
        this.history.unshift(change);
        if (this.history.length > this.config.maxHistory) {
            this.history = this.history.slice(0, this.config.maxHistory);
        }
    }
    getState() {
        return { ...this.state };
    }
    setState(updates, source, action) {
        const previousState = { ...this.state };
        this.state = {
            ...this.state,
            ...updates,
        };
        this.recordStateChange(previousState, this.state, source, action);
        this.saveState();
        this.notifySubscribers();
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }
    updateState(updater, source, action = 'updateState') {
        const previousState = { ...this.state };
        const updates = updater(this.state);
        this.state = { ...this.state, ...updates };
        this.recordStateChange(previousState, this.state, source, action);
        this.saveState();
        this.notifySubscribers();
    }
    dispatchStateChange(previousState, newState, source, action) {
        const event = new CustomEvent('stateChange', {
            detail: {
                previousState,
                newState,
                source,
                action,
                timestamp: Date.now(),
            },
        });
        window.dispatchEvent(event);
    }
    getHistory() {
        return [...this.history];
    }
    timeTravel(index) {
        if (!this.config.enableTimeTravel) {
            this.errorService.handleError(new Error('Time travel is disabled'), 'StateService', 'low');
            return;
        }
        if (index < 0 || index >= this.history.length) {
            this.errorService.handleError(new Error('Invalid history index'), 'StateService', 'low');
            return;
        }
        const targetState = this.history[index].newState;
        this.state = { ...targetState };
        this.saveState();
        this.dispatchStateChange(this.state, targetState, 'StateService', 'timeTravel');
    }
    clearHistory() {
        this.history = [];
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        if (this.config.autoSave) {
            this.setupAutoSave();
        }
        else if (this.saveIntervalId) {
            clearInterval(this.saveIntervalId);
        }
    }
    getConfig() {
        return { ...this.config };
    }
    destroy() {
        if (this.saveIntervalId) {
            clearInterval(this.saveIntervalId);
        }
        UnifiedStateService.instance = null;
    }
    resetState() {
        this.state = {
            bankroll: 0,
            profit: 0,
            riskProfile: RiskProfileType.MODERATE,
            userConstraints: {
                max_bankroll_stake: 0.1,
                time_window_hours: 24,
                preferred_sports: [],
                preferred_markets: [],
            },
            selectedEvent: null,
            recommendations: [],
            bettingOpportunities: [],
            alerts: [],
        };
        this.saveState();
        this.notifySubscribers();
    }
}
UnifiedStateService.instance = null;
export default UnifiedStateService;
