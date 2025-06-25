import React from 'react';
interface FantasyPredictionEnhancerProps {
    fantasyData: Array<{
        playerId: string;
        playerName: string;
        team: string;
        position: string;
        salary: number;
        projectedPoints: number;
        actualPoints?: number;
        ownershipPercentage?: number;
        valueScore?: number;
    }>;
    predictions: Array<{
        playerId: string;
        playerName: string;
        predictedWinProbability: number;
        predictedScore: number;
    }>;
    onEnhancedPredictions: (enhancedPredictions: Array<{
        playerId: string;
        playerName: string;
        predictedWinProbability: number;
        predictedScore: number;
        fantasyValue: number;
        confidenceScore: number;
    }>) => void;
}
export declare const FantasyPredictionEnhancer: React.FC<FantasyPredictionEnhancerProps>;
export {};
