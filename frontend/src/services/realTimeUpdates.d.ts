import { Sport } from "./sportsAnalytics.js";
/**
 * Status reporting for UI/monitoring.
 */
declare global {
    interface Window {
        appStatus?: {
            [key: string]: {
                connected: boolean;
                quality: number;
                timestamp: number;
            };
        };
    }
}
interface LiveOdds {
    propId: string;
    value: number;
    overMultiplier: number;
    underMultiplier: number;
    timestamp: number;
    movement: {
        direction: "up" | "down" | "stable";
        amount: number;
        timeFrame: number;
    };
}
interface InjuryUpdate {
    playerId: string;
    playerName: string;
    team: string;
    status: "out" | "questionable" | "probable" | "available";
    injury: string;
    timestamp: number;
    expectedReturn?: string;
}
interface LineMovement {
    propId: string;
    oldValue: number;
    newValue: number;
    direction: "up" | "down";
    timestamp: number;
    confidence: number;
}
interface BreakingNews {
    id: string;
    title: string;
    content: string;
    type: "injury" | "trade" | "suspension" | "other";
    timestamp: number;
    impact: "high" | "medium" | "low";
    affectedProps?: string[];
}
interface Prediction {
    id: string;
    event: string;
    market: string;
    prediction: string;
    confidence: number;
    timestamp: number;
}
declare class RealTimeUpdatesService {
    private static instance;
    private liveOdds;
    private injuries;
    private lineMovements;
    private breakingNews;
    private predictions;
    private subscribers;
    private readonly CACHE_DURATION;
    private cache;
    private ws;
    private connected;
    private constructor();
    /**
     * Returns the singleton instance of RealTimeUpdatesService.
     */
    static getInstance(): RealTimeUpdatesService;
    /**
     * Initialize the WebSocket connection for real-time updates.
     * Reports connection status for UI.
     */
    /**
     * Initialize the WebSocket connection for real-time updates.
     * Reports connection status for UI.
     */
    private initializeWebSocket;
    /**
     * Returns the latest live odds for a given propId, using cache if available.
     */
    getLiveOdds(propId: string): Promise<LiveOdds | null>;
    /**
     * Updates the live odds and notifies subscribers.
     */
    updateLiveOdds(odds: LiveOdds): Promise<void>;
    getInjuryUpdate(playerId: string): Promise<InjuryUpdate | null>;
    updateInjuryStatus(update: InjuryUpdate): Promise<void>;
    getLineMovements(propId: string): Promise<LineMovement[]>;
    recordLineMovement(movement: LineMovement): Promise<void>;
    getBreakingNews(): Promise<BreakingNews[]>;
    addBreakingNews(news: BreakingNews): Promise<void>;
    getPrediction(id: string): Promise<Prediction | null>;
    updatePrediction(prediction: Prediction): Promise<void>;
    /**
     * Subscribe to a real-time update event.
     * Returns an unsubscribe function.
     */
    subscribe<K extends keyof RealTimeUpdateEventMap>(type: K, callback: (data: RealTimeUpdateEventMap[K]) => void): () => void;
    /**
     * Notify all subscribers of a given event type.
     */
    private notifySubscribers;
    getSportUpdates(sport: Sport): Promise<{
        odds: LiveOdds[];
        injuries: InjuryUpdate[];
        lineMovements: LineMovement[];
        news: BreakingNews[];
        predictions: Prediction[];
    }>;
    private getFromCache;
    private setCache;
    /**
     * Returns true if the real-time service is connected.
     */
    isConnected(): boolean;
    /**
     * Simulate real-time updates if feature flag is disabled or WS fails.
     * Pushes random odds, injuries, etc. for demo/dev mode.
     */
    simulateRealtime(): void;
    private isLiveOdds;
    private isInjuryUpdate;
    private isLineMovement;
    private isBreakingNews;
    private isPrediction;
}
/**
 * Event map for strict typing of real-time event subscriptions.
 */
interface RealTimeUpdateEventMap {
    odds: LiveOdds;
    injury: InjuryUpdate;
    lineMovement: LineMovement;
    breakingNews: BreakingNews;
    prediction: Prediction;
}
export declare const realTimeUpdates: RealTimeUpdatesService;
export {};
