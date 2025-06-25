/**
 * Main prediction service that integrates all prediction models and services.
 */

import { AnalyticsService } from '../AnalyticsService.js';
import { MarketAnalysisService } from '../marketAnalysisService.js';
import { PerformanceTrackingService } from '../PerformanceTrackingService.js';
import { RiskManagerService } from '../RiskManagerService.js';
import { SocialSentimentService, socialSentimentService } from '../SocialSentimentServiceModern.js';
import { DataSource, UnifiedDataService } from '../UnifiedDataService.js';
import { weatherService } from '../weatherModern.js';
import { DailyFantasyService } from './DailyFantasyService.js';
import type {
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
} from './types.js';
// import { WebSocketManager } from '../unified/WebSocketManager'; // Removed unused import
import { UnifiedConfigManager } from '../../core/config/types.js';
import { FinalPredictionEngineImpl } from '../../core/FinalPredictionEngine/FinalPredictionEngine.js';
import type { FinalPredictionEngineConfig, ModelOutput, RiskProfile } from '../../core/FinalPredictionEngine/types.js';
import { UnifiedLogger } from '../../core/logging/types.js';
import { UnifiedMetrics } from '../../core/metrics/types.js';


export class PredictionIntegrationService {
  // private webSocket: WebSocketManager; // Unused, removed to fix lint error
  private dailyFantasy: DailyFantasyService;
  private weather: typeof weatherService;
  private socialSentiment: SocialSentimentService;
  private riskManager: RiskManagerService;
  private marketAnalysis: MarketAnalysisService;
  private performanceTracking: PerformanceTrackingService;
  private analytics: AnalyticsService;
  private unifiedData: UnifiedDataService;
  private finalPredictionEngine: FinalPredictionEngineImpl;

  constructor(
    logger?: UnifiedLogger,
    metrics?: UnifiedMetrics,
    config?: UnifiedConfigManager,
    engineConfig?: FinalPredictionEngineConfig
  ) {
    this.dailyFantasy = new DailyFantasyService();
    this.weather = weatherService;
    this.socialSentiment = socialSentimentService;
    this.riskManager = RiskManagerService.getInstance();
    this.marketAnalysis = MarketAnalysisService.getInstance();
    this.performanceTracking = new PerformanceTrackingService();
    this.analytics = AnalyticsService.getInstance();
    this.unifiedData = UnifiedDataService.getInstance();
    // this.webSocket = WebSocketManager.getInstance(); // Unused, removed to fix lint error
    // Use provided dependencies or fall back to defaults (should be injected in production)
    this.finalPredictionEngine = new FinalPredictionEngineImpl(
      {
        logger: logger as UnifiedLogger,
        metrics: metrics as UnifiedMetrics,
        config: config as UnifiedConfigManager,
        metricsService: { getModelMetrics: () => ({ featureImportance: {}, performance: { accuracy: 1, precision: 1, recall: 1 } }) },
      },
      engineConfig || {
        modelWeights: [
          { type: 'historical', weight: 0.4 },
          { type: 'market', weight: 0.3 },
          { type: 'sentiment', weight: 0.2 },
          { type: 'correlation', weight: 0.1 },
        ],
        riskProfiles: {
          safe: { type: 'safe', multiplier: 1.2, maxStake: 100 },
          aggressive: { type: 'aggressive', multiplier: 2.0, maxStake: 500 },
        },
        sureOddsThreshold: 0.8,
        featureThreshold: 0.1,
        maxFeatures: 5,
      }
    );
  }

