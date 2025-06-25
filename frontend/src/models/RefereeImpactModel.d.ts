import type { GameContext, ShapVector } from '../types/core.js';
export interface RefereeImpactModelOutput {
    features: Record<string, number>;
    shapInsights: ShapVector[];
    refereeScore: number;
}
export declare function getRefereeImpactFeatures(refereeId: string, sport: string, context: GameContext): Promise<RefereeImpactModelOutput>;
