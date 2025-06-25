import { BettingOpportunity } from '../../types/betting';
import type { ModelPrediction } from '../../types/prediction';
export interface WeatherCondition {
    temperature: number;
    windSpeed: number;
    precipitation: number;
    humidity: number;
    windDirection: number;
}
export interface InjuryReport {
    playerId: string;
    playerName: string;
    position: string;
    status: 'OUT' | 'DOUBTFUL' | 'QUESTIONABLE' | 'PROBABLE';
    details: string;
    impactScore: number;
}
export interface SentimentData {
    source: 'TWITTER' | 'NEWS' | 'REDDIT';
    sentiment: number;
    volume: number;
    keywords: string[];
    timestamp: number;
}
export interface PredictionResult {
    predictedValue: number;
    confidence: number;
    factors: PredictionFactor[];
    metadata: Record<string, unknown>;
    kellyValue: number;
    marketEdge: number;
    shapValues: Record<string, number>;
}
export interface PredictionFactor {
    name: string;
    impact: number;
    confidence: number;
    description: string;
    metadata: Record<string, unknown>;
}
export interface WeatherData {
    temperature: number;
    windSpeed: number;
    precipitation: number;
    humidity: number;
    conditions: string;
}
export interface HistoricalPattern {
    pattern: string;
    similarity: number;
    outcome: string;
    confidence: number;
    metadata: {
        matchCount: number;
        winRate: number;
        averageOddsMovement: number;
    };
}
interface PredictionConfig {
    minConfidence: number;
    maxStakePercentage: number;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    autoRefresh: boolean;
    refreshInterval: number;
}
interface ModelOutput {
    type: string;
    prediction: number;
    confidence: number;
    shapValues: Record<string, number>;
}
interface Prediction {
    id: string;
    timestamp: string;
    prediction: number;
    confidence: number;
    shapValues: Record<string, number>;
    kellyValue: number;
    marketEdge: number;
}
declare class UnifiedPredictionService {
    private static instance;
    private weatherCache;
    private injuryCache;
    private sentimentCache;
    private modelWeights;
    private config;
    private readonly apiUrl;
    private readonly wsUrl;
    protected constructor();
    static getInstance(): UnifiedPredictionService;
    analyzePredictionFactors(opportunity: BettingOpportunity): Promise<PredictionFactor[]>;
    private analyzeInjuryImpact;
    private calculateInjuryConfidence;
    private analyzeWeatherImpact;
    private calculateWeatherImpact;
    private analyzeSentiment;
    private aggregateKeywords;
    private findHistoricalPatterns;
    private findSimilarHistoricalScenarios;
    private calculatePatternImpact;
    private normalizePredictionFactors;
    getPredictions(eventId: string): Promise<ModelPrediction[]>;
    private processPredictions;
    private calculateConfidence;
    private calculateTimeDecay;
    private calculatePerformanceFactor;
    updateModelWeights(performance: {
        [key: string]: number;
    }): Promise<void>;
    setConfig(newConfig: Partial<PredictionConfig>): void;
    getConfig(): PredictionConfig;
    getRecentPredictions(): Promise<Prediction[]>;
    generatePrediction(modelOutputs: ModelOutput[]): Promise<Prediction | null>;
    getEngineMetrics(): Promise<Record<string, unknown>>;
    getModelPerformance(modelType: string): Promise<Record<string, unknown>>;
    getFeatureImportance(modelType: string): Promise<Record<string, number>>;
    getShapValues(eventId: string): Promise<Record<string, number>>;
    updateWeatherData(market: string, data: WeatherData): void;
    updateInjuryData(market: string, data: InjuryReport[]): void;
    updateSentimentData(market: string, data: SentimentData): void;
    clearCaches(): void;
}
export default UnifiedPredictionService;
