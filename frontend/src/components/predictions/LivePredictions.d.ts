import React from 'react';
import type { Prediction } from '../../services/predictionService';
interface LivePredictionsProps {
    predictions: Prediction[];
}
export declare const LivePredictions: React.FC<LivePredictionsProps>;
export {};
