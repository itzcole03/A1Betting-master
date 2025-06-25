import { PlayerPropService } from '../betting/PlayerPropService';
import { FeatureEngineeringService } from './featureEngineeringService';
import { ModelTrainingService } from './modelTrainingService';
export interface BacktestData {
    props: BacktestProp[];
    models: BacktestModel[];
    historical: HistoricalData[];
    metadata: Record<string, unknown>;
}
export interface BacktestProp {
    id: string;
    playerId: string;
    playerName: string;
    propType: string;
    line: number;
    odds: number;
    gameId: string;
    gameDate: string;
    actualValue?: number;
    metadata: Record<string, unknown>;
}
export interface BacktestModel {
    id: string;
    name: string;
    type: string;
    version: string;
    weights: Record<string, number>;
    metadata: Record<string, unknown>;
}
export interface ModelPrediction {
    modelId: string;
    prediction: number;
    confidence: number;
    features: Record<string, number>;
    metadata: Record<string, unknown>;
}
export interface PropAnalysis {
    prop: BacktestProp;
    predictions: ModelPrediction[];
    combinedPrediction: number;
    combinedConfidence: number;
    edge: number;
    riskScore: number;
    qualifies: boolean;
    metadata: Record<string, unknown>;
}
export interface HistoricalData {
    date: string;
    timestamp: string;
    events: BacktestEvent[];
    marketData: MarketData[];
    metadata: Record<string, unknown>;
}
export interface BacktestEvent {
    id: string;
    sport: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    startTime: string;
    metadata: Record<string, unknown>;
}
export interface MarketData {
    propId: string;
    playerId: string;
    playerName: string;
    propType: string;
    line: number;
    odds: number;
    gameId: string;
    openingLine: number;
    closingLine: number;
    volume: number;
    movement: number;
    metadata: Record<string, unknown>;
}
export interface TimeSeriesMetric {
    date: string;
    value: number;
    cumulativeValue: number;
    metadata: Record<string, unknown>;
}
export interface Features {
    numerical: number[];
    categorical?: Record<string, unknown>;
}
interface BacktestConfig {
    startDate: string;
    endDate: string;
    modelIds: string[];
    propTypes: string[];
    minConfidence: number;
    minValue: number;
    maxRisk: number;
    targetLegs: number;
    initialBankroll: number;
    stakeSize: number | 'kelly';
    riskManagement: {
        maxPositionSize: number;
        stopLoss: number;
        maxDrawdown: number;
    };
}
interface BacktestResult {
    summary: {
        totalBets: number;
        winningBets: number;
        losingBets: number;
        winRate: number;
        roi: number;
        profitLoss: number;
        maxDrawdown: number;
        sharpeRatio: number;
        kellyFraction: number;
    };
    modelPerformance: Record<string, {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        profitContribution: number;
    }>;
    propTypePerformance: Record<string, {
        totalBets: number;
        winRate: number;
        roi: number;
        averageEdge: number;
    }>;
    timeSeriesMetrics: {
        timestamp: number;
        bankroll: number;
        dailyPnL: number;
        runningWinRate: number;
        drawdown: number;
    }[];
    riskMetrics: {
        valueAtRisk: number;
        expectedShortfall: number;
        betaSharpe: number;
        informationRatio: number;
    };
}
export declare class BacktestingService {
    private readonly playerPropService;
    private readonly modelTraining;
    private readonly featureEngineering;
    constructor(playerPropService: PlayerPropService, modelTraining: ModelTrainingService, featureEngineering: FeatureEngineeringService);
    runBacktest(config: BacktestConfig): Promise<BacktestResult>;
    private loadHistoricalData;
    private organizeDataByDate;
    private getDateRange;
    private getAvailableProps;
    private analyzeProp;
    private predict;
    private combineModelPredictions;
    private calculateEdge;
    private qualifiesProp;
    private calculateRiskScore;
    private optimizeLineup;
    private simulateBet;
    private calculateStakeSize;
    private calculateKellyStake;
    private getActualValue;
    private shouldStopTrading;
    private calculateBacktestResults;
    private calculateSharpeRatio;
    private calculateOptimalKellyFraction;
    private calculateModelPerformance;
    private calculatePropTypePerformance;
    private calculateTimeSeriesMetrics;
    private calculateRiskMetrics;
    private calculateVaR;
    private calculateExpectedShortfall;
    private calculateBetaSharpe;
    private calculateInformationRatio;
}
export declare const backtestingService: BacktestingService;
export { };
