import type { GameContext, ShapVector } from '../types/models.js';
import { BaseModel, ModelConfig, ModelPrediction, ModelMetrics } from '../services/ml/models/BaseModel.js';
export interface PvPMatchupResult {
    sport: 'nba' | 'wnba' | 'mlb' | 'soccer' | 'nhl';
    primaryPlayerId: string;
    opponentId: string;
    context: GameContext;
    features: Record<string, number>;
    shapInsights: ShapVector[];
    matchupScore: number;
}
export declare class PvPMatchupModel extends BaseModel {
    private eventBus;
    constructor(config: ModelConfig);
    predict(input: any): Promise<ModelPrediction>;
    train(data: any): Promise<void>;
    evaluate(data: any): Promise<ModelMetrics>;
    save(path: string): Promise<void>;
    load(path: string): Promise<void>;
    private simulateTraining;
    private calculateConfidence;
    private mlbPvP;
    private basketballPvP;
    private soccerPvP;
    private nhlPvP;
    private fetchStat;
    private normalize;
}
/**
 * Strict ALPHA1-compliant top-level async function for modular integration
 * Extracts PvP matchup features and SHAP insights for two players.
 * Config-gated, singleton, strict typing, ESM-only.
 */
export declare function getPvPMatchupFeatures(playerId1: string, playerId2: string, sport: 'nba' | 'wnba' | 'mlb' | 'soccer' | 'nhl', context: GameContext): Promise<PvPMatchupResult>;
