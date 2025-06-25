import EventEmitter from 'eventemitter3';
import { PrizePicksProp } from './PrizePicksApiService';
export interface PredictionResult {
    propId: string;
    confidence: number;
    predictedValue: number;
    recommendation: 'OVER' | 'UNDER' | 'PASS';
    factors: string[];
}
export interface StrategyConfig {
    minConfidence: number;
    maxRiskPerBet: number;
    bankrollPercentage: number;
}
export declare class UnifiedPredictionService extends EventEmitter {
    private readonly strategyConfig;
    private historicalData;
    constructor(config: StrategyConfig);
    analyzeProp(prop: PrizePicksProp, playerStats: any, gameDetails: any): Promise<PredictionResult>;
    private analyzeHistoricalData;
    private analyzeMatchup;
    private calculateConfidence;
    private generatePrediction;
    private applyStrategyRules;
    updateHistoricalData(playerName: string, data: any[]): void;
}
