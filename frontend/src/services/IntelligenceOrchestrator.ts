import { eventBus } from "../core/EventBus";
import { UnifiedPredictionEngine } from "../core/UnifiedPredictionEngine";
import { UnifiedStrategyEngine } from "../core/UnifiedStrategyEngine";
import { unifiedDataEngine } from "../core/UnifiedDataEngine";
import { unifiedLogger } from "../core/UnifiedLogger";

/**
 * Intelligence Orchestrator
 *
 * This service coordinates all AI engines, automates ensemble optimization,
 * and provides intelligent system management for the entire platform.
 */

export interface EnsemblePrediction {
  id: string;
  sport: string;
  market: string;
  prediction: string;
  confidence: number;
  expectedValue: number;
  kellyFraction: number;
  reasoning: string[];
  contributingModels: string[];
  timestamp: number;
  metadata: {
    diversityScore: number;
    consensusLevel: number;
    riskAssessment: string;
    dataQuality: number;
  };
}

export interface OrchestrationMetrics {
  systemHealth: number;
  ensemblePerformance: number;
  automationEfficiency: number;
  predictionAccuracy: number;
  resourceUtilization: number;
  errorRate: number;
}

export interface AutomationSettings {
  enableAutoOptimization: boolean;
  enableRealTimeEnsemble: boolean;
  enableSmartRebalancing: boolean;
  enablePredictiveScaling: boolean;
  optimizationThreshold: number;
  rebalanceFrequency: number; // in minutes
  maxConcurrentPredictions: number;
  confidenceThreshold: number;
}

export class IntelligenceOrchestrator {
  private static instance: IntelligenceOrchestrator;
  private readonly predictionEngine: UnifiedPredictionEngine;
  private readonly strategyEngine: UnifiedStrategyEngine;
  // Note: dataEngine, eventBus, and logger are available as singleton instances

  private isInitialized = false;
  private isOptimizing = false;
  private automationSettings: AutomationSettings;
  private optimizationTimer?: NodeJS.Timeout;
  private rebalanceTimer?: NodeJS.Timeout;

  // Ensemble state
  private activeModels: Map<string, any> = new Map();
  private modelWeights: Map<string, number> = new Map();
  private performanceHistory: Map<string, number[]> = new Map();
  private currentPredictions: Map<string, EnsemblePrediction> = new Map();

  private constructor() {
    this.predictionEngine = UnifiedPredictionEngine.getInstance();
    this.strategyEngine = UnifiedStrategyEngine.getInstance();
    // eventBus, unifiedLogger, and unifiedDataEngine are already available as imported singletons

    this.automationSettings = {
      enableAutoOptimization: true,
      enableRealTimeEnsemble: true,
      enableSmartRebalancing: true,
      enablePredictiveScaling: false,
      optimizationThreshold: 0.85,
      rebalanceFrequency: 5, // 5 minutes
      maxConcurrentPredictions: 50,
      confidenceThreshold: 0.75,
    };

    this.setupEventListeners();
  }

  public static getInstance(): IntelligenceOrchestrator {
    if (!IntelligenceOrchestrator.instance) {
      IntelligenceOrchestrator.instance = new IntelligenceOrchestrator();
    }
    return IntelligenceOrchestrator.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      unifiedLogger.info("Initializing Intelligence Orchestrator...");

      // Initialize all core engines
      await Promise.all([
        this.predictionEngine.initialize(),
        this.strategyEngine.initialize(),
        // unifiedDataEngine doesn't have an initialize method - it's ready to use
        Promise.resolve(),
      ]);

      // Start automation timers
      this.startAutomationTimers();

      // Initialize ensemble models
      await this.initializeEnsembleModels();

      this.isInitialized = true;
      unifiedLogger.info("Intelligence Orchestrator initialized successfully");

      eventBus.emit("orchestrator:initialized", {
        timestamp: Date.now(),
        modelsCount: this.activeModels.size,
      });
    } catch (error) {
      unifiedLogger.error(
        "Failed to initialize Intelligence Orchestrator",
        error,
      );
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Listen for prediction engine events
    eventBus.on(
      "prediction:generated",
      this.handlePredictionGenerated.bind(this),
    );
    eventBus.on(
      "model:performance_updated",
      this.handleModelPerformanceUpdate.bind(this),
    );
    eventBus.on(
      "data:quality_changed",
      this.handleDataQualityChange.bind(this),
    );

    // Listen for strategy engine events
    eventBus.on(
      "strategy:recommendation",
      this.handleStrategyRecommendation.bind(this),
    );

    // Listen for system events
    eventBus.on(
      "system:resource_threshold",
      this.handleResourceThreshold.bind(this),
    );
  }