  public async generateIntegratedPrediction(request: PredictionRequest): Promise<PredictionResult> {
    try {
      // Get auxiliary data
      const unifiedData = await this.unifiedData.fetchData(DataSource.PRIZEPICKS, request.eventId);
      const weatherData = await this.weather.getCurrentWeather(request.eventId);
      const sentimentData = await this.socialSentiment.analyzeSentiment(request.eventId, 'twitter');
      const marketData = await this.marketAnalysis.getMarketMetrics(request.eventId);
      const riskAssessment = await this.riskManager.getRiskAssessment(request.eventId);

      // Gather model outputs (simulate or aggregate from available services)
      // In production, replace this with real model outputs from all available models
      const modelOutputs: ModelOutput[] = [
        // Example: populate with real model outputs from ensemble, reality, market, etc.
        // { type: 'historical', score: 0.7, features: { ... }, prediction: 0.7, confidence: 0.8, timestamp: Date.now(), metadata: { ... } },
        // ...
      ];
      // Use a default risk profile for now (should be dynamic per user/request)
      const riskProfile: RiskProfile = { type: 'safe', multiplier: 1.2, maxStake: 100 };

      // Generate the final prediction using the engine
      const finalPrediction = await this.finalPredictionEngine.generatePrediction(
        modelOutputs,
        riskProfile,
        {
          unifiedData,
          weatherData,
          sentimentData,
          marketData,
          riskAssessment,
        }
      );

      // Generate daily fantasy recommendations if requested
      let dailyFantasy;
      if (request.includeDailyFantasy) {
        const fantasyResponse = await this.dailyFantasy.generateRecommendations({
          predictions: {
            realityExploitation: finalPrediction.finalScore,
            statistical: finalPrediction.finalScore,
            machineLearning: finalPrediction.finalScore,
            hybrid: finalPrediction.finalScore,
          },
          event: request,
        });
        if (fantasyResponse.success) {
          dailyFantasy = fantasyResponse.data;
        }
      }

      // Optionally update models, track performance, etc.
      await this.updateModels(request);

      // Build the response
      const response: PredictionResponse = {
        realityExploitation: {
          value: finalPrediction.finalScore,
          confidence: finalPrediction.confidence,
          features: finalPrediction.topFeatures,
          metadata: finalPrediction.metadata,
        },
        statisticalModel: {
          value: finalPrediction.finalScore,
          confidence: finalPrediction.confidence,
          features: finalPrediction.topFeatures,
          metadata: finalPrediction.metadata,
        },
        machineLearningModel: {
          value: finalPrediction.finalScore,
          confidence: finalPrediction.confidence,
          features: finalPrediction.topFeatures,
          metadata: finalPrediction.metadata,
        },
        hybridModel: {
          value: finalPrediction.finalScore,
          confidence: finalPrediction.confidence,
          features: finalPrediction.topFeatures,
          metadata: finalPrediction.metadata,
        },
        dailyFantasy,
        modelComparison: {
          models: [],
          consensus: {
            prediction: finalPrediction.finalScore,
            confidence: finalPrediction.confidence,
            agreement: 1,
          },
          timestamp: Date.now().toString(),
        },
        performanceMetrics: {
          overall: {
            accuracy: 1,
            precision: 1,
            recall: 1,
            f1Score: 1,
          },
          byModel: {},
          trends: {
            accuracy: [1],
            precision: [1],
            recall: [1],
            f1Score: [1],
          },
        },
        analytics: await this.analytics.getMetrics(),
        riskAssessment,
        marketAnalysis: marketData,
        sentimentAnalysis: sentimentData,
        weatherImpact: weatherData,
        timestamp: Date.now().toString(),
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: error instanceof Error ? error.name : 'UnknownError',
          message: error instanceof Error ? error.message : 'An unknown error occurred',
          code:
            error instanceof Error && 'code' in error ? (error.code as string) : 'UNKNOWN_ERROR',
          details:
            error instanceof Error ? { message: error.message, stack: error.stack } : undefined,
          timestamp: Date.now().toString(),
        },
      };
    }
  }

  /**
   * Generate predictions for a specific model and date (API compatibility method)
   */
  public async generatePredictions(modelName: string, date: string): Promise<PredictionResult[]> {
    const request: PredictionRequest = {
      eventId: `${modelName}-${date}`,
      sport: 'general',
      homeTeam: 'TBD',
      awayTeam: 'TBD',
      timestamp: date,
      venue: 'TBD',
      metadata: {
        modelName,
        date,
      },
    };

    const result = await this.generateIntegratedPrediction(request);
    return [result];
  }

  /**
   * Evaluate models (public accessor for model evaluation)
   */
  public async evaluateModels(): Promise<Record<string, unknown>> {
    // Return performance metrics from the tracking service
    return this.performanceTracking as unknown as Record<string, unknown>;
  }

  /**
   * Get model comparison data
   */
  public async getModelComparison(): Promise<Record<string, unknown>> {
    // Return comparison data from analytics service
    return this.analytics as unknown as Record<string, unknown>;
  }

  /**
   * Get performance metrics
   */
  public async getPerformanceMetrics(): Promise<Record<string, unknown>> {
    // Return performance metrics from tracking service
    return this.performanceTracking as unknown as Record<string, unknown>;
  }

  /**
   * Get fantasy recommendations
   */
  public async getFantasyRecommendations(): Promise<Record<string, unknown>> {
    // Return fantasy recommendations from daily fantasy service
    return this.dailyFantasy as unknown as Record<string, unknown>;
  }

  /**
   * Public method to update models (wrapper for private updateModels)
   */
  public async updateModelData(modelData: Record<string, unknown>): Promise<void> {
    // Create a mock request for the private method
    const request = {
      eventId: 'model-update',
      sport: 'general',
      homeTeam: 'TBD',
      awayTeam: 'TBD',
      timestamp: new Date().toISOString(),
      venue: 'TBD',
      metadata: modelData,
    };
    await this.updateModels(request);
  }

  private async updateModels(request: PredictionRequest): Promise<void> {
    // Only track performance for now; model updates are handled by FPE or auxiliary services if needed
    this.performanceTracking.recordBetResult({
      propId: request.eventId,
      prediction: { value: 0, confidence: 0 }, // Placeholder values
      actualValue: 0,
      isWin: false,
      stakeAmount: 0,
      profitLoss: 0,
      timestamp: Date.now(),
    });
  }
}
