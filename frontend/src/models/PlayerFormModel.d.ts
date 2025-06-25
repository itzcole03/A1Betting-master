import type { GameContext, ShapVector } from '../types/models.js';
import { BaseModel } from '../services/ml/models/BaseModel.js';
import { ModelConfig, ModelMetrics, ModelPrediction } from '../services/ml/types.js';
export interface PlayerFormModelOutput {
    features: Record<string, number>;
    shapInsights: ShapVector[];
    formScore: number;
    sport: string;
    playerId: string;
    context: GameContext;
}
export declare class PlayerFormModel extends BaseModel {
    private eventBus;
    constructor(config: ModelConfig);
    predict(input: any): Promise<ModelPrediction>;
    train(data: any): Promise<void>;
    evaluate(_data?: any): Promise<ModelMetrics>;
    save(path: string): Promise<void>;
    load(path: string): Promise<void>;
    private simulateTraining;
    private calculateConfidence;
    private getPlayerFormFeatures;
    private getMlbFormFeatures;
    private getBasketballFormFeatures;
    private getSoccerFormFeatures;
    private getNhlFormFeatures;
    private getGenericFormFeatures;
    private calculateFormScore;
}
/**
 * Strict ALPHA1-compliant top-level async function for modular integration
 * Extracts player form features and SHAP insights for a player.
 * Config-gated, singleton, strict typing, ESM-only.
 */
export declare function getPlayerFormFeatures(playerId: string, sport: string, context: GameContext): Promise<PlayerFormModelOutput>;
