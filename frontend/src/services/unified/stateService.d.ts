import { BetRecommendation, BettingEvent, BettingAlert, RiskProfileType, UserConstraints, BettingMetrics, BettingOpportunity } from '@/types/betting';
interface StateConfig {
    persistToStorage: boolean;
    autoSave: boolean;
    saveInterval: number;
    maxHistory: number;
    enableTimeTravel: boolean;
}
interface StateChange<T> {
    timestamp: number;
    previousState: T;
    newState: T;
    source: string;
    action: string;
}
interface BettingInterfaceState {
    bankroll: number;
    profit: number;
    riskProfile: RiskProfileType;
    userConstraints: UserConstraints;
    selectedEvent: BettingEvent | null;
    recommendations: BetRecommendation[];
    bettingOpportunities: BettingOpportunity[];
    alerts: BettingAlert[];
    performance?: BettingMetrics;
}
interface StateServiceConfig {
    initialState: BettingInterfaceState;
    storageKey: string;
}
declare class UnifiedStateService {
    private static instance;
    private readonly loggingService;
    private readonly errorService;
    private readonly settingsService;
    private state;
    private history;
    private readonly STORAGE_KEY;
    private saveIntervalId?;
    private subscribers;
    private config;
    private constructor();
    static getInstance(config: StateServiceConfig): UnifiedStateService;
    private loadState;
    private saveState;
    private setupAutoSave;
    private recordStateChange;
    getState(): BettingInterfaceState;
    setState(updates: Partial<BettingInterfaceState>, source: string, action: string): void;
    subscribe(callback: (state: BettingInterfaceState) => void): () => void;
    private notifySubscribers;
    updateState(updater: (state: BettingInterfaceState) => Partial<BettingInterfaceState>, source: string, action?: string): void;
    private dispatchStateChange;
    getHistory(): StateChange<BettingInterfaceState>[];
    timeTravel(index: number): void;
    clearHistory(): void;
    updateConfig(config: Partial<StateConfig>): void;
    getConfig(): StateConfig;
    destroy(): void;
    resetState(): void;
}
export default UnifiedStateService;
