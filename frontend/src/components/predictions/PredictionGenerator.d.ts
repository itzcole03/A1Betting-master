import React from 'react';
interface PredictionGeneratorProps {
    modelName: string;
    availableModels: string[];
    onPredictionsGenerated: (predictions: Array<{
        playerId: string;
        playerName: string;
        predictedWinProbability: number;
        predictedScore: number;
        confidence: number;
        timestamp: string;
    }>) => void;
}
export declare const PredictionGenerator: React.FC<PredictionGeneratorProps>;
export {};
