import { EventBus } from "../../core/EventBus";
import { ErrorHandler } from "../../core/ErrorHandler";
import { PerformanceMonitor } from "../../core/PerformanceMonitor";
import { UnifiedConfig } from "../../core/UnifiedConfig";
import { WebSocketManager } from "./WebSocketManager";
export class UnifiedPredictionService {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.config = UnifiedConfig.getInstance();
        this.wsService = WebSocketManager.getInstance();
        this.activePredictions = new Map();
        this.predictionSubscribers = new Set();
        this.initialize();
    }
    static getInstance() {
        if (!UnifiedPredictionService.instance) {
            UnifiedPredictionService.instance = new UnifiedPredictionService();
        }
        return UnifiedPredictionService.instance;
    }
    initialize() {
        this.setupWebSocketHandlers();
        this.setupEventListeners();
    }
    setupWebSocketHandlers() {
        this.wsService.on("prediction:update", (data) => {
            this.handlePredictionUpdate(data);
        });
        this.wsService.on("prediction:error", (error) => {
            this.errorHandler.handleError(error, "UnifiedPredictionService", "high");
        });
    }
    setupEventListeners() {
        this.eventBus.on("risk:profile:updated", (profile) => {
            this.recalculatePredictions(profile);
        });
    }
    handlePredictionUpdate(prediction) {
        try {
            this.activePredictions.set(prediction.id, prediction);
            this.predictionSubscribers.forEach((callback) => callback(prediction));
            this.performanceMonitor.trackMetric("prediction:update", {
                predictionId: prediction.id,
                confidence: prediction.confidence,
                riskScore: prediction.riskScore,
            });
        }
        catch (error) {
            this.errorHandler.handleError(error, "UnifiedPredictionService", "medium", {
                action: "handlePredictionUpdate",
                predictionId: prediction.id,
            });
        }
    }
    async recalculatePredictions(profile) {
        try {
            const predictions = Array.from(this.activePredictions.values());
            for (const prediction of predictions) {
                const updatedPrediction = await this.recalculatePrediction(prediction, profile);
                this.handlePredictionUpdate(updatedPrediction);
            }
        }
        catch (error) {
            this.errorHandler.handleError(error, "UnifiedPredictionService", "high", {
                action: "recalculatePredictions",
                profileId: profile.id,
            });
        }
    }
    async recalculatePrediction(prediction, profile) {
        const startTime = performance.now();
        try {
            // Implement prediction recalculation logic based on risk profile
            const updatedPrediction = {
                ...prediction,
                riskScore: this.calculateRiskScore(prediction, profile),
                confidence: this.adjustConfidence(prediction, profile),
            };
            this.performanceMonitor.trackMetric("prediction:recalculation", {
                predictionId: prediction.id,
                duration: performance.now() - startTime,
            });
            return updatedPrediction;
        }
        catch (error) {
            this.errorHandler.handleError(error, "UnifiedPredictionService", "medium", {
                action: "recalculatePrediction",
                predictionId: prediction.id,
            });
            return prediction;
        }
    }
    calculateRiskScore(prediction, profile) {
        // Implement risk score calculation based on prediction and profile
        const confidence = typeof prediction.confidence === "number" ? prediction.confidence : 0;
        const riskToleranceLevel = typeof profile.riskToleranceLevel === "number"
            ? profile.riskToleranceLevel
            : 0;
        const maxRiskScore = typeof profile.maxRiskScore === "number" ? profile.maxRiskScore : 1;
        return Math.min(confidence * riskToleranceLevel, maxRiskScore);
    }
    adjustConfidence(prediction, profile) {
        // Implement confidence adjustment based on risk profile
        const confidence = typeof prediction.confidence === "number" ? prediction.confidence : 0;
        const riskToleranceLevel = typeof profile.riskToleranceLevel === "number"
            ? profile.riskToleranceLevel
            : 0;
        const minConfidenceThreshold = typeof profile.minConfidenceThreshold === "number"
            ? profile.minConfidenceThreshold
            : 0;
        return Math.max(confidence * (1 - riskToleranceLevel * 0.2), minConfidenceThreshold);
    }
    subscribeToPredictions(callback) {
        this.predictionSubscribers.add(callback);
        return () => this.predictionSubscribers.delete(callback);
    }
    getActivePredictions() {
        return Array.from(this.activePredictions.values());
    }
    getPrediction(id) {
        return this.activePredictions.get(id);
    }
}
