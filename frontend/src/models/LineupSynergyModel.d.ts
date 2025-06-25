import type { GameContext, ShapVector } from '../types/core.js';
export interface LineupSynergyModelOutput {
    features: Record<string, number>;
    shapInsights: ShapVector[];
    synergyScore: number;
}
export declare function getLineupSynergyFeatures(lineupIds: string[], sport: string, context: GameContext): Promise<LineupSynergyModelOutput>;
