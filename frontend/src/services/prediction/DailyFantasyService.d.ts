/**
 * Service for generating daily fantasy sports recommendations.
 */
import type { DailyFantasyRecommendation } from '@/types';
export interface FantasyRequest {
    predictions: {
        realityExploitation: number;
        statistical: number;
        machineLearning: number;
        hybrid: number;
    };
    event: {
        eventId: string;
        sport: string;
        homeTeam: string;
        awayTeam: string;
        timestamp: string;
        venue: string;
    };
    metadata?: Record<string, unknown>;
}
export interface FantasyError extends Error {
    code: string;
    details?: Record<string, unknown>;
    timestamp: string;
}
export type FantasyResponse = {
    success: true;
    data: DailyFantasyRecommendation[];
} | {
    success: false;
    error: FantasyError;
};
export declare class DailyFantasyService {
    private recommendations;
    generateRecommendations(request: FantasyRequest): Promise<FantasyResponse>;
    private calculateConsensusPrediction;
    private generatePlayerRecommendations;
    getRecommendations(eventId: string): Promise<DailyFantasyRecommendation[]>;
    getLatestRecommendations(): Promise<DailyFantasyRecommendation[]>;
    updateRecommendations(eventId: string, recommendations: DailyFantasyRecommendation[]): Promise<void>;
}