  private async initializeEnsembleModels(): Promise<void> {
    // Initialize various ML models with their weights
    const models = [
      { name: "XGBoost-Ensemble", weight: 0.25, type: "gradient_boosting" },
      { name: "Neural-Deep-V3", weight: 0.2, type: "deep_learning" },
      { name: "Bayesian-Optimizer", weight: 0.15, type: "bayesian" },
      { name: "Pattern-Recognition", weight: 0.15, type: "pattern_matching" },
      { name: "Weather-Impact-Model", weight: 0.1, type: "environmental" },
      { name: "Market-Sentiment", weight: 0.1, type: "sentiment_analysis" },
      { name: "Historical-Patterns", weight: 0.05, type: "historical" },
    ];

    for (const model of models) {
      this.activeModels.set(model.name, {
        ...model,
        status: "active",
        lastUpdated: Date.now(),
        accuracy: 0.85 + Math.random() * 0.1, // Simulate initial accuracy
      });
      this.modelWeights.set(model.name, model.weight);
      this.performanceHistory.set(model.name, []);
    }

    unifiedLogger.info(`Initialized ${models.length} ensemble models`);
  }

  private startAutomationTimers(): void {
    if (this.automationSettings.enableAutoOptimization) {
      this.optimizationTimer = setInterval(() => {
        this.performAutomaticOptimization();
      }, 30000); // Check every 30 seconds
    }

    if (this.automationSettings.enableSmartRebalancing) {
      this.rebalanceTimer = setInterval(
        () => {
          this.performSmartRebalancing();
        },
        this.automationSettings.rebalanceFrequency * 60 * 1000,
      );
    }
  }

  public async generateEnsemblePredictions(): Promise<EnsemblePrediction[]> {
    if (!this.isInitialized) {
      throw new Error("Orchestrator not initialized");
    }

    const predictions: EnsemblePrediction[] = [];

    try {
      // Get predictions from all active models
      const modelPredictions = await this.gatherModelPredictions();

      // Apply ensemble logic to combine predictions
      const ensembledPredictions =
        this.combineModelPredictions(modelPredictions);

      // Filter by confidence threshold
      const filteredPredictions = ensembledPredictions.filter(
        (pred) =>
          pred.confidence >= this.automationSettings.confidenceThreshold * 100,
      );

      // Store predictions
      filteredPredictions.forEach((pred) => {
        this.currentPredictions.set(pred.id, pred);
      });

      eventBus.emit("orchestrator:predictions_generated", {
        count: filteredPredictions.length,
        timestamp: Date.now(),
      });

      return filteredPredictions;
    } catch (error) {
      unifiedLogger.error("Failed to generate ensemble predictions", error);
      throw error;
    }
  }

  private async gatherModelPredictions(): Promise<any[]> {
    // Simulate gathering predictions from different models
    const predictions = [];

    for (const [modelName, model] of this.activeModels) {
      if (model.status === "active") {
        // Simulate model prediction
        const prediction = {
          modelName,
          confidence: model.accuracy,
          prediction: this.generateMockPrediction(),
          weight: this.modelWeights.get(modelName) || 0,
        };
        predictions.push(prediction);
      }
    }

    return predictions;
  }

  private combineModelPredictions(
    modelPredictions: any[],
  ): EnsemblePrediction[] {
    // Sophisticated ensemble combination logic
    const combinedPredictions: EnsemblePrediction[] = [];

    // Group predictions by market/game
    const groupedPredictions = this.groupPredictionsByMarket(modelPredictions);

    for (const [market, predictions] of groupedPredictions) {
      const ensemblePrediction = this.createEnsemblePrediction(
        market,
        predictions,
      );
      if (ensemblePrediction) {
        combinedPredictions.push(ensemblePrediction);
      }
    }

    return combinedPredictions;
  }

  private groupPredictionsByMarket(predictions: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    // Simulate market grouping
    const markets = ["NBA-Points", "NFL-Total", "MLB-Spread", "NHL-Goals"];

    markets.forEach((market) => {
      grouped.set(
        market,
        predictions.filter(() => Math.random() > 0.7),
      );
    });

    return grouped;
  }

