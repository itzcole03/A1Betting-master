import { WebSocketManager } from '../WebSocketManager';
import { FinalPredictionEngine } from '../../FinalPredictionEngine/types';
import { UnifiedLogger } from '../../logging/types';
export declare class PredictionHandler {
    private wsManager;
    private predictionEngine;
    private logger;
    private readonly PREDICTION_TOPIC;
    private readonly UPDATE_INTERVAL;
    private updateInterval;
    constructor(wsManager: WebSocketManager, predictionEngine: FinalPredictionEngine, logger: UnifiedLogger);
    private setupEventHandlers;
    private handlePredictionRequest;
    startRealTimeUpdates(): void;
    stopRealTimeUpdates(): void;
    cleanup(): void;
}