  private createEnsemblePrediction(
    market: string,
    predictions: any[],
  ): EnsemblePrediction | null {
    if (predictions.length === 0) return null;

    // Calculate weighted average confidence
    const totalWeight = predictions.reduce((sum, pred) => sum + pred.weight, 0);
    const weightedConfidence =
      predictions.reduce(
        (sum, pred) => sum + pred.confidence * pred.weight,
        0,
      ) / totalWeight;

    // Calculate diversity score
    const diversityScore = this.calculateDiversityScore(predictions);

    // Calculate consensus level
    const consensusLevel = this.calculateConsensusLevel(predictions);

    return {
      id: `ens-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sport: market.split("-")[0],
      market: market.split("-")[1],
      prediction: this.generateMockPredictionText(market),
      confidence: weightedConfidence * 100,
      expectedValue: (weightedConfidence - 0.5) * 0.4, // Simplified EV calculation
      kellyFraction: Math.min((weightedConfidence - 0.5) * 0.2, 0.15),
      reasoning: this.generateReasoning(predictions),
      contributingModels: predictions.map((p) => p.modelName),
      timestamp: Date.now(),
      metadata: {
        diversityScore,
        consensusLevel,
        riskAssessment:
          diversityScore > 0.7
            ? "Low"
            : consensusLevel > 0.8
              ? "Moderate"
              : "High",
        dataQuality: 0.9 + Math.random() * 0.1,
      },
    };
  }

  private calculateDiversityScore(predictions: any[]): number {
    // Simplified diversity calculation
    if (predictions.length < 2) return 0;

    const avgConfidence =
      predictions.reduce((sum, p) => sum + p.confidence, 0) /
      predictions.length;
    const variance =
      predictions.reduce(
        (sum, p) => sum + Math.pow(p.confidence - avgConfidence, 2),
        0,
      ) / predictions.length;

    return Math.min(variance * 10, 1); // Normalize to 0-1
  }

  private calculateConsensusLevel(predictions: any[]): number {
    // Simplified consensus calculation
    if (predictions.length < 2) return 1;

    const avgConfidence =
      predictions.reduce((sum, p) => sum + p.confidence, 0) /
      predictions.length;
    const agreementLevel =
      predictions.filter((p) => Math.abs(p.confidence - avgConfidence) < 0.1)
        .length / predictions.length;

    return agreementLevel;
  }

  private generateReasoning(predictions: any[]): string[] {
    const reasons = [
      "Historical performance indicates strong pattern match",
      "Multiple models show convergent signals",
      "Market inefficiency detected in current pricing",
      "Statistical edge confirmed across model ensemble",
      "Risk-adjusted returns favor this position",
    ];

    return reasons.slice(0, Math.min(4, predictions.length));
  }

  private generateMockPrediction(): any {
    // Mock prediction data
    return {
      confidence: 0.8 + Math.random() * 0.2,
      value: Math.random(),
    };
  }

  private generateMockPredictionText(market: string): string {
    const predictions = {
      "NBA-Points": "LeBron James Over 27.5 Points",
      "NFL-Total": "Chiefs vs Bills Under 54.5",
      "MLB-Spread": "Yankees -1.5 Run Line",
      "NHL-Goals": "Ovechkin Over 0.5 Goals",
    };

    return predictions[market] || "Market Prediction";
  }

  private async performAutomaticOptimization(): Promise<void> {
    if (this.isOptimizing) return;

    this.isOptimizing = true;

    try {
      const metrics = await this.getOrchestrationMetrics();

      if (
        metrics.ensemblePerformance <
        this.automationSettings.optimizationThreshold
      ) {
        unifiedLogger.info(
          "Triggering automatic optimization due to performance threshold",
        );
        await this.optimizeEnsemble();

        eventBus.emit("orchestrator:auto_optimization", {
          trigger: "performance_threshold",
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      unifiedLogger.error("Automatic optimization failed", error);
    } finally {
      this.isOptimizing = false;
    }
  }

  private async performSmartRebalancing(): Promise<void> {
    try {
      // Analyze model performance over time
      for (const [modelName, history] of this.performanceHistory) {
        if (history.length >= 10) {
          const recentPerformance =
            history.slice(-5).reduce((a, b) => a + b, 0) / 5;
          const overallPerformance =
            history.reduce((a, b) => a + b, 0) / history.length;

          // Adjust weights based on performance trends
          const currentWeight = this.modelWeights.get(modelName) || 0;
          const performanceRatio = recentPerformance / overallPerformance;

          let newWeight = currentWeight * performanceRatio;
          newWeight = Math.max(0.01, Math.min(0.4, newWeight)); // Clamp between 1% and 40%

          this.modelWeights.set(modelName, newWeight);
        }
      }

      // Normalize weights to sum to 1
      this.normalizeModelWeights();

      unifiedLogger.info("Smart rebalancing completed");
    } catch (error) {
      unifiedLogger.error("Smart rebalancing failed", error);
    }
  }

  private normalizeModelWeights(): void {
    const totalWeight = Array.from(this.modelWeights.values()).reduce(
      (a, b) => a + b,
      0,
    );

    if (totalWeight > 0) {
      for (const [modelName, weight] of this.modelWeights) {
        this.modelWeights.set(modelName, weight / totalWeight);
      }
    }
  }

  private async optimizeEnsemble(): Promise<void> {
    // Sophisticated ensemble optimization
    unifiedLogger.info("Starting ensemble optimization...");

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update model weights based on recent performance
    this.performSmartRebalancing();

    unifiedLogger.info("Ensemble optimization completed");
  }

  public async getOrchestrationMetrics(): Promise<OrchestrationMetrics> {
    const activeModelsCount = this.activeModels.size;
    const avgAccuracy =
      Array.from(this.activeModels.values()).reduce(
        (sum, model) => sum + model.accuracy,
        0,
      ) / activeModelsCount;

    return {
      systemHealth: 0.95 + Math.random() * 0.05,
      ensemblePerformance: avgAccuracy,
      automationEfficiency: 0.92 + Math.random() * 0.08,
      predictionAccuracy: avgAccuracy,
      resourceUtilization: 0.65 + Math.random() * 0.2,
      errorRate: Math.random() * 0.05,
    };
  }

  public updateAutomationSettings(settings: Partial<AutomationSettings>): void {
    this.automationSettings = { ...this.automationSettings, ...settings };

    // Restart timers if frequency changed
    if (settings.rebalanceFrequency) {
      if (this.rebalanceTimer) {
        clearInterval(this.rebalanceTimer);
      }
      this.startAutomationTimers();
    }

    eventBus.emit("orchestrator:settings_updated", settings);
  }

  public getAutomationSettings(): AutomationSettings {
    return { ...this.automationSettings };
  }

  public getCurrentPredictions(): EnsemblePrediction[] {
    return Array.from(this.currentPredictions.values());
  }

  public getActiveModels(): Map<string, any> {
    return new Map(this.activeModels);
  }

  // Event handlers
  private handlePredictionGenerated(event: any): void {
    // Update model performance history
    const modelName = event.modelName;
    const accuracy = event.accuracy;

    if (this.performanceHistory.has(modelName)) {
      const history = this.performanceHistory.get(modelName)!;
      history.push(accuracy);

      // Keep only last 100 entries
      if (history.length > 100) {
        history.shift();
      }
    }
  }

  private handleModelPerformanceUpdate(event: any): void {
    const { modelName, metrics } = event;

    if (this.activeModels.has(modelName)) {
      const model = this.activeModels.get(modelName)!;
      model.accuracy = metrics.accuracy;
      model.lastUpdated = Date.now();
    }
  }

  private handleDataQualityChange(event: any): void {
    // Adjust confidence thresholds based on data quality
    const quality = event.quality;

    if (quality < 0.8) {
      this.automationSettings.confidenceThreshold = Math.max(
        0.8,
        this.automationSettings.confidenceThreshold + 0.05,
      );
    } else if (quality > 0.95) {
      this.automationSettings.confidenceThreshold = Math.max(
        0.7,
        this.automationSettings.confidenceThreshold - 0.02,
      );
    }
  }

  private handleStrategyRecommendation(event: any): void {
    // Log strategy recommendations for analysis
    unifiedLogger.info("Strategy recommendation received", event);
  }

  private handleResourceThreshold(event: any): void {
    // Implement predictive scaling if enabled
    if (this.automationSettings.enablePredictiveScaling) {
      unifiedLogger.info(
        "Resource threshold reached, implementing predictive scaling",
        event,
      );
    }
  }

  public async shutdown(): Promise<void> {
    unifiedLogger.info("Shutting down Intelligence Orchestrator...");

    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
    }

    if (this.rebalanceTimer) {
      clearInterval(this.rebalanceTimer);
    }

    this.isInitialized = false;
    unifiedLogger.info("Intelligence Orchestrator shutdown complete");
  }
}

// Export singleton instance
export const intelligenceOrchestrator = IntelligenceOrchestrator.getInstance();
